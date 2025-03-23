from rest_framework import permissions
from rest_framework.permissions import IsAdminUser, BasePermission


class IsSuperuser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


from rest_framework import permissions

class IsMeUser(permissions.BasePermission):
    """
    Permission to allow access only if the request parameter matches the authenticated user's ID.
    """

    def has_permission(self, request, view):
        # General permission check (optional; can customize further)
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Compare the request parameter (e.g., user_id) with the authenticated user's ID
        user_id = view.kwargs.get("user_id")  # Get 'user_id' from URL parameters
        return (
            request.user
            and request.user.is_authenticated
            and str(request.user.id) == str(user_id)  # Compare user IDs as strings for consistency
        )

class IsSuperUserOrMe(BasePermission):
    """
    Custom permission that grants access if the user is either an admin or matches the request parameter.
    """
    def has_permission(self, request, view):
        is_admin = IsSuperUserOrMe().has_permission(request, view)
        is_me = IsMeUser().has_permission(request, view)
        return is_admin or is_me

class IsAdminUserOrMe(BasePermission):
    """
    Custom permission that grants access if the user is either an admin or matches the request parameter.
    """
    def has_permission(self, request, view):
        is_admin = IsAdminUser().has_permission(request, view)
        is_me = IsMeUser().has_permission(request, view)
        return is_admin or is_me