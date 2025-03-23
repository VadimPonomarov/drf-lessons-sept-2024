import os

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "HOST": os.environ.get("POSTGRES_HOST", "pg"),
        "PORT": os.environ.get("POSTGRES_PORT", 5432),
        "NAME": os.environ.get("POSTGRES_DB", "db"),
        "USER": os.environ.get("POSTGRES_USER", "user"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "password"),
    }
}
