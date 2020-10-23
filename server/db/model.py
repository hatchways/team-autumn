from pymodm import MongoModel, fields
from google.auth.transport.requests import AuthorizedSession
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
import json


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

    @staticmethod
    def get_by_email(email):
        """
        Get user by email.

        Args:
            email: The expected email field, can be in mongodb query set grammar.

        Returns:
            (None|User): return user object or none.
        """
        ret = User.objects.raw({"email": email})
        ret_list = list(ret)
        return ret_list[0] if ret_list else None

    def update_credentials(self, cred):
        if self.gmail_oauth_info and self.gmail_oauth_info.token == cred.token:
            return
        self.gmail_oauth_info = GmailOauthInfo(**json.loads(cred.to_json()))
        self.save()

    @property
    def is_oauthed(self):
        return self.gmail_oauth_info is not None

    @property
    def _session(self):
        """

        Returns:
            AuthorizedSession
        """
        if not self.is_oauthed:
            return None
        authed_session = AuthorizedSession(
            Credentials.from_authorized_user_info(self.gmail_oauth_info.to_dict()))
        return authed_session

    def get_gmail_profile(self):
        _token = self._session.credentials.token

        res = self._session.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/profile?alt=json")
        if self._session.credentials.token != _token:
            self.save_credentials(self._session.credentials)
        return res.text

    def to_dict(self, remove_password=True, remove_oauth_info=True):
        ret = self.to_son().to_dict()
        return {"email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name}

    def user_info_dict(self):
        return {"email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name}

    class Meta:
        # This model will be used in the connection "user-db"
        connection_alias = 'user-db'
        ignore_unknown_fields = True


class Prospect(MongoModel):
    """
    Prospect Model
    Example:
      from pymodm.connection import connect
      connect("mongodb://localhost:8000/db", alias="user-db")
      new_prospect=Prospect("steven@example.com", first_name="Steven", last_name="McGrath", status="open").save()

    """
    owner_email = fields.EmailField()
    email = fields.EmailField()
    first_name = fields.CharField()
    last_name = fields.CharField()
    status = fields.CharField()

    @staticmethod
    def get_by_owner_email(owner_email):
        """
        This method finds all prospects which have specified owner_email
        """
        ret = Prospect.objects.raw({"owner_email": owner_email})
        ret_list = list(ret)
        return ret_list if ret_list else None

    @staticmethod
    def check_duplicate_prospect(owner_email, email):
        """
        This method checks whether the specified owner email is
        already associated with the specified email
        """
        ret = Prospect.objects.raw(
            {"owner_email": owner_email, "email": email})
        ret_list = list(ret)  # might just need to  check ret
        return True if ret_list else None

    def to_dict(self):
        ret = self.to_son().to_dict()
        if "_cls" in ret:
            del ret["_cls"]
        if "_id" in ret:
            del ret["_id"]
        return ret

    class Meta:
        connection_alias = "user-db"
        ignore_unknown_fields = True
