from rest_framework.permissions import (
        BasePermission,
        IsAuthenticated,
        SAFE_METHODS)

class IsAdminUserSelfOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if request.method == 'POST':
            return request.user.is_superuser or request.user.is_staff
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user == obj:
            return True
        if request.user.is_superuser:
            return True
        if request.user.is_staff:
            return not obj.is_superuser


