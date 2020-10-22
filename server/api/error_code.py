PASSWORD_MISMATCH = -1  # Happens when register and login
EMPTY_REQUIRED_FIELD = -2  # Happens when register and login
USER_EXIST = -3  # Happens when register
USER_NOT_EXIST = -4  # Happens when login
MIME_NOT_JSON = -5  # Happens when register and login
UNAUTHORIZED_ACCESS = -6  # Happens when login
NO_VALID_GMAIL_OAUTH_CREDENTIALS = -7
GMAIL_AUTH_FAILED = -8

DESC = ["_",
        "Password mismatch",
        "Empty required field or input not match schema",
        "User already exist",
        "User does not exist",
        "The 'Content-Type' is not set as 'application/json'",
        "Unauthorized access",
        "User's gmail oauth credentials is invalid",
        "Error occurs when auth with google oauth server"
        ]