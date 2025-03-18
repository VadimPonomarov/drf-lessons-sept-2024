from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from .managers import UserManager
from core.models.base import BaseModel


class ProfileModel(BaseModel):
    class Meta(BaseModel.Meta):
        db_table = "profiles"

    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    age = models.IntegerField()
    user = models.OneToOneField("UserModel", on_delete=models.CASCADE, related_name="profile")


class UserModel(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Meta(BaseModel.Meta):
        db_table = "auth_user"

    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    objects = UserManager()
