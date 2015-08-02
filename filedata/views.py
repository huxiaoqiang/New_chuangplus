# -*- coding: utf-8 -*-
from models import *
from django.http import HttpResponse
from app.common_api import user_permission,error
from account.models import Member,Companyinfo,Userinfo
from django.db import DatabaseError
import json
import re

# Create your views here.

@user_permission('login')
def upload_file(request):
    re = dict()
    if request.method == 'POST':
        file_type = request.POST.get('file_type','')
        if file_type not in ['member_avatar','qr_code','resume']:
            re['error'] = error(4,'params error!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        id = request.POST.get('id', '')
        description = request.POST.get('description', '')
        file_obj = request.FILES.get('file', None)
        if file_obj:
            if file_obj.size > 10000000:
                re['error'] = error(15,"error,file size is bigger than 10M!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            if file_type == "member_avatar":
                try:
                    member = Member.objects.get(id=id)
                except:
                    re['error'] = error(16,'member dose not exist,fail to upload!')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                try:
                    f = File.objects.get(file_type=file_type,id=id)
                except:
                    f = File(file_type=file_type,id=id)
                    f.value.put(file_obj.read(),content_type=file_obj.content_type)
                else:
                    f.value.replace(file_obj.read(),content_type=file_obj.content_type)
                f.name = file_obj.name
                f.description = description
                try:
                    f.save()
                except DatabaseError:
                    re['error'] = error(250,'Database error: Failed to get companyinfo')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                try:
                    member.m_avatar = f
                    member.save()
                except DatabaseError:
                    re['error'] = error(250,'Database error: Failed to save companyinfo!')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                re['error'] = error(1,"file upload successfully")
                re['data'] = str(f.id)
            elif file_type == 'qr_code':
                try:
                    companyinfo = Companyinfo.objects.get(id=id)
                except:
                    re['error'] = error(17,"company dose not exist,fail to upload file!")
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                else:
                    if companyinfo.username != request.user.username:
                        re['error'] = error(18,'no permission to upload,fail to upload file!')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    try:
                        f = File.objects.get(file_type=file_type,id=id)
                    except:
                        f = File(file_type=file_type,id=id)
                        f.value.put(file_obj.read(),content_type=file_obj.content_type)
                    else:
                        f.value.replace(file_obj.read(), content_type=file_obj.content_type)
                    f.name = file_obj.name
                    f.description = description
                    try:
                        f.save()
                    except DatabaseError:
                        re['error'] = error(250,'Database error: Failed to save file!')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    try:
                        companyinfo.qrcode = f
                        companyinfo.save()
                    except DatabaseError:
                        re['error'] = error(250,'Database error: Failed to save companyinfo!')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    re['error'] = error(1, 'file upload successfully')
                    re['data'] = str(f.id)

            elif file_type == 'resume':
                try:
                    username = request.user.username
                    userinfo = Userinfo.objects.get(username=username)
                except:
                    re['error'] = error(110,"user dose not exist!")
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                else:
                    try:
                        f = File.objects.get(file_type = file_type,id=id)
                    except:
                        f = File(file_type=file_type,id=id)
                        f.value.put(file_obj.read(),content_type=file_obj.content_type)
                    else:
                        f.value.replace(file_obj.read(),content_type=file_obj.content_type)
                    f.name = file_obj.name
                    f.description = description
                    try:
                        f.save()
                    except DatabaseError:
                        re['error'] = error(250,'Database error: Failed to save file!')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    try:
                        Userinfo.resume = f
                        Userinfo.save()
                    except DatabaseError:
                        re['error'] = error(250,'Database error: Failed to save companyinfo!')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    re['error'] = error(1, 'file upload successfully')
                    re['data'] = f.id
    else:
        re['error'] = error(2,"error, need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def download_file(request,file_id):
    re = dict()
    if request.method == "GET":
        try:
            file = File.objects.get(id=file_id)
        except:
            re['error'] = error(20,'file does not exist!fail to download file')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        resp = HttpResponse(file.value.read(), content_type=file.value.content_type)
        from urllib import quote_plus
        resp['Content-Disposition'] = 'attachment; filename="' + quote_plus(unicode(file.name).encode('utf8')) + '"'
        return resp
    else:
        re['error'] = error(3,"error, need GET")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_filelist(request):
    re = dict()

def delete_file(request,file_id=''):
    re = dict()
    if request.method ==  'POST':
        #only the superuser can delete file
        if request.user.is_superuser == True:
            try:
                f = File.objects.get(id=file_id)
            except:
                re['error'] = error(31,'file dose not exist, fail to delete the file!')
            else:
                f.value.delete()
                f.delete()
                re['error'] = error(1,'delete file successfully!')
        else:
            re['error'] = error(30,'no permission to delete the file!')
    else:
        re['error'] = error(2,'error, need POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')


@user_permission('login')
def delete_file(request,file_id):
    pass

@user_permission('login')
def submit_resume(request):
    re = dict()
    if request.method == 'POST':
        username = request.user.username
        try:
            userinfo = Userinfo.objects.get(username = username)
        except:
            re['error'] = error(110, 'user do not exist')

        resume_choice = request.POST.get('resume_choice', '1')
        if resume_choice == '1': # use the long-term resume
            if userinfo.has_resume:
                pass
            else:
                re['error'] = error(120, 'Resume does not exist')

        elif resume_choice == '2': # use the resume uploaded
            pass
    else:
        re['error'] = error(2, 'error, need post!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

