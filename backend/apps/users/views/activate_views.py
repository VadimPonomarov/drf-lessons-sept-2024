from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import (
    UpdateAPIView, get_object_or_404,
)
from rest_framework.response import Response

from apps.users.permissions import IsSuperUserOrMe
from apps.users.serializers import (
    UserActivateSerializer,
)
from core.services.jwt import JwtService, ActivateToken

UserModel = get_user_model()


class ActivateUserView(UpdateAPIView):
    """
    Activate a user using a query parameter token.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserActivateSerializer
    permission_classes = (IsSuperUserOrMe,)
    http_method_names = ['get']

    @swagger_auto_schema(
        tags=["auth"],
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
