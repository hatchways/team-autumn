import json
from flask import jsonify, request, Blueprint, Response
from db.model import User
# Ref: https://medium.com/@riken.mehta/full-stack-tutorial-3-flask-jwt-e759d2ee5727
import jsonschema
from api.util import *
from api import error_code
from addon import bcrypt, jwt
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, \
    jwt_refresh_token_required, unset_jwt_cookies
import time

login_schema = {
    "type": "object",
    "properties": {
        "email": get_schema(format="email"),
        "password": get_schema(minLength=6),
    },
    "minProperties": 2  # requires all 2 properties
}

auth_handler = Blueprint('auth_handler', __name__)


@auth_handler.route('/login', methods=['POST'])
def login():
    """
    API to handle login POST request.
    input json needs to match the login_schema or HTTP 400 error code will be returned
    User password will be compared with data in mongoDB.
    Returns:
        str: return json include request status
            if success, the return will be in the format
                {"status":True, "error_code":0,"user_info":
                    {'email': str, 'first_name': str, 'last_name': str, 'refresh_token': str, 'access_token': str}
                }
            if fail, the return will be in the format
                {"status":False, "error_code":-[1-9]}
        int: HTTP status code
    """
    err, user_json = validate_json_input(request.get_json(), login_schema)
    if err:
        # TODO: log
        return fail_response(error_code.EMPTY_REQUIRED_FIELD), 400
    user_in_db = User.get_by_email(user_json["email"])

    if not user_in_db:
        return fail_response(error_code.PASSWORD_MISMATCH)

    user_password_input = user_in_db.salted_password
    if not bcrypt.check_password_hash(user_password_input, user_json["password"]):
        return fail_response(error_code.PASSWORD_MISMATCH), 400

    ret_user = user_in_db.to_dict(remove_password=True)
    access_token = create_access_token(ret_user)
    refresh_token = create_refresh_token(ret_user)
    ret_user["access_token"] = access_token
    ret_user["refresh_token"] = refresh_token
    cur_response = success_response(user_info=ret_user, login=True)
    set_access_cookies(cur_response, access_token)
    set_refresh_cookies(cur_response, refresh_token)
    return cur_response, 200


@auth_handler.route('/logout', methods=['POST'])
@jwt_required
def logout():
    """
        API to handle logout POST request.
        (When the JWT setting is not set as ["cookies"]) The header needs to include
            {"Authorization": "Bearer "+access_token} to access this api; Or HTTP401 error code will be returned
        User will be logged out as the jwt cookies will be unset.
        Returns:
            str: return json include request status
                if success, the return will be in the format
                    {"status":True, "error_code":0, "logout":True}
                if fail, the return will be in the format
                    {"status":False, "error_code":-[1-9]}
            int: HTTP status code
        """
    cur_response = success_response(logout=True)
    unset_jwt_cookies(cur_response)
    return cur_response, 200


@auth_handler.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    """
    API to handle refresh POST request.
    (When the JWT setting is not set as ["cookies"]) The header needs to include
        {"Authorization": "Bearer "+refresh_token} to access this api; Or HTTP401 error code will be returned
    new access_token will be returned.
    Returns:
        str: return json include request status
            if success, the return will be in the format
                {"status":True, "error_code":0, "refresh":True}
            if fail, the return will be in the format
                {"status":False, "error_code":-[1-9]}
        int: HTTP status code
    """
    new_token = create_access_token(get_jwt_identity())
    cur_response = success_response(
        user_info={"access_token": new_token, **get_jwt_identity()}, refresh=True)
    set_access_cookies(cur_response, new_token)
    return cur_response, 200


@jwt.unauthorized_loader
def _unauthorized_access(callback):
    """
    Will be called when user access JWT middleware protected API endpoint without proper authorization.
    Args:
        callback: won't be called by programmer.

    Returns:
        str: {"status":False, "error_code":error_code.UNAUTHORIZED_ACCESS}
        int: HTTP status code
    """
    return fail_response(error_code.UNAUTHORIZED_ACCESS), 401


@jwt.user_claims_loader
def _add_keyword(identity_dict):
    """
    This will auto add keywords to the identity dictionary.
    Args:
        identity_dict: the dict given to create_access_token()

    Returns:
        dict: new augmented dict
    """
    return {**identity_dict,
            "iat": int(time.time())
            }
