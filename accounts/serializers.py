import re

from django.contrib.auth import authenticate, login

from rest_framework import serializers

from .models import User, make_password

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ('last_login', 'date_joined', 'groups', 'user_permissions', 'password', 'is_active')


class UserCreateSerializer(serializers.ModelSerializer):

    def save_object(self, obj, **kwargs):
       obj.set_password(self.data['password']) 
       obj.save()

    class Meta:
        model = User
        readonly = ('is_superuser', 'is_staff')
        exclude = ('last_login', 'date_joined', 'groups', 'user_permissions', 'is_active')


class UserChangePasswordSerializer(serializers.ModelSerializer):
    oldpassword = serializers.CharField()
    newpassword = serializers.CharField()

    def validate_oldpassword(self, attrs, source):
        oldpassword = attrs['oldpassword']
        user = self.object
        if not user.check_password(oldpassword):
            raise serializers.ValidationError('Incorrect old password.')
        attrs['oldpassword'] = '[PASSWORD_MASKED]'
        return attrs

    def validate_newpassword(self, attrs, source):
        newpassword = attrs['newpassword']
        if not re.match(r'[\x21-\x7F]{8,}', newpassword):
            raise serializers.ValidationError(
                    'Invalid new password, ' 
                    'should be at least 8 non-space ASCII characters.'
                    )
        attrs['password'] = make_password(newpassword)
        attrs['newpassword'] = '[PASSWORD_MASKED]'
        return attrs

    class Meta:
        model = User
        fields = ('oldpassword', 'newpassword')
