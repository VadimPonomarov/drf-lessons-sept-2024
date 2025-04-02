from abc import ABC

from django.contrib.auth import get_user_model
from django.db import transaction
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import (
    RetrieveUpdateDestroyAPIView, UpdateAPIView, get_object_or_404, ListAPIView,
    CreateAPIView, RetrieveAPIView
)
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from apps.users.docs.swagger_params import (
    pagination_parameters, filtering_parameters,
    update_avatar_parameters, update_avatar_responses, delete_avatar_responses
)
from apps.users.filters import UsersFilter
from apps.users.models import ProfileModel
from apps.users.permissions import IsAdminUserOrMe, IsSuperUserOrMe
from apps.users.serializers import (
    UserSerializer, UserEditSerializer, AvatarSerializer, UserActivateSerializer,
    UserPasswordSerializer
)
from core.enums.msg import MessagesEnum
from core.logging.logger_config import logger
from core.services.jwt import JwtService, ActivateToken, ChangePasswordToken
from core.services.send_email import send_email_service

UserModel = get_user_model()


### List and Create Views

class ListCreateCustomMixin(ABC):
    """
    Base mixin for list and create user operations.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer


class ListUsersView(ListCreateCustomMixin, ListAPIView):
    """
    Retrieve a list of users with pagination and filtering.
    """
    permission_classes = (IsAdminUser,)
    filterset_class = UsersFilter

    @swagger_auto_schema(
        manual_parameters=pagination_parameters + filtering_parameters,
        operation_summary="List users",
        operation_description="Retrieve a list of users with pagination and filtering options."
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class CreateUserView(ListCreateCustomMixin, CreateAPIView):
    """
    Create a new user with profile data and an avatar file upload.
    """
    permission_classes = (AllowAny,)

    @swagger_auto_schema(
        request_body=UserSerializer,
        operation_summary="Create a user",
        operation_description="Create a new user and upload an avatar file.",
        consumes=["multipart/form-data"]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


### Detail View

class UserDetailCustomMixin(ABC):
    """
    Base mixin for user detail-related operations.
    """
    queryset = UserModel.objects.all()
    permission_classes = (IsAdminUserOrMe,)


class UserDetailView(UserDetailCustomMixin, RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific user.
    """
    serializer_class = UserEditSerializer

    @swagger_auto_schema(
        operation_summary="Retrieve user details",
        operation_description="Retrieve detailed information about a specific user."
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=UserEditSerializer,
        operation_summary="Update user details",
        operation_description="Update details of a specific user, including uploading a new avatar.",
        consumes=["multipart/form-data"]
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete user",
        operation_description="Delete a specific user."
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


### Avatar Update and Deletion

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
        operation_id="update_avatar",
        operation_description="Update the avatar of a user's profile using user_id (pk).",
        manual_parameters=update_avatar_parameters,
        responses=update_avatar_responses,
        consumes=["multipart/form-data"]
    )
    def patch(self, request, *args, **kwargs):
        user_id = self.kwargs.get("pk")
        try:
            profile = ProfileModel.objects.get(user_id=user_id)
        except ProfileModel.DoesNotExist:
            return Response({"error": "Profile not found"},
                            status=status.HTTP_404_NOT_FOUND)

        avatar_file = request.FILES.get("avatar")
        if not avatar_file:
            return Response({"error": "Avatar file is required"},
                            status=status.HTTP_400_BAD_REQUEST)

        profile.avatar = avatar_file
        profile.save()

        return Response({"avatar_url": profile.avatar.url}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_id="delete_avatar",
        operation_description="Delete the avatar of a user's profile using user_id (pk).",
        responses=delete_avatar_responses
    )
    def delete(self, request, *args, **kwargs):
        user_id = self.kwargs.get("pk")
        try:
            profile = ProfileModel.objects.get(user_id=user_id)
        except ProfileModel.DoesNotExist:
            return Response({"error": "Profile not found"},
                            status=status.HTTP_404_NOT_FOUND)

        profile.avatar.delete()
        return Response({"message": "Avatar deleted successfully"},
                        status=status.HTTP_200_OK)


### Activation and Password Reset

class ActivateUserView(UpdateAPIView):
    """
    Activate a user using a query parameter token.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserActivateSerializer
    permission_classes = (IsSuperUserOrMe,)
    http_method_names = ['get']

    @swagger_auto_schema(
        operation_summary="Activate a user",
        operation_description="Activate a user by verifying a token passed as a query parameter."
    )
    def get(self, request, *args, **kwargs):
        try:
            token = request.GET.get("token")
            if not token:
                return Response({"error": "Token is required"},
                                status=status.HTTP_400_BAD_REQUEST)

            user_data = JwtService.verify_token(token, ActivateToken)
            user = get_object_or_404(UserModel, pk=user_data.id)

            if user.is_active:
                return Response({"message": "User is already active"},
                                status=status.HTTP_200_OK)

            user.is_active = True
            user.save()

            return Response({"message": "User activated successfully"},
                            status=status.HTTP_200_OK)
        except ValidationError:
            return Response({"error": "Invalid token"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordTokenView(RetrieveAPIView):
    """
    Generate a token for resetting a user's password.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

    @swagger_auto_schema(
        operation_summary="Request password reset token",
        operation_description="Generate and send a token to reset a user's password."
    )
    @transaction.atomic
    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(UserModel, pk=self.kwargs.get("pk"))
            token = JwtService.create_token(user, ChangePasswordToken)
            message = MessagesEnum.PASSWORD_RESET.get_message(token=token)

            send_email_service(title="Reset password", message=message,
                               to_email=user.email)
            return Response(
                {"message": "Email with password reset token sent successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error in get(): {e}")


class ResetPasswordView(UpdateAPIView):
    """
    Reset a user's password using a token.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserPasswordSerializer
    allowed_methods = ['PATCH']
    permission_classes = (AllowAny,)

    @swagger_auto_schema(
        request_body=UserPasswordSerializer,
        operation_summary="Reset password",
        operation_description="Reset the user's password using a token and a new password."
    )
    def patch(self, request, *args, **kwargs):
        token = request.data.get("token")
        new_password = request.data.get("password")

        if not token or not new_password:
            return Response(
                {"error": "Both 'token' and 'password' fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = JwtService.verify_token(token, ChangePasswordToken)
        except Exception as e:
            return Response({"error": f"Invalid token: {str(e)}"},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={"password": new_password})
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data["password"])
        user.save()

        return Response({"message": "Password changed successfully"},
                        status=status.HTTP_200_OK)
