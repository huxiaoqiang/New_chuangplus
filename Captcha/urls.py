from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^image/$', views.image, name='image'),
    url(r'^check/$', views.check, name='check'),
    url(r'^check_ic$',views.check_invitation_code,name='check_invitation_code'),
    url(r'^register_invitation_code$',views.register_invitation_code,name='register_invitation_code$'),
    url(r'^invitationcode$',views.generate_invitation_code,name='generate_invitation_code'),
]
