from django.db import models
from django.contrib.auth.models import User
from mongoengine import *
# Create your models here.

class Image(Document):
    title=StringField(max_length=60)
    text=StringField(max_length=60)
    data=FileField()

class Resume(Document):
    User_id=ReferenceField("User")
    #description=StringField(max_length=100)
    title=StringField(max_length=60)
    data=FileField()