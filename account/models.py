#coding=utf-8
from mongoengine.django.auth import User
from datetime import datetime
from filedata.models import File
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
    resume = ReferenceField(File)
    info_complete=BooleanField(default=False)
    has_resume=BooleanField(default=False)
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
    m_avatar=ReferenceField(File)

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
    homepage = URLField(default="www.chuangplus.com")
    wechat = StringField(max_length=40,default = "")
    email_resume=EmailField(max_length=50,default = "default@default.com")  #email for receiving resume
    qrcode = ReferenceField(File,default = None)
    welfare_tags = StringField(max_length=200,default = "")
    product_link = URLField()
    ICregist_name = StringField(max_length=200,default = "")  #Industrial and commercial registration name
    company_description = StringField(max_length=300,default = "")
    product_description = StringField(max_length=300,default = "")
    team_description = StringField(max_length=300,default = "")
    team_info = ListField(ReferenceField(Member))
    slogan = StringField(max_length=25,default = "")
    status = BooleanField(default=False) # if the company is accepted by the admin
    User = ReferenceField(User)


#user and company relationship
#the user collect the company
class UC_Relationship(Document):
    company=ReferenceField(Companyinfo)
    user=ReferenceField(Userinfo)
