from mongoengine.django.auth import User
from django.test import TestCase
from django.test import Client
from .models import *
from account.models import *

def init_account():
    User.create_user(username='ryz', password='123456', email='')
    company1 = Companyinfo(username = "mycompany",User = user1)
    company1.save()

class TestPositionCreate(TestCase):
    def setUp(self):
        self.c = Client()
        init_account()
        
    def test_Login(self):
        res = self.c.post("/api/account/login/",{'username':'ryz','password':'123456'})
        self.assertEqual(res.context['error']['code'],1)
    
    def test_LoginError(self):
        res = self.c.post("/api/account/login/",{'username':'ryz','password':'123457'})
        self.assertEqual(res.context['error']['code'],108)
    
    #def testCreatePosition(self):
    #    res = self.c.post("/api/account/login/",{'username':'ryz','password' = '123456'})
    #    self.assertEqual(res.context['error']['code'],1)
    #    res = self.c.post("/api/position/create/",{})
