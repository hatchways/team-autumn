from test.test_base import TestBase
from pymodm.context_managers import no_auto_dereference
import json
import uuid
from api import error_code
from api.util import validate_json_input
from db.model import User, Campaign, Prospect
from api.register_handler import user_schema
from api.gmail_auth_handler import *
import os
from unittest.mock import patch


def fake_user_json():
    test_email = "{}@test.test".format(uuid.uuid4())
    return {'email': test_email,
            "first_name": "John",
            "last_name": "Smith",
            "password": "123456",
            "confirm_password": "123456"}


class CampaignHandlerTest(TestBase):
    def test_create_campaign(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)
        res = self.api.post("/user/campaigns_list", json={})
        self.assertTrue(len(res.json["response"]) == 0)

        res = self.api.post("/user/campaigns_append", json={"name": "TestCamp"})
        self.assertTrue(res.json["response"]["name"] == "TestCamp")
        res = self.api.post("/user/campaigns_list", json={})
        self.assertTrue(len(res.json["response"]) == 1)
        self.assertTrue(res.json["response"][0]["name"] == "TestCamp")
        _id = res.json["response"][0]["_id"]
        res = self.api.post("/user/campaign_by_id", json={"campaign_id": _id})
        print(res.json)
        self.assertTrue(res.json["response"]["name"] == "TestCamp")

    def test_add_prospects(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)

        res = self.api.post("/user/prospects_bulk_append",
                            json={"prospects_list": [{"email": "email"}, {"email": "email2"}]})
        with no_auto_dereference(Prospect):
            print(User.get_by_email(fake_json["email"]).prospects_count)

    def test_step(self):
        fake_json = fake_user_json()
        _ = self.api.post('/register', json=fake_json)

        res = self.api.post("/user/campaigns_append", json={"name": "TestCamp"})
        _id = res.json["response"]["_id"]
        res = self.api.post("/user/campaigns_list", json={})
        print(res.json)
        res = self.api.post("/campaign/{}/steps_add".format(_id), json={"content": "TEXT {my_name} {campaign_name}", "subject": "Title"})
        print("Step add",res.json)
        u = User.get_by_email(fake_json["email"])
        class fake_prospect:
            keyword_dict={}
        print(u.campaign_by_id(_id).steps_email_replace_keyword("TEXT {my_name} {campaign_name}",fake_prospect))

        self.assertTrue(res.json["response"]["email"].startswith("TEXT"))
        res = self.api.post("/campaign/{}/steps_edit".format(_id),
                            json={"step_index": 0, "content": "TEXT2", "subject": "Title2"})
        self.assertTrue(res.json["response"]["email"] == "TEXT2")
        print(User.get_by_email(fake_json["email"]).campaigns_list()[0].steps[0].to_son().to_dict())
        self.assertTrue(User.get_by_email(fake_json["email"]).campaigns_list()[0].steps[0].to_son().to_dict()[
                            "subject"] == "Title2")

        res = self.api.post("/user/prospects_bulk_append",
                            json={"prospects_list": [{"email": "email"}, {"email": "email2"}]})
        print(res.json)
        res = self.api.post("/campaign/{}/prospects_add".format(_id),
                            json={"prospect_ids": res.json["response"]["prospects_ids"]})
        print(res.json)
        res = self.api.post("/campaign/{}/prospects_auto_add_to_step".format(_id),
                            json={"step_index": 0})
        print(res.json)

    def tearDown(self):
        User.objects.raw({"email": {"$regex": r".*@test\.test"}}).delete()
        User.objects.raw({"email": "a@b.com"}).delete()
        Campaign.objects.raw({}).delete()
