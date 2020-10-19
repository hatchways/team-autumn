import os
import datetime
from flask.cli import load_dotenv

TEAM_NAME = os.environ.get('TEAM_NAME', "TEAM_AUTUMN")

load_dotenv()


class DevConfig:
    TESTING = True
    DEBUG = True
    JWT_TOKEN_LOCATION = ['cookies']  # Configure application to store JWTs in cookies
    JWT_COOKIE_SECURE = False  # Only allow JWT cookies to be sent over https.
    JWT_COOKIE_CSRF_PROTECT = False  # Enable csrf double submit protection. / False can pass the test.
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=5)
    JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-TOKEN-ACCESS"
    JWT_REFRESH_CSRF_HEADER_NAME = "X-CSRF-TOKEN-REFRESH"
    JWT_SECRET_KEY = b'VkO\xce\x0b\xc8\xde\xf1l\xaaQ+\x8bT\xfa\xbf\xb4\xf7\xdf\xc3OP\xcb\x86'  # The secret is for test
    DB_ADDR = os.environ.get("db_addr", None)  # Located at .env file
    DB_ALIAS = "user-db"


class ProdConfig:
    JWT_TOKEN_LOCATION = ['cookies']  # Configure application to store JWTs in cookies
    JWT_COOKIE_SECURE = True  # Only allow JWT cookies to be sent over https.
    JWT_COOKIE_CSRF_PROTECT = True  # Enable csrf double submit protection. / False can pass the test.
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=5)
    JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-TOKEN-ACCESS"
    JWT_REFRESH_CSRF_HEADER_NAME = "X-CSRF-TOKEN-REFRESH"
    JWT_SECRET_KEY = os.getenv("jwt_secret_key", None)  # TODO: decode to bytes might be needed
    DB_ADDR = ""
    DB_ALIAS = "user-db"
