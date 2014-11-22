from django.conf.urls import patterns, include, url
from rest_framework.routers import DefaultRouter

from .views import CollectionsViewSet, CollectionIconsViewSet

router = DefaultRouter()

router.register('collections', CollectionsViewSet)
router.register('collectionicons', CollectionIconsViewSet)

urlpatterns = patterns(
    '',
    url(r'^', include(router.urls)),
)
