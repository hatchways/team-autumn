from test.test_base import TestBase
from db.model import User
from db.model import GmailOauthInfo
import google.auth.exceptions
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import AuthorizedSession
import json


class GmailAuthHandlerTest(TestBase):

    def test_user(self):
        User("a@b.com", first_name="John", last_name="Smith", salted_password="aa-bb-cc-dd").save()
        u = User.get_by_email("a@b.com")
        self.assertTrue(u is not None)
        self.assertFalse(u.is_oauthed)

    def test_gmailoauthinfo(self):
        g = GmailOauthInfo("123", "123", "123", "123", "123", ["1", "2", "3"], "2020-10-21T17:54:02.513055Z")
        User("a@b.com", first_name="John", last_name="Smith", salted_password="aa-bb-cc-dd").save()
        u = User.get_by_email("a@b.com")
        u.gmail_oauth_info = g
        u.save()
        c = Credentials.from_authorized_user_info(u.gmail_oauth_info.to_dict())

        g.token = "AAA"
        u.save()
        s = AuthorizedSession(Credentials.from_authorized_user_info(g.to_dict()))
        u = User.get_by_email("a@b.com")
        # print(u.gmail_oauth_info.to_dict())
        self.assertTrue(True)

    def tearDown(self):
        User.objects.raw({"email": {"$regex": r".*@b\.com"}}).delete()
