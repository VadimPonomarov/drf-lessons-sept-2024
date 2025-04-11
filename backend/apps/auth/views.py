from django.core.serializers.base import Serializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.users.permissions import IsMeUser
from config.extra_config.logger_config import logger
from core.services.jwt import JwtService, SocketToken


class SocketTokenView(GenericAPIView):
    """
    API endpoint for generating a socket token via session-based authentication.
    """
    queryset = None
    serializer_class = Serializer
    permission_classes = (IsMeUser,)  # Restrict access to authenticated users

    @swagger_auto_schema(
        operation_summary="Generate Socket Token (Session-Based Authentication)",
        operation_description=(
                "This endpoint generates a JSON Web Token (JWT) for socket authentication. "
                "Access is restricted to the authenticated user, who must be logged in "
                "and provide Bearer authentication in the 'Authorization' header. "
        ),
        responses={
            200: openapi.Response(
                description="Token generated successfully",
                examples={
                    "application/json": {
                        "token": "your_generated_token_here"
                    }
                },
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "token": openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description="JWT token for socket authentication"
                        ),
                    }
                )
            ),
            403: openapi.Response(
                description="Forbidden: Access denied",
                examples={
                    "application/json": {
                        "error": "Forbidden: Access denied"
                    }
                }
            ),
            401: openapi.Response(
                description="Unauthorized: Authentication credentials were not provided",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                }
            )
        }
    )
    def post(self, request, *args, **kwargs):
        """
        Generates a JWT token for socket connection using session-based authentication.

        Args:
            request (HttpRequest): The request object containing authenticated session details.

        Returns:
            Response: A JSON response containing the token.
        """
        try:
            # Assuming JwtService.create_token returns a non-serializable object
            token = JwtService.create_token(request.user, SocketToken)

            # Ensure `token` is JSON-serializable
            if isinstance(token, SocketToken):
                # Convert `SocketToken` to a string or dictionary (based on your implementation)
                token = str(token)  # Example: Convert it to string representation
                # Alternatively, you could implement a `to_dict()` method for `SocketToken`

            return Response({"token": token}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error generating token: {e}")
            return Response({"error": "Forbidden: Access denied"},
                            status=status.HTTP_403_FORBIDDEN)
