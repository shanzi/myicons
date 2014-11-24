from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response

from preset_labels import PRESET_LABELS, PRESET_LABEL_DICT

class LabelViewSet(viewsets.ViewSet):

    def list(self, request):
        return Response(PRESET_LABELS)

    def retrieve(self, request, pk):
        if pk in PRESET_LABEL_DICT.keys():
            return Response({'name': pk })
        return Response({'detail': 'Not Found'}, status=status.HTTP_404_NOT_FOUND)
