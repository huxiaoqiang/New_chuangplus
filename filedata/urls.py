from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^upload', views.upload_file, name='upload_file'),
    url(r'^download',views.download_file,name='download_file'),
    url(r'^delete',views.delete_file,name='delete_file'),
    url(r'^submit',views.submit_resume,name='submit_resume'),
    url(r'^emailresume',views.email_resume,name='email_resume'),
]
