from rest_framework.permissions import BasePermission


class BaseUserPermission(BasePermission):
    """
    Base class for user-related permissions, enforcing shared logic for authentication
    and requiring the user to be active.
    """

    def is_authenticated(self, request):
        # Check if the user is authenticated AND active
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


class IsMeUser(BaseUserPermission):
    """
    Permission that grants access only if the authenticated user's ID matches the `pk` parameter in the URL.
    """

    def has_permission(self, request, view):
        return self.is_authenticated(request)

    def has_object_permission(self, request, view, obj):
        pk = view.kwargs.get("pk")  # Retrieve `pk` from URL parameters
        return str(request.user.id) == str(pk)  # Allow access to own data


class IsSuperUserOrMe(BaseUserPermission):
    """
    Permission that grants access to superusers or if the authenticated user's ID matches the `pk` in the URL.
    """

    def has_permission(self, request, view):
        return self.is_authenticated(request)

    def has_object_permission(self, request, view, obj):
        if self.is_superuser(request):  # Superusers always have access
            return True
        pk = view.kwargs.get("pk")  # Retrieve `pk` from URL parameters
        return str(request.user.id) == str(pk)  # Allow access to own data


class IsStaffUserOrMe(BaseUserPermission):
    """
    Permission that grants access to staff users or active authenticated users whose ID matches the `pk` in the URL.
    """

    def has_permission(self, request, view):
        # Allow access to staff users or authenticated and active users
        return self.is_staff(request) or self.is_authenticated(request)

    def has_object_permission(self, request, view, obj):
        # Allow access to superusers
        if self.is_superuser(request):
            return True

        # Allow access to staff users
        if self.is_staff(request):
            return True

        # Allow access to active users if `pk` matches their user ID
        pk = view.kwargs.get("pk")  # Retrieve `pk` from URL parameters
        return str(request.user.id) == str(pk)
