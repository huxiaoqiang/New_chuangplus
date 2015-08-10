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

def register(request):
    re=dict()
    if request.method == "POST":
        #Validate the captcha
        try:
            session_captcha = request.session.get('captcha', False)
            request_captcha = request.POST.get('captcha','')
        except KeyError:
            re['error'] = error(100,"Need captcha!")
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
            find_user_email = User.objects.get(email=email)
            if find_user_email is not None:
                re['error'] = error(115,"Email has been registed")
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
                reguser.is_staff == True
                reguser.save()
                companyinfo = Companyinfo(username=username)
                companyinfo.user = reguser
                companyinfo.date_joined = datetime_now()
                companyinfo.update_time = datetime_now()
                companyinfo.save()
            elif reguser is not None and role == "0":
                userinfo = Userinfo(username=username)
                userinfo.email = email
                userinfo.date_joined = datetime_now()
                userinfo.update_time = datetime_now()
                userinfo.user = reguser
                userinfo.save()
            #elif role == -1:
            #    reguser.is_superuser = True
            #    reguser.save()
            user = auth.authenticate(username=username, password=password)
            if user is not None and user.is_active:
                auth.login(request, user)
                request.session['role'] = int(role)
                #request.session['status'] = userinfo.status
                #request.session['practice_code'] = userinfo.practice_code
                re['error'] = error(1, 'regist succeed!')
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
            re['username'] = {'exist': 'ture'}
        else:
            re['username'] = {'exist': 'false'}
    else:
        re['error'] = error(2,"error, need POST!")
    return  HttpResponse(json.dumps(re), content_type = 'application/json')

def check_email(request):
    re = dict()
    if request.method == "POST":
        email = request.POST.get('email','')
        if email == "":
            re['error'] = error(102,'Need post email')
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
        role = request.POST.get('role','')
        if username == '' or password == "":
            re['error'] = error(111,"username or password is empty")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            if user.is_staff == '1' and role == '0':
                re['error'] = error(113,'Role error,turn hr tab to login')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            elif user.is_staff == '0' and role == '1':
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
            re['error'] = error(103, 'user do not exist')
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
        u.real_name = request.POST.get('real_name', u.real_name)
        u.position_type = request.POST.get('position_type', u.position_type)
        u.work_city = request.POST.get('work_city', u.work_city)
        u.cellphone = request.POST.get('cellphone', u.cellphone)
        u.university = request.POST.get('university', u.university)
        u.major = request.POST.get('major', u.major)
        u.grade = request.POST.get('grade', u.grade)
        u.gender = request.POST.get('gender', u.gender)
        u.work_days = request.POST.get('work_days', u.work_days)
        u.description = request.POST.get('description', u.description)
        u.update_time = datetime_now()
        u.save()

        request.user.email = u.email
        request.user.save()

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
        and u.major and u.grade \
        and u.gender and u.work_days and u.description\
        and u.has_resume and u.real_name:
            u.info_complete = True
            u.save() 
    else:
        re["error"] = error(3,"error,need GET!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')
    
def get_companyinfo_detail(request,company_id):
    re=dict()
    if request.method == "GET":
        try:
            companyinfo=Companyinfo.objects.get(id=company_id)
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
        c = Companyinfo.objects.get(username=request.user.username)
        c.abbreviation = request.POST.get('abbreviation', c.abbreviation)
        c.city = request.POST.get('city', c.city)
        c.field = request.POST.get('field', c.field)
        c.scale = request.POST.get('scale', c.scale)
        c.stage = request.POST.get('scale', c.stage)
        c.homepage = request.POST.get('scale', c.homepage)
        c.wechat = request.POST.get('wechat', c.wechat)
        c.email_resume = request.POST('email_resume', c.email_resume)
        c.qrcode = request.POST.get('qrcode', c.qrcode)
        c.welfare_tags = request.POST.get('welfare_tags', c.welfare_tags)
        c.product_link = request.POST.get('product_link', c.product_link)
        c.ICregist_name = request.POST.get('ICregist_name', c.ICregist_name)
        c.company_descrition = request.POST.get('company_descrition', c.company_descrition)
        c.product_description = request.POST.get('product_description', c.product_description)
        c.team_description = request.POST.get('team_description', c.team_description)
        c.slogan = request.POST.get('slogan', c.slogan)
        c.update_time = datetime_now()
        c.save()
    else:
        re['error'] = error(2,"error,need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def check_companyinfo_complete(request):
    re = dict()
    if request.method == "GET":
        c = Companyinfo.objects.get(username=request.user.username)
        if c.city and c.field and c.scale and c.stage\
        and c.email_resume and c.welfare_tags and c.ICregist_name\ 
        and c.company_descrition:
            c.info_complete = True
            c.save() 
    else:
        re["error"] = error(3,"error,need GET!")
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

@user_permission("login")
def create_financing_info(request):
    re=dict()
    if request.method == "POST":
        username = request.user.username
        try:
            companyinfo = Companyinfo.objects.get(username=username)
        except:
            re["error"] = error(105,"companyinfo dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if request.user.is_staff == True or request.user.is_superuser == True:
            financing_info = Financing()
            financing_info.stage = request.POST.get('stage','')
            financing_info.organization = request.POST.get('organization','')
            financing_info.amount = request.POST.get('amount','')
            financing_info.company = companyinfo
            try:
                financing_info.save()
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to save')

            stage = financing_info.stage
            if stage == 'D_plus':
                scale = 2
            elif stage == 'A' or stage == 'B' or stage == 'C':
                scale = 1
            else:
                scale = 0

            if scale > companyinfo.scale:
                companyinfo.scale = scale
                companyinfo.save()

            re['error'] = error(1,"financing_info created ")
            re['data'] = json.loads(financing_info.to_json())
        else:
            re['error'] = error(100,"permission denied!")
    else:
        re['error'] = error(2,"error, need post")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_financinginfo_list(request,company_id):
    re = dict()
    if request.method == "GET":
        try:
            companyinfo = Companyinfo.objects.get(id=company_id)
        except:
            re["error"] = error(105,"company dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            financinginfo_list = Financing.objects.get(company = companyinfo)
        except DatabaseError:
            re['error'] = error(250,'Database error: Failed to get')
        re['data'] = json.loads(financinginfo_list.to_json())
        re['error'] = error(1,"get financinginfo_list successfully")
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
            re['error'] = error(112,"financing_info dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if request.user.is_staff == True or request.user.is_superuser == True:
            financing_info.stage = request.POST.get("stage","")
            financing_info.organization = request.POST.get("organization","")
            financing_info.amount = request.POST.get("amount","")
            try:
                financing_info.update()
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to save')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
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
        if request.user.is_staff == True or request.user.is_superuser == True:
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
            re['error'] = error(105,"companyinfo dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if request.user.is_staff == True or request.user.is_superuser == True:
            new_member = Member()
            new_member.m_name = request.POST.get('m_name','')
            new_member.m_position = request.POST.get('m_position','')
            new_member.m_introduction = request.POST.get('m_introduction','')
            new_member.m_avatar_path = request.POST.get('m_avatar_path','')
            new_member.company = companyinfo
            try:
                new_member.save()
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to save')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            re['error'] = error(1,'create new member successfully!')
            re['data'] = json.loads(new_member.to_json())
        else:
            re['error'] = error(100,"permission denied!")
    else:
        re['error'] = error(2,"error, need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_member_list(request,company_id):
    re=dict()
    if request.method == 'POST':
        try:
            companyinfo = Companyinfo.objects.get(id=company_id)
        except:
            re['error'] = error(105,"companyinfo dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            member_list = Member.objects.get(company=companyinfo)
        except DatabaseError:
             re['error'] = error(250,'Database error: Failed to save')
             return HttpResponse(json.dumps(re), content_type = 'application/json')
        re['error'] = error(1,"get memberlist successfully")
        re['data'] = json.loads(member_list.to_json())
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
            re['error'] = error(112,"member dose not exist")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if request.user.is_staff == True or request.user.is_superuser == True:
            member.m_name = request.POST.get('m_name','')
            member.m_position = request.POST.get('m_position','')
            member.m_introduction = request.POST.get('m_introduction','')
            member.m_avatar_path = request.POST.get('m_avatar_path','')
            try:
                member.update()
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
            re['error'] = error(112,"member dose not exist")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if request.user.is_staff == True or request.user.is_superuser == True:
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
            re['error'] = error(100,"Need captcha!")
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
    if request.method == 'POST':
        text = request.POST.get('text', '')
        field = request.POST.get('field', '')
        auth_organization = request.POST.get('auth_organization', '')
        scale = request.POST.get('scale', '')

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
            companies = companies.filter(scale = scale)
            
        re['error'] = error(1, "get company list successfully")
        re['data'] = json.loads(companies.to_json())
    else:
        re['error'] = error(2, 'error, need POST!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def user_like_company(request):
    re = dict()
    if request.method == 'POST':
        company_id = request.POST.get('company_id', '')
        try:
            company = Companyinfo.objects.get(id = company_id)
        except:
            re["error"] = error(105,"company does not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        
        user = Userinfo.objects.get(username = request.user.username)
        uc = UC_Relationship(company = company, user = user)
        uc.save()
        re['error'] = error(1, "success!")
    else:
        re['error'] = error(2, 'error, need POST!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')
