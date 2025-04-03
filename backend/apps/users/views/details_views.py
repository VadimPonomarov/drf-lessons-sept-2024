from abc import ABC

from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import (
    RetrieveUpdateDestroyAPIView, )
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.users.serializers import UserEditSerializer

UserModel = get_user_model()


class UserDetailCustomMixin(ABC):
    """
    Base mixin for user detail-related operations.
    """
    queryset = UserModel.objects.all()
    permission_classes = (AllowAny,)


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
    def patch(self, request, *args, **kwargs):
        # Get the object and pass partial=True to allow partial updates
        serializer = self.get_serializer(instance=self.get_object(), data=request.data,
                                         partial=True)
        serializer.is_valid(raise_exception=True)  # Validate data
        self.perform_update(serializer)  # Perform the update
        return Response(serializer.data,
                        status=status.HTTP_200_OK)  # Return the updated object

    @swagger_auto_schema(
        operation_summary="Delete user",
        operation_description="Delete a specific user."
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
