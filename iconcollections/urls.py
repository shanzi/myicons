from django.conf.urls import patterns, include, url
from rest_framework.routers import SimpleRouter

from .views import CollectionsViewSet, CollectionIconsViewSet

router = SimpleRouter()

router.register('collections', CollectionsViewSet)
router.register('collectionicons', CollectionIconsViewSet)

urlpatterns = patterns(
    '',
    url(r'^', include(router.urls)),
)
