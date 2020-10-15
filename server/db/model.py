from pymodm import MongoModel, fields


class User(MongoModel):
    """
    User model


    Example:
        from pymodm.connection import connect
        connect("mongodb://localhost:8000/db", alias="user-db")
        new_user=User("a@b.com",first_name="John",last_name="Smith",salted_password="aa-bb-cc-dd").save()

    """
    email = fields.EmailField()
    first_name = fields.CharField()
    last_name = fields.CharField()
    salted_password = fields.CharField()

    @staticmethod
    def get_by_email(email):
        ret = User.objects.raw({"email": email})
        return list(ret)

    def to_dict(self, remove_password=True):
        ret = self.to_son().to_dict()
        if "_cls" in ret:
            del ret["_cls"]
        if "_id" in ret:
            del ret["_id"]
        if remove_password:
            del ret["salted_password"]
        return ret

    class Meta:
        # This model will be used in the connection "user-db"
        connection_alias = 'user-db'
        ignore_unknown_fields = True
