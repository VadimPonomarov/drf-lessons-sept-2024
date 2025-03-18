import os

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "HOST": os.getenv("POSTGRES_HOST", "pg"),
        "PORT": os.getenv("POSTGRES_PORT", 5432),
        "NAME": os.getenv("POSTGRES_DB", "db"),
        "USER": os.getenv("POSTGRES_USER", "user"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "password"),
    }
}