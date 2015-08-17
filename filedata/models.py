from mongoengine import *

# Create your models here.

class File(Document):
    name = StringField(max_length=1000)
    file_type = StringField(max_length=30)
    category = StringField(max_length=30)
    description = StringField(max_length=200)
    upload_time = DateTimeField()
    value = FileField()
