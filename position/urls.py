from django.conf.urls import url
from rest_framework.authtoken.views import obtain_auth_token
#from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    url(r'^manage/create/$', views.create_position),
    url(r'^manage/edit/$', views.edit_position),
    url(r'^search/$', views.search_position),
]