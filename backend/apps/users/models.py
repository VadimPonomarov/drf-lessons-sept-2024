from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django_minio_backend import MinioBackend, iso_date_prefix

from core.models.base import BaseModel
from .managers import UserManager


class ProfileModel(BaseModel):
    class Meta(BaseModel.Meta):
        db_table = "profiles"

    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    age = models.IntegerField()
    avatar = models.ImageField(
        upload_to=iso_date_prefix,  # Префикс из даты, например 2023/04/06
        storage=MinioBackend(bucket_name="test-bucket"),  # Указываем бакет
        null=True,
        blank=True,
    )
    user = models.OneToOneField("UserModel", on_delete=models.CASCADE,
                                related_name="profile")


class UserModel(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Meta(BaseModel.Meta):
        db_table = "auth_user"

    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    objects = UserManager()
