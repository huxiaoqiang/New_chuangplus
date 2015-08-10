__author__ = "huxiaoqiang"

from url_generators import *

WECHAT_URLS = {
    'access_token' : access_token_generator,
    'get_custom_menu' : get_custom_menu_url_generator,
    'create_custom_menu' : create_custom_menu_url_generator,
    'get_openid' : get_openid_url_generator,
}