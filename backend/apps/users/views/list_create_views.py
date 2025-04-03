from abc import ABC

from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView
)
from rest_framework.permissions import AllowAny, IsAdminUser

from apps.users.docs.swagger_params import (
    pagination_parameters, filtering_parameters
)
from apps.users.filters import UsersFilter
from apps.users.serializers import (
    UserSerializer
)

UserModel = get_user_model()


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
