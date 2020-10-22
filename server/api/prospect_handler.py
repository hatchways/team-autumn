import json
from flask import jsonify, request, Blueprint, Response
from db.model import Prospect
import jsonschema
from api.util import get_schema, validate_json_input, fail_response
from api import error_code


prospect_handler = Blueprint('prospect_handler', __name__)


prospect_schema = {
    "type": "object",
    "properties": {
        # "user_id": get_schema(),
        # "owner_email": get_schema(),
        "first_name": get_schema(),
        "last_name": get_schema(),
        "email": get_schema(format="email"),
        "status": get_schema()
    }
}


@prospect_handler.route('/upload_prospects', methods=['POST'])
def upload_prospect():
    """
    API to handle the upload of prospects
    Fill this out later
    """

    # Change this to work with one or many prospects

    if not request.is_json:
        return fail_response(error_code.MIME_NOT_JSON), 400
    err, prospect_json = validate_json_input(
        request.get_json(), prospect_schema)
    if err:
        return fail_response(error_code.EMPTY_REQUIRED_FIELD), 400
    if not prospect_json["email"]:
        return fail_response(error_code.EMAIL_REQUIRED), 400

    # Potentially add check whether email and owner already exist

    # Add to db
    prospect_json = prospect_json.copy()
    Prospect(**prospect_json).save()
    return 201


@prospect_handler.route('/prospects', methods=['GET'])
def get_prospects():
    # return all prospects
    return 200
