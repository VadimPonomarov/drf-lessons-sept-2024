from django.urls.conf import path

from apps.users.views import ListCreateUsersView, UserDetailView

urlpatterns = [
    path("", ListCreateUsersView.as_view(), name="user_list_create"),
    path("<int:pk>", UserDetailView.as_view(), name="user_list_create"),
]
