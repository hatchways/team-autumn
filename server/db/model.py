from datetime import datetime

from bson import ObjectId
from pymodm import MongoModel, fields
from google.auth.transport.requests import AuthorizedSession
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
import json
from warnings import warn

from pymodm.context_managers import no_auto_dereference


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
    campaigns: ...
    status: ...
    last_contacted: ...
    steps: ...  # ?
    # TODO what's that cloud?

    class Meta:
        # This model will be used in the connection "user-db"
        connection_alias = 'user-db'
        ignore_unknown_fields = True


class Step(MongoModel):
    email = fields.CharField()  # =Template
    subject = fields.CharField()  # =Title;Subject is only there for the first step in the campaign
    prospects = fields.ListField(fields.ReferenceField(Prospect, on_delete=fields.ReferenceField.PULL))

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
    prospects = fields.ListField(fields.ReferenceField(Prospect, on_delete=fields.ReferenceField.PULL))
    steps = fields.EmbeddedDocumentListField(Step)  # TODO is it global?

    def steps_add(self, content, subject):
        self.steps.append(Step(email=content, subject=subject))
        self.save()
        return self.steps[-1]

    def steps_edit(self, step_index, content, subject):
        cur_step = self.steps[step_index]
        cur_step.email = content
        cur_step.subject = subject
        self.save()
        return cur_step

    def to_dict(self):
        return self.to_son().to_dict()

    @property
    def subject(self):
        if self.steps:
            return self.steps[0].subject
        return None

    class Meta:
        # This model will be used in the connection "user-db"
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
    salted_password = fields.CharField()  # TODO maybe add __ in the front
    gmail_oauth_info = fields.EmbeddedDocumentField(GmailOauthInfo)
    campaigns = fields.ListField(fields.ReferenceField(Campaign, on_delete=fields.ReferenceField.PULL))
    prospects = fields.ListField(fields.ReferenceField(Prospect, on_delete=fields.ReferenceField.PULL))

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

    def to_dict(self, remove_password=True, remove_oauth_info=True):
        warn("to_dict will be replace by user_info soon", DeprecationWarning)
        ret = self.to_son().to_dict()
        return {"email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name}

    def user_info(self):
        return {"_id": self._id,
                "email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name}

    # TODO: Maybe split by multi inheritance

    def gmail_profile(self):
        _token = self._session.credentials.token

        res = self._gmail_session.get("https://gmail.googleapis.com/gmail/v1/users/me/profile?alt=json")
        if self._gmail_session.credentials.token != _token:
            self.save_credentials(self._session.credentials)
        return res.text

    def gmail_update_credentials(self, cred):
        if self.gmail_oauth_info and self.gmail_oauth_info.token == cred.token:
            return
        self.gmail_oauth_info = GmailOauthInfo(**json.loads(cred.to_json()))
        self.save()

    @property
    def gmail_oauthed(self):
        return self.gmail_oauth_info is not None

    @property
    def _gmail_session(self):
        """

        Returns:
            AuthorizedSession
        """
        if not self.is_oauthed:
            return None
        authed_session = AuthorizedSession(Credentials.from_authorized_user_info(self.gmail_oauth_info.to_dict()))
        return authed_session

    def campaigns_list(self):
        with no_auto_dereference(Campaign):
            return self.campaigns[::-1]

    def campaigns_append(self, **campaign_info):
        c = Campaign(creator=self._id, creation_date=datetime.now(), **campaign_info).save()
        self.campaigns.append(c)
        self.save()
        with no_auto_dereference(Campaign):
            return c

    def campaign_by_id(self, campaign_id):
        """Call by other methods
        Args:
            campaign_id:
        Returns:
            Campaign: campaign object
        Raises:
            DoesNotExist
        """
        return Campaign.objects.get({"$and": [{"_id": ObjectId(campaign_id)}, {"creator": self._id}]})

    def prospects_bulk_append(self, prospects_list):
        """
        Append Prospect to User; Prospect is store for each user
        Args:
            prospects_list:

        Returns:
        """
        # TODO prospects_list preprocess to [{k:v},{k:v}] format
        # TODO: handle repeat/exists prospects
        prospects_objs = Prospect.objects.bulk_create(
            [Prospect(owner=self._id, **each_p) for each_p in prospects_list], retrieve=True)
        self.prospects.extend(prospects_objs)
        self.save()
        return None

    class Meta:
        # This model will be used in the connection "user-db"
        connection_alias = 'user-db'
        ignore_unknown_fields = True
        # Save all referenced object when save is called on this.
        # cascade = True
