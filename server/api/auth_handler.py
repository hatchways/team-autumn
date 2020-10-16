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

    Returns:
        str: Response
        int: HTTP Status Code
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
    get_jwt_identity()
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return success_response(logout=True), 200


@auth_handler.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    """

    Returns:

    """
    new_token = create_access_token(get_jwt_identity())
    resp = jsonify({'refresh': True})
    set_access_cookies(resp, new_token)
    return success_response(user_info={"token": new_token}, refresh=True), 200


@jwt.unauthorized_loader
def unauthorized_access(callback):
    print(request.headers)
    return fail_response(error_code.UNAUTHORIZED_ACCESS), 401
