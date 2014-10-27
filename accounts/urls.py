from django.conf.urls import patterns, include, url

from rest_framework.routers import SimpleRouter

from .views import UserViewSet

router = SimpleRouter()
router.register('users', UserViewSet)

urlpatterns = patterns(
    '',
    url(r'', include(router.urls)),
    url(r'^logout/', 'django.contrib.auth.views.logout_then_login'),
    url(r'^login/', 'django.contrib.auth.views.login', {'template_name':'login.html'}, name="login"),
)
