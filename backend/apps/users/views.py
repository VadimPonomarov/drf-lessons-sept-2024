from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.parsers import MultiPartParser, FormParser

from apps.users.docs.swagger_params import pagination_parameters, filtering_parameters
from apps.users.filters import UsersFilter
from apps.users.serializers import UserSerializer, UserEditSerializer
from rest_framework.permissions import AllowAny

UserModel = get_user_model()


class ListCreateUsersView(ListCreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    filterset_class = UsersFilter
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (AllowAny,)

    @swagger_auto_schema(
        manual_parameters=pagination_parameters + filtering_parameters
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class UserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserEditSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (AllowAny,)
