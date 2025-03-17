from django.urls import path
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


@swagger_auto_schema(tags=["Auth"])
class CustomTokenObtainPairView(TokenObtainPairView):
    pass


@swagger_auto_schema(tags=["Auth"])
class CustomTokenRefreshView(TokenRefreshView):
    pass


urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="auth_login"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="auth_refresh"),
]
