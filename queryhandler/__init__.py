#-*- coding:utf-8 -*-
__author__ = "huxiaoqiang"
import xml.etree.ElementTree as ET
from django.utils.encoding import smart_str
from wechatlib.base_support import auth

#todo add a wechat query handler entry
#wechat request handler entry
def request_handler(query):
    print query

#turn xml to python dict
def xml2dict(xml_root):
    msg = {}
    if xml_root.tag == 'xml':
        for child in xml_root:
            msg[child.tag] = smart_str(child.text)
    return msg