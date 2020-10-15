from flask import Flask
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.register_handler import register_handler
from addon import bcrypt, jwt
from pymodm import connect
import os

app = Flask(__name__)

# The secret is for test only
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET',
                                              b'VkO\xce\x0b\xc8\xde\xf1l\xaaQ+\x8bT\xfa\xbf\xb4\xf7\xdf\xc3OP\xcb\x86')
default_db_addr = "localhost"  # Your own mongodb address here
default_db_alias = "user-db"
bcrypt.init_app(app)
jwt.init_app(app)
connect(os.environ.get("db_addr", default_db_addr), alias=os.environ.get("db_alias",default_db_alias))

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(register_handler)
