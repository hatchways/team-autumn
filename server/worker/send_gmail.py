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

BATCH_SIZE = 1


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

    status_dict = {}

    def status_update(each_p, status, value):
        step.prospects_email_status[str(each_p._id)] = value
        status_dict[str(each_p._id)] = status

    def update_thread_id(prospect, thread_id):
        prospect_id = str(prospect._id)
        campaign.prospects_thread_id[thread_id] = (step_index, prospect_id)
        prospect.thread_id[str(campaign._id)] = thread_id

    def status_send():
        if not room_id:
            return
        if len(status_dict) == 0:
            return
        campaign.save()
        sio.emit("sent_email_status", status_dict, room=room_id)
        status_dict.clear()

    count = 0
    for each in step.prospects:
        # Skip prospects that already receive the email
        if str(each._id) in step.prospects_email_status and step.prospects_email_status[str(each._id)] > 0:
            continue
        email_text = campaign.steps_email_replace_keyword(step.email, each)
        msg = create_message(each.email, campaign.subject, email_text)
        # Set threadId to keep the email in a conversation in the same campagin
        if str(campaign._id) in each.thread_id:
            msg["threadId"] = each.thread_id[str(campaign._id)]

        res = session.post(METAONLY_URL, json=msg)
        if res.status_code != 200:
            fail_text = "Failed " + res.text
            status_update(each, fail_text, -1)
        else:
            res_json = res.json()
            update_thread_id(each, res_json["threadId"])
            each.last_contacted = datetime.now()
            each.save()

            status_update(each, "Success", 1)
        # batch update status & campaign
        if count % BATCH_SIZE == 0:
            status_send()
        count += 1

    status_send()
