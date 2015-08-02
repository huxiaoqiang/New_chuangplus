from django.conf.urls import url
from . import views,tests

urlpatterns = [
    url(r'^manage/create$', views.create_position),
    url(r'^manage/edit$', views.edit_position),
    url(r'^search$', views.search_position),
    url(r'^init$',tests.init_account),
    url(r'^submit',views.submit_resume,name='submit_resume'),
    url(r'^emailresume',views.email_resume,name='email_resume'),
]
