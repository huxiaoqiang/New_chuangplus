from django.contrib.auth.models import User
from django.test import TestCase
from django.test import Client
from .models import *
from account.models import *

def init_account():
    

class TestPositionCreate:
    def setUp(self):
        self.c = Client()
        init_account()
        
    def testCreate(self):
        