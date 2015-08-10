from wechat_urls import WECHAT_URLS
from base_support import get_access_token
from wechat_urls import WECHAT_URLS
from . import http_get,http_post
import json

def get_custom_menu():
    access_token = get_access_token()
    url = WECHAT_URLS['get_custom_menu'](access_token)
    res = http_get(url)
    rjson = json.loads(res)
    return  rjson.get('menu', {})

def modify_custom_menu(button):
    access_token = get_access_token()
    url = WECHAT_URLS['create_custom_menu'](access_token)
    res = http_post(url)
    return res
