import json
import os
import jsonschema
from flask import jsonify, request, Blueprint, Response
from db.model import ProspectToBeMerge, User
from api import error_code
from api.util import get_schema, validate_json_input, fail_response, success_response, get_jwt_identity


prospect_handler = Blueprint('prospect_handler', __name__)


prospect_schema = {
    "type": "object",
    "properties": {
        "user_email": get_schema(format="email"),
        "first_name": get_schema(),
        "last_name": get_schema(),
        "email": get_schema(format="email"),
        "status": get_schema()
    }
}


@prospect_handler.route('/upload_prospects', methods=['POST'])
def upload_prospects():
    """
    API to handle the upload of prospects
    Fill this out later
    """

    # Change this to work with one or many prospects
    owner = User.get_by_email(get_jwt_identity()['email'])

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
    prospect_json = prospect_json.copy()
    prospect_list = list(prospect_json.values())
    prospects = []
    for prospect in prospect_list:

        p = {
            'owner_email': prospect['owner_email'],
            'email': prospect['email'],
            'first_name': prospect['first_name'],
            'last_name': prospect['last_name'],
            'status': 'open',
        }
        prospects.append(Prospect(**p))

    ProspectToBeMerge.objects.bulk_create(prospects)
    return success_response(), 201


@prospect_handler.route('/prospects', methods=['GET'])
def get_prospects():

    user = User.get_by_email(get_jwt_identity()['email'])

    if not user:
        return fail_response(error_code.USER_NOT_EXIST), 400

    prospects_list = ProspectToBeMerge.objects.raw(
        {'owner_email': owner['email']})
    prospects = []
    for prospect in prospects_list:
        prospects.append(prospect.to_dict())

    # return all prospects associated with an owner email
    return success_response(prospects=prospects), 200


# prospects = prospects_list
