#coding=utf-8
from datetime import datetime
from account.models import Userinfo,Companyinfo
from mongoengine.django.auth import User
from mongoengine import *
import json
import re
# Create your models here

TYPE = ('technology','product','design','operate','marketing','functions','others')
STATUS = ('open','hiden','closed')

class Position(Document):
    name = StringField(max_length=30)
    type = StringField(max_length=15,choices=TYPE)
    work_city = StringField(max_length=50)
    work_address = StringField(max_length=200)
    release_time = DateTimeField(default=datetime.now())
    end_time = DateTimeField()
    position_description = StringField(max_length=2000)
    position_request = StringField(max_length=2000)
    days_per_week = IntField(default=3)
    internship_time = IntField(default=1)
    salary_min = IntField(default=0)
    salary_max = IntField(default=0)
    delivery_number = IntField(default=0)
    status = StringField(max_length=15,choices=STATUS,default='hiden')
    company = ReferenceField(Companyinfo,required=True)
    user = ListField(ReferenceField(User))

class UserPosition(Document):
    submit_date = DateTimeField()
    resume_submited = FileField()
    position = ReferenceField(Position)
    user = ReferenceField(User)
