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


class GmailOauthInfo(MongoModel):
    token = fields.CharField()
    refresh_token = fields.CharField()
    token_uri = fields.CharField()
    client_id = fields.CharField()
    client_secret = fields.CharField()
    scopes = fields.ListField(field=fields.CharField())
    expiry = fields.CharField()

    def to_dict(self):
        ret = self.to_son().to_dict()
        if "_cls" in ret:
            del ret["_cls"]
        if "_id" in ret:
            del ret["_id"]
        return ret

    class Meta:
        # This model will be used in the connection "user-db"
        connection_alias = 'user-db'
        ignore_unknown_fields = True


class Prospect(MongoModel):
    owner = fields.ReferenceField("User")
    email = fields.CharField()  # TODO can be primary key
    first_name = fields.CharField()
    last_name = fields.CharField()
    status = fields.CharField()
    campaigns = fields.ListField(fields.ReferenceField(
        "Campaign"))
    thread_id = fields.DictField()
    last_contacted = fields.DateTimeField()
    keyword_dict = fields.DictField()

    @staticmethod
    def find_by_id(_id):
        if isinstance(_id, str):
            _id = ObjectId(_id)
        try:
            prospect = Prospect.objects.get({'_id': _id})
            return prospect
        except:
            return None

    # TODO Replace with true Prospect class

    def to_dict(self):
        return self.to_son().to_dict()

    class Meta:
        indexes = [pymongo.IndexModel([("owner", pymongo.HASHED)])]
        connection_alias = 'user-db'
        ignore_unknown_fields = True


class StepProspect(Prospect):
    prospect = fields.ReferenceField('Prospect')
    step = fields.ReferenceField('Step')
    status = fields.CharField()

    def to_dict(self):
        return self.to_son().to_dict()

    class Meta:
        # This model will be used in the connection "user-db"
        connection_alias = 'user-db'
        ignore_unknown_fields = True


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

    @property
    def stats(self):
        num_reached = 0
        num_reply = 0
        if len(self.steps):
            succ_status = [
                i for i in self.steps[-1].prospects_email_status.values() if i != -1]
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
            prospects: reference to prospects who have received previous step

        Returns:
            Step: Step instance
        """
        prospect_refs = [ObjectId(prospect_id) for prospect_id in prospect_ids]
        step = Step(email=content, subject=subject)
        step.save()
        self.steps.append(step)
        self.save()

        step_prospects = []
        for ref in prospect_refs:
            step_prospects.append(StepProspect(
                prospect=ref, step=self.steps[-1], status="contacted"))
        # StepProspect.objects.bulk_create([StepProspect()])

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
        # TODO check whether user owns prospects

        own_prospect_ids = set()
        if len(self.prospects) > 0:
            for prospect in self.prospects:
                own_prospect_ids.add(str(prospect._id))

        new = [ObjectId(val)
               for val in prospect_ids if val not in own_prospect_ids]

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
        result = rq.send_gmail(str(self.creator._id),
                               str(self._id), step_index)
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


class User(MongoModel):
    """
    User model


    Example:
        from pymodm.connection import connect
        connect("mongodb://localhost:8000/db", alias="user-db")
        new_user=User("a@b.com",first_name="John",last_name="Smith",salted_password="aa-bb-cc-dd").save()

    """
    email = fields.EmailField()
    first_name = fields.CharField()
    last_name = fields.CharField()
    salted_password = fields.CharField()
    gmail_oauth_info = fields.EmbeddedDocumentField(GmailOauthInfo)
    campaigns_count = fields.IntegerField(default=0)
    prospects_count = fields.IntegerField(default=0)
    keyword_dict = fields.DictField()

    @staticmethod
    def get_by_email(email):
        """
        Get user by email.

        Args:
            email: The expected email field, can be in mongodb query set grammar.

        Returns:
            (None|User): return user object or none.
        """
        warn("get_by_email will be replace by get_by_id soon", DeprecationWarning)
        ret = User.objects.raw({"email": email})
        ret_list = list(ret)
        return ret_list[0] if ret_list else None

    @staticmethod
    def get_by_id(_id):
        """
        Get user by email.
        Args:
            _id: The expected id field, can be in mongodb query set grammar.
        Returns:
            (None|User): return user object or none.
        """
        if isinstance(_id, str):
            _id = ObjectId(_id)
        ret = User.objects.raw({"_id": _id})
        ret_list = list(ret)
        return ret_list[0] if ret_list else None

    def to_dict(self, remove_password=True, remove_oauth_info=True):
        warn("to_dict will be replace by user_info soon", DeprecationWarning)
        ret = self.to_son().to_dict()
        del ret["salted_password"]
        return ret

    def user_info(self):
        return {"_id": self._id,
                "email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name}

    # TODO: split by multi inheritance

    def gmail_profile(self):
        _token = self._gmail_session.credentials.token

        res = self._gmail_session.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/profile?alt=json")
        if self._gmail_session.credentials.token != _token:
            self.save_credentials(self._gmail_session.credentials)
        return res.text

    # update_credentials

    def gmail_update_credentials(self, cred):
        if self.gmail_oauth_info and self.gmail_oauth_info.token == cred.token:
            return
        self.gmail_oauth_info = GmailOauthInfo(**json.loads(cred.to_json()))
        self.save()

    @property
    # is_oauthed
    def gmail_oauthed(self):
        return self.gmail_oauth_info is not None

    @property
    def _gmail_session(self):
        """

        Returns:
            AuthorizedSession
        """
        if not self.gmail_oauthed:
            return None
        authed_session = AuthorizedSession(
            Credentials.from_authorized_user_info(self.gmail_oauth_info.to_dict()))
        return authed_session

    def campaigns_list(self):
        """
        Get campaign list (last added will be at first), can be empty
        Returns:
            list: list of Campaign instances
        """
        with no_auto_dereference(Campaign):
            return list(Campaign.objects.raw({"creator": self._id}))[::-1]

    def campaigns_append(self, **campaign_info):
        """
        Add campaigns for the user
        Args:
            **campaign_info: keyword dict that Campaign need
            The call should be in the format: campaigns_append(name="Test")
        Returns:
            Campaign: Campaign instance
        """
        c = Campaign(creator=self._id, creation_date=datetime.now(),
                     **campaign_info).save()
        self.campaigns_count += 1
        self.save()
        with no_auto_dereference(Campaign):
            return c

    def campaign_by_id(self, campaign_id):
        """
        Get campaign by id
        Args:
            campaign_id: id
        Returns:
            Campaign: Campaign object
        Raises:
            DoesNotExist
        """

        if isinstance(campaign_id, str):
            campaign_id = ObjectId(campaign_id)
        return Campaign.objects.get({"$and": [{"_id": campaign_id}, {"creator": self._id}]})

        campaign = Campaign.objects.get(
            {"$and": [{"_id": ObjectId(campaign_id)}, {"creator": self._id}]})

        prospect_ids = []
        for key in campaign.to_dict().keys():
            if key == 'prospects':
                prospect_ids = campaign.to_dict()['prospects']

        prospects = Prospect.objects.raw(
            {"_id": {"$in": [prosp_id for prosp_id in prospect_ids]}})

        prospects_list = list(prospects)

        prospects_count = len(prospects_list)

        return {'campaign': campaign, 'stats': {'num_prospects': prospects_count, 'contacted': 121, 'reached': 120, 'replied': 4}}

    @ property
    def campaigns(self):
        with no_auto_dereference(Campaign):
            return list(Campaign.objects.raw({"creator": self._id}))

    def prospects_bulk_append(self, prospects_list):
        """
        Append Prospect to User; Prospect is store for each user
        Args:
            prospects_list: list of keyword dict to construct Prospect
        Returns:
            dict: length of both duplicate prospects as well as new prospects
        """
        own_prospect_emails_set = set()
        if len(self.get_prospects()) > 0:
            for prospect in self.get_prospects():
                own_prospect_emails_set.add(prospect.email)

        new_prospects_set = set()
        for prospect_obj in prospects_list:
            if prospect_obj['email'] not in own_prospect_emails_set:
                new_prospects_set.add(tuple(prospect_obj.items()))

        if len(new_prospects_set) > 0:
            prospect_objs = Prospect.objects.bulk_create(
                [Prospect(owner=self._id, **dict(prospect_tup)) for prospect_tup in new_prospects_set], retrieve=False)

            self.prospects_count += len(prospect_objs)
            self.save()

        return {'new_prospects': len(new_prospects_set), 'dup_prospects': len(prospects_list) - len(new_prospects_set)}

    def get_prospects(self):
        with no_auto_dereference(Prospect):
            return list(Prospect.objects.raw({"owner": self._id}))

    class Meta:
        # This model will be used in the connection "user-db"
        indexes = [pymongo.IndexModel([("email", pymongo.HASHED)])]
        connection_alias = 'user-db'
        ignore_unknown_fields = True
