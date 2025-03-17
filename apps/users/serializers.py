from django.contrib.auth import get_user_model
from apps.users.models import ProfileModel
from core.serializers.base import BaseModelSerializer

UserModel = get_user_model()


class ProfileSerializer(BaseModelSerializer):
    class Meta(BaseModelSerializer.Meta):
        model = ProfileModel
        fields = ("id", "name", "surname", "age", "created_at", "updated_at")


class UserSerializer(BaseModelSerializer):
    profile = ProfileSerializer(many=False, required=False)

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

    def create(self, validated_data):
        profile_data = validated_data.pop("profile", None)
        user = UserModel(**validated_data)
        user.set_password(validated_data["password"])
        user.save()

        if profile_data:
            ProfileModel.objects.create(user=user, **profile_data)

        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)
        user = super().update(instance, validated_data)

        if profile_data:
            ProfileModel.objects.update_or_create(user=user, defaults=profile_data)

        return user
