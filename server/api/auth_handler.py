from flask import jsonify, Blueprint
from auth.google import get_authorization_url
# import email address from user model
# from db.model import User
auth_handler = Blueprint('auth_handler', __name__)


@auth_handler.route('/auth')
def auth():
    # url = get_authorization_url(User.email)
    # return jsonify({'url': url})