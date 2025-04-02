import os

from loguru import logger

log_directory = os.environ.get("LOG_DIRECTORY", "./logs")
os.makedirs(log_directory, exist_ok=True)

enable_logging = (
        os.environ.get("ENABLE_LOGGING", "False").lower() not in ["false",
                                                                  "0",
                                                                  "no"])
if not enable_logging:
    logger.disable("")

else:
    logger.add(
        os.path.join(log_directory, "app.log"),
        level=os.environ.get("LOG_LEVEL", "TRACE"),
        format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}",
        rotation="10 MB",
        compression="zip",
    )
