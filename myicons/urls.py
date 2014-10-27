from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

urlpatterns = patterns('',
    url(r'^', include('frontend.urls')),

    url(r'^', include('iconpacks.urls')),
    url(r'^', include('iconcollections.urls')),

    url(r'^convert/', include('convert.urls')),
    url(r'^accounts/', include('accounts.urls')),
)

if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT
    )
