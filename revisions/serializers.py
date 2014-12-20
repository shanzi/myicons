from rest_framework import serializers

from .models import Revision


class RevisionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Revision
        exclude = ('snapshot', )
