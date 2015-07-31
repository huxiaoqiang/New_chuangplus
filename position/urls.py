from django.conf.urls import url
from . import views,tests

urlpatterns = [
    url(r'^manage/create$', views.create_position),
    url(r'^manage/edit$', views.edit_position),
    url(r'^search$', views.search_position),
    url(r'^init$',tests.init_account),
]
