from flask import Flask
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.register_handler import register_handler
from api.auth_handler import auth_handler
from api.google_auth_handler import google_auth_handler
from addon import bcrypt, jwt
from pymodm import connect
import datetime
import os

DEV_mode = True
app = Flask(__name__)

# True for production
app.config['JWT_TOKEN_LOCATION'] = ['cookies']  # Configure application to store JWTs in cookies #TODO: test can pass when this is commented out.
app.config['JWT_COOKIE_SECURE'] = not DEV_mode  # Only allow JWT cookies to be sent over https.
app.config['JWT_COOKIE_CSRF_PROTECT'] = True    # Enable csrf double submit protection.
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=5)    # JWT expire time
# The secret is for test only
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET',
                                              b'VkO\xce\x0b\xc8\xde\xf1l\xaaQ+\x8bT\xfa\xbf\xb4\xf7\xdf\xc3OP\xcb\x86')
default_db_addr = "mongodb+srv://cpascale43:G6637nM3eVh6Nk8p@cluster0.plsid.mongodb.net/db?retryWrites=true&w=majority"  # Your own mongodb address here
default_db_alias = "user-db"
bcrypt.init_app(app)
jwt.init_app(app)
connect(os.environ.get("db_addr", default_db_addr), alias=os.environ.get("db_alias",default_db_alias))

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(register_handler)
app.register_blueprint(auth_handler)
app.register_blueprint(google_auth_handler)
