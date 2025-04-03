from django.urls.conf import path

from apps.users.views.activate_views import ActivateUserView
from apps.users.views.avatar_views import UpdateAvatarView
from apps.users.views.details_views import UserDetailView
from apps.users.views.list_create_views import ListUsersView, CreateUserView
from apps.users.views.reset_password_views import ResetPasswordTokenView, \
    ResetPasswordView

urlpatterns = [
    path("", ListUsersView.as_view(), name="users_list"),
    path("create", CreateUserView.as_view(), name="user_create"),
    path('activate', ActivateUserView.as_view(), name='user_activate'),
    path("<int:pk>", UserDetailView.as_view(), name="user_crud"),
    path('upload-avatar/<int:pk>', UpdateAvatarView.as_view(),
         name='userprofile_upload_avatar'),
    path('<int:pk>/reset-password-token', ResetPasswordTokenView.as_view(),
         name='reset_password_token'),
    path('reset-password', ResetPasswordView.as_view(), name='reset_password'),
]
