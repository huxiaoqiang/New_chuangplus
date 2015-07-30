from django.contrib.auth.models import User
from django.test import TestCase
from django.test import Client
from .models import *
from account.models import *

def init_account():
    user1 = User(username = "ryz",password = "123456",email = "a@b.com",is_staff = 1)
    user1.save
    company1 = Companyinfo(username = "mycompany",User = user1)
    company1.save()

class TestPositionCreate:
    def setUp(self):
        self.c = Client()
        init_account()
        
    def testLogin(self):
        res = self.c.post("/api/account/login/",{'username':'ryz','password' = '123456'})
        self.assertEqual(res.context['error']['code'],1)
    
    def testLoginError(self):
        res = self.c.post("/api/account/login/",{'username':'ryz','password' = '123457'})
        self.assertEqual(res.context['error']['code'],108)
    
    #def testCreatePosition(self):
    #    res = self.c.post("/api/account/login/",{'username':'ryz','password' = '123456'})
    #    self.assertEqual(res.context['error']['code'],1)
    #    res = self.c.post("/api/position/create/",{})
