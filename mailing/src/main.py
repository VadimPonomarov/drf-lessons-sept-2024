import asyncio
import os
from contextlib import asynccontextmanager

import pika
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

from services.mail_services import send_email
from services.pika_helper import ConnectionFactory
from settings.config import settings
from settings.logger_config import logger

# Load environment variables
load_dotenv()

# Initialize the FastAPI app
app = FastAPI()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the lifespan of the application, including the startup and shutdown of background tasks.
    """
    consumer_task = None  # Background consumer task

    try:
        if settings.run.docker:
            logger.info("Starting consumer from Docker environment...")
        else:
            logger.info("Starting consumer from Local environment...")

        # Start the background consumer task
        consumer_task = asyncio.create_task(start_consumer())
        yield  # The application runs here
    except Exception as e:
        logger.error(f"Error in lifespan(): {e}")

    finally:
        # Cancel the consumer task if it's still running
        if consumer_task:
            consumer_task.cancel()
            try:
                await consumer_task
            except asyncio.CancelledError:
                logger.info("Сonsumer task cancelled successfully.")

        logger.info("Application shutdown completed.")


async def start_consumer():
    """
    Starts the RabbitMQ consumer as an asynchronous task.
    """

    def consume():
        # Create a RabbitMQ connection factory and start consuming messages
        connection = ConnectionFactory(
            pika.ConnectionParameters(
                "rabbitmq" if os.environ.get("DOCKER",
                                             "False") == "True" else "localhost"
            ),
            "email_queue",
            callback=lambda *args, **kwargs: send_email.delay(*args, **kwargs),
        )
        connection.consume()

    # Run the blocking consume function in a separate thread
    await asyncio.to_thread(consume)


# Create a FastAPI application with a custom lifespan
main_app = FastAPI(lifespan=lifespan, default_response_class=ORJSONResponse)

if __name__ == "__main__":
    try:
        # Start the ASGI server (Uvicorn)
        uvicorn.run(
            app="main:main_app",
            reload=True,
        )
    except Exception as e:
        # Log unexpected errors during application startup
        logger.error(f"Error in main(): {e}")
    finally:
        # Ensure all background tasks and resources are closed
        logger.info("Exiting application. Cleaning up resources.")
