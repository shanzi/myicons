from rest_framework import viewsets

from .serializers import RevisionSerializer
from .models import Revision

class RevisionViewSet(viewsets.ReadOnlyModelViewSet):

    """ViewSet for displaying revisions. """
    queryset = Revision.objects.all()
    serializer_class = RevisionSerializer
    ordering_fields = ('created_at',)
    ordering = ('-created_at', )
