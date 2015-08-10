#-*- coding:utf-8 -*-
WECHAT_APPID = 'wx90c1af3f296f9f22'
WECHAT_APPSECRET = 'cf4eeca93bd13869ba0d7013ab8ccddd'

XINIU_URL = "123.56.88.173/mobile"

WECHAT_COMPANY_LIST_URL = XINIU_URL+'/complist'
WECHAT_POSITION_LIST_URL = XINIU_URL+'posilist'


WECHAT_EVENT_KEYS = {
    'intro': 'XINIU_INTRO',
    'about': 'XINIU_ABOUT',
    'activity' : 'XINIU_ACTIVITY',
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
                "type" : "click",
                "name" : "犀牛简介",
                "key"  : WECHAT_EVENT_KEYS['intro'],
                "sub_button" : []
            },
            {
                "type" : "click",
                "name" : "关于我们",
                "key"  : WECHAT_EVENT_KEYS['about'],
                "sub_button" : []
            },
            {
                "type" : "click",
                "name" : "近期活动",
                "key"  : WECHAT_EVENT_KEYS['activity'],
                "sub_button" : []
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