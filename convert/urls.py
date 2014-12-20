from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns(
    '',
    url(r'^font/?$', views.FontUploadView.as_view()),
    url(r'^css/?$', views.CSSUploadView.as_view()),
    url(r'^svg/?$', views.SVGUploadView.as_view()),
)
