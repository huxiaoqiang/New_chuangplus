#-*- coding:utf-8 -*-
__author__ = "huxiaoqiang"
import xml.etree.ElementTree as ET
from django.utils.encoding import smart_str
from wechatlib.base_support import auth
from django.http import HttpResponse

#todo add a wechat query handler entry
#wechat request handler entry
def request_handler(request):
    print request.BODY
    if request.method == "GET":
        signature=request.GET.get('signature','')
        timestamp=request.GET.get('timestamp','')
        nonce=request.GET.get('nonce','')
        echostr=request.GET.get('echostr','')
        print echostr
        if not auth(signature, timestamp, nonce):
            print '!!!!! Check weixin signature failed !!!!!'
            return HttpResponse('')
        else:
            return HttpResponse(echostr)

    elif request.method == "POST":
        signature=request.POST.get('signature','')
        timestamp=request.POST.get('timestamp','')
        nonce=request.POST.get('nonce','')
        if not auth(signature, timestamp, nonce):
            print '!!!!! Check weixin signature failed !!!!!'
            return HttpResponse('')
        print request.POST
        print request
    return HttpResponse('')

#turn xml to python dict
def xml2dict(xml_root):
    msg = {}
    if xml_root.tag == 'xml':
        for child in xml_root:
            msg[child.tag] = smart_str(child.text)
    return msg
