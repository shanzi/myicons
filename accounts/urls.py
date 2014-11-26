from django.conf.urls import patterns, include, url

from rest_framework.routers import SimpleRouter

from .views import UserViewSet

router = SimpleRouter()
router.register('users', UserViewSet)

urlpatterns = patterns(
    '',
    url(r'', include(router.urls)),
)
