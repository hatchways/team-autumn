import os
import datetime
from pymodm import connect
from addon import bcrypt, jwt
from api.prospect_handler import prospect_handler
from api.gmail_auth_handler import gmail_auth_handler
from flask import Flask, session
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.register_handler import register_handler
from api.auth_handler import auth_handler


app = Flask(__name__)
app.config.from_object("config.Config")
app.secret_key = "Not secret key"
bcrypt.init_app(app)
jwt.init_app(app)

connect(app.config["DB_ADDR"], alias=app.config["DB_ALIAS"])

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(register_handler)
app.register_blueprint(auth_handler)
app.register_blueprint(gmail_auth_handler)


@app.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = datetime.timedelta(minutes=5)


app.register_blueprint(prospect_handler)
