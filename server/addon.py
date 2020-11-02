# Flask extension goes in here
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from redis import Redis
from rq import Queue

# from worker.send_gmail import send_gmail_worker


class FlaskRQ(Queue):
    # rq_q = FlaskRQ(connection=Redis())
    def send_gmail(self, *args, **kwargs):
        return self.enqueue("worker.send_gmail.send_gmail_worker", args=args, kwargs=kwargs)

    def init_app(self, app):
        """
        Register this extension with the flask app.

        :param app: A flask application
        """
        # Save this so we can use it later in the extension
        if not hasattr(app, 'extensions'):  # pragma: no cover
            app.extensions = {}
        app.extensions['redis-queue'] = self


bcrypt = Bcrypt()
jwt = JWTManager()
rq = FlaskRQ(connection=Redis())
