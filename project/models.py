from django.db import models
from account.models import Member
from filedata.models import Image
from mongoengine import *
import datetime

# Create your models here
# project table.
class Project(Document):
    project_name = StringField(max_length=50)
    project_field = StringField(max_length=50)
    project_type = StringField(max_length=50)
    project_slogan = StringField(max_length=200)
    project_summary = StringField(max_length=300)
    project_city=StringField(max_length=30)
    project_stage=StringField(max_length=30)
    contact_name=StringField(max_length=30)
    contact_phone=StringField(max_length=30)
    contact_email=EmailField()
    link=URLField()
    business_model=StringField(max_length=10000)
    team_info = ListField(ReferenceField(Member))
    post=ListField(ReferenceField(Post))
    plan=StringField(max_length=10000)
    market_analysis=StringField(max_length=10000)
    competitor_analysis=StringField(max_length=10000)
    customer_analysis=StringField(max_length=10000)
    is_checked=BooleanField()
    is_roadshowing=BooleanField()
    date = DateTimeField()

#
class Post(Document):
    project=ReferenceField("Project")
    title=StringField(max_length=50)
    content=StringField(max_length=300)
    link=URLField()
    image_path=ReferenceField(Image)
    date=DateTimeField(default=datetime.datetime.now)

