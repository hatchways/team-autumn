import json
from flask import jsonify, request, Blueprint, Response
from db.model import User
# Ref: https://medium.com/@riken.mehta/full-stack-tutorial-3-flask-jwt-e759d2ee5727
import jsonschema
from api.util import *
from api import error_code
from addon import bcrypt, jwt
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, \
    jwt_refresh_token_required,unset_jwt_cookies

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
        return fail_response(error_code.USER_NOT_EXIST), 400
    user_in_db = user_in_db[0]

    if not bcrypt.check_password_hash(user_in_db.salted_password, user_json["password"]):
        return fail_response(error_code.PASSWORD_MISMATCH), 400

    ret_user = user_in_db.to_dict(remove_password=True)
    access_token = create_access_token(ret_user)
    refresh_token = create_refresh_token(ret_user)
    ret_user["access_token"] = access_token
    ret_user["refresh_token"] = refresh_token
    login_in_cookies = jsonify({"login": True})
    set_access_cookies(login_in_cookies, access_token)
    set_refresh_cookies(login_in_cookies, refresh_token)
    return success_response(user_info=ret_user), 200


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
    get_jwt_identity()
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return success_response(logout=True), 200


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
    resp = jsonify({'refresh': True})
    set_access_cookies(resp, new_token)
    return success_response(user_info={"token": new_token}, refresh=True), 200


@jwt.unauthorized_loader
def unauthorized_access(callback):
    """
    Will be called when user access JWT middleware protected API endpoint without proper authorization.
    Args:
        callback: won't be called by programmer.

    Returns:
        str: {"status":False, "error_code":error_code.UNAUTHORIZED_ACCESS}
        int: HTTP status code
    """
    print(request.headers)
    return fail_response(error_code.UNAUTHORIZED_ACCESS), 401
