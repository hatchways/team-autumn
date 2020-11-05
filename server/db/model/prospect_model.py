from datetime import datetime
import pymongo
from bson import ObjectId
from pymodm import MongoModel, fields
import pymodm.errors
from google.auth.transport.requests import AuthorizedSession
from google.oauth2.credentials import Credentials
import json
from warnings import warn
from api.util import SafeDict
from pymodm.context_managers import no_auto_dereference
from addon import rq


class Prospect(MongoModel):
    owner = fields.ReferenceField("User")
    email = fields.CharField()
    first_name = fields.CharField()
    last_name = fields.CharField()
    status = fields.CharField()
    campaigns = fields.ListField(fields.ReferenceField(
        "Campaign"))
    last_contacted = fields.DateTimeField()
    keyword_dict = fields.DictField()
    thread_id = fields.DictField()

    @classmethod
    def find_by_id(cls, _id):
        """

        Args:
            _id:

        Returns:
            Prospect: the object
        """
        if isinstance(_id, str):
            _id = ObjectId(_id)
        try:
            prospect = cls.objects.get({'_id': _id})
            return prospect
        except:
            return None
    @classmethod
    def get_by_owner(cls, _id):
        if isinstance(_id, str):
            _id = ObjectId(_id)
        return cls.objects.raw({"owner": _id})

    def to_dict(self):
        return self.to_son().to_dict()

    class Meta:
        indexes = [pymongo.IndexModel([("owner", pymongo.HASHED)])]
        connection_alias = 'user-db'
        ignore_unknown_fields = True