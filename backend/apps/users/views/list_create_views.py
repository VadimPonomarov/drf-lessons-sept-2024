from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser

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

    This view relies on model-level validation via the serializer’s call to full_clean()
    (as defined in your model). When invalid data is submitted, the serializer raises a
    ValidationError and DRF returns a detailed error response (e.g. a dictionary containing
    errors for "email" and "password"). Unauthorized access (if it occurred) would also be
    handled by the global exception handler.

    Swagger documentation is provided via the decorator.
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
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
