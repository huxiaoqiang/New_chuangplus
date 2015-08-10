from django.conf.urls import url
from wechatlib.base_support import auth
urlpatterns = [
    url(r'^auth$', auth, name='auth'),
]