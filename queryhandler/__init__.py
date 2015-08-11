#-*- coding:utf-8 -*-
__author__ = "huxiaoqiang"
import xml.etree.ElementTree as ET
from django.utils.encoding import smart_str
from wechatlib.base_support import auth

#todo add a wechat query handler entry
#wechat request handler entry
def request_handler(request):
    if request.method == "GET":
        print request.GET
        signature=request.GET.get('signature','')
        timestamp=request.GET.get('timestamp','')
        nonce=request.GET.get('nonce','')
        echostr=request.GET.get('echostr','')
        if not auth(signature, timestamp, nonce):
            print '!!!!! Check weixin signature failed !!!!!'
            return ''
        else:
            return echostr
    elif request.method == "POST":
        signature=request.POST.get('signature','')
        timestamp=request.POST.get('timestamp','')
        nonce=request.POST.get('nonce','')
        if not auth(signature, timestamp, nonce):
            print '!!!!! Check weixin signature failed !!!!!'
            return ''
        


#turn xml to python dict
def xml2dict(xml_root):
    msg = {}
    if xml_root.tag == 'xml':
        for child in xml_root:
            msg[child.tag] = smart_str(child.text)
    return msg
