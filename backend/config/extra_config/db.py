import os

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "HOST": os.environ["POSTGRES_HOST"] or "pg",
        "PORT": os.environ["POSTGRES_PORT"] or 5432,
        "NAME": os.environ["POSTGRES_DB"] or "db",
        "USER": os.environ["POSTGRES_USER"] or "user",
        "PASSWORD": os.environ["POSTGRES_PASSWORD"] or "password",
    }
}
