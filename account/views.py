#coding=utf-8
import sys
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib import auth
from app.common_api import error,user_permission
from django.db import DatabaseError
from django.core.mail import send_mail
from random import randint
from django.db.models import Q
import traceback

# Create your views here.
from .models import *
from position.models import *
from app.common_api import check_email


def register(request):
    re=dict()
    if request.method == "POST":
        #Validate the captcha
        session_captcha = request.session.get('captcha', '')
        request_captcha = request.POST.get('captcha','')

        if session_captcha == '' or request_captcha == '':    
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
            reguser = User()
            #todo validate the email
            try:
                reguser = User.create_user(username=username, password=password, email=email)
            except Exception as e:
                #print traceback.print_exc()
                re['error'] = error(107, 'Username exist or username include special character')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            if reguser is not None and role == "1":
                reguser.is_staff = True
                reguser.save()
                companyinfo = Companyinfo(username=username)
                companyinfo.user = reguser
                companyinfo.date_joined = datetime_now()
                companyinfo.update_time = datetime_now()
                companyinfo.hr_cellphone = request.POST.get('hr_cellphone', '')
                companyinfo.save()
                re['error'] = error(1, 'company user registered!')
            elif reguser is not None and role == "0":
                userinfo = Userinfo(username=username)
                userinfo.email = email
                userinfo.date_joined = datetime_now()
                userinfo.update_time = datetime_now()
                userinfo.user = reguser
                userinfo.save()
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

#login
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
        role = request.POST.get('role','0')
        if username == '' or password == "":
            re['error'] = error(111,"username or password is empty")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            if user.is_staff == True and role == '0':
                re['error'] = error(113,'Role error,turn hr tab to login')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            elif user.is_staff == False and role == '1':
                re['error'] = error(114,'Role error,turn intern tab to login')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            re['username'] = username
            auth.login(request, user)
            user = User.objects.get(username=username)
            request.session['role'] = 1 if user.is_staff else 0
            re['error'] = error(1, 'login succeed!')
            #re['status'] = request.session['status']
            re['role'] = request.session['role']
            resp = HttpResponse(json.dumps(re), content_type = 'application/json')
            resp.set_cookie('username', username)
            resp.set_cookie('role',request.session['role'])
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
            re['error'] = error(103, 'user does not exist')
        re['data'] = json.loads(userinfo.to_json())
        re['error'] = error(1, 'get succeed')
    else:
        re['error'] = error(2, 'error, need get')
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
def check_userinfo_complete(request):
    re = dict()
    if request.method == "GET":
        u = Userinfo.objects.get(username=request.user.username)
        if u.position_type and u.work_city\
        and u.cellphone and u.university\
        and u.major and u.grade\
        and u.gender and u.work_days and u.description\
        and u.resume_id and u.real_name:
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

def get_companyinfo_detail(request,company_id):
    re=dict()
    if request.method == "GET":
        try:
            companyinfo = Companyinfo.objects.get(id=company_id)
        except:
            re["error"] = error(105,"company does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        position_list = []
        for position in companyinfo.positions:
            try:
                position_info = Position.objects.get(id=position.id)
            except DoesNotExist:
                re['error'] = error(260,'Position does not exist')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            position_list.append(json.loads(position_info.to_json()))

        re['data'] = json.loads(companyinfo.to_json())
        re['data']['position_list'] = position_list
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
        c.ICregist_name = request.POST.get('ICregist_name', c.ICregist_name)
        c.company_description = request.POST.get('company_description', c.company_description)
        c.product_description = request.POST.get('product_description', c.product_description)
        c.team_description = request.POST.get('team_description', c.team_description)
        c.slogan = request.POST.get('slogan', c.slogan)
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
        and c.ICregist_name and c.company_description:
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
            except DoesNotExist:
                re['error'] = error(105,'Companyinfo dose not exist')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            company_favor_list.append(json.loads(company.to_json()))
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
            re['error'] = error(112,"financing_info does not exist!")
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
            Userinfo.objects.get(email = email)
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
            re['error'] = error(2, 'Email sending failed')
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

def get_company_list(request):
    re = dict()
    if request.method == 'GET':
        text = request.GET.get('text', '')
        field = request.GET.get('field', '')
        auth_organization = request.GET.get('auth_organization', '')
        scale = request.GET.get('scale', '')
        status = request.GET.get('status', '')

        companies = Companyinfo.objects.all()

        if text != '':
            companies = companies.filter(
                Q(abbreviation__icontains = text) | 
                Q(ICregist_name__icontains = text))
        if field != '':
            companies = companies.filter(field = field)
        if auth_organization != '':
            companies = companies.filter(auth_organization = auth_organization)
        if scale != '':
            companies = companies.filter(scale = int(scale))
        if status != '':
            companies = companies.filter(status = bool(status))
            
        re['error'] = error(1, "get company list successfully")
        re['data'] = json.loads(companies.to_json())
    else:
        re['error'] = error(2, 'error, need POST!')
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
