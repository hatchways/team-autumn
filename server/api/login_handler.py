import json
from flask import jsonify, request, Blueprint, Response
from db.model import User
# Ref: https://medium.com/@riken.mehta/full-stack-tutorial-3-flask-jwt-e759d2ee5727
import jsonschema
from api.util import *
from api import error_code
from addon import bcrypt, jwt
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity

login_schema = {
    # "type": "object",
    "properties": {
        "email": get_schema(format="email"),
        "password": get_schema(minLength=6),
    },
    # "additionalProperties": False,
    "minProperties": 2  # requires all 2 properties
}

register_handler = Blueprint('login_handler', __name__)


def login(first_login=False):
    """

    """
    err, user_json_str = validate_json_input(request.get_json(), login_schema)
    if err:
        print(err)
        return fail_response(error_code.EMPTY_REQUIRED_FILED), 400
    user_json = json.loads(user_json_str)
    user_in_db = User.get_by_email(user_json["email"])
    print(user_in_db)
    if not user_in_db:
        return fail_response(error_code.USER_NOT_EXIST), 400
    user_in_db = user_in_db[0]

    if not bcrypt.check_password_hash(user_in_db.salted_password, user_json["password"]):
        return fail_response(error_code.PASSWORD_MISMATCH), 400

    ret_user = user_in_db.to_dict()
    access_token = create_access_token(ret_user)
    refresh_token = create_refresh_token(ret_user)
    ret_user["access_token"] = access_token
    ret_user["refresh_token"] = refresh_token
    print(ret_user)
    return success_response(user_info=ret_user), 200
