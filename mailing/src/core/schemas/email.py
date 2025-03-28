from pydantic import BaseModel
from settings.config import settings


class MyTemplateData(BaseModel):
    title: str
    message: str
    logo_url: str


class SendEmailParams(BaseModel):
    to_email: str = settings.sendgrid.my_email
    from_email: str = "pvs.versia@gmail.com"
    subject: str = "Subject"
    template_data: dict[str, str]

