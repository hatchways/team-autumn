import json
import os
import jsonschema
from flask import jsonify, request, Blueprint, Response
from db.model import Prospect, User
from api import error_code
from api.util import get_schema, validate_json_input, fail_response, success_response, get_jwt_identity
from flask_jwt_extended import jwt_required

prospect_handler = Blueprint('prospect_handler', __name__)


prospect_schema = {
    "type": "object",
    "properties": {
        "owner": get_schema(),
        "first_name": get_schema(),
        "last_name": get_schema(),
        "email": get_schema(format="email"),
        "status": get_schema()
    }
}


@prospect_handler.route('/upload_prospects', methods=['POST'])
@jwt_required
def upload_prospects():
    """
    API to handle the upload of prospects
    Fill this out later
    """

    # Change this to work with one or many prospects
    owner = User.get_by_id(get_jwt_identity()['_id'])

    if not request.is_json:
        return fail_response(error_code.MIME_NOT_JSON), 400

    err, prospect_json = validate_json_input(
        request.get_json(), prospect_schema)

    if err:
        return fail_response(error_code.EMPTY_REQUIRED_FIELD), 400

    if not owner:
        return fail_response(error_code.USER_NOT_EXIST), 400

    # Potentially add check whether email and owner already exist

    # Add to db
    result = owner.prospects_bulk_append(list(prospect_json.values()))

    return success_response(**result), 201



@prospect_handler.route('/prospects', methods=['GET'])
@jwt_required
def get_prospects():

    owner = User.get_by_id(get_jwt_identity()['_id'])

    if not owner:
        return fail_response(error_code.USER_NOT_EXIST), 400

    prospects_list = owner.get_prospects()

    # return all prospects associated with an owner email
    return success_response(prospects=prospects_list), 200


# prospects = prospects_list
