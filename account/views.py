#coding=utf-8
import sys
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib import auth
from app.common_api import error,user_permission
from django.db import DatabaseError
from django.core.mail import send_mail
from random import randint
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

        #todo
        #Validate and register information
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        email = request.POST.get('email', '')
        role=request.POST.get('role','')
        try:
            reguser = User.create_user(username=username, password=password, email=email)
        except Exception as e:
            print traceback.print_exc()
            re['error'] = error(107, 'username exist or username include special character')
        #todo care for role's type
        if role == 1:
            reguser.is_staff == True
            reguser.save()

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
        re['data'] = json.loads(userinfo.to_json())
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
            re['error'] = error(111, 'permission denied')
    else:
        re['error'] = error(2, 'erroe，need post')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

#todo get list
def get_company_list(request,field,scale,organization):
    re=dict()

    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_companyinfo_detail(request,compamy_id):
    re=dict()
    if request.method == "GET":
        try:
            companyinfo=Companyinfo.objects.get(id=compamy_id)
        except:
            re["error"] = error(110,"company dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        re['data'] = json.loads(companyinfo.to_json())
        re['error'] = error(1, 'get succeed')
    else:
        re["error"] = error(3,"error,need GET!")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

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
                    companyinfo.contacts = request.POST.get('contacts', '')
                    companyinfo.abbreviation = request.POST.get('abbreviation', '')
                    companyinfo.city = request.POST.get('city', '')
                    companyinfo.field = request.POST.get('field', '')
                    companyinfo.people_scale = request.POST.get('people_scale','')
                    companyinfo.wechat = request.POST.get('wechat','')
                    companyinfo.email_resume = request.POST('email_resume','')
                    companyinfo.qrcode = request.POST.get('qrcode','')
                    companyinfo.welfare_tags = request.POST.get('welfare_tags','')
                    companyinfo.product_link = request.POST.get('welfare_tags','')
                    companyinfo.product_description = request.POST.get('product_description','')
                    companyinfo.ICregist_name = request.POST.get('ICregist_name','')
                    companyinfo.company_descrition = request.POST.get('company_descrition','')
                    companyinfo.team_description = request.POST.get('team_description','')
                    companyinfo.position_type = request.POST.get('position_type','')
                    companyinfo.grade = request.POST.get('grade', '')
                    companyinfo.gender = request.POST.get('gender', '')
                    companyinfo.work_days = request.POST.get('work_days', '')
                    companyinfo.description = request.POST.get('description', '')
                    companyinfo.slogan = request.POST.get('slogan','')
                    companyinfo.update_time = datetime_now()
            else:
                re['error'] = error(111,'permission denied')
    else:
        re['error'] = error(2,"error,need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

#admin api: for modifying the companyinfo.status
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
            companyinfo.status = True
            try:
                companyinfo.save()
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to get companyinfo')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
        else:
            re['error'] = error(111, 'permission denied!')
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
            re["error"] = error(110,"company dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if request.user.is_staff == True or request.user.is_superuser == True:
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
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to save')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            try:
                companyinfo.financing_info.append(financing_info)
                companyinfo.save()
            except:
                re['error'] = error(250,'Database error: Failed to save')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            re['error'] = error(1,"financing_info created ")
            re['data'] = json.loads(financing_info.to_json())
        else:
            re['error'] = error(100,"permission denied!")
    else:
        re['error'] = error(2,"error, need post")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_financinginfo_list(request,compamy_id):
    re = dict()
    if request.method == "GET":
        try:
            companyinfo = Companyinfo.objects.get(id=compamy_id)
        except:
            re["error"] = error(110,"company dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            financinginfo_list = companyinfo.financing_info.all()
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
            re['error'] = error(110,"companyinfo dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        if request.user.is_staff == True or request.user.is_superuser == True:
            new_member = Member()
            new_member.m_name = request.POST.get('m_name','')
            new_member.m_position = request.POST.get('m_position','')
            new_member.m_introduction = request.POST.get('m_introduction','')
            new_member.m_avatar_path = request.POST.get('m_avatar_path','')
            try:
                new_member.save()
            except DatabaseError:
                re['error'] = error(250,'Database error: Failed to save')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            try:
                companyinfo.team_info.append(new_member)
                companyinfo.save()
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
            re['error'] = error(110,"companyinfo dose not exist!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            member_list = companyinfo.team_info.all()
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

#todo add organization auth function (for admin)

def send_email(request):
    re = dict()
    if request.method == 'POST':
        email = request.POST.get('email', '')
        if email == '':
            re['error'] = error(102, 'Need post email')
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
    
