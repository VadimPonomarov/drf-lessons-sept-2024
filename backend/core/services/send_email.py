from typing import Literal

from pika import ConnectionParameters

from config.extra_config.logger_config import logger
from core.schemas.email import SendEmailParams, MyTemplateData
from core.services.pika_helper import ConnectionFactory


def send_email_service(to_email: str, title: str, message: str,
                       queue_name: str = "email_queue",
                       connection_parameters: Literal[
                           "localhost", "rabbitmq"] = "rabbitmq"):
    try:
        (ConnectionFactory(
            parameters=ConnectionParameters(connection_parameters),
            queue_name=queue_name,
        )
        .publish(
            params=SendEmailParams(
                to_email=to_email,
                subject=title,
                template_data=MyTemplateData(
                    title=title, message=message,
                    logo_url="cid:logo"
                )
                .model_dump(),
            ),
        ))
        logger.info("Email successfully sent to the queue.")
    except Exception as e:
        logger.error(f"Failed to send email to the queue: {str(e)}")
