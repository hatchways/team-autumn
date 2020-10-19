from flask import jsonify, request, Blueprint, Response
from flask_jwt_extended import get_jwt_identity, jwt_required
from auth.google import get_authorization_url
from db.model import User
from api.util import *
from api import error_code

gmail_auth_handler = Blueprint('gmail_auth_handler', __name__)


@gmail_auth_handler.route('/google_auth')
# @jwt_required
def auth():
    print('gmail auth handler running')
    # One good choice for a state token is a string of 30 or so characters constructed using a high-quality random-number generator
    # see: https://developers.google.com/identity/protocols/oauth2/openid-connect#createxsrftoken
    # {'email': '45f4e949-53d4-4eff-a98e-ea6d084fafee@test.test', 'first_name': 'John', 'last_name': 'Smith'}
    # res = get_jwt_identity()
    res = {'email': 'abc@abc.com'}
    state = 'J8jVUzDq38sNA4yxYQccmWZ7HeVXuC'
    url = get_authorization_url(res['email'], state)
    print('url', url)
    return success_response(Url=url), 200