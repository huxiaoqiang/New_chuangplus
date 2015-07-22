from django.db import models
from django.contrib.auth.models import User
from position.models import Position
from filedata.models import Image
from mongoengine import *
import json
import re
# Create your models here.


#Userinfo
class Userinfo(Document):
    position_type = StringField(max_length=30)
    work_city = StringField(max_length=100)
    cellphone = StringField(max_length=20)
    school = StringField(max_length=100)
    major = StringField(max_length=100)
    grade = IntField(default=1)
    gender = IntField(default=0)  #0 is woman 1 is man
    work_days = IntField(default=1)
    description = StringField(max_length=200)
    attachment = FileField()
    info_complete=BooleanField(default=0)
    has_resume=BooleanField(default=0)
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
    contacts = StringField(max_length=20)
    abbreviation = StringField(max_length=100)
    city = StringField(max_length=30)
    field = StringField(max_length=100)
    financing_info = ListField(ReferenceField(Financing))
    is_auth = BooleanField(default=0)
    auth_organization = StringField(max_length=100)
    people_scale = IntField(default=0)  # 0: 1~10, 1:10~20, 2: more than 30
    homepage = URLField()
    wechat = StringField(max_length=40)
    email_resume=StringField(max_length=50)  #email for receiving resume
    qrcode = ReferenceField(Image)
    welfare_tags = StringField(max_length=200)
    product_link = URLField(required=0)
    ICregist_name = StringField(max_length=200)  #Industrial and commercial registration name
    Company_descrition = StringField(max_length=300)
    product_description = StringField(max_length=300)
    team_description = StringField(max_length=300)
    team_info = ListField(ReferenceField(Member))
    position_type = StringField(max_length=30,choices=TYPE)
    position_number = IntField(default=0)
    position=ListField(ReferenceField(Position))
    slogan = StringField(max_length=25)
    status=BooleanField(default=0)
    User = ReferenceField("User")


#user and company relationship
#the user collect the company
class UC_Relationship(Document):
    company=ReferenceField(Companyinfo)
    user=ReferenceField(Userinfo)

#position and company relationship
class PC_Relationship(Document):
    company=ReferenceField(Companyinfo)
    position=ReferenceField(Position)
    status=IntField(default=0) #0:not send 1: send and not handle 2: send and handled 3:user collect the position

def error(code, message):
    return {'code':code, 'message':message}
