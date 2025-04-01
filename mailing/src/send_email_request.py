from pika import ConnectionParameters

from core.schemas.email import MyTemplateData, SendEmailParams
from services.pika_helper import ConnectionFactory

if __name__ == "__main__":
    message = 'Thank you for joining us! '
    ConnectionFactory(
        parameters=ConnectionParameters("localhost"),
        queue_name="email_queue",
    ).publish(
        params=SendEmailParams(
            to_email="pvs.versia@gmail.com",
            subject="Test Email",
            template_data=MyTemplateData(
                title="Test Email", message=message, logo_url="cid:logo"
            ).model_dump(),
        ),
    )
