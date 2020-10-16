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
        print(response.json)
        self.assertTrue("user_info" in response.json)
        # TODO cookie test
        self.assertTrue("access_token" in response.json["user_info"])
        self.assertTrue("refresh_token" in response.json["user_info"])
        self.assertTrue("password" not in response.json["user_info"])

    def test_wrong_password(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)
        fake_json["password"] = "000000"
        response = self.api.post('/login', json=fake_json)
        self.assertTrue("error_code" in response.json and response.json["error_code"] == error_code.PASSWORD_MISMATCH)

    def test_user_dne(self):
        fake_json = fake_user_json()
        response = self.api.post('/login', json=fake_json)
        # only PASSWORD_MISMATCH will be returned for security concer
        self.assertTrue("error_code" in response.json and response.json["error_code"] == error_code.PASSWORD_MISMATCH)

    def test_unauthorized_access(self):
        fake_json = fake_user_json()
        response = self.api.post('/logout', json=fake_json)
        self.assertTrue("error_code" in response.json and response.json["error_code"] == error_code.UNAUTHORIZED_ACCESS)

    def test_logout(self):
        # TODO manually set cookies
        fake_json = fake_user_json()
        response = self.api.post('/register', json=fake_json)
        access_token = response.json["user_info"]["access_token"]
        # Try to log out user
        response = self.api.post('/logout', json=fake_json)
        self.assertTrue(response.json["status"] is True)
        self.assertTrue(response.json["logout"] is True)
        # After user sign out, they have no more access to protected api.
        response = self.api.post('/logout', json=fake_json, headers={"Authorization": "Bearer " + access_token})
        self.assertTrue("error_code" in response.json and response.json["error_code"] == error_code.UNAUTHORIZED_ACCESS)

    def test_refresh(self):
        fake_json = fake_user_json()
        response = self.api.post('/register', json=fake_json)
        access_token = response.json["user_info"]["access_token"]
        # Try to refresh
        response = self.api.post('/refresh', json=fake_json)

        # User will get a new access token now
        old_access_token = response.json["user_info"]["access_token"]
        self.assertTrue(response.json["status"] is True)
        new_access_token = response.json["user_info"]["access_token"]


        # TODO After user refresh, the old jwt token should be expire
        self.api.set_cookie("/", "access_token_cookie", old_access_token)
        response = self.api.post('/logout', json=fake_json, )
        # self.assertTrue("error_code" in response.json and response.json["error_code"] ==
        # error_code.UNAUTHORIZED_ACCESS)

    def tearDown(self):
        User.objects.raw({"email": {"$regex": r".*@test\.test"}}).delete()
