from abc import ABC

from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveUpdateDestroyAPIView, \
    UpdateAPIView, get_object_or_404, ListAPIView, CreateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser

from apps.users.docs.swagger_params import pagination_parameters, filtering_parameters, \
    update_avatar_parameters, update_avatar_responses
from apps.users.filters import UsersFilter
from apps.users.models import ProfileModel
from apps.users.permissions import IsMeUser, IsAdminUserOrMe, IsSuperUserOrMe
from apps.users.serializers import UserSerializer, UserEditSerializer, \
    AvatarSerializer, UserActivateSerializer
from core.services.jwt import JwtService, ActivateToken

UserModel = get_user_model()


class ListCreateCustomMixin(ABC):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer


class ListUsersView(ListCreateCustomMixin, ListAPIView):
    permission_classes = (IsAdminUser, )
    filterset_class = UsersFilter

    @swagger_auto_schema(
        manual_parameters=pagination_parameters + filtering_parameters,
        operation_summary="List users",
        operation_description="Retrieve a list of users with pagination and filtering."
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class CreateUserView(ListCreateCustomMixin, CreateAPIView):
    permission_classes = (AllowAny,)

    @swagger_auto_schema(
        request_body=UserSerializer,
        operation_summary="Create a user",
        operation_description="Create a new user with profile data and upload an avatar file.",
        consumes=["multipart/form-data"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UserDetailCustomMixin(ABC):
    queryset = UserModel.objects.all()
    permission_classes = (IsAdminUserOrMe,)


class UserDetailView(UserDetailCustomMixin, RetrieveUpdateDestroyAPIView):
    serializer_class = UserEditSerializer

    @swagger_auto_schema(
        operation_summary="Retrieve user details",
        operation_description="Retrieve details of a specific user."
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=UserEditSerializer,
        operation_summary="Update user details",
        operation_description="Update details of a specific user including avatar upload.",
        consumes=["multipart/form-data"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete user",
        operation_description="Delete a specific user."
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status


class UpdateAvatarView(UpdateAPIView):
    """
    Update the avatar of a user's profile by user_id.
    """
    serializer_class = AvatarSerializer
    parser_classes = (MultiPartParser,)
    permission_classes = (IsSuperUserOrMe,)
    allowed_methods = ['PATCH']

    def get_queryset(self):
        """
        Returns a Profile object associated with the given user_id.
        """
        user_id = self.kwargs.get("pk")
        return ProfileModel.objects.filter(user_id=user_id)

    @swagger_auto_schema(
        operation_id="update_avatar",
        operation_description="Update the avatar of a user's profile using user_id (pk).",
        manual_parameters=update_avatar_parameters,
        responses=update_avatar_responses,
        consumes=["multipart/form-data"],
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


class ActivateUserView(UpdateAPIView):
    """
    View to activate a user using a query parameter token.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserActivateSerializer
    permission_classes = (IsSuperUserOrMe,)
    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        try:
            token = request.GET.get("token")
            if not token:
                return Response({"error": "Token is required"},
                                status=status.HTTP_400_BAD_REQUEST)

            # Verify the token
            user_data = JwtService.verify_token(token, ActivateToken)

            # Retrieve the user by the decoded token data
            user = get_object_or_404(UserModel, pk=user_data.id)
            if user.is_active:
                return Response({"message": "User is already active"},
                                status=status.HTTP_200_OK)

            # Activate the user
            user.is_active = True
            user.save()

            return Response({"message": "User activated successfully"},
                            status=status.HTTP_200_OK)
        except ValidationError:
            return Response({"error": "Invalid token"},
                            status=status.HTTP_400_BAD_REQUEST)
        except UserModel.DoesNotExist:
            return Response({"error": "User not found"},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
