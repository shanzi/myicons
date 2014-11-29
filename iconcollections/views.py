from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route

from revisions import mixins as rmixins

from .models import Collection, CollectionIcon
from .serializers import CollectionSerializer, CollectionIconSerializer


class CollectionsViewSet(rmixins.CollectionRevisionMixin, viewsets.ModelViewSet):

    """ViewSet for displaying packs. """
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    ordering_fields = ('id', 'name')
    ordering = ('id', )

    @detail_route(methods=['post'])
    def retoken(self, request, pk=None):
        obj = self.get_object()
        obj.token = ''
        obj.save()
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

class CollectionIconsViewSet(rmixins.CollectionIconRevisionMixin, viewsets.ModelViewSet):

    """ViewSet for displaying packicons. """
    queryset = CollectionIcon.objects.all()
    filter_fields = ('packicon', 'collection')
    serializer_class = CollectionIconSerializer
    ordering_fields = ('id', 'name')
    ordering = ('id', )
