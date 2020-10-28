from flask import request, Blueprint, current_app
from db.model import User
from api import error_code
from api.util import get_schema, validate_json_input, fail_response, get_jwt_identity, jwt_required, new_schema, \
    success_response
from pymodm.errors import DoesNotExist

campaign_handler = Blueprint('campaign_handler', __name__)

user_entry_allow_methods = {
    "campaigns_list": new_schema(),
    "campaigns_append": new_schema("name"),
    "campaign_by_id": new_schema("campaign_id"),
    "prospects_bulk_append": new_schema(prospects_list=get_schema("array", properties={}, additionalProperties=True))
}


@campaign_handler.route('/user/<method_name>', methods=['POST'])
@jwt_required
def user_entry(method_name):
    """
    User api end point. The api should post to any of the following method in such format "/user/campaigns_list"
    For methods need no args, pass empty dict {} as the body
    All methods listed below are defined in User class in ../db/model.py
    If accessed document is not in db, return false_response with error_code.DOCUMENT_NOT_EXIST
    Args:
        method_name:
            campaigns_list
            campaigns_append
            campaign_by_id
            prospects_bulk_append
    Returns:
        {"status":True, "error_code":0,"response":jsonified_RETURN_FROM_CORRESPONDING_METHOD}
        if fail, the return will be in the format
                {"status":False, "error_code":-[1-9]}
    """
    user = User.get_by_email(get_jwt_identity()["email"])
    if method_name not in user_entry_allow_methods.keys():
        return fail_response(error_code.METHODS_NOT_ALLOWED), 400
    err, user_json = validate_json_input(
        request.get_json(), user_entry_allow_methods[method_name])
    if err:
        return fail_response(error_code.EMPTY_REQUIRED_FIELD), 400
    res = user.__getattribute__(method_name)(**user_json)
    return success_response(response=res), 200


campaign_entry_allow_methods = {
    "steps_add": new_schema("content", "subject"),
    "steps_edit": new_schema("content", "subject", step_index=get_schema("integer"))
}
print(campaign_entry_allow_methods["steps_edit"])


@campaign_handler.route('/campaign/<campaign_id>/<method_name>', methods=['POST'])
@jwt_required
def campaign_entry(campaign_id, method_name):
    """
    Campaign api end point. The api should post to any of the following method in such format
        "/campaign/aabbccdd/steps_add"
    For methods need no args, pass empty dict {} as the body
    All methods listed below are defined in Campaign class in ../db/model.py
    If accessed document is not in db, return false_response with error_code.DOCUMENT_NOT_EXIST
    Args:
        campaign_id: id to lookup in user's campaign list
        method_name:
            steps_add
            steps_edit
    Returns:
        {"status":True, "error_code":0,"response":jsonified_RETURN_FROM_CORRESPONDING_METHOD}
        if fail, the return will be in the format
                {"status":False, "error_code":-[1-9]}
    """
    if method_name not in campaign_entry_allow_methods.keys():
        return fail_response(error_code.METHODS_NOT_ALLOWED), 400
    err, user_json = validate_json_input(
        request.get_json(), campaign_entry_allow_methods[method_name])
    if err:
        return fail_response(error_code.EMPTY_REQUIRED_FIELD), 400

    user = User.get_by_email(get_jwt_identity()["email"])
    cur_campaign = user.campaign_by_id(campaign_id)
    res = cur_campaign.__getattribute__(method_name)(**user_json)
    return success_response(response=res), 200


@campaign_handler.app_errorhandler(DoesNotExist)
def item_not_exist(e):
    return fail_response(error_code.DOCUMENT_NOT_EXIST), 404
