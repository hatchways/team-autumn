from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import send, emit
from flask_socketio import ConnectionRefusedError
from addon import sio
from flask import request
from addon import redis


@sio.on("connect")
@jwt_required
def connect():
    _id = get_jwt_identity()["_id"]
    redis.set(_id, request.sid)
    print(_id, redis.get(_id))
    return True


@sio.on("disconnect")
@jwt_required
def disconnect():
    redis.delete(get_jwt_identity()["_id"])
    return

# emit("sent_email_status", status_dict, room=room_id)
# emit("new_email_reply", {"campaign": campaign._id, "step_index": step_index, "prospect": prospect_id})
