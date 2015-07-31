from django.db import models
from datetime import datetime
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
