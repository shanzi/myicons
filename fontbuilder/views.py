from rest_framework import viewsets
from iconcollections.models import Collection

from .serializers import CollectionSerializer
from .renderers import (
    FontCheatSheetRenderer,
    FontCSSRenderer,
    PListRenderer,
    SVGFontRenderer,
    WOFFRenderer,
    TTFRenderer,
    EOTRenderer,
    ZIPPackRenderer,
)

class LiveTestingViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = []
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    lookup_field = 'token'
    renderer_classes = (FontCheatSheetRenderer,
                        FontCSSRenderer,
                        PListRenderer,
                        SVGFontRenderer,
                        WOFFRenderer,
                        EOTRenderer,
                        TTFRenderer)

    def finalize_response(self, request, response, *args, **kwargs):
        response = viewsets.ReadOnlyModelViewSet.finalize_response(self, request, response, *args, **kwargs)
        response['Access-Control-Allow-Origin'] = '*'
        return response

class ZIPPackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    lookup_field = 'token'
    renderer_classes = (ZIPPackRenderer,)

    def finalize_response(self, request, response, *args, **kwargs):
        response = viewsets.ReadOnlyModelViewSet.finalize_response(self, request, response, *args, **kwargs)
        obj = self.get_object()
        if obj:
            response['content-disposition'] = 'attachment; filename="%s.zip"' % obj.name
        return response

