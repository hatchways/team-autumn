import os
from datetime import datetime

from bson import ObjectId
from pymodm import connect
from redis import Redis

from api.util import create_message
from db.model import User
from flask.cli import load_dotenv
from flask_socketio import SocketIO

load_dotenv()

DB_ADDR = os.environ.get("DB_ADDR", None)
DB_ALIAS = "user-db"


def send_gmail_worker(user_id, campaign_id, step_index):
    connect(DB_ADDR, DB_ALIAS)
    r = Redis()
    sio = SocketIO(message_queue="redis://localhost:6379/0")

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

    room_id = r.get(user_id)
    room_id = room_id.decode() if room_id else None

    def status_update(prospect, status):
        if room_id:
            sio.emit("sent_email_status", {str(prospect._id): status}, room=room_id)

    for each in step.prospects:
        email_text = campaign.steps_email_replace_keyword(step.email, each)
        msg = create_message(each.email, campaign.subject, email_text)
        # Set threadId to keep the email in a conversation in the same campagin
        if campaign.name in each.thread_id:
            msg["threadId"] = each.thread_id[campaign.name]

        res = session.post(METAONLY_URL, json=msg)
        if res.status_code != 200:
            fail_text = "Failed " + res.text
            step.prospects_email_status[str(each._id)] = fail_text
            status_update(each, fail_text)
            continue
        res_json = res.json()

        each.thread_id[campaign.name] = res_json["threadId"]
        # TODO: watch this thread_id
        each.last_contacted = datetime.now()
        each.save()
        step.prospects_email_status[str(each._id)] = "Success"
        status_update(each, "Success")

    campaign.save()
