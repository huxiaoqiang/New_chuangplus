#coding=utf-8
import sys
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib import auth
from app.common_api import error,user_permission
from django.db import DatabaseError
from django.core.mail import send_mail
from random import randint
from position.models import Position,UserPosition,SortPosition
from bson.objectid import ObjectId
from django.db.models import Q
import urllib2,urllib2
import json
import traceback
import random
# Create your views here.
from .models import *
from position.models import *
from app.common_api import check_email
from django.core.mail import EmailMessage
from StringIO import StringIO
import zipfile


POSITIONS_PER_PAGE = 10
url = "http://student.tsinghua.edu.cn/api/login"
def register(request):
    re=dict()
    if request.method == "POST":
        #Validate the captcha
        session_captcha = request.session.get('captcha', '')
        request_captcha = request.POST.get('captcha','')

        if session_captcha == '':
            re['error'] = error(98,"session_captcha is out of work")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        if request_captcha == '':
            re['error'] = error(99,"Need captcha!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        if session_captcha.upper() != request_captcha.upper():
            re['error'] = error(101,'Captcha error!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        #Validate and register information
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        email = request.POST.get('email', '')
        role = request.POST.get('role','0')
        if username == '' or password == '' or email == '':
            re['error'] = error(112,"Username or password or email is empty,fail to register!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        #check the email
        try:
            if check_email(email) != True:
                re['error'] = error(116,'email is not legal')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            find_user_email = User.objects.get(email=email)
            if find_user_email is not None:
                re['error'] = error(115,"Email has been registed")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
        except DoesNotExist:
            try:
                find_username = User.objects.get(username = username)
                if find_username is not None:
                    re['error'] = error(107,"Username has been registed")
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
            except DoesNotExist:
                reguser = User()
                try:
                    reguser = User.create_user(username=username, password=password, email=email)
                except Exception as e:
                    #print traceback.print_exc()
                    re['error'] = error(107, 'Username exist or username include special character')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                if reguser is not None and role == "1":
                    reguser.is_staff = True
                    reguser.save()
                    companyinfo = Companyinfo(username=username,user=reguser)
                    companyinfo.date_joined = datetime_now()
                    companyinfo.update_time = datetime_now()
                    companyinfo.hr_cellphone = request.POST.get('hr_cellphone', '')
                    try:
                        companyinfo.save(force_insert=True)
                    except:
                        re['error'] = error(106," Register failed")
                        reguser.delete()
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    re['error'] = error(1, 'company user registered!')
                    cpn_json = json.loads(companyinfo.to_json())
                    re['id'] = cpn_json['_id']['$oid']
                elif reguser is not None and role == "0":
                    userinfo = Userinfo(username=username,user=reguser,email=email)
                    userinfo.date_joined = datetime_now()
                    userinfo.update_time = datetime_now()
                    userinfo.save(force_insert=True)
                    re['error'] = error(1, 'ordinary user registered!')
                #elif role == -1:
                #    reguser.is_superuser = True
                #    reguser.save()
                user = auth.authenticate(username=username, password=password)
                if user is not None and user.is_active:
                    auth.login(request, user)
                    request.session['role'] = int(role)
                    #request.session['status'] = userinfo.status
                    #request.session['practice_code'] = userinfo.practice_code
                    #re['status'] = userinfo.status
                    re['role'] = role
                    resp = HttpResponse(json.dumps(re), content_type = 'application/json')
                    resp.set_cookie('username', username)
                    #resp.set_cookie('status', userinfo.status)
                    resp.set_cookie('role', int(role))
                    return resp
                else:
                    re['error'] = error(106,"register fail!")
    else:
        re['error'] = error(2, 'error, need post!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def check_username(request):
    re = dict()
    if request.method == "POST":
        name = request.POST.get('username','')
        if name == "":  
            re['error']=error(102,'Need post username')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        else:
            re['error']=error(1,"succeed!")

        if User.objects.filter(username=name).count() != 0:
            re['username'] = {'exist': 'true'}
        else:
            re['username'] = {'exist': 'false'}
    else:
        re['error'] = error(2,"error, need POST!")
    return  HttpResponse(json.dumps(re), content_type = 'application/json')

def check_email_exist(request):
    re = dict()
    if request.method == "POST":
        email = request.POST.get('email','')
        if email == "":
            re['error'] = error(102,'Need post email')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        else:
            re['error'] = error(1,"succeed!")
        
        if User.objects.filter(email=email).count() != 0:
            re['email'] = {'exist': 'true'}
        else:
            re['email'] = {'exist': 'false'}
    else:
        re['error'] = error(2,"error, need POST!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')


def set_username_by_tsinghua(request):
    re = dict()
    if request.method == "POST":
        
        #print  "student_id" in request.GET.keys()
        student_id = request.POST.get('student_id')
        print student_id
        #print  "username" in request.GET.keys()
        student_name = request.POST.get('username')
        email  = request.POST.get("email")
        university = request.POST.get("university")
        major = request.POST.get("major")
        grade = request.POST.get("grade")
        userinfo = Userinfo.objects.filter(student_id = student_id)
        if userinfo:
            userinfo = Userinfo.objects.get(student_id = student_id)
            print student_name
            userinfo.username = student_name
            userinfo.email = email
            userinfo.university = university
            userinfo.major = major
            userinfo.grade = grade
            userinfo.save()
            user = userinfo.user
            user.username = student_name
            user.email = email
            user.save()
            try:
                print "login check"
                auth.login(request,user)
            except:
                re['error'] = error(272,"login,error")
        else:
            re['error'] = error(33,"userinfo doesnot exist")
            return HttpResponse(json.dumps(re),content_type = "application/json")
        re["error"] = error(1,"login succeed!")
        re['role'] = 0
        request.session['role'] = 0
        resp = HttpResponse(json.dumps(re),content_type = "application/json")
        resp.set_cookie('username',student_name)
        resp.set_cookie('role',request.session['role'])
        return resp
    else:
        re['error'] = error(2,'error,need post!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')



#login by tsinghua
def login_by_tsinghua(request):
    re = dict()
    if request.method=="POST":

        #Validate the captcha
        
        session_captcha = request.session.get('captcha', '')
        request_captcha = request.POST.get('captcha','')

        if session_captcha == '' or request_captcha == '':
            re['error'] = error(99,"Need captcha!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        if session_captcha.upper() != request_captcha.upper():
            re['error'] = error(101,'Captcha error!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        
        username = request.POST.get('username')
        password = request.POST.get('password')
        if username == '' or password == '':
            re['error'] = error(111,'username or password is empty!')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        data = {}
        
        data['username'] = username
        data['password'] = password
        req = urllib2.Request(url,json.dumps(data))
        conn = urllib2.urlopen(req)
        content = conn.read()
        map = json.loads(content)
        
        is_succeed = map['error']['message']
        if is_succeed == "login success.":
            student_id = map['info']['id']
            student_name = map['info']['username']
            userinfo = Userinfo.objects.filter(student_id = student_id, is_info = True)
            if userinfo:
                print "login the second time"
                userinfo = Userinfo.objects.get(student_id = student_id, is_info = True)
                #if userinfo.username == "occupation":
                #   
                completive = 1
                if userinfo.university is None:
                    completive = 0
                if userinfo.major is None:
                    completive = 0
                if userinfo.grade is None:
                    completive = 0
                if userinfo.email is None:
                    completive = 0
                if completive == 0:
                    re['completive'] = '0'
                else:
                    re['completive'] = '1'
                user = auth.authenticate(username = userinfo.username,password = password)
                if user is not None and user.is_active:
                    try:
                        print "login check"
                        auth.login(request,user)
                    except:
                        re['error'] = error(272,"login,error")
                request.session['role'] = 0
                re['error'] = error(1,"login succeed!")
                re['role'] = 0
                resp = HttpResponse(json.dumps(re),content_type = 'application/json')
                resp.set_cookie('username',userinfo.username)
                resp.set_cookie('role',request.session['role'])
                return resp
            else:
                user_old = User.objects.filter(username = student_name)
                if user_old:#username is occupied
                    print "chutu"
                    re['occupation'] = '1'
                    flag = str(random.randint(0,100))
                    reguser = User.create_user(username = 'occupation' + flag,password = password)
                    reguser.is_staff = False
                    reguser.save()
                    reguserinfo = Userinfo(user = reguser,is_info = True)
                    reguserinfo.username = 'occupation' + flag
                    reguserinfo.student_id = student_id
                    reguserinfo.data_joined = datetime_now()
                    reguserinfo.update_time = datetime_now()
                    reguserinfo.save(force_insert = True)
                    re['completive'] = '0'
                    re['student_id'] = student_id
                    re['error'] = error(32,"username is occupied")
                    re['role'] = 0
                    resp = HttpResponse(json.dumps(re),content_type = "application/json")
                    return resp
                else:
                    print "hello,new"
                    reguser = User.create_user(username = student_name,password = password)
                    reguser.is_staff = False
                    reguser.save()
                    reguserinfo = Userinfo(username = student_name,user = reguser)
                    reguserinfo.student_id = student_id
                    reguserinfo.is_info = True
                    reguserinfo.data_joined = datetime_now()
                    reguserinfo.update_time = datetime_now()
                    reguserinfo.save(force_insert = True)
                    re['completive'] = '0'
                    user = auth.authenticate(username = student_name,password = password)
                    if user is not None and user.is_active:
                        try:
                            auth.login(request,user)
                        except:
                            re["error"] = error(272,"login error!")
                            return HttpResponse(json.dumps(re),content_type = "application/json")
                    request.session['role'] = 0
                    re['error'] = error(1,"login,succeed!")
                    re['role'] = 0
                    resp = HttpResponse(json.dumps(re),content_type = "application/json")
                    resp.set_cookie('username',student_name)
                    resp.set_cookie('role',request.session['role'])
                    return resp
        else:
            re['error'] = error(108, 'username or password error!')
    else:
        re['error'] = error(2,'error,need post!')
    return HttpResponse(json.dumps(re),content_type = 'application/json')
        

def login(request):
    re = dict()
    if request.method=="POST":

        #Validate the captcha
        session_captcha = request.session.get('captcha', '')
        request_captcha = request.POST.get('captcha','')

        if session_captcha == '' or request_captcha == '':
            re['error'] = error(99,"Need captcha!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        if session_captcha.upper() != request_captcha.upper():
            re['error'] = error(101,'Captcha error!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        if username == '' or password == "":
            re['error'] = error(111,"username or password is empty")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        data = {}
        data['username'] = username
        data['password'] = password
        req = urllib2.Request(url,json.dumps(data))
        conn = urllib2.urlopen(req)
        content = conn.read()
        map = json.loads(content)
        is_succeed = map['error']['message']
        '''
        if is_succeed == 'login success.':

            student_id = map['info']['id']
            student_username = map['info']['username']
            has_created = 0
            qs = User.objects.get(by_tsinghua = True, student_id = student_id)
            if qs is not None:
                has_created = 1
            else:
                qs = User(by_tsinghua = True,student_id = student_id,username = student_username,is_staff = False)
            if has_created == 0:
                try:
                    qs.save()
                except DatabaseError:
                    re['error'] = error(250,'Database Error:failed to save the info of tsinghua student')
                    return HttpResponse(json.dumps(re),content_type = 'application/json')
                re['has_created'] = '0'
            else:
                re['has_created'] = '1'
            
            request.session['role'] = 0
            re['error'] = error(1,'login succeed!')
            re['role'] = 0
            resp = HttpResponse(json.dumps(re),content_type = 'application/json')
            resp.set_cookie('username',username)
            resp.set_cookie('role',request.session['role'])
            return resp

            pass
        else:
        '''
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            re['username'] = username
            auth.login(request, user)
            user = User.objects.get(username=username)
            if not user.is_staff:
                userInfo = Userinfo.objects.get(username = username)
                completive = 1
                if userInfo.university is None :
                    completive = 0
                if userInfo.major is None:
                    completive = 0
                if userInfo.grade is None:
                    completive = 0
                if completive == 0:
                    re['completive'] = '0'
                else:
                    re['completive'] = '1'
            #print 'completive ' + str(completive)
            request.session['role'] = 1 if user.is_staff else 0
            re['error'] = error(1, 'login succeed!')
            re['role'] = request.session['role']
            resp = HttpResponse(json.dumps(re), content_type = 'application/json')
            resp.set_cookie('username', username)
            resp.set_cookie('role',request.session['role'])
            return resp
        else:
            try:
                user_login = User.objects.get(email = username)
            except DoesNotExist:
                re['error'] = error(108,"username or password error!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            username = ""
            if user_login is not None:
                username = user_login.username
            else:
                re['error'] = error(108, 'username or password error!')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            user = auth.authenticate(username=username,password=password)
            if user is not None and user.is_active:
                re['username'] = user.username
                auth.login(request,user)
                user = User.objects.get(username = username)
                if not user.is_staff:
                    userInfo = Userinfo.objects.get(username=username)
                    completive = 1
                    if userInfo.university is None :
                        completive = 0
                    if userInfo.major is None:
                        completive = 0
                    if userInfo.grade is None:
                        completive = 0
                    if completive == 0:
                        re['completive'] = '0'
                    else:
                        re['completive'] = '1'
                request.session['role'] = 1 if user.is_staff else 0
                re['error'] = error(1, 'login succeed!')
                re['role'] = request.session['role']
                resp = HttpResponse(json.dumps(re), content_type = 'application/json')
                resp.set_cookie('username', user.username)
                resp.set_cookie('role',request.session['role'])
                return resp
            else:
                re['error'] = error(108, 'username or password error!')
    else:
            re['error'] = error(2, 'error, need post!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def logout(request):
    auth.logout(request)
    re = dict()
    re['error'] = error(1, 'logout successfully!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def set_password(request):
    re = dict()
    if request.method == 'POST':
        password = request.POST.get('password', '')
        new_password = request.POST.get('new_password', '')
        if password == new_password:
            re['error'] = error(109, 'password is the same')
        else:
            user = auth.authenticate(username=request.user.username, password=password)
            if user is not None and user.is_active:
                user.set_password(new_password)
                user.save()
                re['error'] = error(1, 'settings OK')
            else:
                re['error'] = error(117, 'password error')
    else:
        re['error'] = error(2, 'error,need get')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def set_password_verifycode(request):
    re = dict()
    if request.method == 'POST':
        input_code = request.POST.get('input_code', '')
        correct_code = request.session['correct_code']
        email = request.POST.get('email', '')
        new_password = request.POST.get('new_password', '')
        if correct_code == '':
            re['error'] = error(271,"Email code is out of work")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if input_code != correct_code:
            re['error'] = error(270,'Email code error')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        user = User.objects.get(email = email)
        if user is not None and user.is_active:
            user.set_password(new_password)
            user.save()
            re['error'] = error(1, 'settings OK')
        else:
            re['error'] = error(117, 'password error')
    else:
        re['error'] = error(2, 'error,need get')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def get_userinfo(request):
    re = dict()
    if request.method == 'GET':
        username = request.user.username
        try:
            userinfo = Userinfo.objects.get(username=username)
        except:
            re['error'] = error(103, 'user does not exist')
        re['data'] = json.loads(userinfo.to_json())
        re['error'] = error(1, 'get succeed')
    else:
        re['error'] = error(2, 'error, need get')
    return HttpResponse(json.dumps(re), content_type = 'application/json')


@user_permission('login')
def set_userinfo_by_tsinghua(request):
    re = dict()
    if request.method == 'POST':
        u = Userinfo.objects.get(username=request.user.username)
        email = request.POST.get('email', u.email)
        if check_email(email) != True:
            re['error'] = error(116,'email is not legal')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            find_user_email = User.objects.get(email=email)
            if find_user_email is not None:
                re['error'] = error(115,"Email has been registed")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
        except:
            u.email = email
        request.user.email = u.email
        try:
            request.user.save()
        except:
            re['error'] = error(250, 'Database error: Failed to save')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        u.university = request.POST.get('university', u.university)
        u.major = request.POST.get('major', u.major)
        u.grade = request.POST.get('grade', u.grade)
        u.update_time = datetime_now()
        try:
            u.save()
        except:
            re['error'] = error(250, 'Database error: Failed to save')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        re['userinfo'] = json.loads(u.to_json())
        re['error'] = error(1, 'updated successfully')
    else:
        re['error'] = error(2, 'error，need post')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def set_userinfo(request):
    re = dict()
    if request.method == 'POST':
        u = Userinfo.objects.get(username=request.user.username)

        u.email = request.POST.get('email', u.email)
        request.user.email = u.email

        try:
            request.user.save()
        except:
            re['error'] = error(250, 'Database error: Failed to save')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        u.real_name = request.POST.get('real_name', u.real_name)

        position_type = request.POST.get('position_type', '')
        if position_type != '':
            u.position_type = position_type.split(',')

        u.work_city = request.POST.get('work_city', u.work_city)
        u.cellphone = request.POST.get('cellphone', u.cellphone)
        u.university = request.POST.get('university', u.university)
        u.major = request.POST.get('major', u.major)
        u.grade = request.POST.get('grade', u.grade)
        u.gender = request.POST.get('gender', u.gender)
        u.work_days = request.POST.get('work_days', u.work_days)
        u.description = request.POST.get('description', u.description)
        u.resume_id = request.POST.get('resume_id',u.resume_id)
        u.resume_name = request.POST.get('resume_name',u.resume_name)
        u.update_time = datetime_now()

        try:
            u.save()
        except:
            re['error'] = error(250, 'Database error: Failed to save')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        re['userinfo'] = json.loads(u.to_json())
        re['error'] = error(1, 'updated successfully')
    else:
        re['error'] = error(2, 'error，need post')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def check_userinfo_all_complete(request):
    re = dict()
    if request.method == "GET":
        u = Userinfo.objects.get(username=request.user.username)
        #if u.position_type and u.work_city\
        if u.cellphone and u.university\
        and u.major and u.grade\
        and u.gender and u.work_days and u.description\
        and u.resume_id and u.real_name and u.resume_name:
            u.info_complete = True
            re["complete"] = 'True' 
        else:
            u.info_complete = False
            re["complete"] = 'False' 
        u.save() 
    else:
        re["error"] = error(3,"error,need GET!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def check_userinfo_complete(request):
    re = dict()
    if request.method == "GET":
        u = Userinfo.objects.get(username=request.user.username)
        #if u.position_type and u.work_city\
        if u.cellphone and u.university\
        and u.major and u.grade\
        and u.gender and u.work_days and u.description\
        and u.real_name:
            u.info_complete = True
            re["complete"] = 'True'
        else:
            u.info_complete = False
            re["complete"] = 'False'
        u.save()
    else:
        re["error"] = error(3,"error,need GET!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def get_companyinfo_detail_by_username(request):
    re=dict()
    if request.method == "GET":
        try:
            companyinfo=Companyinfo.objects.get(username=request.user.username)
        except:
            re["error"] = error(105,"company does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        re['data'] = json.loads(companyinfo.to_json())
        re['error'] = error(1, 'get succeed')
    else:
        re["error"] = error(3,"error,need GET!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_companyinfo_detail_with_positions(request,company_id):
    re=dict()
    if request.method == "GET":
        try:
            companyinfo = Companyinfo.objects.get(id=company_id)
        except:
            re["error"] = error(105,"company does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        companyinfo_re = json.loads(companyinfo.to_json())
        position_list = []
        position_type = []
        for position in companyinfo_re['positions']:
            try:
                position_info = Position.objects.get(id=position['$oid'])
            except DoesNotExist:
                re['error'] = error(260,'Position does not exist')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            position_list.append(json.loads(position_info.to_json()))
            if position_info.position_type not in position_type:
                position_type.append(position_info.position_type)
        re['data'] = companyinfo_re
        re['data']['position_list'] = position_list
        re['data']['position_type'] = position_type
        re['error'] = error(1, 'get succeed')
    else:
        re["error"] = error(3,"error,need GET!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_companyinfo_detail(request,company_id):
    re=dict()
    if request.method == "GET":
        try:
            companyinfo = Companyinfo.objects.get(id=company_id)
        except:
            re["error"] = error(105,"company does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        re['data'] = json.loads(companyinfo.to_json())
        re['error'] = error(1, 'get succeed')
    else:
        re["error"] = error(3,"error,need GET!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def set_companyinfo(request,company_id):
    re=dict()
    if request.method == "POST":
        if request.user.is_superuser == False:
            c = Companyinfo.objects.get(username=request.user.username)
        else:
            c = Companyinfo.objects.get(id=company_id)
        c.abbreviation = request.POST.get('abbreviation', c.abbreviation)
        c.city = request.POST.get('city', c.city)
        c.field = request.POST.get('field', c.field)
        c.homepage = request.POST.get('homepage', c.homepage)
        c.wechat = request.POST.get('wechat', c.wechat)
        c.email_resume = request.POST.get('email_resume', c.email_resume)
        c.qrcode_id = request.POST.get('qrcode_id', c.qrcode_id)
        c.logo_id = request.POST.get('logo_id',c.logo_id)
        c.hr_cellphone = request.POST.get('hr_cellphone',c.hr_cellphone)

        welfare_tags = request.POST.get('welfare_tags', '')
        if welfare_tags != '':
            c.welfare_tags = welfare_tags.split(',') 

        c.product_link = request.POST.get('product_link', c.product_link)
        c.brief_introduction = request.POST.get('brief_introduction',c.brief_introduction)
        c.ICregist_name = request.POST.get('ICregist_name', c.ICregist_name)
        c.company_description = request.POST.get('company_description', c.company_description)
        c.product_description = request.POST.get('product_description', c.product_description)
        c.team_description = request.POST.get('team_description', c.team_description)
        c.slogan = request.POST.get('slogan', c.slogan)
        scale = request.POST.get('scale',c.scale)
        if scale != '':
            c.scale = scale
        info_complete = request.POST.get('info_complete', False)
        if info_complete != 'false':
            c.info_complete = True
        c.update_time = datetime_now()
        c.save()

        re['companyinfo'] = json.loads(c.to_json())
        re['error'] = error(1, 'updated successfully')
    else:
        re['error'] = error(2,"error,need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def check_companyinfo_complete(request,company_id):
    re = dict()
    if request.method == "GET":
        c = Companyinfo.objects.get(id = company_id)
        if c.city and c.field and c.email_resume and c.welfare_tags\
        and c.ICregist_name and c.company_description and c.homepage\
        and c.wechat and c.qrcode_id and c.hr_cellphone and c.abbreviation\
        and c.logo_id and c.brief_introduction and c.team_description:
            c.info_complete = True
            re['complete'] = 'True'
        else:
            c.info_complete = False
            re['complete'] = 'False'

        c.save() 
    else:
        re["error"] = error(3,"error,need GET!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def get_position_favor(request):
    re = dict()
    if request.method == "GET":
        try:
            up = UP_Relationship.objects(user=request.user)
            #user = User.objects.get(username='hutest')
            #up = UP_Relationship.objects(user=user)
        except DoesNotExist:
            re['error'] = error(261,"Position does not exist")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except DatabaseError:
            re['error'] = error(250,"Database error: Failed to get UP_Relationship")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        position_favor_list = []
        for item in up:
            try:
                posi = Position.objects.get(id=item.position.id)
            except:
                re['error'] = error(260,"Position does not exist")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            position_re = json.loads(posi.to_json())
            try:
                userposition = UserPosition.objects.get(user=request.user,position=posi)
                position_re['resume_submitted'] = True
            except:
                position_re['resume_submitted'] = False
            try:
                company = Companyinfo.objects.get(id=posi.company.id)
            except DoesNotExist:
                re['error'] = error(105,"Companyinfo does not exist!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            position_re['company'] = json.loads(company.to_json())
            position_favor_list.append(position_re)

        re['data'] = position_favor_list
        re['error'] = error(1,"Get favor position list successfully")
    else:
        re['error'] = error(3,"Error, need GET")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def check_submit(request,position):
    try:
        up = UserPosition(user=request.user,position=position)
        return True
    except DoesNotExist:
        return False

@user_permission('login')
def submitall(request):
    re = dict()
    if request.method == 'POST':
        try:
            up = UP_Relationship(user=request.user)
        except DoesNotExist:
            re['error'] = error(261,'UP-relationship is not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            userinfo = Userinfo(user=request.user)
        except DoesNotExist:
            re['error'] = error(104,'Userinfo dose not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if userinfo.resume_id:
            try:
                r = File.objects.get(id=userinfo.resume_id)
                resume = r.value
            except:
                re['error'] = error(120, 'Resume does not exist')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
        else:
            resume = None

        for item in up:
            try:
                posi = Position.objects.get(id=item.position.id)
            except:
                re['error'] = error(260,"Position does not exist")
                return HttpResponse(json.dumps(re), content_type = 'application/json')

            if not check_submit(request,posi):
                submit_date = datetime.now()
                posi.submit_num = posi.submit_num+1
                posi.save()
                UP = UserPosition(submit_date = submit_date, resume_submitted = resume, position = posi, user = request.user)
                UP.save()
        re['error'] = error(1,'succeed')
    else:
        re['error'] = error(2,'Error, need POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def get_position_submit(request):
    re = dict()
    if request.method == "GET":
        try:
            up = UserPosition.objects(user=request.user)
        except DoesNotExist:
            re['error'] = error(265,'User does not submit any position')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        page = 1
        if "page" in request.GET.keys():
            if len(request.GET["page"]) > 0:
                try:
                    page = int(request.GET["page"])
                    assert page > 0
                except (ValueError,AssertionError):
                    re['error'] = error(200,"Invaild request!")
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                except:
                    re['error'] = error(299,'Unknown Error!')
                    return HttpResponse(json.dumps(re),content_type = 'application/json')

        orderValue = "id"
        up.order_by(orderValue)
        shang = up.count() / POSITIONS_PER_PAGE
        yushu = 1 if up.count() % POSITIONS_PER_PAGE else 0
        page_number =  shang + yushu
        up = up[(page - 1) * POSITIONS_PER_PAGE: page * POSITIONS_PER_PAGE]

        position_submit_list = []
        for item in up:
            try:
                posi = Position.objects.get(id=item.position.id)
            except:
                re['error'] = error(260,"Position does not exist")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            position_re = json.loads(posi.to_json())
            try:
                company = Companyinfo.objects.get(id=posi.company.id)
            except DoesNotExist:
                re['error'] = error(105,"Companyinfo does not exist!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')

            position_re['company'] = json.loads(company.to_json())
            position_re['processed'] = item.processed
            position_submit_list.append(position_re)

        re['data'] = position_submit_list
        re['page_number'] = page_number
        re['error'] = error(1,"Get submitted position list successfully")
    else:
        re['error'] = error(3,"Error, need GET")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def check_favor_position(request,position_id):
    re = dict()
    if request.method == 'GET':
        try:
            position = Position.objects.get(id=position_id)
        except DoesNotExist:
            re['error'] = error(260,'Position does not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            up = UP_Relationship.objects.get(user=request.user,position=position)
            re['data'] = {'exist':True}
        except DoesNotExist:
            re['data'] = {'exist':False}
        re['error'] = error(1,'Response succeed!')
    else:
        re['error'] = error(3,'Error,need Get')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def get_company_favor(request):
    re = dict()
    if request.method == "GET":
        try:
            uc =  UC_Relationship.objects(user=request.user)
        except DoesNotExist:
            re['error'] = error(263,'UC-relationship is not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except DatabaseError:
            re['error'] = error(250,"Database error: Failed to get UP_Relationship")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        company_favor_list = []
        for item in uc:
            try:
                company = Companyinfo.objects.get(id = item.company.id)
                company_re = json.loads(company.to_json())
                position_type = []
                if 'positions' in company_re and len(company_re['positions']) != 0:
                    for p in company_re['positions']:
                        try:
                            position = Position.objects.get(id = p['$oid'])
                        except DoesNotExist:
                            re['error'] = error(260,'Position does not exist')
                            return HttpResponse(json.dumps(re), content_type = 'application/json')
                        if position.status == 'open' and position.position_type not in position_type:
                            position_type.append(position.position_type)
                else:
                    company_re['positions'] = []
                company_re['position_type'] = position_type
            except DoesNotExist:
                re['error'] = error(105,'Companyinfo dose not exist')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            company_favor_list.append(company_re)
        re['data'] = company_favor_list
        re['error'] = error(1,'Get favor company list successfully')
    else:
        re['error'] = error(3,'Error, need GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def check_favor_company(request,company_id):
    re = dict()
    if request.method == "GET":
        try:
            company = Companyinfo.objects.get(id=company_id)
        except DoesNotExist:
            re['error'] = error(105,'Companyinfo dose not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            uc = UC_Relationship.objects.get(user=request.user,company=company)
            re['data'] = {'exist':True}
        except DoesNotExist:
            re['data'] = {'exist':False}
        re['error'] = error(1,'Response succeed!')
    else:
        re['error'] = error(3,'Error, need GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def remove_closed_position(request):
    re = dict()
    if request.method == 'POST':
        try:
            up = UP_Relationship(user = request.user)
        except DoesNotExist:
            re['error'] = error(261,'UP-relationship is not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        for item in up:
            try:
                posi = Position.objects.get(id=item.position.id)
            except:
                re['error'] = error(260,"Position does not exist")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            if posi.status == 'closed':
                item.delete()
        re['error'] = error(1,'succeed!')
    else:
        re['error'] = error(2,'Error,need post')
    return HttpResponse(json.dumps(re), content_type = 'application/json')



#admin api: for modifying the companyinfo.status, is_auth, auth_organization
@user_permission("login")
def auth_company(request,company_id):
    re = dict()
    if request.method == "POST":
        # only the superuser can modify the auth status
        if request.user.is_superuser == True:
            try:
                companyinfo = Companyinfo.objects.get(id = company_id)
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to get companyinfo')
                return HttpResponse(json.dumps(re), content_type = 'application/json')

            status = request.POST.get('status', '0')
            if status == '1':
                companyinfo.status = True
            else:
                companyinfo.status = False

            auth_organization = request.POST.get('auth_organization', '')
            if auth_organization == '':
                companyinfo.is_auth = False
                companyinfo.auth_organization = ''
            else:
                companyinfo.is_auth = True
                companyinfo.auth_organization = auth_organization
            
            try:
                companyinfo.save()
                re['error'] = error(1,'Auth succeed!')
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to get companyinfo')
                return HttpResponse(json.dumps(re), content_type = 'application/json')

        else:
            re['error'] = error(110, 'Permission denied, no permission to change ')
    else:
        re['error'] = error(2,"error, need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

# This is a helper function
def update_stage_scale(company):
    scale_hash = {'seed':0, 'angel':0, 'A':1, 'B':1, 'C':1, 'D_plus':2}
    highest_stage = ''
    highest_scale = -1

    for f in Financing.objects.filter(company = company):
        scale = scale_hash[f.stage]
        if scale > highest_scale:
            highest_scale = scale
            highest_stage = f.stage

    company.scale = highest_scale
    company.stage = highest_stage
    company.save()

@user_permission("login")
def create_financing_info(request):
    re=dict()
    if request.method == "POST":
        username = ''
        if request.user.is_superuser:
            username = request.POST.get('username', '')
        if request.user.is_staff:
            username = request.user.username

        if username == '':
            re['error'] = error(100,"permission denied!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
            
        try:
            companyinfo = Companyinfo.objects.get(username=username)
        except:
            re["error"] = error(105, "companyinfo does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        financing_info = Financing()
        financing_info.stage = request.POST.get('stage','')
        if financing_info.stage == 'none':
            financing_info.stage = ''
        financing_info.organization = request.POST.get('organization','')
        financing_info.amount = request.POST.get('amount','')
        financing_info.company = companyinfo
        try:
            financing_info.save()
        except DatabaseError:
            re['error'] = error(250,'Database error: Failed to save')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        companyinfo.financings.append(financing_info)
        update_stage_scale(companyinfo) 

        re['error'] = error(1,"financing_info created")
        re['data'] = json.loads(financing_info.to_json())
    else:
        re['error'] = error(2,"error, need post")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_financinginfo_list(request,company_id):
    re = dict()
    if request.method == "GET":
        try:
            companyinfo = Companyinfo.objects.get(id=company_id)
        except:
            re["error"] = error(105,"company does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            financinginfo_list = companyinfo.financings
        except DatabaseError:
            re['error'] = error(250,'Database error: Failed to get')
        re['error'] = error(1,"get financinginfo_list successfully")
        datalist = []
        for financinginfo in financinginfo_list:
            datalist.append(json.loads(financinginfo.to_json()))
        re['data'] = datalist
    else:
        re['error'] = error(3,"error, need GET")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def set_financinginfo(request,fin_id):
    re = dict()
    if request.method == "POST":
        try:
            financing_info = Financing.objects.get(id=fin_id)
        except:
            re['error'] = error(121,"financing_info does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if request.user.is_superuser == True or\
        financing_info.company.username == request.user.username:
            financing_info.stage = request.POST.get("stage",financing_info.stage)
            financing_info.organization = request.POST.get("organization",financing_info.organization)
            financing_info.amount = request.POST.get("amount",financing_info.amount)
            try:
                financing_info.save()
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to save')
                return HttpResponse(json.dumps(re), content_type = 'application/json')

            update_stage_scale(financing_info.company) 

            re['error'] = error(1,"financing_info update successfully!")
            re['data'] = json.loads(financing_info.to_json())
        else:
            re["error"] = error(100,"permission denied!")
    else:
        re['error'] = error(2,"error, need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def delete_financinginfo(request,fin_id):
    re=dict()
    if request.method == "POST":
        try:
            financing_info = Financing.objects.get(id=fin_id)
        except:
            re['error'] = error(112,"financing_info dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        if request.user.is_superuser == True or\
        financing_info.company.username == request.user.username:
            financing_info.company.financings.remove(financing_info) 
            update_stage_scale(financing_info.company) 

            try:
                financing_info.delete()
            except DatabaseError:
                re['error'] = error(252,"Database error: Failed to delete!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')

            re['error'] = error(1,'Delete position succeed!')
        else:
            re["error"] = error(100,"permission denied!")
    else:
        re['error'] = error(2,"error, need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def create_company_member(request):
    re = dict()
    if request.method == 'POST':
        username = request.user.username
        try:
            companyinfo = Companyinfo.objects.get(username=username)
        except:
            re['error'] = error(105,"companyinfo does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        if request.user.is_staff == True or request.user.is_superuser == True:
            new_member = Member()
            new_member.m_name = request.POST.get('m_name','')
            new_member.m_position = request.POST.get('m_position','')
            new_member.m_introduction = request.POST.get('m_introduction','')
            new_member.m_avatar_id = request.POST.get('m_avatar_id','')
            new_member.company = companyinfo
            try:
                new_member.save()
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to save')
                return HttpResponse(json.dumps(re), content_type = 'application/json')

            companyinfo.members.append(new_member)
            companyinfo.save()

            re['error'] = error(1,'create new member successfully!')
            re['data'] = json.loads(new_member.to_json())
        else:
            re['error'] = error(100,"permission denied!")
    else:
        re['error'] = error(2,"error, need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_member_list(request,company_id):
    re=dict()
    if request.method == 'GET':
        try:
            companyinfo = Companyinfo.objects.get(id=company_id)
        except:
            re['error'] = error(105,"companyinfo dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            member_list = companyinfo.members
        except DatabaseError:
             re['error'] = error(250,'Database error: Failed to Get')
             return HttpResponse(json.dumps(re), content_type = 'application/json')
        re['error'] = error(1,"get memberlist successfully")
        datalist = []
        for member in member_list:
            datalist.append(json.loads(member.to_json()))
        re['data'] = datalist
    else:
        re['error'] = error(3,"error,need GET")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def set_company_member(request,mem_id):
    re=dict()
    if request.method == 'POST':
        try:
            member = Member.objects.get(id=mem_id)
        except:
            re['error'] = error(112,"member does not exist")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        if request.user.is_superuser == True\
        or member.company.username == request.user.username:
            member.m_name = request.POST.get('m_name',member.m_name)
            member.m_position = request.POST.get('m_position',member.m_position)
            member.m_introduction = request.POST.get('m_introduction',member.m_introduction)
            try:
                member.save()
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to update')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            re['error'] = error(1, 'change member information successfully!')
            re['data'] = json.loads(member.to_json())
        else:
            re['error'] = error(100,"permission denied!")
    else:
        re['error'] = error(2,"errer,need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def delete_company_member(request,mem_id):
    re = dict()
    if request.method == "POST":
        try:
            del_member = Member.objects.get(id=mem_id)
        except:
            re['error'] = error(112,"member does not exist")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        if request.user.is_superuser == True\
        or del_member.company.username == request.user.username:
            del_member.company.members.remove(del_member)
            del_member.company.save()

            try:
                del_member.delete()
            except DatabaseError:
                re['error'] = error(252,"Database error: Failed to delete!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            re['error'] = error(1,"delete member successfully")
        else:
            re['error'] = error(100,"permission denied!")
    else:
        re["error"] = error(2,"error,need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def send_email(request):
    re = dict()
    if request.method == 'POST':
        email = request.POST.get('email', '')
        if email == '':
            re['error'] = error(102, 'Need post email')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        try:
            User.objects.get(email = email)
        except:
            re['error'] = error(103, "user does not exist")
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        try:
            session_captcha = request.session.get('captcha', False)
            request_captcha = request.POST.get('captcha','')
        except KeyError:
            re['error'] = error(99,"Need captcha!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if session_captcha.upper() != request_captcha.upper():
            re['error'] = error(101,'Captcha error!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        correct_code = ''
        for i in range(6):
            correct_code += str(randint(0, 9)) 
        request.session['correct_code'] = correct_code

        try:
            send_mail('[创+]找回密码', '您找回密码的验证码为：%s。\n请在10分钟内输入验证码进行下一步操作。如非您本人操作，请忽略此邮件。' % correct_code, 'support@chuangplus.com', [email])
            re['error'] = error(1, 'Success!')
        except:
            re['error'] = error(300, 'Email sending failed')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
    else:
        re['error'] = error(2, 'Error, need POST!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def verify_code(request):
    re = dict()
    if request.method == 'POST':
        input_code = request.POST.get('input_code', '') 
        correct_code = request.session['correct_code']
        if input_code == correct_code:
            re['pass_verify'] = True
        else:
            re['pass_verify'] = False 
    else:
        re['error'] = error(2, 'Error, need POST!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')


#@user_permission('login')
def get_company_list_admin(request):
    re = dict()
    if request.method == 'GET':
        status = request.GET.get('status', '')
        info_complete = request.GET.get('info_complete','')
        is_auth = request.GET.get('is_auth','')
        companies = Companyinfo.objects()
        if status != '':
            status = bool(status)
            companies = companies.filter(status = status)

        if info_complete != '':
            info_complete = bool(info_complete)
            companies = companies.filter(info_complete = info_complete)
        if is_auth != '':
            is_auth = bool(is_auth)
            companies = companies.filter(is_auth = is_auth)

        page = 1
        if "page" in request.GET.keys():
            if len(request.GET["page"]) > 0:
                try:
                    page = int(request.GET["page"])
                    assert page > 0
                except (ValueError,AssertionError):
                    re['error'] = error(200,"Invaild request!")
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                except:
                    re['error'] = error(299,'Unknown Error!')
                    return HttpResponse(json.dumps(re),content_type = 'application/json')

        orderValue = "id"
        companies.order_by(orderValue)
        shang = companies.count() / POSITIONS_PER_PAGE
        yushu = 1 if companies.count() % POSITIONS_PER_PAGE else 0
        page_number =  shang + yushu
        companies = companies[(page - 1) * POSITIONS_PER_PAGE: page * POSITIONS_PER_PAGE]

        companies_re = json.loads(companies.to_json())
        for i in range(0,len(companies_re)):
            financings = companies[i].financings
            for j in range(0,len(financings)):
                financings[j] = json.loads(financings[j].to_json())
            companies_re[i]["financing"] = financings
        re['data'] = companies_re
        re['page_number'] = page_number
        re['error'] = error(1,"succeed")
    else:
        re['error'] = error(3,'Error, need GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_company_with_financing(request,company_id):
    re = dict()
    if request.method == 'GET':
        try:
            company = Companyinfo.objects.get(id=company_id)
        except DoesNotExist:
            re['error'] = error(105,"companyinfo dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        company_re = json.loads(company.to_json())
        financings = company.financings
        for j in range(0,len(financings)):
            financings[j] = json.loads(financings[j].to_json())
        company_re["financing"] = financings
        re["data"] = company_re
        re['error'] = error(1,"succeed")
    else:
        re['error'] = error(3,'Error, need GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_company_list(request):
    re = dict()
    if request.method == 'GET':
        text = request.GET.get('text', '')
        fields = request.GET.get('fields', '')
        auth_organization = request.GET.get('auth_organization', '')
        scale = request.GET.get('scale', '')
        status = request.GET.get('status', '')

        companies = Companyinfo.objects(info_complete=True).all().order_by('index')

        if text != '':
            companies = companies.filter(
                Q(abbreviation__contains = text) |
                Q(ICregist_name__contains = text))
        if fields != '':
            fields = fields.split(',')
            companies = companies.filter(field__in = fields)
        if auth_organization != '':
            auth_organization = auth_organization.split(',')
            companies = companies.filter(auth_organization__in = auth_organization)
        if scale != '':
            scale = scale.split(',')
            for i in range(0,len(scale)):
                scale[i] = int(scale[i])
            companies = companies.filter(scale__in = scale)
        if status != '':
            companies = companies.filter(status = bool(status))
        page = 1
        if "page" in request.GET.keys():
            if len(request.GET["page"]) > 0:
                try:
                    page = int(request.GET["page"])
                    assert page > 0
                except (ValueError,AssertionError):
                    re['error'] = error(200,"Invaild request!")
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                except:
                    re['error'] = error(299,'Unknown Error!')
                    return HttpResponse(json.dumps(re),content_type = 'application/json')
        shang = companies.count() / POSITIONS_PER_PAGE
        yushu = 1 if companies.count() % POSITIONS_PER_PAGE else 0
        page_number =  shang + yushu
        companies = companies[(page - 1) * POSITIONS_PER_PAGE: page * POSITIONS_PER_PAGE]
        companies_re = json.loads(companies.to_json())
        for cpn in companies_re:
            position_type = []
            if 'positions' in cpn and  len(cpn['positions']) != 0:
                for p in cpn['positions']:
                    try:
                        position = Position.objects.get(id=p['$oid'])
                    except DoesNotExist:
                        re['error'] = error(260,'Position does not exist')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    if position.status == 'open' and  position.position_type not in position_type:
                        position_type.append(position.position_type)
            else:
                cpn['positions'] = []
            cpn['position_type'] = position_type


        re['error'] = error(1, "get company list successfully")
        re['data'] = companies_re
        re['page_number'] = page_number
        re['page'] = page
    else:
        re['error'] = error(2, 'error, need GET!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def user_like_company(request,company_id):
    re = dict()
    if request.method == 'POST':
        try:
            company = Companyinfo.objects.get(id = company_id)
        except:
            re["error"] = error(105,"company does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            uc = UC_Relationship.objects.get(company = company, user = request.user)
        except DoesNotExist:
            uc = UC_Relationship(company = company, user = request.user)
        uc.save()
        re['error'] = error(1, "success!")
    else:
        re['error'] = error(2, 'error, need POST!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def user_unlike_company(request,company_id):
    re = dict()
    if request.method == 'POST':
        try:
            company = Companyinfo.objects.get(id = company_id)
        except:
            re["error"] = error(105,"company does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            uc = UC_Relationship.objects.get(company = company, user = request.user)
        except DoesNotExist:
            re['error'] = error(263,' UC-relationship is not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        uc.delete()
        re['error'] = error(1, "success!")
    else:
        re['error'] = error(2, 'error, need POST!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def process_position(request,position_id):
    re = dict()
    if request.method == 'POST':
        try:
            position = Position.objects.get(id=position_id)
        except DoesNotExist:
            re['error'] = error(260,'Position does not exist!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            up = UserPosition.objects(position=position,processed=False)
        except DoesNotExist:
            re['error'] = error(267,'Nobody submit the position')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        for item in up:
            item.processed = True
            item.save()
        re['error'] = error(1,'succeeed!')
    else:
        re['error'] = error(2,'Error, need POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')


@user_permission('login')
def process_single(request):
    re = dict()
    position_id = request.POST.get('position_id','')
    username = request.POST.get('username','')
    if(position_id == '' or username == ''):
        re['error'] = error(274,'need post position_id or username')
        return HttpResponse(json.dumps(re), content_type = 'application/json')

    if request.method == 'POST':
        try:
            position = Position.objects.get(id=position_id)
        except DoesNotExist:
            re['error'] = error(260,'Position does not exist!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            user = User.objects.get(username=username)
        except DoesNotExist:
            re['error'] = error(103,'User dose not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            up = UserPosition.objects.get(position=position,user=user,processed=False)
        except DoesNotExist:
            re['error'] = error(268,'No Userposition relation to process')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        up.processed = True
        up.save()
        re['error'] = error(1,'succeed!')
    else:
        re['error'] = error(2,'Error, need POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def get_submit_list_intern(request,position_id):
    re = dict()
    if request.method == 'GET':
        try:
            position = Position.objects.get(id=position_id)
        except DoesNotExist:
            re['error'] = error(260,'Position does not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            up = UserPosition.objects(position = position)
        except DoesNotExist:
            re['error'] = error(267,'Nobody submit the position')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        user_list = []
        for item in up:
            u = Userinfo.objects.get(user = item.user)
            userinfo = json.loads(u.to_json())
            userinfo['position_name'] = item.position.name
            user_list.append(userinfo)
        re['error'] = error(1,'succeed ')
        re['data'] = user_list
    else:
        re['error'] = error(3,'Error, need GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

TYPE = ('technology','product','design','operate','marketing','functions','others')
@user_permission('login')
def search_submit_intern(request):
    re = dict()
    if request.method == 'GET':
        type = request.GET.get('position_type', '')
        processed = request.GET.get('processed','')
        interested = request.GET.get('interested','')
        try:
            company = Companyinfo.objects.get(username=request.user.username)
            #company = Companyinfo.objects.get(username='tsinghuachuangplus')
        except:
            re["error"] = error(105,"company does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            up = UserPosition.objects(company=company)
        except DoesNotExist:
            re['error'] = error(267,'Nobody submit the position')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if processed != '':
            if processed == 'false':
                up = up.filter(processed = False)
            elif processed == 'true':
                up = up.filter(processed = True)
            else:
                re['error'] = error(275,'param error!')
                return HttpResponse(json.dumps(re), content_type = 'application/json')

        if type != '':
            try:
                assert type in TYPE
            except (AssertionError,ValueError,UnicodeDecodeError):
                re['error'] = error(238,"Invaild search type!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            #todo: how to  filter???
            try:
                positions = Position.objects(position_type=type)
            except DoesNotExist:
                re['error'] = error(260,'Position does not exist')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            up = up.filter(position__in = positions)

        if interested != '':
            if interested == 'false':
                up = up.filter(interested = False)
            elif interested == 'true':
                up = up.filter(interested = True)
            else:
                re['error'] = error(275,'param error!')
                return HttpResponse(json.dumps(re), content_type = 'application/json')

        page = 1
        if "page" in request.GET.keys():
            if len(request.GET["page"]) > 0:
                try:
                    page = int(request.GET["page"])
                    assert page > 0
                except (ValueError,AssertionError):
                    re['error'] = error(200,"Invaild request!")
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                except:
                    re['error'] = error(299,'Unknown Error!')
                    return HttpResponse(json.dumps(re),content_type = 'application/json')

        orderValue = "id"
        up.order_by(orderValue)
        shang = up.count() / POSITIONS_PER_PAGE
        yushu = 1 if up.count() % POSITIONS_PER_PAGE else 0
        page_number =  shang + yushu
        up = up[(page - 1) * POSITIONS_PER_PAGE: page * POSITIONS_PER_PAGE]

        user_list = []
        for item in up:
            u = Userinfo.objects.get(user = item.user)
            userinfo = json.loads(u.to_json())
            p = json.loads(item.position.to_json())
            userinfo['position_name'] = item.position.name
            userinfo['position_id'] = p['_id']['$oid']
            userinfo['process'] = item.processed
            userinfo['interested'] = item.interested
            user_list.append(userinfo)
        re['error'] = error(1,'succeed ')
        re['data'] = user_list
        re['page_number'] = page_number
    else:
        re['error'] = error(3,'Error,need GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_image_list(request):
    re = dict()
    if request.method == 'GET':
        company = Companyinfo.objects.all()
        company = json.loads(company.to_json())
        f_company = StringIO()
        zip_company = zipfile.ZipFile(f_company, 'w', zipfile.ZIP_DEFLATED)

        for cpn in company:
            if cpn.has_key('logo_id'):
                f_logo = StringIO()
                zip_logo = zipfile.ZipFile(f_logo, 'w', zipfile.ZIP_DEFLATED)
                empty = True
                category = cpn['_id']['$oid']+"_logo"
                for logo in File.objects.filter(file_type='logo',category=category):
                    empty = False
                    if cpn.has_key('abbreviation'):
                        zip_logo.writestr('%s.jpg' % cpn['abbreviation'], logo.value.read())
                    else:
                        zip_logo.writestr('%s.jpg' % 'null', logo.value.read())
                zip_logo.close()
                if not empty:
                    zip_company.writestr('%s.zip' % cpn['abbreviation'], f_logo.getvalue())
        zip_company.close()
        mail = EmailMessage('[创+]logo','正文', 'support@chuangplus.com', ['1459234485@qq.com'])
        mail.attach('%s.zip' % 'logo', f_company.getvalue(), 'application/zip')
        try:
            mail.send()
            re['error'] = error(1,"Send success")
        except:
            re['error'] = error(300,"Send Error")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    else:
        re['error'] = error(3,"Error, need GET")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def search_count(request,query):
    re = dict()
    if request.method == "GET":
        if query != '':
            try:
                companies = Companyinfo.objects(Q(abbreviation__contains = query)|Q(ICregist_name__contains = query))
            except (AssertionError, ValueError, UnicodeDecodeError):
                re['error'] = error(231,"Invaild search query!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')

            try:
                positions = Position.objects(name__contains = query)
            except (AssertionError, ValueError, UnicodeDecodeError):
                re['error'] = error(231,"Invaild search name!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
        re['company_count'] = len(companies)
        re['position_count'] = len(positions)
        re['error'] = error(1,"succeed!")
    else:
        re['error'] = error(3,"Error, need GET")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_position_num(request):
    re = dict()
    if request.method =="GET":
        try:
            count = Position.objects.filter().count()
        except:
            re['error'] = error(251,"Database error: Failed to search")
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        re['error'] = error(1,"succeed")
        re['positionNumber'] = count

        #print count
    else:
        re['error'] = error(3,'Error,need GET')
    return HttpResponse(json.dumps(re),content_type = 'application/json')
    
def get_company_num(request):
    re = dict()
    if request.method == "GET":
        try:
            count = Companyinfo.objects.filter().count()
        except:
            re['error'] = error(251,"Database error: Failed to search")
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        re['error'] = error(1,"succeed")
        re['companyNumber'] = count
        #print count
    else:
        re['error'] = error(3,'Error,need GET')
    return HttpResponse(json.dumps(re),content_type = 'application/json')

    
def hr_set_interested_user(request,position_id,username):
    re = dict()
    #print username
    if request.method == "GET":
        try:
            position = Position.objects.get(id = position_id)
            user = User.objects.get(username = username)
            up = UserPosition.objects.get(user = user,position = position)

            up.interested = True
            up.save()
        except (AssertionError, ValueError, UnicodeDecodeError):
            re['error'] = error(231,"Invaild search query!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except (DatabaseError):
            re['error'] = error(251,"Database error: Failed to search!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except:
            re['error'] = error(299,'Unknown Error!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        re['error'] = error(1,"succeed!")
    else:
        re['error'] = error(3,'Error, need GET')
    return HttpResponse(json.dumps(re),content_type = 'application/json')

def interested_list_position(request):
    re = dict()
    if "position_id" in request.GET.keys():
        position_id = request.GET["position_id"]
        try:
            position = Position.objects.get(id = position_id)
        except (AssertionError, ValueError, UnicodeDecodeError):
            re['error'] = error(231,"Invaild search name!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except (DatabaseError):
            re['error'] = error(251,"Database error: Failed to search!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except:
            re['error'] = error(299,'Unknown Error!')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        data = []
        up = UserPosition.objects.filter(position = position,interested = True)
        if up:
            for i in up:
                try:
                    userinfo = Userinfo.objects.get(user = i.user)
                    data.append(json.loads(userinfo.to_json()))
                except DoesNotExist:
                    re['error']  = error(106,"Userinfo does not exist!")
                    return HttpResponse(json.dumps(re),content_type = "application/json")
        re['data'] = data
        re['error'] = error(1,"succeed")
    else:
        re['error'] = error(3,"Error, need GET")
    return HttpResponse(json.dumps(re), content_type = "application/json")

def interested_list_company(request):
    re = dict()
    if "company_id" in request.GET.keys():
        company_id = request.GET["company_id"]
        try:
            company = Companyinfo.objects.get(id = company_id)
        except (AssertionError, ValueError, UnicodeDecodeError):
            re['error'] = error(231,"Invaild search name!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except (DatabaseError):
            re['error'] = error(251,"Database error: Failed to search!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except DoesNotExist:
            re['error'] = error(150,'DoesNotExist!')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        except:
            re['error'] = error(299,'Unknown Error')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        data = []
        try:
            position = Position.objects.filter(company = company)
        except (DatabaseError):
            re['error'] = error(251,"Database error: Failed to search!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except:
            re['error'] = error(299,'Unknown Error!')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        if position:
            for i in position:
                up = UserPosition.objects.filter(position = i,interested = True)
                if up:
                    for j in up:
                        try:
                            userinfo = Userinfo.objects.get(user = j.user)
                        except DoesNotExist:
                            re['error']  = error(106,"Userinfo does not exist!")
                            return HttpResponse(json.dumps(re),content_type = "application/json")
                        data.append(json.loads(userinfo.to_json()))
        
        re['error'] = error(1,"succeed")
        re['data'] = data
    else:
        re['error'] = error(3,"Error, need GET")
    return HttpResponse(json.dumps(re),content_type="application/json")

def run_one_times(request):
    re = dict()
    if request.method == "GET":
        qs = Position.objects.all()
        '''
        n = Position.objects.filter().count()
        item = []
        for i in range(0,n+1):
            item.append(i+1)
        random.shuffle(item)
        num = 0
        '''
        for i in qs:
            sp = SortPosition.objects.get(position = i)
            i.index = sp.value + int(sp.companyIndex * 0.3)
            i.save()
            sp.save()
            #num = num + 1
    else:
        re['error'] = error(3,"Error, need GET")
    return HttpResponse(json.dumps(re),content_type="application/json")

def add_student_id(request):
    re = dict()
    if request.method == "GET":
        userlist = Userinfo.objects.filter(is_info=True,student_id=None)
        if userlist:
            for i in userlist:
                username = i.user.username
                password = i.user.password
                print username + " " + str(password)
                data = {}
                data['username'] = username
                data['password'] = password
                req = urllib2.Request(url,json.dumps(data))
                conn = urllib2.urlopen(req)
                content = conn.read()
                map = json.loads(content)
                data = {}
                is_succeed = "login success."
                is_succeed = map['error']['message']
                if is_succeed == "login success.":
                    student_id = map['info']['id']
                    student_name = map['info']['username']
                    i.student_id = student_id
                    i.save()
                    data[i.username] = i.student_id
        re['data'] = data
        re['error'] = error(1,"succeed")
    else:
        re['error'] = error(3,"Need GET")
    return HttpResponse(json.dumps(re),content_type = "application/json")
'''
def set_company_sort(request,company_id,index)
    re =dict()
    if request.method == "GET":
    
    else:
        re['error'] = error(3,""N)
'''
def look_position_sort(request):
    re = dict()
    if request.method == "GET":
        qs = Position.objects.all()
        data = {}
        for i in qs:
            data[i.name] = i.index
        re['data'] = data
    else:
        re['error'] = error(1,"adfaf")
    return HttpResponse(json.dumps(re),content_type="application/json")