from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^', include('iconpacks.urls')),
    url(r'^', include('iconcollections.urls')),

    url(r'^convert/', include('convert.urls')),
    url(r'^accounts/', include('accounts.urls')),
)
