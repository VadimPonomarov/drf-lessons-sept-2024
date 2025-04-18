import asyncio
from contextlib import asynccontextmanager

import pika
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from health import router as health_router

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
                logger.info("Consumer task cancelled successfully.")

        logger.info("Application shutdown completed.")


async def start_consumer():
    """
    Starts the RabbitMQ consumer as an asynchronous task.
    """
    def consume():
        # Create a RabbitMQ connection factory and start consuming messages
        connection = ConnectionFactory(
            pika.ConnectionParameters(
                # Always use the service name from docker-compose when in container
                host="rabbitmq",  
                heartbeat=600,    # Add heartbeat for connection stability
                blocked_connection_timeout=300
            ),
            "email_queue",
            callback=lambda *args, **kwargs: send_email.delay(*args, **kwargs),
        )
        connection.consume()

    # Run the blocking consume function in a separate thread
    await asyncio.to_thread(consume)


# Create a FastAPI application with a custom lifespan
main_app = FastAPI(lifespan=lifespan, default_response_class=ORJSONResponse)
main_app.include_router(health_router)

@main_app.on_event("startup")
async def startup_event():
    """
    Start the consumer when the application starts
    """
    if not settings.run.docker:
        logger.info("Starting in local mode")
        return
        
    logger.info("Starting consumer in Docker mode")
    try:
        consumer_task = asyncio.create_task(start_consumer())
        asyncio.create_task(monitor_consumer(consumer_task))
    except Exception as e:
        logger.error(f"Failed to start consumer: {e}")

async def monitor_consumer(consumer_task):
    """
    Monitor consumer state and restart if necessary
    """
    while True:
        try:
            await asyncio.sleep(30)  # Check every 30 seconds
            if consumer_task.done():
                logger.warning("Consumer task completed unexpectedly, restarting...")
                consumer_task = asyncio.create_task(start_consumer())
        except Exception as e:
            logger.error(f"Error in consumer monitor: {e}")

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
