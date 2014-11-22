from django.conf.urls import patterns, include, url
from rest_framework.routers import DefaultRouter

from .views import RevisionViewSet

router = DefaultRouter()

router.register('revisions', RevisionViewSet)

urlpatterns = patterns(
    '',
    url(r'^', include(router.urls)),
)
