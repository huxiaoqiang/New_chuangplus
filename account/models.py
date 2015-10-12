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
TYPE = ('technology','product','design','operate','marketing','functions','others')
class Userinfo(Document):
    is_info = BooleanField(default=False)
    user = ReferenceField(User,required=True)
    username = StringField(max_length=30,required=True)
    user_avatar_id = StringField(max_length=30)
    email = EmailField()
    real_name = StringField(max_length=20)
    work_city = StringField(max_length=100)
    cellphone = StringField(max_length=20)
    university = StringField(max_length=100)
    major = StringField(max_length=100)
    description = StringField(max_length=200)
    #1,2,3,4 undergraduate 11 12 13 master 21 22 doctor
    grade = IntField()
    gender = IntField()  #0 is woman 1 is man
    work_days = IntField()
    position_type = ListField(StringField(max_length=30,choices=TYPE))
    resume_id = StringField(max_length=30)
    resume_name = StringField(max_length=100)
    date_joined = DateTimeField()
    update_time = DateTimeField()
    info_complete = BooleanField(default=False)

    def __str__(self):
        return self.username

# company position type
FIELD = ('social','e-commerce','education','health_medical','culture_creativity','living_consumption','hardware','O2O','others')
STAGE=('none','seed','angel','A','B','C','D_plus')
class Companyinfo(Document):
    user = ReferenceField(User,required=True)
    username = StringField(max_length=30,required=True)
    hr_cellphone = StringField(max_length=30,required=True)
    ICregist_name = StringField(max_length=200) #Industrial and commercial registration name
    abbreviation = StringField(max_length=100)
    city = StringField(max_length=40)
    field = StringField(max_length=30,choices=FIELD)
    scale = IntField(default=0)  #0 newly established  1:rapid expansion 2:mature period
    stage = StringField(max_length=10,choices=STAGE,default='none')
    homepage = StringField()
    wechat = StringField(max_length=40)
    email_resume=EmailField()  #email for receiving resume
    qrcode_id = StringField(max_length=30)
    logo_id = StringField(max_length=30)
    welfare_tags = ListField(StringField(max_length=18))
    product_link = URLField()
    brief_introduction = StringField(max_length=100)
    company_description = StringField(max_length=3000)
    product_description = StringField(max_length=3000)
    team_description = StringField(max_length=5000)
    slogan = StringField(max_length=50)
    status = BooleanField(default=False) # if the company is accepted by the admin
    is_auth = BooleanField(default=False)
    auth_organization = StringField(max_length=100)
    date_joined = DateTimeField()
    update_time = DateTimeField()
    info_complete = BooleanField(default=False)

    positions = ListField(ReferenceField("position.Position"))
    financings = ListField(ReferenceField("Financing"))
    members = ListField(ReferenceField("Member"))
    index = IntField(default = 100)
    def __str__(self):
        return self.username

class Sortcompany(Document):
    company = ReferenceField(Companyinfo,required = True)
    positionNumber = IntField(default=0,required=True)
    index = IntField(default=100,required=True)
    
    def __str__(self):
        return self.company.username

#project member table
class Member(Document):
    company = ReferenceField(Companyinfo,required=True)
    m_name= StringField(max_length=30,required=True)
    m_position = StringField(max_length=30,required=True)
    m_introduction = StringField(max_length=1000)
    m_avatar_id = StringField(max_length=30)

    def __str__(self):
        return self.m_name

AMOUNT=('ten','hundred','thousand','thousand_plus')
class Financing(Document):
    company = ReferenceField(Companyinfo,required=True)
    stage = StringField(max_length=15,choices=STAGE)
    organization = StringField(max_length=100)
    amount = StringField(choices=AMOUNT)

    def __str__(self):
        return self.stage

#user and company relationship
#the user likes the company
class UC_Relationship(Document):
    user = ReferenceField(User,required=True)
    company = ReferenceField(Companyinfo,required=True)

    def __str__(self):
        return self.user.username + '*' + self.company.username
