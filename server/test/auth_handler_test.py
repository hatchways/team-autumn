from test.test_base import TestBase
import json
import uuid
from api import error_code
from api.util import validate_json_input
from db.model import User
from api.register_handler import user_schema

used_emails = []


def fake_user_json():
    test_email = "{}@test.test".format(uuid.uuid4())
    used_emails.append(test_email)
    return {'email': test_email,
            "first_name": "John",
            "last_name": "Smith",
            "password": "123456",
            "confirm_password": "123456"}


class AuthHandlerTest(TestBase):

    def test_login(self):

        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)
        response = self.api.post('/login', json=fake_json)
        self.assertTrue("user_info" in response.json)
        # TODO cookie test
        self.assertTrue("access_token" in response.json["user_info"])
        self.assertTrue("refresh_token" in response.json["user_info"])
        self.assertTrue("password" not in response.json["user_info"])

    def test_wrong_password(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)
        fake_json["password"]="000000"
        response = self.api.post('/login', json=fake_json)
        self.assertTrue("error_code" in response.json and response.json["error_code"]==error_code.PASSWORD_MISMATCH)

    def test_unauthorized_access(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)
        response = self.api.post('/login', json=fake_json)
        response = self.api.post('/logout', json=fake_json)
        self.assertTrue("error_code" in response.json and response.json["error_code"]==error_code.UNAUTHORIZED_ACCESS)

    def test_logout(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)
        response = self.api.post('/login', json=fake_json)
        access_token = response.json["user_info"]["access_token"]
        response = self.api.post('/logout', json=fake_json, headers={"Authorization": "Bearer "+access_token,
                                                                     "HTTP_AUTHORIZATION": "Bearer "+access_token})
        print(response.json)
        # TODO selenium test to handle the cookie part
        self.assertTrue("error_code" in response.json and response.json["error_code"] == error_code.UNAUTHORIZED_ACCESS)

    def tearDown(self):
        User.objects.raw({"email": {"$regex": r".*@test\.test"}}).delete()
