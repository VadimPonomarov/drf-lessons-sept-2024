import os

from loguru import logger

from settings.config import settings

log_directory = settings.log_directory
os.makedirs(log_directory, exist_ok=True)

if settings.loguru:
    logger.add(
        os.path.join(log_directory, "app.log"),
        level=settings.log_level or "DEBUG",
        format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}",
        rotation="10 MB",
        compression="zip",
    )
else:
    logger.remove()

__all__ = ["logger"]
