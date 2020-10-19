import json
from flask import jsonify, request, Blueprint, Response
from db.model import User
import jsonschema
from api.util import *
from api import error_code
from auth.google import get_authorization_url
# import email address from user model
# from db.model import User
google_auth_handler = Blueprint('google_auth_handler', __name__)


@google_auth_handler.route('/google_auth')
def auth():
    # url = get_authorization_url(User.email)
    return jsonify({'url': 'url goes here'})
