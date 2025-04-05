from rest_framework.permissions import BasePermission


class BaseUserPermission(BasePermission):
    """
    Base class for user-related permissions with shared utility methods.
    It ensures that the user is authenticated and active.
    """
    def is_authenticated(self, request):
        return request.user and request.user.is_authenticated and request.user.is_active

    def is_superuser(self, request):
        return request.user and request.user.is_superuser

    def is_staff(self, request):
        return request.user and request.user.is_staff


class IsSuperuser(BaseUserPermission):
    """
    Permission that grants access only to superusers.
    """
    def has_permission(self, request, view):
        return self.is_superuser(request)


class IsMeUser(BasePermission):
    """
    Permission that grants access only if the authenticated user's ID matches the `pk` parameter in the URL,
    and the user is active.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False  # Return 401 Unauthorized for unauthenticated users.
        return request.user.is_active  # Only active users are allowed.

    def has_object_permission(self, request, view, obj):
        return request.user == obj and request.user.is_active


class IsSuperUserOrMe(BaseUserPermission):
    """
    Permission that grants access if the authenticated user is a superuser
    or if the authenticated user is the same as the object being accessed.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated for basic access.
        print(f"User authenticated: {request.user.is_authenticated}")
        return self.is_authenticated(request)

    def has_object_permission(self, request, view, obj):
        # Debugging logs.
        print(f"Authenticated user: {request.user}")
        print(f"Target object: {obj}")
        print(f"Superuser status: {self.is_superuser(request)}")

        # Grant access if the user is a superuser or the user is the same as the object.
        return self.is_superuser(request) or (request.user == obj)


class IsStaffUserOrMe(BaseUserPermission):
    """
    Permission that grants access to superusers or staff users, or if the object corresponds
    to the authenticated user.
    """
    def has_permission(self, request, view):
        return self.is_authenticated(request)

    def has_object_permission(self, request, view, obj):
        # Grant all access if user is a superuser or staff.
        if self.is_superuser(request) or self.is_staff(request):
            return True
        # Otherwise, allow only if the user is the same as the object.
        return request.user == obj

