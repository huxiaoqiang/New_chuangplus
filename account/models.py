#coding=utf-8
from django.db import models
from mongoengine.django.auth import User
from datetime import datetime
from position.models import Position
from filedata.models import Image,Resume
from django.http import HttpResponse
from mongoengine import *
import json
import re
# Create your models here.

try:
    # django >= 1.4
    from django.utils.timezone import now as datetime_now
except ImportError:
    datetime_now = datetime.now

#Userinfo
class Userinfo(Document):
    username=StringField(max_length=30)
    email=EmailField()
    position_type = StringField(max_length=30)
    work_city = StringField(max_length=100)
    cellphone = StringField(max_length=20)
    university = StringField(max_length=100)
    major = StringField(max_length=100)
    grade = IntField(default=1)
    gender = IntField(default=0)  #0 is woman 1 is man
    work_days = IntField(default=3)
    description = StringField(max_length=200)
    attachment = ReferenceField(Resume)
    info_complete=BooleanField(default=0)
    has_resume=BooleanField(default=0)
    date_joined=DateTimeField()
    update_time=DateTimeField()
    User = ReferenceField("User")

STAGE=('no','angel','A','B','C','D_plus')
AMOUNT=('ten','hundred','thousand','thousand_plus')
class Financing(Document):
    stage=StringField(max_length=15,choices=STAGE)
    organization = StringField(max_length=50)
    amount=StringField(choices=AMOUNT)

#project member table
class Member(Document):
    m_name=StringField(max_length=30)
    m_position=StringField(max_length=30)
    m_introduction=StringField(max_length=10000)
    m_avatar_path=ReferenceField(Image)

# company position type
TYPE = ('technology','product','design','operate','marketing','functions','others')
class Companyinfo(Document):
    username = StringField(max_length=30)
    contacts = StringField(max_length=20,default = "")
    abbreviation = StringField(max_length=100,default = "")
    city = StringField(max_length=30,default = "")
    field = StringField(max_length=100,default = "")
    financing_info = ListField(ReferenceField(Financing),default = None)
    is_auth = BooleanField(default=False)
    auth_organization = StringField(max_length=100,default = "")
    people_scale = IntField(default=0)  # 0: 1~10, 1:10~20, 2: more than 30
    homepage = URLField(default="")
    wechat = StringField(max_length=40,default = "")
    email_resume=EmailField(max_length=50,default = "")  #email for receiving resume
    qrcode = ReferenceField(Image,default = None)
    welfare_tags = StringField(max_length=200,default = "")
    product_link = URLField()
    ICregist_name = StringField(max_length=200,default = "")  #Industrial and commercial registration name
    Company_descrition = StringField(max_length=300,default = "")
    product_description = StringField(max_length=300,default = "")
    team_description = StringField(max_length=300,default = "")
    team_info = ListField(ReferenceField(Member))
    position_type = StringField(max_length=100,default = "")
    position_number = IntField(default=0)
    position = ListField(ReferenceField(Position))
    slogan = StringField(max_length=25,default = "")
    status = BooleanField(default=0) # if the company is accepted
    User = ReferenceField("User")


#user and company relationship
#the user collect the company
class UC_Relationship(Document):
    company=ReferenceField(Companyinfo)
    user=ReferenceField(Userinfo)

#Position and User relationship
class PC_Relationship(Document):
    user=ReferenceField(Userinfo)
    position=ReferenceField(Position)
    status=IntField(default=0) #0:not send 1: send and not handle 2: send and handled 3:user collect the position

def error(code, message):
    return {'code':code, 'message':message}


def user_permission(level):
    def check_login_state(func):
        def __decorator(*args, **kwargs):
            request = args[0]
            if request.user.is_authenticated():
                return func(*args, **kwargs)
            return HttpResponse(json.dumps({'error':error(100,'请登录')}), content_type = 'application/json')
        return __decorator

    def check_roles(func):
        def __decorator(*args, **kwargs):
            request = args[0]
            try:
                if request.session['role'] <= level:
                    return func(*args, **kwargs)
                return HttpResponse(json.dumps({'error':error(100+level,'权限错误')}), content_type = 'application/json')
            except:
                import traceback
                traceback.print_exc()
                return HttpResponse(json.dumps({'error':error(100+level,'权限错误')}), content_type = 'application/json')
        return __decorator

    if level == 'login':
        return check_login_state
    else:
        return check_roles

