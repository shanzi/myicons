from rest_framework import serializers

from iconcollections.models import Collection

class CollectionSerializer(serializers.ModelSerializer):
    icons = serializers.SerializerMethodField('get_icons')

    def get_icons(self, collection):
        icons = collection.icons.values('name', 'svg_d', 'width')
        prefix = collection.prefix.strip()
        if prefix: prefix += '-'
        for i, icon in enumerate(icons):
            icon['unicode'] = 0xf000 + i
            icon['classname'] =  prefix + icon['name']
        return icons

    class Meta:
        model = Collection
