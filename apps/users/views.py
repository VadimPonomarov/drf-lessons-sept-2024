from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListCreateAPIView

from apps.users.docs.swagger_params import pagination_parameters, filtering_parameters
from apps.users.filters import UsersFilter
from apps.users.serializers import UserSerializer
from rest_framework.permissions import AllowAny

UserModel = get_user_model()


class ListCreateUsersView(ListCreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    filterset_class = UsersFilter
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        manual_parameters=pagination_parameters + filtering_parameters
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class UserDetailView(ListCreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
