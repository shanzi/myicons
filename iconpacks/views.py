from django.shortcuts import render

from rest_framework import mixins
from rest_framework import viewsets

from revisions import mixins as rmixins

from .models import Pack, PackIcon
from .serializers import (PackSerializer,
                          PackIconSerializer,
                          PackCreateSerializer)


class PacksViewSet(rmixins.PackRevisionMixin, viewsets.ModelViewSet):

    """ViewSet for displaying packs. """
    queryset = Pack.objects.all()
    ordering_fields = ('id', 'name')
    serializer_class = PackSerializer

    def get_serializer_class(self):
        request = self.request
        if request.method == 'POST':
            return PackCreateSerializer
        else:
            return PackSerializer

class PackIconsViewSet(viewsets.ReadOnlyModelViewSet, mixins.UpdateModelMixin):

    """ViewSet for displaying packicons. """
    queryset = PackIcon.objects.all()
    filter_fields = ('pack', )
    ordering_fields = ('id', 'name', 'svg_unicode')
    serializer_class = PackIconSerializer
