from pymodm import MongoModel as OriginMongoModel


class MongoModel(OriginMongoModel):
    def __init__(self, *args, **kwargs):
        super(MongoModel, self).__init__(*args, **kwargs)
        self.__post_init__()

    def __post_init__(self):
        pass
