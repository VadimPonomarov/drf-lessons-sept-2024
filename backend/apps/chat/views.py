from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.response import Response

class WebSocketDocumentationView(APIView):
    @swagger_auto_schema(
        tags=["sockets"],
        operation_summary="Connect to Chat WebSocket",
        operation_description=(
            "Establish a WebSocket connection to ws://<HOST>/api/chat/test/.\n\n"
            "Headers:\n"
            "- Authorization: Bearer `<JWT Token>`\n\n"
            "Expected WebSocket events:\n"
            "- **message**: Send a message to the chat.\n"
            "- **disconnect**: Disconnect from the chat.\n\n"
            "This endpoint is used to document WebSocket routes only."
        ),
        responses={
            101: openapi.Response(
                description="WebSocket handshake successful. Switch to WebSocket protocol."
            ),
            403: openapi.Response(
                description="Access denied due to invalid or expired token."
            ),
        },
    )
    def get(self, request, *args, **kwargs):
        return Response({"message": "This endpoint documents WebSocket functionality."})
