import re
from rest_framework import serializers

from .models import Pack, PackIcon


class PackSerializer(serializers.ModelSerializer):

    """Packs's serializer"""

    class Meta:
        model = Pack


class PackIconSerializer(serializers.ModelSerializer):

    """PackIcon's Serializer. """

    class Meta:
        model = PackIcon

    def validate_width(self, attrs, source):
        width = attrs[source]
        if width < 1.0:
            raise serializers.ValidationError('Width should be greater than 1.0')
        return attrs

    def validate_name(self, attrs, source):
        name = attrs[source].lower()
        name = re.sub(r'[^a-z0-9\-]', '-', name).strip('-')
        name = re.sub(r'-+', '-', name)
        if name:
            attrs[source] = name
        else:
            raise serializers.ValidationError('Invalid name')
        return attrs


class PackCreateSerializer(serializers.ModelSerializer):

    """Serializer for creating pack with all its icons. """

    icons = PackIconSerializer(many=True)

    class Meta:
        model = Pack

    def validate_icons(self, attrs, source):
        icons = attrs.get(source)
        if icons: return attrs
        serializers.ValidationError('Icons should not be empty')

    def save_object(self, obj, **kwargs):
        obj.save()
        related = obj._related_data
        icons = related.get('icons')
        for icon in icons: icon.pack = obj
        PackIcon.objects.bulk_create(icons)
        del(obj._related_data)


class PackIconUpdateSerializer(PackIconSerializer):

    class Meta:
        model = PackIcon
        fields = ('tagnames', )
