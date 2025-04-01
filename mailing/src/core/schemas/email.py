from pydantic import BaseModel
from settings.config import settings

class MyTemplateData(BaseModel):
    title: str
    message: str
    logo_url: str

class SendEmailParams(BaseModel):
    subject: str
    to_email: str
    from_email: str = settings.gmail.sender_email
    template_data: MyTemplateData

