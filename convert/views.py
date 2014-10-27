from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from .serializers import (
        FontFileSerializer,
        CSSFileSerializer,
        IconFileSerializer,
        )

class FontUploadView(generics.CreateAPIView):

    """The API view to handle font upload and convert the file into json format"""

    parser_classes = (MultiPartParser, )
    serializer_class = FontFileSerializer


class CSSUploadView(generics.CreateAPIView):

    """The API view to handle CSS upload and convert the file into json format"""

    parser_classes = (MultiPartParser, )
    serializer_class = CSSFileSerializer


class SVGUploadView(generics.CreateAPIView):

    """The API view to handle Icon upload and convert the file into json format"""

    parser_classes = (MultiPartParser, )
    serializer_class = IconFileSerializer

