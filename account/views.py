#coding=utf-8
import sys
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.contrib import auth

# Create your views here.
from .models import *

def register(request):
    re=dict()
    if request.method == "POST":
    #Validate the captcha
        try:
            session_captcha = request.session.get('captcha', False)
            request_captcha = request.DATA['captcha']
        except KeyError:
            re['error']=error(100,"Need captcha!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if session_captcha.upper() != request_captcha.upper():
            re['error']=error(101,'Captcha error!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        #Validate and register information
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        email = request.POST.get('email', '')
        role=request.POST.get('role','')
        try:
            User.create_user(username=username, password=password, email=email,is_staff=role)
            userinfo = Userinfo(username=username)
            userinfo.email=email
            userinfo.date_joined = datetime_now()
            userinfo.update_time = datetime_now()
            userinfo.save()
            user = auth.authenticate(username=username, password=password)
            if user is not None and user.is_active:
                auth.login(request, user)
                request.session['role'] = role
                #request.session['status'] = userinfo.status
                #request.session['practice_code'] = userinfo.practice_code
                re['error'] = error(1, 'regist succeed!')
                #re['status'] = userinfo.status
                re['role'] = role
                resp = HttpResponse(json.dumps(re), content_type = 'application/json')
                resp.set_cookie('username', username)
                #resp.set_cookie('status', userinfo.status)
                resp.set_cookie('role', role)
                return resp
            else:
                re['error']=error(106,"register fail!")
            #try:
            #    user = User.objects.create_user(**user_data)
            #except MySQLdb.IntegrityError:
            #    return Response({'email': 'Email 已经注册。'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            re['error'] = error(107, 'username exist or username include special character')
    else:
        re['error'] = error(2, 'error, need post!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def check_username(request):
    re=dict()
    try:
        name = request.POST.get('username','')
        re['error']=error(1,"succeed!")
    except KeyError:
        re['error']=error(102,'Need post username')
        return HttpResponse(json.dumps(re), content_type = 'application/json')

    if User.objects.filter(username=name).count() != 0:
        re['data']={'exist': 'ture'}
        return  HttpResponse(json.dumps(re), content_type = 'application/json')
    else:
        re['data']={'exist': 'false'}
        return  HttpResponse(json.dumps(re), content_type = 'application/json')

#login
def login(request):
    re = dict()
    if request.method=="POST":
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        re['username'] = username
        if user is not None and user.is_active:
            auth.login(request, user)
            user = User.objects.get(username=username)
            request.session['role'] = user.is_staff
            re['error'] = error(1, 'login succeed!')
            #re['status'] = request.session['status']
            re['role'] = request.session['role']
            resp = HttpResponse(json.dumps(re), content_type = 'application/json')
            resp.set_cookie('username', username)
            resp.set_cookie('role',user.is_staff)
            return resp
        else:
            re['error'] = error(108, 'username or password error!')
    else:
        re['error'] = error(2, 'error, need post!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def logout(request):
    auth.logout(request)
    re = dict()
    re['error'] = error(1, '注销成功')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

