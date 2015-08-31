from django.conf.urls import url
from . import views,tests

urlpatterns = [
    url(r'^create$', views.create_position, name='create_position'),
    url(r'^(?P<position_id>.*?)/delete', views.delete_position, name='delete_position'),
    url(r'^(?P<position_id>.*?)/set$', views.update_position, name='update_position'),
    url(r'^(?P<position_id>.*?)/get$', views.get_position, name='get_position'),
    url(r'^(?P<position_id>.*?)/get_with_company$', views.get_position_with_company, name='get_position_with_company'),
    url(r'^(?P<position_id>.*?)/like$', views.user_like_position, name='user_like_position'),
    url(r'^(?P<position_id>.*?)/submit$', views.submit_resume, name='submit_resume'),
    url(r'^search$', views.search_position, name='search_position'),
    url(r'^company/(?P<company_id>.*?)/list$',views.get_company_position_list,name='get_company_position_list'),
    url(r'^init$',tests.init_account),
    url(r'^submit',views.submit_resume,name='submit_resume'),
    url(r'^emailresume',views.email_resume,name='email_resume'),
    url(r'^(?P<position_id>.*?)/userlikeposition',views.user_like_position,name='user_like_position'),
]
