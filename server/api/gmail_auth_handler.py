from flask import jsonify, request, Blueprint, Response, session, url_for, redirect
from flask_jwt_extended import get_jwt_identity, jwt_required
from db.model import User
from api.util import *
from api import error_code
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import AuthorizedSession
import google.auth.exceptions

gmail_auth_handler = Blueprint('gmail_auth_handler', __name__)

SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/userinfo.email',
    # Add other requested scopes.
]

CLIENTSECRETS_LOCATION = './credentials.json'  # TODO: goes to config file
# url_for('gmail_auth_handler.gmail_oauth_callback', _external=True)
REDIRECT_URI = 'http://localhost:5000/gmail_oauth_callback'
REDIRECT_URI_FRONT = 'http://localhost:3000/campaigns'


@gmail_auth_handler.route('/gmail_oauth_url', methods=["GET", "POST"])
@jwt_required
def get_authorization_url():
    """Retrieve the authorization URL.
        Returns:
          str: json includes Authorization URL to redirect the user to.
        """
    flow = Flow.from_client_secrets_file(CLIENTSECRETS_LOCATION, scopes=SCOPES,
                                         redirect_uri=REDIRECT_URI,
                                         )
    auth_url, state = flow.authorization_url(prompt='consent',
                                             access_type='offline',
                                             include_granted_scopes='true',
                                             )
    session["GMAIL_OAUTH_STATE"] = state
    return success_response(url=auth_url), 200


@gmail_auth_handler.route('/gmail_oauth_callback')
@jwt_required
def gmail_oauth_callback():
    """
    Called by google oauth server; This will add user gmail cred to db and redirect to front-end page.
    """
    # 0. get jwt identity
    if not session.get("GMAIL_OAUTH_STATE", None):
        return fail_response(error_code.UNAUTHORIZED_ACCESS), 400
    flow = Flow.from_client_secrets_file(CLIENTSECRETS_LOCATION,
                                         scopes=SCOPES,
                                         redirect_uri=REDIRECT_URI, state=session["GMAIL_OAUTH_STATE"]
                                         )
    flow.redirect_uri = REDIRECT_URI
    # 1. Confirm State == saved state with jwt required
    if session.get("GMAIL_OAUTH_STATE", None) != request.args["state"]:
        return fail_response(error_code.UNAUTHORIZED_ACCESS), 402
    code = request.args["code"]
    try:
        flow.fetch_token(code=code)
    except Exception as e:
        print(e)
        return fail_response(error_code.GMAIL_AUTH_FAILED), 401

    u = User.get_by_email(get_jwt_identity()["email"])
    u.gmail_update_credentials(flow.credentials)
    return redirect(REDIRECT_URI_FRONT)


@gmail_auth_handler.route('/gmail_profile')
@jwt_required
def get_gmail_profile():
    email = get_jwt_identity()["email"]
    user = User.get_by_email(email)
    return success_response(gmail_info=user.get_gmail_profile()), 200
