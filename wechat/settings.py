#-*- coding:utf-8 -*-
WECHAT_APPID = 'wx90c1af3f296f9f22'
WECHAT_APPSECRET = 'cf4eeca93bd13869ba0d7013ab8ccddd'

WECHAT_COMPANY_LIST_URL = ""

WECHAT_POSITION_LIST_URL = ""

WECHAT_XINIU_DESCRIPTION_URL = ""
WECHAT_ABOUT_US_URL = ""
WECHAT_RECENT_ACTIVITY_URL = ""


WECHAT_EVENT_KEYS = {
    'help' : 'XINIU_HELP',
}
WEIXIN_CUSTOM_MENU_TEMPLATE = {
    "button" : [
    {
        "type" : "view",
        "name" : "公司",
        "url"  : WECHAT_COMPANY_LIST_URL
    },
    {
        "type" : "view",
        "name" : "公司",
        "url"  : WECHAT_POSITION_LIST_URL
    },
    {
        "name" : "关于犀牛",
        "sub_button" : [
            {
                "type" : "view",
                "name" : "犀牛简介",
                "url"  : WECHAT_XINIU_DESCRIPTION_URL
            },
            {
                "type" : "view",
                "name" : "关于我们",
                "url"  : WECHAT_ABOUT_US_URL
            },
            {
                "type" : "view",
                "name" : "近期活动",
                "url"  : WECHAT_RECENT_ACTIVITY_URL
            },
            {
                "type" : "click",
                "name" : "我要帮助",
                "key"  : WECHAT_EVENT_KEYS['help'],
                "sub_button" : []
            },
        ]
    }
    ]
}