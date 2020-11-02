import os
from datetime import datetime

from bson import ObjectId
from pymodm import connect
from api.util import create_message
from db.model import User
from flask.cli import load_dotenv

load_dotenv()

DB_ADDR = os.environ.get("DB_ADDR", None)
DB_ALIAS = "user-db"


def send_gmail_worker(user_id, campaign_id, step_index):
    connect(DB_ADDR, DB_ALIAS)
    MEDIA_UPLOAD_URL = "https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send"
    METAONLY_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
    user = User.get_by_id(ObjectId(user_id))
    if not user:
        raise AssertionError("User not exist")
    if not user.gmail_oauthed:
        raise AssertionError("User didn't link the gmail account")
    session = user._gmail_session
    campaign = user.campaign_by_id(ObjectId(campaign_id))
    step = campaign.steps_get(step_index)

    for each in step.prospects:
        email_text = campaign.steps_email_replace_keyword(step.email, each)
        msg = create_message(each.email, campaign.subject, email_text)
        # Set threadId to keep the email in a conversation in the same campagin
        if campaign.name in each.thread_id:
            msg["threadId"] = each.thread_id[campaign.name]
        print(msg)
        res = session.post(METAONLY_URL, json=msg)
        if res.status_code != 200:
            continue
        res_json = res.json()
        print(res)
        each.thread_id[campaign.name] = res_json["threadId"]
        each.last_contacted = datetime.now()
        # Replace
        # TODO: Other status update
        # TODO: notify front end
        each.save()
