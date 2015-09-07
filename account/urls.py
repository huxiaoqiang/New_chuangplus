from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^register$', views.register, name='register'),
    url(r'^checkusername$', views.check_username, name='check_username'),
    url(r'^checkemail$', views.check_email_exist, name='check_email_exist'),
    url(r'^login$',views.login, name='login'),
    url(r'^logout$',views.logout, name='logout'),

    url(r'^password/set$',views.set_password, name='set_password'),
    url(r'^userinfo/get$',views.get_userinfo, name='get_userinfo'),
    url(r'^userinfo/set$',views.set_userinfo, name='set_userinfo'),
    url(r'^userinfo/check$',views.check_userinfo_complete, name='check_userinfo_complete'),
    url(r'^userinfo/position/favor/list$',views.get_position_favor,name='get_position_favor'),
    url(r'^userinfo/position/submit/list$',views.get_position_submit,name='get_position_submit'),
    url(r'^userinfo/company/favor/list$',views.get_company_favor,name='get_company_favor'),
    url(r'^userinfo/(?P<position_id>.*?)/check_favor_position$',views.check_favor_position,name='check_favor_position'),
    url(r'^userinfo/(?P<company_id>.*?)/check_favor_company$',views.check_favor_company,name='check_favor_company'),

    url(r'^sendemail$', views.send_email, name='send_email'),
    url(r'^verifycode$', views.verify_code, name='verify_code'),

    url(r'^member/create', views.create_company_member, name='create_company_member'),
    url(r'^member/(?P<company_id>.*?)/list', views.get_member_list, name='get_member_list'),
    url(r'^member/(?P<mem_id>.*?)/set', views.set_company_member, name='set_company_member'),
    url(r'^member/(?P<mem_id>.*?)/delete', views.delete_company_member, name='delete_company_member'),

    url(r'^financing/create', views.create_financing_info, name='create_financing_info'),
    url(r'^financing/(?P<fin_id>.*?)/set', views.set_financinginfo, name='set_financinginfo'),
    url(r'^financing/(?P<fin_id>.*?)/delete', views.delete_financinginfo, name='delete_financinginfo'),
    url(r'^financing/(?P<company_id>.*?)/list', views.get_financinginfo_list, name='get_financinginfo_list'),

    url(r'^company/list', views.get_company_list, name='get_company_list'),
    url(r'^company/(?P<company_id>.*?)/detail_with_positions', views.get_companyinfo_detail_with_positions, name='get_companyinfo_detail_with_positions'),
    url(r'^company/(?P<company_id>.*?)/detail', views.get_companyinfo_detail, name='get_companyinfo_detail'),
    url(r'^company/detail', views.get_companyinfo_detail_by_username, name='get_companyinfo_detail_by_username'),
    url(r'^company/(?P<company_id>.*?)/set', views.set_companyinfo, name='set_companyinfo'),
    url(r'^company/(?P<company_id>.*?)/auth', views.auth_company, name='auth_company'),
    url(r'^company/(?P<company_id>.*?)/check', views.check_companyinfo_complete, name='check_companyinfo_complete'),

    url(r'^company/(?P<company_id>.*?)/like', views.user_like_company, name='user_like_company'),
    url(r'^company/(?P<company_id>.*?)/unlike', views.user_unlike_company, name='user_unlike_company'),
    url(r'^company/(?P<position_id>.*?)/process', views.process_position, name='process_position'),
    url(r'^company/(?P<position_id>.*?)/(?P<username>.*?)/process', views.process_single, name='process_single'),
    url(r'^company/(?P<position_id>.*?)/submit/list', views.get_submit_list, name='get_submit_list'),

]

#urlpatterns = format_suffix_patterns(urlpatterns)
