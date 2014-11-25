import itertools

from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response

from iconpacks.models import Pack, PackIcon

from .preset_labels import PRESET_LABELS, PRESET_LABEL_DICT, PRESET_LABEL_MAP


class LabelViewSet(viewsets.ViewSet):

    def list(self, request):
        return Response(PRESET_LABELS)

    def retrieve(self, request, pk):
        pk = pk.lower()
        if pk in PRESET_LABEL_MAP.keys():
            results = self._search_icons(pk)
            return Response(results)
        return Response({'detail': 'Not Found'}, status=status.HTTP_404_NOT_FOUND)

    def _search_icons(self, label):
        icons = PackIcon.objects.filter(search_text__icontains=label).order_by('pack', 'name').values()
        packgroups = itertools.groupby(icons, key=lambda icon: icon['pack_id'])
        pack_dict = {pack_id: list(icons) for pack_id, icons in packgroups}
        pack_ids = pack_dict.keys()
        packs = Pack.objects.filter(id__in=pack_ids).values()
        for pack in packs:
            pack_id = pack['id']
            pack_icons = list(pack_dict[pack_id])
            pack['icons'] = pack_icons
        return {
            'name': PRESET_LABEL_MAP.get(label),
            'id': label,
            'packs': packs
        }


