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
    username = StringField(max_length=30,required=True)
    email = EmailField(required=True)
    position_type = ListField(StringField(max_length=30))
    work_city = StringField(max_length=100)
    cellphone = StringField(max_length=20)
    university = StringField(max_length=100)
    major = StringField(max_length=100)
    grade = IntField(default=1)
    gender = IntField(default=0)  #0 is woman 1 is man
    work_days = IntField(default=3)
    description = StringField(max_length=200)
    resume = ReferenceField(File)
    info_complete = BooleanField(default=False)
    has_resume = BooleanField(default=False)
    date_joined = DateTimeField()
    update_time = DateTimeField()
    user = ReferenceField("User")

# company position type
TYPE = ('technology','product','design','operate','marketing','functions','others')
FIELD = ('social','e-commerce','education','health_medical','culture_creativity','living_consumption','hardware','O2O','others')
STAGE=('','seed','angel','A','B','C','D_plus')
class Companyinfo(Document):
    username = StringField(max_length=30,required=True)
    hr_cellphone = StringField(max_length=30,required=True)
    abbreviation = StringField(max_length=100,default = "")
    city = StringField(max_length=40,default = "")
    field = StringField(max_length=30,default = "")
    is_auth = BooleanField(default=False)
    auth_organization = StringField(max_length=100,default = "")
    scale = IntField(default=0)  #0 newly established  1:rapid expansion 2:mature period
    stage = StringField(max_length=10,choices=STAGE)
    homepage = URLField()
    wechat = StringField(max_length=40,default = "")
    email_resume=EmailField()  #email for receiving resume
    qrcode = ReferenceField(File,default = None)
    logo = ReferenceField(File,default = None)
    welfare_tags = ListField(StringField(max_length=18,default = ""))
    product_link = URLField()
    ICregist_name = StringField(max_length=200,default = "")  #Industrial and commercial registration name
    company_description = StringField(max_length=1000,default = "")
    product_description = StringField(max_length=1000,default = "")
    team_description = StringField(max_length=1000,default = "")
    slogan = StringField(max_length=50,default = "")
    status = BooleanField(default=False) # if the company is accepted by the admin
    user = ReferenceField(User)

#project member table
class Member(Document):
    m_name= StringField(max_length=30)
    m_position = StringField(max_length=30)
    m_introduction = StringField(max_length=1000)
    m_avatar = ReferenceField(File)
    company = ReferenceField(Companyinfo,required=True)


AMOUNT=('ten','hundred','thousand','thousand_plus')
class Financing(Document):
    stage = StringField(max_length=15,choices=STAGE)
    organization = StringField(max_length=100)
    amount = StringField(choices=AMOUNT)
    company = ReferenceField(Companyinfo,required=True)

#user and company relationship
#the user collect the company
class UC_Relationship(Document):
    company = ReferenceField(Companyinfo)
    user = ReferenceField(User)