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


class GmailAuthHandlerTest(TestBase):

    def test_login(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)
        response = self.api.get('/google_auth', json=fake_json)
        print(response.json)