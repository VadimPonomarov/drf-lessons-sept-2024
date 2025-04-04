from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status, exceptions


def custom_exception_handler(exc, context):
    """
    Custom exception handler that:
    - Forces NotAuthenticated and PermissionDenied exceptions to return a 403 Forbidden.
    - Defers to DRF's default exception_handler for known exceptions (such as ValidationError),
      so that detailed error responses are returned.
    - Returns a minimal error response with status 400 for any other unexpected exception.
    """
    # Force unauthenticated and unauthorized errors to 403.
    if isinstance(exc, (exceptions.NotAuthenticated, exceptions.PermissionDenied)):
        detail = exc.detail if hasattr(exc, "detail") else str(exc)
        return Response({"detail": detail}, status=status.HTTP_403_FORBIDDEN)

    # Use DRF's default exception handler for known errors (e.g. ValidationError).
    response = exception_handler(exc, context)
    if response is not None:
        return response

    # For any unexpected exceptions, return a minimal error response.
    return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
