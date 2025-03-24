import os

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": 5432,
        "NAME": "db",
        "USER": "user",
        "PASSWORD": "password",
    }
}
