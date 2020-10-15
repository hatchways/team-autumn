import jsonschema
from flask import jsonify


def get_schema(input_type="string", **kwargs):
    """
    Define schema for keywords in user json
    """
    ret = {"type": input_type}
    if kwargs:
        ret.update(kwargs)
    return ret


def validate_json_input(user_json, user_schema):
    try:
        jsonschema.validate(user_json, user_schema)
    except jsonschema.ValidationError as e:
        return e, user_json
    except jsonschema.SchemaError as e:
        return e, user_json
    return None, user_json


def fail_response(ecode):
    ret = {"status": False, "error_code": ecode}
    return jsonify(ret)


def success_response(**kwargs):
    ret = {"status": True}
    if kwargs:
        ret.update(kwargs)
    return jsonify(ret)
