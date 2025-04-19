from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response

from apps.users.docs.swagger_params import pagination_parameters, filtering_parameters
from apps.users.filters import UsersFilter
from apps.users.serializers import UserSerializer

UserModel = get_user_model()


class ListUsersView(ListAPIView):
    """
    Retrieve a list of users with pagination and filtering.

    This view uses the IsAdminUser permission so that only admin users
    (i.e. users with is_staff=True) can access the list. When an unauthenticated user
    or a user without proper permissions accesses this endpoint, the global exception
    handler will intercept the NotAuthenticated/PermissionDenied exception and return a 403.

    Swagger documentation is provided via the decorator.
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
    Create a new user with profile data and support for avatar file uploads.

    Returns:
        - 201: User created successfully
        - 400: Validation error or duplicate email
        - 500: Server error
    """
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
    allowed_methods = ['POST']

    @swagger_auto_schema(
        tags=["user"],
        request_body=UserSerializer,
        operation_summary="Create a user",
        operation_description="Create a new user and optionally upload an avatar file.",
        consumes=["multipart/form-data"],
        security=[],
        responses={
            201: UserSerializer,
            400: "Bad Request - Validation error or duplicate email",
            500: "Internal Server Error"
        }
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"email": ["User with this email already exists."]},
                status=status.HTTP_400_BAD_REQUEST
            )
