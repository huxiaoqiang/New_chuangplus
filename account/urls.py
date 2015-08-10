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

    url(r'^member/create', views.create_company_member, name='create_company_member'),
    url(r'^member/(?P<compamy_id>.*?)/get', views.get_member_list, name='get_member_list'),
    url(r'^member/(?P<mem_id>.*?)/set', views.set_company_member, name='set_company_member'),
    url(r'^member/(?P<mem_id>.*?)/delete', views.delete_company_member, name='delete_company_member'),

    url(r'^financing/create', views.create_financing_info, name='create_financing_info'),
    url(r'^financing/(?P<company_id>.*?)/delete', views.get_financinginfo_list, name='get_financinginfo_list'),
    url(r'^financing/(?P<fin_id>.*?)/set', views.set_financinginfo, name='set_financinginfo'),
    url(r'^financing/(?P<fin_id>.*?)/delete', views.delete_financinginfo, name='delete_financinginfo'),

    url(r'^company/list', views.get_company_list, name='get_company_list'),
    url(r'^company/(?P<compamy_id>.*?)/detail', views.get_companyinfo_detail, name='get_companyinfo_detail'),
    url(r'^company/set', views.set_companyinfo, name='set_companyinfo'),
    url(r'^company/(?P<compamy_id>.*?)/auth', views.auth_company, name='auth_company'),

    url(r'^userlikecompany', views.user_like_company, name='user_like_company'),

]

#urlpatterns = format_suffix_patterns(urlpatterns)
