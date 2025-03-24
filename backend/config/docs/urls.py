from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version="v1",
        description="OpenAPI",
        terms_of_service="",
        contact=openapi.Contact(email="pvs.versia@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('api/doc/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
]
