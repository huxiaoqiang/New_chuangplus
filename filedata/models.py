from mongoengine import *

# Create your models here.

class File(Document):
    name = StringField(max_length=1000)
    type = StringField(max_length=30)
    category = StringField(max_length=100)
    description = StringField(max_length=200)
    upload_time = DateTimeField()
    value = FileField()
