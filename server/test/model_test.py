from test.test_base import TestBase
from db.model import User,Campaign
from db.model import GmailOauthInfo
import google.auth.exceptions
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import AuthorizedSession
import json
from pymodm.context_managers import no_auto_dereference


class GmailAuthHandlerTest(TestBase):

    def test_user(self):
        User("a@b.com", first_name="John", last_name="Smith", salted_password="aa-bb-cc-dd").save()
        u = User.get_by_email("a@b.com")
        # print(User.objects.raw({"email": "a@bc.com"}).values().first())
        print(User.objects.values().get({"email": "a@b.com"}))
        print(u.user_info())
        self.assertTrue(u is not None)
        self.assertFalse(u.gmail_oauthed)

    def test_user(self):
        User("a@b.com", first_name="John", last_name="Smith", salted_password="aa-bb-cc-dd").save()
        u = User.get_by_email("a@b.com")
        print(u.user_info())
        print(u.campaigns)
        # new_campaign = Campaign(u, "Test_campaign").save()
        u.campaigns_append(name="Test campaign")
        # u.save()
        u = User.get_by_email("a@b.com")
        with no_auto_dereference(Campaign):
            print(u.campaigns)
            print(len(u.campaigns))
            print(u.campaigns[::-1])
        print(u.to_son().to_dict())
        for each in u.campaigns:
            print(each.name)
        from db.model import Step
        u.campaigns[0].steps_add("aaa", "title")
        print(u.campaigns[0].steps)
        u.campaigns[0].steps[0].email = "b"

        print(u.campaigns[0].steps)

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
        Campaign.objects.raw({}).delete()
