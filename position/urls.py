from django.conf.urls import url
from . import views,tests

urlpatterns = [
    url(r'^create$', views.create_position, name='create_position'),
    url(r'^edit$', views.edit_position, name='edit_position'),
    url(r'^search$', views.search_position),
    url(r'^init$',tests.init_account),
    url(r'^submit',views.submit_resume,name='submit_resume'),
    url(r'^emailresume',views.email_resume,name='email_resume'),
    url(r'^userlikeposition',views.user_like_position,name='user_like_position'),
]
