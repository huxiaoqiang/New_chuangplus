__author__ = 'huxiaoqiang'
from settings import WECHAT_APPID,WECHAT_APPSECRET

def access_token_generator():
    return 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s' % (WECHAT_APPID,WECHAT_APPSECRET)

def create_custom_menu_url_generator(access_token):
    return 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=%s' % (access_token,)

def get_custom_menu_url_generator(access_token):
    return 'https://api.weixin.qq.com/cgi-bin/menu/get?access_token=%s' % (access_token,)

def get_openid_url_generator(code):
    return 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code' % (WECHAT_APPID, WECHAT_APPSECRET, code)