import json
from flask import jsonify, request, Blueprint, Response
from db.model import User
# Ref: https://medium.com/@riken.mehta/full-stack-tutorial-3-flask-jwt-e759d2ee5727
from api import error_code
from addon import bcrypt, jwt
from api.util import get_schema, validate_json_input, fail_response
from api.auth_handler import login

register_handler = Blueprint('register_handler', __name__)

user_schema = {
    "type": "object",
    "properties": {
        "first_name": get_schema(),
        "last_name": get_schema(),
        "email": get_schema(format="email"),
        "password": get_schema(minLength=6),
        "confirm_password": get_schema(minLength=6)
    },
    "additionalProperties": False,
    "minProperties": 5  # requires all 5 properties
}


@register_handler.route('/register', methods=['POST'])
def register_entry():
    """
    API to handle register POST request.

    """
    if not request.is_json:
        return fail_response(error_code.MIME_NOT_JSON), 400
    err, user_json = validate_json_input(request.get_json(), user_schema)
    if err:
        return fail_response(error_code.EMPTY_REQUIRED_FIELD), 400
    if user_json["password"] != user_json["confirm_password"]:
        return fail_response(error_code.PASSWORD_MISMATCH)

    # Assumption: user input is legit now

    # Check if user exists
    if User.get_by_email(user_json["email"]):
        return fail_response(error_code.USER_EXIST)

    # ADD TO db
    salted_password = bcrypt.generate_password_hash(user_json["password"]).decode()
    user_json = user_json.copy()
    del user_json["password"]
    del user_json["confirm_password"]
    User(**user_json, salted_password=salted_password).save()
    ret_json, _ = login()
    return ret_json, 201
