import re
from rest_framework import serializers

from .models import Collection, CollectionIcon


class CollectionSerializer(serializers.ModelSerializer):

    """Collections's serializer"""

    class Meta:
        model = Collection
        read_only = ('token', )


class CollectionIconSerializer(serializers.ModelSerializer):

    """CollectionIcon's Serializer. """

    class Meta:
        model = CollectionIcon

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

    def validate(self, attrs):
        packicon = attrs.get('packicon')
        svg_d = attrs.get('svg_d')
        width = attrs.get('width')
        if packicon or (svg_d and width): return attrs
        raise serializers.ValidationError(
            'Either a packicon or the shape of icon should be given'
        )
