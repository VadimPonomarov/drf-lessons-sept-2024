__all__ = ["BASE_URL", "REST_FRAMEWORK", "SIMPLE_JWT", "SWAGGER_SETTINGS",
           "DATABASES", "logger"]

from .db import DATABASES
from .rest_framework import REST_FRAMEWORK
from .simple_jwt import SIMPLE_JWT
from .swagger import SWAGGER_SETTINGS
from .base_url import BASE_URL
from .logger_config import logger
