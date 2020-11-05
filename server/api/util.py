import jsonschema
from flask import jsonify
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import get_jwt_identity, jwt_required
from api import error_code
import base64
from email.mime.text import MIMEText


class SafeDict(dict):
    def __missing__(self, key):
        return "{"+str(key)+"}"


def create_message(to, subject, message_text):
    """
    Create a message for an email.

    Args:
        to: Email address of the receiver.
        subject: The subject of the email message.
        message_text: The text of the email message.

    Returns:
        An object containing a base64url encoded str email object.
  """
    message = MIMEText(message_text)
    message['to'] = to
    message['subject'] = subject
    return {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}


def get_schema(input_type="string", **kwargs):
    """
    Define schema for keywords in user json
    """
    ret = {"type": input_type}
    if kwargs:
        ret.update(kwargs)
    return ret


def new_schema(*args, **kwargs):
    """

    Args:
        *args: args that take the default get_schema
        **kwargs: args that needs customize

    Returns:
        dict: a schema
    """
    ret = {
        "type": "object",
        "properties": dict(((arg, get_schema()) for arg in args), **kwargs),
        "additionalProperties": False
    }
    ret["minProperties"] = len(ret["properties"])
    return ret


def validate_json_input(model_json: dict, model_schema):
    """
    Validate user input json against given schema
    Args:
        user_json: dict from front-end
        user_schema: predefined schema

    Returns:
        (Exception|None): Exception if error, else None
        dict: the input user json
    """
    try:
        jsonschema.validate(model_json, model_schema)
    except jsonschema.ValidationError as e:
        return e, model_json
    except jsonschema.SchemaError as e:
        return e, model_json
    return None, model_json


def fail_response(ecode):
    """
    Return the jsonified fail response.
    Args:
        ecode: error code from error_code

    Returns:
        str: jsonified data dict
    """
    ret = {"status": False, "error_code": ecode,
           "error_msg": error_code.DESC[abs(ecode)]}
    return jsonify(ret)


def success_response(**kwargs):
    """
    Return the jsonified success response.
    Args:
        **kwargs: key-valve pair to be inserted to the return dict in json form.

    Returns:
        str: jsonified data dict
    """
    ret = {"status": True, "error_code": 0}
    if kwargs:
        ret.update(kwargs)
    return jsonify(ret)
