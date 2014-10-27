from django.shortcuts import render

from rest_framework import viewsets

from .models import Collection, CollectionIcon
from .serializers import CollectionSerializer, CollectionIconSerializer


class CollectionsViewSet(viewsets.ModelViewSet):

    """ViewSet for displaying packs. """
    queryset = Collection.objects.all()
    ordering_fields = ('id', 'name')
    serializer_class = CollectionSerializer

class CollectionIconsViewSet(viewsets.ModelViewSet):

    """ViewSet for displaying packicons. """
    queryset = CollectionIcon.objects.all()
    filter_fields = ('packicon', 'collection')
    ordering_fields = ('id', 'name')
    serializer_class = CollectionIconSerializer
