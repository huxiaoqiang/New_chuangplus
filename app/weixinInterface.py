# -*- coding: utf-8 -*-
import hashlib
import lxml
import time
import os
import urllib2,json
from django.http import HttpResponse
from lxml import etree
 
def weixin(request):
    #获取输入参数
    if request.method == "GET":
        signature=request.GET.get('signature','')
        timestamp=request.GET.get('timestamp','')
        nonce=request.GET.get('nonce','')
        echostr=request.GET.get('echostr','')
        #自己的token
        token="chuangplus" #这里改写你在微信公众平台里输入的token
        #字典序排序
        list=[token,timestamp,nonce]
        list.sort()
        sha1=hashlib.sha1()
        map(sha1.update,list)
        hashcode=sha1.hexdigest()
        #sha1加密算法        
        #如果是来自微信的请求，则回复echostr
        if hashcode == signature:
            return HttpResponse(echostr)
