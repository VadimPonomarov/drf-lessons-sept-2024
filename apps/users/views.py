from django.contrib.auth import get_user_model
from rest_framework.generics import ListCreateAPIView

from apps.users.filters import UsersFilter
from apps.users.serializers import UserSerializer

UserModel = get_user_model()


class ListCreateUsersView(ListCreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    filterset_class = UsersFilter

class UserDetailView(ListCreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
