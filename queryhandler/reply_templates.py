#-*- coding:utf-8 -*-

import time

def get_reply_template_xml(msg, msgtype, content):
    return '<xml>' \
           '<ToUserName><![CDATA[%s]]></ToUserName>' \
           '<FromUserName><![CDATA[%s]]></FromUserName>' \
           '<CreateTime>%s</CreateTime>' \
           '<MsgType><![CDATA[%s]]></MsgType>' \
           '%s' \
           '</xml>' \
           % (msg.get('FromUserName', ''), msg.get('ToUserName', ''), int(time.time()), msgtype, content)


def get_reply_template_text(msg,reply_content):
    return get_reply_template_xml(msg,"text","<Content><![CDATA[%s]]></Content>",reply_content)

def get_reply_tempalte_article(article):
    return "<item>" \
           "<Title><![CDATA[%s]]></Title>" \
           "<Description><![CDATA[%s]]></Description>" \
           "<PicUrl><![CDATA[%s]]></PicUrl>" \
           "<Url><![CDATA[%s]]></Url>" \
           "</item>"\
           % (article.title,article.description,article.picurl,article.url)

def get_reply_template_news(msg,articles):
    if len(articles) > 10:
        articles = articles[0:10]
    tmpxml = []
    for article in articles:
        tmpxml.append(get_reply_tempalte_article(article))

    return get_reply_template_xml(msg,"news",'<ArticleCount>%s</ArticleCount>'
                                               '<Articles>%s</Articles>'
                                               % (len(articles),''.join(tmpxml)))

def get_reply_template_single_news(msg,article):
    return get_reply_template_news(msg,[article])

