from django.conf.urls import patterns, include, url

urlpatterns = patterns('',

    url(r'^accounts/', include('accounts.urls')),
    url(r'^convert/', include('convert.urls')),
)
