from django.db import models
from django.contrib.auth.models import User
from position.models import Position
from mongoengine import *

# Create your models here.

class File(Document):
    name = StringField(max_length=1000)
    file_type = StringField(max_length=1000)
    id = StringField(max_length=1000)
    description = StringField(max_length=1000)
    upload_time = DateTimeField()
    file = FileField()


class ResumePost(Document):
    submit_date = DateTimeField()
    resume_copy = FileField()
    position = ReferenceField(Position)
    user = ReferenceField(User)
