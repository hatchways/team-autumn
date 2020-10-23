from test.test_base import TestBase
import json
import uuid
from api import error_code
from api.util import validate_json_input
from db.model import User
from api.register_handler import user_schema
from api.gmail_auth_handler import *
import os
from unittest.mock import patch
used_emails = []


def fake_user_json():
    test_email = "{}@test.test".format(uuid.uuid4())
    used_emails.append(test_email)
    return {'email': test_email,
            "first_name": "John",
            "last_name": "Smith",
            "password": "123456",
            "confirm_password": "123456"}


class GmailAuthHandlerTest(TestBase):

    def test_login(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)
        response = self.api.get('/google_auth', json=fake_json)
        print(response.json)

    def test_get_url(self):
        print(os.path.abspath("."))
        get_authorization_url()

    # def test_callback(self):
    #     #Manually set session
    #     with self.api.session_transaction() as sess:
    #         sess["GMAIL_OAUTH_STATE"] = "GMAIL_OAUTH_STATE"
    #     u = "4%2F0AfDhmrgpFVNvlQGjO5kIY8uVGrS2X0KbHcsGkY67ULbqEeuqil_DQ40dy_fr0Fqv1nqiNw"

    def test_full_auth(self):
        """
        This only works when jwt_identity is disabled
        Returns:

        """
        fake_json = fake_user_json()
        res = self.api.post('/register', json=fake_json)
        e = {'email': "a@b.com",
             "first_name": "John",
             "last_name": "Smith",
             "salted_password": "123456"}
        User(**e).save()
        res = self.api.post("/gmail_oauth_url")
        ret_oauth_url = input("Copy paste result here: ")
        ret_oauth_url = ret_oauth_url.strip()
        self.api.get(ret_oauth_url)
        u = User.get_by_email("a@b.com")
        print(u.gmail_oauth_info)
        print(u.get_gmail_profile())

    def tearDown(self):
        User.objects.raw({"email": {"$regex": r".*@test\.test"}}).delete()
        User.objects.raw({"email": "a@b.com"}).delete()