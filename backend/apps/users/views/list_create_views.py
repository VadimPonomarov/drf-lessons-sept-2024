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


class ListUsersView(ListAPIView):
    """
    Retrieve a list of users with pagination and filtering.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAdminUser,)
    filterset_class = UsersFilter
    allowed_methods = ['GET']

    @swagger_auto_schema(
        tags=["users"],
        manual_parameters=pagination_parameters + filtering_parameters,
        operation_summary="List users",
        operation_description="Retrieve a list of users with pagination and filtering options."
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class CreateUserView(CreateAPIView):
    """
    Create a new user with profile data and an avatar file upload.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
    allowed_methods = ['POST']

    @swagger_auto_schema(
        tags=["user"],
        request_body=UserSerializer,
        operation_summary="Create a user",
        operation_description="Create a new user and upload an avatar file.",
        consumes=["multipart/form-data"]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
