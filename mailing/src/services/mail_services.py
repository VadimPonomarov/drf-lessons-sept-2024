import os
import smtplib
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from jinja2 import Environment, FileSystemLoader

from celery_config import celery_app
from settings.config import settings

# Set up the Jinja2 template environment.
template_loader = FileSystemLoader(searchpath="./templates")
env = Environment(loader=template_loader, autoescape=True)


@celery_app.task(name="send_email_task")
def send_email(from_email: str, to_email: str, subject: str, template_data: dict) -> str:
    """
    Celery task to send an HTML email with an inline logo image via Gmail SMTP.

    Parameters:
        from_email (str): Sender's email address.
        to_email (str): Recipient's email address.
        subject (str): Email subject.
        template_data (dict): Data for rendering the HTML email template.

    Returns:
        str: A message indicating success or an error description.
    """
    # Render the HTML content using the provided template data.
    try:
        template = env.get_template("email_template.html")
        html_content = template.render(template_data)
    except Exception as e:
        error_msg = f"Error rendering template: {e}"
        print(error_msg)
        return error_msg

    print("Rendered HTML content:")
    print(html_content)

    # Create the root message container (for inline attachments, use "related").
    msg = MIMEMultipart("related")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email

    # Create an alternative part to include the HTML content.
    msg_alternative = MIMEMultipart("alternative")
    msg.attach(msg_alternative)
    msg_alternative.attach(MIMEText(html_content, "html"))

    # Attach an inline logo image.
    image_path = "./media/indonesian_halal_logo_2022.jpg"
    if os.path.exists(image_path):
        try:
            with open(image_path, "rb") as logo_file:
                img_data = logo_file.read()
            image_mime = MIMEImage(img_data, _subtype="jpeg")
            # Set Content-ID so it can be referenced in HTML as <img src="cid:logo">
            image_mime.add_header("Content-ID", "<logo>")
            image_mime.add_header("Content-Disposition", "inline", filename="logo.jpg")
            msg.attach(image_mime)
        except Exception as e:
            print(f"Error attaching image: {e}")
    else:
        print(f"Attachment file not found: {image_path}")

    # Prepare Gmail SMTP connection settings.
    smtp_server = settings.gmail.email_server
    smtp_port = settings.gmail.email_port
    username = settings.gmail.email_host_user
    password = settings.gmail.email_host_password
    use_tls = settings.gmail.email_use_tls

    server = None
    try:
        # Connect to the SMTP server.
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
        server.ehlo()
        if use_tls:
            server.starttls()
            server.ehlo()
        # (Optional) Uncomment the following line for debug output:
        # server.set_debuglevel(1)
        # Log in using your Gmail credentials.
        server.login(username, password)
        # Send the email.
        server.sendmail(from_email, [to_email], msg.as_string())
        print("Email sent successfully via Gmail SMTP.")
        return "Email sent successfully."
    except Exception as e:
        error_message = f"Error sending email: {str(e)}"
        print(error_message)
        return error_message
    finally:
        if server is not None:
            try:
                server.quit()
            except Exception:
                pass
