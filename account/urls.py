from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^register/$', views.register, name='register'),
    url(r'^checkusername/$', views.check_username, name='check_username'),


]

#urlpatterns = format_suffix_patterns(urlpatterns)
