from datetime import datetime
import pymongo
from bson import ObjectId
from pymodm import MongoModel, fields
import pymodm.errors
from google.auth.transport.requests import AuthorizedSession
from google.oauth2.credentials import Credentials
import json
from warnings import warn
from api.util import SafeDict
from pymodm.context_managers import no_auto_dereference
from addon import rq

from .prospect_model import Prospect


class Step(MongoModel):
    email = fields.CharField()  # =Template
    # =Title;Subject is only there for the first step in the campaign
    subject = fields.CharField()
    prospects = fields.ListField(fields.ReferenceField(
        Prospect, on_delete=fields.ReferenceField.PULL))
    # prospects = fields.EmbeddedDocumentListField(ProspectWithStatus)
    # -1 fail
    # 1 sent
    # 2 replied
    prospects_email_status = fields.DictField()

    def to_dict(self):
        return self.to_son().to_dict()

    class Meta:
        # This model will be used in the connection "user-db"
        connection_alias = 'user-db'
        ignore_unknown_fields = True


class Campaign(MongoModel):
    creator = fields.ReferenceField("User")
    name = fields.CharField()
    creation_date = fields.DateTimeField()
    prospects = fields.ListField(fields.ReferenceField(
        Prospect, on_delete=fields.ReferenceField.PULL))
    steps = fields.EmbeddedDocumentListField(Step)
    keyword_dict = fields.DictField()
    # {thread_id:(step_index,prospect_id)}
    prospects_thread_id = fields.DictField()

    @property
    def stats(self):
        num_reached = 0
        num_reply = 0
        if len(self.steps):
            succ_status = [i for i in self.steps[-1].prospects_email_status.values() if i != -1]
            num_reached = len(succ_status)
            num_reply = succ_status.count(2)
        stat = {
            "_id": self._id,
            "name": self.name,
            "num_prospects": len(self.prospects),
            "num_reached": num_reached,
            "num_reply": num_reply
        }
        return stat

    def to_dict(self):
        ret = self.to_son().to_dict()
        ret.update(self.stats)
        return ret

    def steps_add(self, content, subject):
        """
        Add a step to this campaign; Only first step's subject will be taken
        Args:
            content: email content
            subject: email subject

        Returns:
            Step: Step instance
        """
        self.steps.append(Step(email=content, subject=subject))
        self.save()
        return self.steps[-1]

    def steps_edit(self, step_index, content, subject):
        """
        Edit a step in ; Only first step's subject will be taken
        Args:
            step_index: index of step to be edited
            content: new email content
            subject: new email subject

        Returns:
            Step: Step instance
        """
        try:
            cur_step = self.steps[step_index]
        except IndexError:
            raise pymodm.errors.DoesNotExist  # Catched by error handler
        cur_step.email = content
        cur_step.subject = subject
        self.save()
        return cur_step

    def steps_get(self, step_index):
        try:
            cur_step = self.steps[step_index]
        except IndexError:
            raise pymodm.errors.DoesNotExist  # Catched by error handler
        return cur_step

    def prospects_add(self, prospect_ids):
        """

        Args:
            prospect_ids: list of str _id of prospects

        Returns:
            dict of count
        """

        own_prospect_ids = set()
        if len(self.prospects) > 0:
            for prospect in self.prospects:
                own_prospect_ids.add(str(prospect._id))

        new = [ObjectId(val)
               for val in prospect_ids if
               (val not in own_prospect_ids) and (Prospect.find_by_id(val).owner == self.creator)]

        self.prospects.extend(new)
        self.save()

        return {'new': len(new), 'dups': len(prospect_ids) - len(new)}

    def prospects_add_to_step(self, prospect_ids=None, step_index=0):
        if not prospect_ids:
            prospect_ids = [str(each._id) for each in self.prospects]
        for pid in prospect_ids:
            self.steps[step_index].prospects.append(ObjectId(pid))
        self.save()

    def steps_send(self, step_index):
        self.creator.gmail_start_webhook()
        result = rq.send_gmail(str(self.creator._id), str(self._id), step_index)
        return

    def steps_email_replace_keyword(self, email_text, prospect):
        keyword_dict = SafeDict()
        keyword_dict.update(self.creator.keyword_dict)
        keyword_dict.update(self.keyword_dict)
        keyword_dict.update(prospect.keyword_dict)
        return email_text.format_map(keyword_dict)

    @property
    def subject(self):
        if self.steps:
            return self.steps[0].subject
        return None

    class Meta:
        indexes = [pymongo.IndexModel([("creator", pymongo.HASHED)])]
        connection_alias = 'user-db'
        ignore_unknown_fields = True
