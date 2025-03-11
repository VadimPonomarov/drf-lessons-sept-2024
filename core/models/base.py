from django.db import models

from core.utils.converters import camel_case_to_snake_case


class BaseModel(models.Model):
    class Meta:
        abstract = True
        db_table = f"{camel_case_to_snake_case(__name__)}s"