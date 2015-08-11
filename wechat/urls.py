from django.conf.urls import url
from queryhandler import request_handler
urlpatterns = [
    url(r'^handler$',request_handler, name='request_handler'),
]