from rest_framework.permissions import (
        BasePermission,
        IsAuthenticated,
        SAFE_METHODS)

class IsAdminUserSelfOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if request.method == 'POST':
            return request.user.is_superuser
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user == obj


