import os
from datetime import datetime
import pymongo
from bson import ObjectId
from flask.cli import load_dotenv
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
from .campaign_model import Campaign, Step
load_dotenv()


class UserBase(MongoModel):
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

    keyword_dict = fields.DictField()

    @classmethod
    def get_by_email(cls, email):
        """
        Get user by email.

        Args:
            email: The expected email field, can be in mongodb query set grammar.

        Returns:
            (None|User): return user object or none.
        """
        warn("get_by_email will be replace by get_by_id soon", DeprecationWarning)
        ret = cls.objects.raw({"email": email})
        ret_list = list(ret)
        return ret_list[0] if ret_list else None

    @classmethod
    def get_by_id(cls, _id):
        """
        Get user by email.
        Args:
            _id: The expected id field, can be in mongodb query set grammar.
        Returns:
            (None|User): return user object or none.
        """
        if isinstance(_id, str):
            _id = ObjectId(_id)
        ret = cls.objects.raw({"_id": _id})
        ret_list = list(ret)
        return ret_list[0] if ret_list else None

    def to_dict(self):
        warn("to_dict will be replace by user_info soon", DeprecationWarning)
        ret = self.to_son().to_dict()
        del ret["salted_password"]
        return ret

    def user_info(self):
        return {"_id": self._id,
                "email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name}


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


class UserGmail(UserBase):
    gmail_oauth_info = fields.EmbeddedDocumentField(GmailOauthInfo)
    gmail_link_address = fields.CharField()
    gmail_history_id = fields.CharField()

    def gmail_update_history_id(self, hid):
        self.gmail_history_id = hid
        self.save()

    @classmethod
    def get_by_gmail_link_address(cls, gmail):
        ret = cls.objects.raw({"gmail_link_address": gmail})
        ret_list = list(ret)
        return ret_list[0] if ret_list else None

    def gmail_profile(self, text=True):
        _token = self._gmail_session.credentials.token

        res = self._gmail_session.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/profile?alt=json")

        if self._gmail_session.credentials.token != _token:
            self.gmail_update_credentials(self._gmail_session.credentials)
        return res.text if text else res.json()

    def gmail_history_list(self):
        res = self._gmail_session.get("https://gmail.googleapis.com/gmail/v1/users/me/history",
                                      params={"startHistoryId": self.gmail_history_id, "historyTypes": "MESSAGE_ADDED"})
        # nextPageToken
        res = res.json()
        print("hisId",self.gmail_history_id)
        print("history list",res)
        if "history" not in res:
            return []
        message_list = []  # [{"id":"","threadId":""},...]
        for each in res["history"]:
            message_list.extend([i["message"] for i in each["messagesAdded"]])
        return message_list

    def gmail_update_credentials(self, cred):
        if self.gmail_oauth_info and self.gmail_oauth_info.token == cred.token:
            return
        self.gmail_oauth_info = GmailOauthInfo(**json.loads(cred.to_json()))
        self.save()

        # Update profile
        profile = self.gmail_profile(text=False)
        if profile and "emailAddress" in profile:
            self.gmail_link_address = profile["emailAddress"]
            self.gmail_history_id = profile["historyId"]
            self.save()
        # Start webhook
        self.gmail_start_webhook()

    def gmail_start_webhook(self):
        print("Starting web hook")
        res = self._gmail_session.post("https://www.googleapis.com/gmail/v1/users/me/watch", json={
            "topicName": os.getenv("TOPIC_NAME", "projects/quickstart-1603250317186/topics/new_gmail_notify"),
            "labelIds": ["INBOX"]
        })
        # TODO: renew with rq if we can schedule time
        res = res.json()
        print("Webhook response: ", res)
        if res and "historyId" in res:
            self.gmail_history_id = res["historyId"]
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
        if not self.gmail_oauthed:
            return None
        authed_session = AuthorizedSession(
            Credentials.from_authorized_user_info(self.gmail_oauth_info.to_dict()))
        return authed_session


class UserCampaign(UserBase):
    campaigns_count = fields.IntegerField(default=0)

    def campaign_by_thread_id(self, thread_id):
        """
        Get thread id dict from all campaigns of user
        Returns:
            Campaign: obj
        """
        for each in self.campaigns:
            if thread_id in each.prospects_thread_id:
                return each
        return None

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

    @property
    def campaigns(self):
        with no_auto_dereference(Campaign):
            return list(Campaign.objects.raw({"creator": self._id}))


class UserProspects(UserBase):
    prospects_count = fields.IntegerField(default=0)

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


class User(UserGmail, UserCampaign, UserProspects):
    def user_info(self):
        return {"_id": self._id,
                "email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "gmail_oauthed": self.gmail_oauthed}
    class Meta:
        # This model will be used in the connection "user-db"
        # TODO another gmail index
        indexes = [pymongo.IndexModel([("email", pymongo.HASHED)])]
        collection_name = "User"
        connection_alias = 'user-db'
        ignore_unknown_fields = True
