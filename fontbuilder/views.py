from rest_framework import viewsets
from iconcollections.models import Collection

from .serializers import CollectionSerializer
from .renderers import (
    FontCheatSheetRenderer,
    FontCSSRenderer,
    SVGFontRenderer,
    WOFFRenderer,
)

class LiveTestingViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = []
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    lookup_field = 'token'
    renderer_classes = (FontCheatSheetRenderer, FontCSSRenderer, SVGFontRenderer, WOFFRenderer)

class ZIPPackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    lookup_field = 'token'
