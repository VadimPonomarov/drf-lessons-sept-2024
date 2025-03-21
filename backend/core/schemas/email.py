from pydantic import BaseModel, EmailStr


class MyTemplateData(BaseModel):
    title: str
    message: str
    logo_url: str


class SendEmailParams(BaseModel):
    to_email: str  # Stricter email validation
    from_email: str = "pvs.versia@gmail.com"
    subject: str = "Subject"
    template_data: dict[str, str]
