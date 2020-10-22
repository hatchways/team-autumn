from flask import Flask
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.register_handler import register_handler
from api.auth_handler import auth_handler
from addon import bcrypt, jwt
from pymodm import connect
import datetime
import os

app = Flask(__name__)
app.config.from_object("config.Config")
bcrypt.init_app(app)
jwt.init_app(app)

connect(app.config["DB_ADDR"], alias=app.config["DB_ALIAS"])

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(register_handler)
app.register_blueprint(auth_handler)
