import base64
from datetime import datetime
from email.mime.text import MIMEText

from db.model import User

MEDIA_UPLOAD_URL = "https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send"
METAONLY_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"


def create_message(to, subject, message_text):
    """
    Create a message for an email.
    # TODO : every message should only be send to one; Can I use BCC
    Args:
        to: Email address of the receiver.
        subject: The subject of the email message.
        message_text: The text of the email message.

    Returns:
        An object containing a base64url encoded email object.
  """
    message = MIMEText(message_text)
    message['to'] = to
    message['subject'] = subject
    return {'raw': base64.urlsafe_b64encode(message.as_bytes())}


def send_email_worker(user_id, campaign_id, step_index):
    user = User.get_by_id(user_id)
    if not user:
        raise AssertionError("User not exist")
    if not user.gmail_oauthed:
        raise AssertionError("User didn't link the gmail account")
    session = user._gmail_session
    campaign = user.campaign_by_id(campaign_id)
    step = campaign.steps_get(step_index)

    for each in step.prospects:
        email_text = campaign.steps_email_replace_keyword(step.email, each)
        msg = create_message(each.email, campaign.subject, email_text)
        # Set threadId to keep the email in a conversation in the same campagin
        if campaign.name in each.thread_id:
            msg["threadId"] = each.thread_id[campaign.name]
        res = session.post(METAONLY_URL, json=msg)
        if res.status_code != 200:
            continue
        res_json = res.json()
        each.thread_id[campaign.name] = res_json["threadId"]
        each.last_contacted = datetime.now()
        # Replace
        # TODO: Other status update
        # TODO: notify front end
        each.save()



if __name__ == '__main__':
    print(create_message("api.test.gm@gmail.com", "TestTitle", "Test_text"))
