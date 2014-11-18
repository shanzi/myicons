from django.conf.urls import patterns, include, url

from rest_framework.routers import DefaultRouter

from .views import LiveTestingViewSet, ZIPPackViewSet

router = DefaultRouter(trailing_slash=False)

router.register('livetesting', LiveTestingViewSet)
router.register('zippack', ZIPPackViewSet)

urlpatterns = patterns(
    '',
    url(r'^build/', include(router.urls)),
)
