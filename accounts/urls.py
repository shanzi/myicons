from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    '',
    url(r'^logout/', 'django.contrib.auth.views.logout_then_login'),
    url(r'^login/', 'django.contrib.auth.views.login', {'template_name':'login.html'}, name="login"),
)
