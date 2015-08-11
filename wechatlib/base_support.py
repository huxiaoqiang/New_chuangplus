from wechat_urls import WECHAT_URLS
from . import http_get
import hashlib
import time
import os
import urllib2,json
from django.http import HttpResponse


def auth(signature, timestamp, nonce):
        token="chuangplus"
        list=[token,timestamp,nonce]
        list.sort()
        sha1=hashlib.sha1()
        map(sha1.update,list)
        hashcode=sha1.hexdigest()
        if hashcode == signature:
            return True
        else:
            return False

def get_access_token():
    url = WECHAT_URLS['access_token']
    res = http_get(url)
    rjson =json.loads(res)
    if 'errcode' in rjson:
        raise res
    return rjson['access_token']