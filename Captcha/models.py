#coding=utf-8
from django.db import models
from mongoengine import *

class InvitationCode(Document):
    code = StringField(max_length=30)
    status = BooleanField(default=False)
    def __str__(self):
        return self.usercode