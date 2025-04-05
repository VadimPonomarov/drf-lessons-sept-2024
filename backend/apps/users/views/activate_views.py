from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import (
    get_object_or_404, GenericAPIView,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.users.serializers import (
    UserActivateSerializer,
)
from core.services.jwt import JwtService, ActivateToken

UserModel = get_user_model()


class ActivateUserView(GenericAPIView):
    """
    Activate User using a query parameter token.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserActivateSerializer
    permission_classes = (AllowAny,)
    allowed_methods = ['GET', ]

    @swagger_auto_schema(
        tags=["auth"],
        operation_summary="Activate a user",
        operation_description="Activate a user by verifying a token passed as a query parameter."
    )
    def get(self, request, *args, **kwargs):
        try:
            token = request.GET.get("token")
            if not token:
                raise ValueError("Token is required")

            user_data = JwtService.verify_token(token, ActivateToken)
            user = get_object_or_404(UserModel, pk=user_data.id)
            if user.is_active:
                return Response({"message": "User is already active"},
                                status=status.HTTP_200_OK)
            user.is_active = True
            user.save()
            return Response({"message": "User is activated successfully"},
                            status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except NotFound:
            return Response({"error": "User not found"},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "An unexpected error occurred"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
