from flask import Flask
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.register_handler import register_handler
from api.auth_handler import auth_handler
from addon import bcrypt, jwt
from pymodm import connect
import datetime
import os

DEV_mode = True
app = Flask(__name__)

app.config['JWT_TOKEN_LOCATION'] = ['cookies']  # Configure application to store JWTs in cookies
app.config['JWT_COOKIE_SECURE'] = not DEV_mode  # Only allow JWT cookies to be sent over https.
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Enable csrf double submit protection. / False can pass the test.
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=5)    # JWT expire time
app.config["JWT_ACCESS_CSRF_HEADER_NAME"] = "X-CSRF-TOKEN-ACCESS"
app.config["JWT_REFRESH_CSRF_HEADER_NAME"] = "X-CSRF-TOKEN-REFRESH"
# The secret is for test only
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET',
                                              b'VkO\xce\x0b\xc8\xde\xf1l\xaaQ+\x8bT\xfa\xbf\xb4\xf7\xdf\xc3OP\xcb\x86')

bcrypt.init_app(app)
jwt.init_app(app)

default_db_alias = "user-db"
db_addr = os.environ.get("db_addr", None)
if DEV_mode:
    # Your own mongodb address here
    db_addr = "mongodb+srv://dbUser:{}BkA@{}.mongodb.net/db?retryWrites=true&w=majority".format(
    "mqMgkPzs90L5x",
    "cluster0.7p53t"
)
connect(db_addr, alias=os.environ.get("db_alias", default_db_alias))

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(register_handler)
app.register_blueprint(auth_handler)

# app.run()