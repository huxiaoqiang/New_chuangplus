#coding=utf-8
import sys
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib import auth
from app.common_api import error,user_permission
from django.db import DatabaseError
import traceback

# Create your views here.
from .models import *

def register(request):
    re=dict()
    if request.method == "POST":
    #Validate the captcha
        try:
            session_captcha = request.session.get('captcha', False)
            request_captcha = request.POST.get('captcha','')
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
            User.create_user(username=username, password=password, email=email)
            userinfo = Userinfo(username=username)
            userinfo.email = email
            userinfo.date_joined = datetime_now()
            userinfo.update_time = datetime_now()
            userinfo.has_resume = False
            userinfo.info_complete = False
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
        except Exception as e:
            print traceback.print_exc()
            re['error'] = error(107, 'username exist or username include special character')
    else:
        re['error'] = error(2, 'error, need post!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def check_username(request):
    re=dict()
    if request.method == "POST":
        name = request.POST.get('username','')
        if name == "":  
            re['error']=error(102,'Need post username')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        else:
            re['error']=error(1,"succeed!")

        if User.objects.filter(username=name).count() != 0:
            re['username']={'exist': 'ture'}
        else:
            re['username']={'exist': 'false'}
    else:
        re['error'] = error(2,"error, need POST!")
    return  HttpResponse(json.dumps(re), content_type = 'application/json')

def check_email(request):
    re=dict()
    if request.method == "POST":
        email = request.POST.get('email','')
        if email == "":
            re['error']=error(102,'Need post email')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        else:
            re['error'] = error(1,"succeed!")
        
        if User.objects.filter(email=email).count() != 0:
            re['email'] = {'exist': 'ture'}
        else:
            re['email'] = {'exist': 'false'}
    else:
        re['error'] = error(2,"error, need POST!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

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
                re['error'] = error(101, 'password error')
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
            re['error'] = error(110, 'user do not exist')
        re['userinfo'] = json.loads(userinfo.to_json())
        re['error'] = error(1, 'get succeed')
    else:
        re['error'] = error(2, 'error, need get')
    return HttpResponse(json.dumps(re), content_type = 'application/json')


@user_permission('login')
def set_userinfo(request):
    re = dict()
    if request.method == 'POST':
        username = request.POST.get('username', '')
        if username == request.user.username:
            try:
                userinfo = Userinfo.objects.get(username=username)
            except:
                re['error'] = error(110, 'user do not exist')
                re['username'] = username
            else:
                userinfo.username = request.POST.get('username', '')
                userinfo.email = request.POST.get('email', '')
                userinfo.position_type = request.POST.get('position_type', '')
                userinfo.work_city = request.POST.get('work_city', '')
                userinfo.cellphone = request.POST.get('cellphone', '')
                userinfo.university = request.POST.get('university', '')
                userinfo.major = request.POST.get('major', '')
                userinfo.grade = request.POST.get('grade', '')
                userinfo.gender = request.POST.get('gender', '')
                userinfo.work_days = request.POST.get('work_days', '')
                userinfo.description = request.POST.get('description', '')
                userinfo.update_time = datetime_now()
                userinfo.save()

                user = User.objects.get(username=username)
                user.email = userinfo.email
                user.save()

                re['userinfo'] = json.loads(userinfo.to_json())
                re['error'] = error(1, 'updated successfully')
        else:
            re['error'] = error(111, 'no change permissions')
    else:
        re['error'] = error(2, 'erroe，need post')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def get_companyinfo(request):
    re=dict()
    if request.method == "GET":
        username=request.user.username
        try:
            companyinfo=Companyinfo.objects.get(username=username)
        except:
            re["error"] = error(110,"company dose not exist!")
            re["username"] = username
        re['company'] = json.loads(companyinfo.to_json())
        re['error'] = error(1, 'get succeed')
    else:
        re["error"] = error(2,"error,need GET!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

#todo: this function is not completed!!
@user_permission("login")
def set_companyinfo(request):
    re=dict()
    if request.method == "POST":
            username=request.POST.get('username','')
            if username == request.user.username:
                try:
                    companyinfo=Companyinfo.objects.get(username=username)
                except:
                    re['error'] = error(110, 'companyinfo do not exist')
                    re['username'] = username
                else:
                    companyinfo.username = request.POST.get('username', '')
                    companyinfo.contacts = request.POST.get('contacts', '')
                    companyinfo.abbreviation = request.POST.get('abbreviation', '')
                    companyinfo.city = request.POST.get('city', '')
                    companyinfo.field = request.POST.get('field', '')
                    companyinfo.financing_info = request.POST.get('financing_info', '')
                    companyinfo.grade = request.POST.get('grade', '')
                    companyinfo.gender = request.POST.get('gender', '')
                    companyinfo.work_days = request.POST.get('work_days', '')
                    companyinfo.description = request.POST.get('description', '')
                    companyinfo.update_time = datetime_now()
            else:
                re['error'] = error(111,'no change permissions')
    else:
        re['error'] = error(2,"error,need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def create_financing_info(request):
    re=dict()
    if request.method == "POST":
        username = request.user.username
        try:
            companyinfo = Companyinfo.objects.get(username=username)
        except:
            re["error"] = error(110,"company dose not exist!")
        financing_info = Financing()
        financing_info.stage = request.POST.get('stage','')
        financing_info.organization = request.POST.get('organization','')
        financing_info.amount = request.POST.get('amount','')
        try:
            financing_info.save()
        except DatabaseError:
            re['error'] = error(250,'Database error: Failed to save')
        companyinfo.financing_info.append(financing_info)
        try:
            companyinfo.save()
            re['error'] = error(1,"financing_info created ")
        except DatabaseError:
            re['error'] = error(250,'Database error: Failed to save')

    else:
        re['error'] = error(2,"error, need post")
    return HttpResponse(json.dumps(re), content_type = 'application/json')


@user_permission("login")
def set_financing_info(requset,fin_id):
    pass

@user_permission("login")
def delete_financing_info(request,fin_id):
    pass

@user_permission("login")
def set_company_member(request,mem_id):
    re=dict()
    if request.method == 'POST':
        try:
            member = Member.objects.get(id=mem_id)
        except:
            re['error'] = error(112,"member dose not exist")
        #todo add permission!!!
        member.m_name = request.POST.get('m_name','')
        member.m_position = request.POST.get('m_position','')
        member.m_introduction = request.POST.get('m_introduction','')
        member.m_avatar_path = request.POST.get('m_avatar_path','')
        member.update()
        re['error'] = error(1, 'change member information successfully!')
        re['member'] = json.loads(member.to_json())
    else:
        re['error'] = error(2,"errer,need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def create_company_member(request):
    re = dict()
    if request.method == 'POST':
        username = request.user.username
        try:
            companyinfo = Companyinfo.objects.get(username=username)
            new_member = Member()
            new_member.m_name = request.POST.get('m_name','')
            new_member.m_position = request.POST.get('m_position','')
            new_member.m_introduction = request.POST.get('m_introduction','')
            new_member.m_avatar_path = request.POST.get('m_avatar_path','')
            new_member.save()
            companyinfo.team_info.append(new_member)
            companyinfo.save()
            re['error'] = error(1,'create new member successfully!')
            re['member'] = json.loads(new_member.to_json())
        except:
            re['error'] = error(110,"companyinfo dose not exist!")
    else:
        re['error'] = error(2,"error, need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def delete_company_member(requset,mem_id):
    pass
#todo add organization auth function (for admin)
