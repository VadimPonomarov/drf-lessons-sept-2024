from django.urls.conf import path

from apps.users.views import ListUsersView, CreateUserView, UserDetailView, \
    UpdateAvatarView, ActivateUserView, ResetPasswordTokenView, ResetPasswordView

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
