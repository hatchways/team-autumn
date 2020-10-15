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


class RegisterHandlerTest(TestBase):

    def test_user_schema(self):
        fake_json = fake_user_json()
        ret = validate_json_input(fake_json, user_schema)
        self.assertTrue(ret[0] is None,ret)

        fake_json = fake_user_json()
        fake_json["password"] = "123"
        ret = validate_json_input(fake_json, user_schema)
        self.assertTrue(ret[0] is not None, ret)

        fake_json = fake_user_json()
        del fake_json["email"]
        ret = validate_json_input(fake_json, user_schema)
        self.assertTrue(ret[0] is not None, ret)

    def test_success_new_user(self):
        fake_json = fake_user_json()
        response = self.api.post('/register', json=fake_json)
        self.assertTrue(response.json["status"] == True)
        self.assertTrue("user_info" in response.json)
        self.assertTrue(all([x in response.json["user_info"] for x in
                             ("email", "first_name", "last_name", "access_token", "refresh_token")]))
        r_json = response.json["user_info"]
        del r_json["access_token"]
        del r_json["refresh_token"]
        del fake_json["password"]
        del fake_json["confirm_password"]
        self.assertDictEqual(fake_json, r_json)

    def test_password_mismatch(self):
        fake_json = fake_user_json()
        fake_json["password"] = "000000"
        response = self.api.post('/register', json=fake_json)
        self.assertTrue(response.json["status"] is False)
        self.assertTrue(response.json["error_code"] == error_code.PASSWORD_MISMATCH)
        self.assertTrue(len(list(User.objects.raw({"email": fake_json["email"]}))) == 0)

    def test_short_password(self):
        fake_json = fake_user_json()
        fake_json["password"] = "123"
        fake_json["confirm_password"] = "123"
        response = self.api.post('/register', json=fake_json)
        self.assertTrue(response.json["status"] is False)
        self.assertTrue(response.json["error_code"] == error_code.EMPTY_REQUIRED_FIELD)
        self.assertTrue(len(list(User.objects.raw({"email": fake_json["email"]}))) == 0)

    def test_empty_required_field(self):
        fake_json = fake_user_json()
        del fake_json["last_name"]
        response = self.api.post('/register', json=fake_json)
        self.assertFalse(response.json["status"], response.json)
        self.assertTrue(response.json["error_code"] == error_code.EMPTY_REQUIRED_FIELD)
        self.assertTrue(len(list(User.objects.raw({"email": fake_json["email"]}))) == 0)

    def test_exist_user(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)
        response = self.api.post('/register', json=fake_json)
        self.assertFalse(response.json["status"], response.json)
        self.assertTrue(response.json["error_code"] == error_code.USER_EXIST)
        self.assertTrue(len(list(User.objects.raw({"email": fake_json["email"]}))) == 1)

    def tearDown(self):
        User.objects.raw({"email": {"$regex": r".*@test\.test"}}).delete()
