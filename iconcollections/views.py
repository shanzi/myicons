from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route

from .models import Collection, CollectionIcon
from .serializers import CollectionSerializer, CollectionIconSerializer


class CollectionsViewSet(viewsets.ModelViewSet):

    """ViewSet for displaying packs. """
    queryset = Collection.objects.all()
    ordering_fields = ('id', 'name')
    serializer_class = CollectionSerializer

    @detail_route(methods=['post'])
    def retoken(self, request, pk=None):
        obj = self.get_object()
        obj.token = ''
        obj.save()
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

class CollectionIconsViewSet(viewsets.ModelViewSet):

    """ViewSet for displaying packicons. """
    queryset = CollectionIcon.objects.all()
    filter_fields = ('packicon', 'collection')
    ordering_fields = ('id', 'name')
    serializer_class = CollectionIconSerializer
