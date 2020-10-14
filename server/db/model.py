from pymodm import MongoModel, fields


class Email(MongoModel):
    """
    Stub for future Email model
    """
    pass


class User(MongoModel):
    """
    User model

    Example:
        from pymodm.connection import connect
        connect("mongodb://localhost:8000/db", alias="user-db")
        new_user=User("a@b.com",first_name="John",last_name="Smith",salted_password="aa-bb-cc-dd").save()

    """
    email = fields.EmailField(primary_key=True)
    first_name = fields.CharField()
    last_name = fields.CharField()
    salted_password = fields.CharField()
    # Google Oauth link status; Related data field might be added later
    google_account_linked = fields.BooleanField(default=False)
    sent_emails = fields.EmbeddedDocumentListField(Email)

    class Meta:
        # This model will be used in the connection "user-db"
        connection_alias = 'user-db'

