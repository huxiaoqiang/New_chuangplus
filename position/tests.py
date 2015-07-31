from mongoengine.django.auth import User
from django.test import TestCase
from django.test import Client
from .models import *
from account.models import *
from django.shortcuts import render
from django.http import HttpResponse

def init_account(request):
    ret = dict()
    #User.create_user(username='ryz1', password='123456', email="a@b.com")
    user1=User.objects.get(username='ryz1')
    user1.is_stuff = True
    user1.save
    #company1 = Companyinfo(username = "mycompany1",User = user1)
    #company1.save()
    ret['error'] = {"code":1, "info":"succeed"}
    return HttpResponse(json.dumps(ret),content_type = 'application/json')

