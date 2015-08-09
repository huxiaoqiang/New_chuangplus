from django.shortcuts import render
from app.common_api import user_permission,error
from django.http import HttpResponse
import json
# Create your views here.

@user_permission('login')
def GetAccessToken(request):
    pass
