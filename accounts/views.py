from django.shortcuts import render

from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route

from .models import User
from .permissions import IsAdminUserSelfOrReadOnly, IsAuthenticated
from .serializers import (UserSerializer,
                          UserAdminSerializer,
                          UserChangePasswordSerializer)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    lookup_field = 'username'

    permission_classes = (IsAuthenticated, IsAdminUserSelfOrReadOnly)

    def get_serializer_class(self):
        user = self.request.user
        if user.is_superuser:
            return UserAdminSerializer
        return UserSerializer

    @list_route(methods=['get'])
    def current(self, request):
        user = request.user
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(user)
        return Response(serializer.data)

    @detail_route(methods=['patch'])
    def change_password(self, request, *args, **kwargs):
        serializer = UserChangePasswordSerializer(
                request.user,
                data=request.DATA,
                context={'request':self.request}
                )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
