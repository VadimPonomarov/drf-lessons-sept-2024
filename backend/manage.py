#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from config.extra_config.logger_config import logger


def load_env_files():
    """
    Searches for .env files in the directory where this script resides, in priority order.
    """
    script_dir = Path(__file__).resolve().parent  # Directory of the current script
    env_files = ['.env', '.env.local', '.env.production', '.env.example']

    for env_file in env_files:
        env_path = script_dir / env_file  # Construct full path using script directory
        if env_path.exists():
            logger.info(f"Loading environment variables from {env_file}")
            load_dotenv(dotenv_path=env_path)
            break  # Stop once the first valid .env file is loaded
    else:
        logger.info("No .env file found. Using default environment variables.")


# Disable logging if ENABLE_LOGGING is set to False
if os.environ.get("ENABLE_LOGGING", "False").lower() in ["false", "0", "no", "off"]:
    logger.disable("__main__")  # Disables logging for the main script


# Call the function to load environment files
load_env_files()


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
