import os
import datetime
from flask.cli import load_dotenv

load_dotenv()

TEAM_NAME = os.environ.get('TEAM_NAME', "TEAM_AUTUMN")


class Config:
    # Configure application to store JWTs in cookies
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False  # Only allow JWT cookies to be sent over https.
    # Enable csrf double submit protection. / False can pass the test.
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=5)
    JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-TOKEN-ACCESS"
    JWT_REFRESH_CSRF_HEADER_NAME = "X-CSRF-TOKEN-REFRESH"

    # Located at .env file
    JWT_SECRET_KEY = bytes(os.environ.get("JWT_SECRET_KEY", ""), encoding="utf-8")\
        .decode("unicode_escape").encode("latin-1")
    DB_ADDR = os.environ.get("DB_ADDR", None)
    DB_ALIAS = "user-db"
