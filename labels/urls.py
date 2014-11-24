from django.conf.urls import patterns, include, url
from rest_framework.routers import DefaultRouter

from .views import LabelViewSet

router = DefaultRouter()

router.register('labels', LabelViewSet, base_name="label")

urlpatterns = patterns(
    '',
    url(r'^', include(router.urls)),
)
