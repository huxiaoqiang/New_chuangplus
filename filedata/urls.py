from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^upload', views.upload_file, name='upload_file'),
    url(r'^download',views.download_file,name='download_file'),
    url(r'^delete',views.delete_file,name='delete_file'),
]