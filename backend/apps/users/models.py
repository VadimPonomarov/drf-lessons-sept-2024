from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.validators import MaxValueValidator, EmailValidator
from django.db import models
from django_minio_backend import MinioBackend, iso_date_prefix

from core.models.base import BaseModel
from .managers import UserManager


class ProfileModel(BaseModel):
    class Meta(BaseModel.Meta):
        db_table = "profiles"

    name = models.CharField(max_length=255, blank=True)
    surname = models.CharField(max_length=255, blank=True)
    age = models.IntegerField(null=True, validators=[
        MaxValueValidator(100, message="Invalid age")])
    avatar = models.ImageField(
        upload_to=iso_date_prefix,
        storage=MinioBackend(bucket_name="media-bucket"),
        blank=True,
    )
    user = models.OneToOneField("UserModel", on_delete=models.CASCADE,
                                related_name="profile")


class UserModel(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Meta(BaseModel.Meta):
        db_table = "auth_user"

    email = models.EmailField(unique=True, validators=[
        EmailValidator(message="Invalid email address")])
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    objects = UserManager()
