import os

from loguru import logger

log_directory = os.environ.get("LOG_DIRECTORY", "./logs")
os.makedirs(log_directory, exist_ok=True)

if os.environ.get("ENABLE_LOGGING", "True") == "True":
    logger.add(
        os.path.join(log_directory, "app.log"),
        level=os.environ.get("LOG_LEVEL", "DEBUG"),
        format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}",
        rotation="10 MB",
        compression="zip",
    )
else:
    logger.disable("loguru")
