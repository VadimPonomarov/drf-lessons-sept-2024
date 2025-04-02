from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from apps.users.models import ProfileModel
from core.enums.msg import MessagesEnum
from core.logging.logger_config import logger
from core.serializers.base import BaseModelSerializer
from core.serializers.file_upload import FileUploadSerializer
from core.services.jwt import JwtService, ActivateToken
from core.services.send_email import send_email_service

UserModel = get_user_model()


class ProfileSerializer(FileUploadSerializer, BaseModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True, use_url=True, )

    class Meta(BaseModelSerializer.Meta):
        model = ProfileModel
        fields = ("id", "name", "surname", "age", "avatar", "created_at", "updated_at")

    def validate_avatar(self, value):
        if value is None:
            return value
        return self.validate_file(value)


class UserSerializer(BaseModelSerializer):
    profile = ProfileSerializer(required=False, allow_null=True)

    class Meta(BaseModelSerializer.Meta):
        model = UserModel
        fields = (
            "id",
            "email",
            "password",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
            "profile",
        )
        extra_kwargs = {
            "password": {"write_only": True},
            "is_active": {"read_only": True},
            "is_staff": {"read_only": True},
            "is_superuser": {"read_only": True},
        }

    @transaction.atomic
    def create(self, validated_data):
        try:
            profile_data = validated_data.pop("profile", None)
            user = UserModel(**validated_data)
            user.set_password(validated_data["password"])
            user.save()

            if profile_data:
                ProfileModel.objects.create(user=user, **profile_data)
            token = JwtService.create_token(user, ActivateToken)
            message = MessagesEnum.EMAIL_ACTIVATE.get_message(
                token=token, resource="api/users/activate"
            )

            send_email_service(title="Activate your account", message=message,
                               to_email=validated_data["email"])
            return user
        except Exception as e:
            logger.error(f"Error in create(): {e}")

    @transaction.atomic
    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)
        user = super().update(instance, validated_data)

        if profile_data:
            if "avatar" in profile_data and profile_data["avatar"] is None:
                profile_data.pop("avatar")

            ProfileModel.objects.update_or_create(user=user, defaults=profile_data)

        return user


class UserEditSerializer(UserSerializer):
    class Meta(BaseModelSerializer.Meta):
        model = UserModel
        fields = ("email", "profile")


class UserPasswordSerializer(BaseModelSerializer):
    token = serializers.CharField(required=True)

    class Meta(BaseModelSerializer.Meta):
        model = UserModel
        fields = ("password", "token")


class UserActivateSerializer(BaseModelSerializer):
    class Meta(BaseModelSerializer.Meta):
        model = UserModel
        fields = ("is_active",)


class AvatarSerializer(BaseModelSerializer):
    class Meta(BaseModelSerializer.Meta):
        model = ProfileModel
        fields = ("avatar",)
