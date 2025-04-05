from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import NotAcceptable
from rest_framework.generics import (
    RetrieveUpdateDestroyAPIView, get_object_or_404, )
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from apps.users.docs.swagger_params import (
    update_avatar_parameters, update_avatar_responses, delete_avatar_responses
)
from apps.users.models import ProfileModel
from apps.users.permissions import IsSuperUserOrMe
from apps.users.serializers import (
    AvatarSerializer, )

UserModel = get_user_model()


class UpdateAvatarView(RetrieveUpdateDestroyAPIView):
    """
    Update or delete the avatar of a user's profile by user_id.
    """
    serializer_class = AvatarSerializer
    parser_classes = (MultiPartParser,)
    permission_classes = (IsSuperUserOrMe,)
    allowed_methods = ['PATCH', 'DELETE']

    def get_queryset(self):
        """
        Returns the profile object associated with the given user_id.
        """
        user_id = self.kwargs.get("pk")
        return ProfileModel.objects.filter(user_id=user_id)

    @swagger_auto_schema(
        tags=["profile"],
        operation_id="upload_avatar",
        operation_description="Upload avatar of user's profile using "
                              "user_id (pk).",
        manual_parameters=update_avatar_parameters,
        responses=update_avatar_responses,
        consumes=["multipart/form-data"]
    )
    def patch(self, request, *args, **kwargs):
        user_id = self.kwargs.get("pk")
        profile = get_object_or_404(ProfileModel, user_id=user_id)

        avatar_file = request.FILES.get("avatar")
        if not avatar_file:
            raise NotAcceptable("Avatar file is required")

        profile.avatar = avatar_file
        profile.save()

        return Response({"avatar_url": profile.avatar.url}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        tags=["profile"],
        operation_id="delete_avatar",
        operation_description="Delete the avatar of a user's profile using user_id (pk).",
        responses=delete_avatar_responses
    )
    def delete(self, request, *args, **kwargs):
        user_id = self.kwargs.get("pk")
        profile = get_object_or_404(ProfileModel, user_id=user_id)
        profile.avatar.delete()
        return Response({"message": "Avatar deleted successfully"},
                        status=status.HTTP_200_OK)
