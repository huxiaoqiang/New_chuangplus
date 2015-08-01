from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^register$', views.register, name='register'),
    url(r'^checkusername$', views.check_username, name='check_username'),
    url(r'^checkemail$', views.check_email, name='check_email'),
    url(r'^login$',views.login, name='login'),
    url(r'^logout$',views.logout, name='logout'),
    url(r'^password/set$',views.set_password, name='set_password'),
    url(r'^userinfo/get$',views.get_userinfo, name='get_userinfo'),
    url(r'^userinfo/set$',views.set_userinfo, name='set_userinfo'),
    url(r'^sendemail$', views.send_email, name='send_email'),
    url(r'^verifycode$', views.verify_code, name='verify_code'),
]

#urlpatterns = format_suffix_patterns(urlpatterns)
