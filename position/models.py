#coding=utf-8
from datetime import datetime
from account.models import Userinfo,Companyinfo
from mongoengine.django.auth import User
from mongoengine import *
import json
import re
# Create your models here

TYPE = ('technology','product','design','operate','marketing','functions','others')
STATUS = ('open','hidden','closed')

class Position(Document):
    company = ReferenceField(Companyinfo,required=True)
    name = StringField(max_length=30,required=True)
    position_type = StringField(max_length=30,choices=TYPE)
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
    status = StringField(max_length=15,choices=STATUS,default='hidden')

    def __str__(self):
        return self.name

class UserPosition(Document):
    user = ReferenceField(User,required=True)
    position = ReferenceField(Position,required=True)
    submit_date = DateTimeField()
    resume_submited = FileField()
    processed = BooleanField(default=False)

    def __str__(self):
        return user.username + '->' + position.name

class UP_Relationship(Document):
    user = ReferenceField(User,required=True)
    position = ReferenceField(Position,required=True)

    def __str__(self):
        return user.username + '*' + position.name
