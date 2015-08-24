from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^upload', views.upload_file, name='upload_file'),
    url(r'^(?P<file_id>.*?)/download',views.download_file,name='download_file'),
    url(r'^(?P<file_type>.*?)/(?P<category>.*?)/download_special',views.download_file_special,name='download_file_special'),
    url(r'^(?P<file_id>.*?)/delete',views.delete_file,name='delete_file'),
]
