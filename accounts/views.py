import random

from django.shortcuts import render

from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route

from .models import User
from .permissions import IsAdminUserSelfOrReadOnly, IsAuthenticated
from .serializers import (UserSerializer,
                          UserCreateSerializer,
                          UserChangePasswordSerializer)

def random_pass():
    return ''.join([random.choice('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM?!-_+') for i in range(16)])

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    lookup_field = 'username'
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsAdminUserSelfOrReadOnly)

    def create(self, request, *args, **kwargs):
        data = request.DATA
        data['password'] = random_pass()
        serializer = UserCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

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

    @detail_route(methods=['reset'])
    def reset_password(self):
        user = self.get_object()
        newpass = random_pass()
        user.set_password(newpass)
        user.save()
        return Response({'password': newpass})
