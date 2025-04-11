from django.urls import path
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.auth.views import SocketTokenView


class CustomTokenObtainPairView(TokenObtainPairView):
    @swagger_auto_schema(tags=["auth"], security=[])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class CustomTokenRefreshView(TokenRefreshView):
    @swagger_auto_schema(tags=["auth"])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


urlpatterns = [
    path("login", CustomTokenObtainPairView.as_view(), name="auth_login"),
    path("refresh", CustomTokenRefreshView.as_view(), name="auth_refresh"),
    path("socket-token", SocketTokenView.as_view(), name="socket_token"),
]
