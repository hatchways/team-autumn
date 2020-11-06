import json

from flask import jsonify, request, Blueprint, Response, session, url_for, redirect
from flask_jwt_extended import get_jwt_identity, jwt_required
from db.model import User, Step
from api.util import *
from addon import redis, sio
from flask_socketio import emit

gmail_webhook_handler = Blueprint('gmail_webhook_handler', __name__)


# TODO: front end might need to forward request to here
# TODO: multiple users use same gmail account?


@gmail_webhook_handler.route("/gmail_webhook", methods=["POST"])
def get_webhook():
    if not request.is_json:
        print(request.data)
        return jsonify({}), 200
    input_json = request.get_json()
    message = input_json["message"]
    message_data_byte = base64.decodebytes(message["data"].encode())
    message_data = json.loads(message_data_byte)

    print("Webhook", message_data)

    user_link_gmail = message_data["emailAddress"]
    history_id = message_data["historyId"]
    user: User = User.get_by_gmail_link_address(user_link_gmail)
    if not user:
        print("User not found")
        return jsonify({}), 200
    emails = user.gmail_history_list()
    print("Emails", emails)
    user.gmail_update_history_id(history_id)
    # [{"id": "", "threadId": ""}, ...]
    for each in emails:
        if redis.get(each["id"]):
            continue
        campaign = user.campaign_by_thread_id(each["threadId"])
        if not campaign:
            print("ThreadId not in record")
            continue
        step_index, prospect_id = campaign.prospects_thread_id[each["threadId"]]
        campaign.steps[step_index].prospects_email_status[prospect_id] = 2
        campaign.save()

        room_id = redis.get(str(campaign.creator._id))
        if room_id:
            room_id = room_id.decode()
            sio.emit("new_email_reply", {"campaign": str(campaign._id), "step_index": step_index, "prospect": prospect_id},
                     room=room_id)

    return jsonify({}), 200
