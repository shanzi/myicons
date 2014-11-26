from django.conf.urls import patterns, include, url

from .views import index, login

urlpatterns = patterns(
    '',
    url(r'^$', index, name="index"),
    url(r'^login/', login, name="login"),
    url(r'^logout/', 'django.contrib.auth.views.logout_then_login'),
)
