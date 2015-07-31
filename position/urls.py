from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^manage/create/$', views.create_position),
    url(r'^manage/edit/$', views.edit_position),
    url(r'^search/$', views.search_position),
]
