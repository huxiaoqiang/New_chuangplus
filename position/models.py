#coding=utf-8
from datetime import datetime
from account.models import Userinfo,Companyinfo
from mongoengine.django.auth import User
from mongoengine import *
import json
import re
# Create your models here

TYPE = ('technology','product','design','operate','marketing','functions','others')
STATUS = ('employing','hide','delete')

class Position(Document):
    name = StringField(max_length=30)
    type = StringField(max_length=15,choices=TYPE)
    work_city=StringField(max_length=50)
    work_address=StringField(max_length=100)
    release_time=DateTimeField(default=datetime.now())
    end_time=DateTimeField()
    position_description=StringField(max_length=500)
    position_request=StringField(max_length=500)
    daysperweek=IntField(default=3)
    internship_time=IntField(default=1)
    salary_min=IntField(default=0)
    salary_max=IntField(default=0)
    delivery_number=IntField(default=0)
    status = StringField(max_length=15,choices=STATUS,default='hide')
    company = ReferenceField(Companyinfo)

#Position and User favorite relationship
class PC_Relationship(Document):
    user=ReferenceField(Userinfo)
    position=ReferenceField(Position)

class ResumePost(Document):
    submit_date = DateTimeField()
    resume_copy = FileField()
    position = ReferenceField(Position)
    user = ReferenceField(User)

