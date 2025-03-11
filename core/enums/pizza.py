from django.db import models


class PizzaSize(models.TextChoices):
    SMALL = 'S',
    MEDIUM = 'M',
    LARGE = 'L'