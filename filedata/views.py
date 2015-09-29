# -*- coding: utf-8 -*-
from models import *
from django.http import HttpResponse
from app.common_api import user_permission,error
from account.models import Member,Companyinfo,Userinfo
from datetime import datetime
from django.db import DatabaseError
from PIL import Image
import json
import shutil
import io
import re
import os
import cStringIO
# Create your views here.
#todo:to be  moditied and tested
@user_permission('login')
def upload_file(request):
    re = dict()
    sizeBig = (256,256)
    ##sizeSmall = (50,50)
    if request.method == 'POST':
        data = request.POST.get('data','')
        data_dict = eval(data)
        file_type = data_dict['file_type']
        if file_type not in ['CEOavatar','memberavatar','qrcode','resume','logo']:
            re['error'] = error(4,'Parameter error')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        category = data_dict['category']
        description = data_dict['description']
        file_obj = request.FILES.get('file', None)
        if file_obj:
            re['error'] = error(1, 'Success')
            if file_obj.size > 10000000:
                re['error'] = error(15,"File size is bigger than 10M!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            if file_type in["memberavatar",'CEOavatar']:
                if data_dict.has_key('avatar_id'):
                    avatar_id = data_dict['avatar_id']
                image = Image.open(file_obj)
                #image.thumbnail(sizeBig)
                original_name = category+"old.png"
                image.save(original_name)
                file_obj2 = open(original_name,'rb')
                category2 = category + "_original"
                try:
                    f_original = File.objects.get(file_type = file_type,category = category2)
                except:
                    f_original = File(file_type = file_type,category = category2)
                    f_original.value.put(file_obj2.read(),content_type = file_obj.content_type)
                else:
                    f_original.value.replace(file_obj2.read(),content_type = file_obj.content_type)
                f_original.name = file_obj.name
                f_original.description = description
                try:
                    f_original.save()
                except:
                    re['error'] = error(250,'Database error: Failed to get companyinfo')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                #file_obj2.close()
                img = Image.open(original_name)
                img.thumbnail(sizeBig)
                thumb_name = category + "new.png"
                img.save(thumb_name)
                file_obj3 = open(thumb_name,"rb")
                try:
                    file_obj2.close()
                except:
                    print "file_obj2 close error!"
                try:
                    os.remove(original_name)
                except:
                    print "delete original error!"
                try:
                    id = category.split('_')[0]
                    companyinfo = Companyinfo.objects.get(id=id)
                except:
                    re['error'] = error(16,'Company does not exist,fail to upload member avatar')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                try:
                    f = File.objects.get(id = avatar_id)
                    f.value.replace(file_obj3.read(), content_type = file_obj.content_type)
                except:
                    f = File(file_type = file_type,category = category)
                    f.value.put(file_obj3.read(), content_type = file_obj.content_type)
                f.name = file_obj.name
                ##print "f.name " + f.name
                f.description = description
                try:
                    f.save()
                except DatabaseError:
                    re['error'] = error(250,'Database error: Failed to get companyinfo')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                re['error'] = error(1,"file upload successfully")
                re['data'] = str(f.id)
                #file_obj2.close()
                try:
                    file_obj3.close()
                except:
                    print "close file_obj3 error!"
                try:
                    os.remove(thumb_name)
                except:
                    print "delete thumb_name error!"
            elif file_type in['qrcode','logo']:
                image = Image.open(file_obj)
                original_name = category + "old.png"
                image.save(original_name)
                file_obj2 = open(original_name,'rb')
                category2 = category + "_original"
                try:
                    f_original = File.objects.get(file_type = file_type,category = category2)
                except:
                    f_original = File(file_type = file_type,category = category2)
                    f_original.value.put(file_obj2.read(),content_type = file_obj.content_type)
                else:
                    f_original.value.replace(file_obj2.read(),content_type = file_obj.content_type)
                f_original.name = file_obj.name
                f_original.description = description
               
                try:
                    f_original.save()
                except DatabaseError:
                    re['error'] = error(250,'Database error: Failed to save file!')
                    return HttpResponse(json.dumps(re),content_type = 'application/json')
                #file_obj2.close()
                img = Image.open(original_name)
                img.thumbnail(sizeBig)
                thumb_name = category+"new.png"
                img.save(thumb_name)
                file_obj3 = open(thumb_name,"rb")
                try:
                    file_obj2.close()
                except:
                    print "close file_obj2 error!"
                try:
                    os.remove(original_name)
                except:
                    print "remove original error!"
                try:
                    id = category.split('_')[0]
                    companyinfo = Companyinfo.objects.get(id=id)
                except:
                    re['error'] = error(17,"Company does not exist,fail to upload")
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                else:
                    if companyinfo.username != request.user.username:
                        re['error'] = error(18,'no permission to upload,fail to upload file!')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    try:
                        f = File.objects.get(file_type = file_type, category = category)
                    except:
                        f = File(file_type = file_type,category = category)
                        f.value.put(file_obj3.read(),content_type = file_obj.content_type)
                    else:
                        f.value.replace(file_obj3.read(), content_type = file_obj.content_type)
                    f.name = file_obj.name
                    f.description = description
                    try:
                        file_obj3.close()
                    except:
                        print "close file_obj3 error!"
                    try:
                        os.remove(thumb_name)
                    except:
                        print "remove thumb error!"
                    try:
                        f.save()
                    except DatabaseError:
                        re['error'] = error(250,'Database error: Failed to save file!')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    #file_obj3.close()
                    re['error'] = error(1, 'file upload successfully')
                    re['data'] = str(f.id)
            elif file_type == 'resume':
                username = request.user.username
                try:
                    userinfo = Userinfo.objects.get(username=username)
                except:
                    re['error'] = error(103,"user does not exist!")
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                else:
                    try:
                        f = File.objects.get(file_type = file_type,category=username)
                    except:
                        f = File(file_type = file_type,category=username)
                        f.value.put(file_obj.read(),content_type = file_obj.content_type)
                    else:
                        f.value.replace(file_obj.read(),content_type = file_obj.content_type)
                    f.name = file_obj.name
                    f.description = description
                    try:
                        f.save()
                    except DatabaseError:
                        re['error'] = error(250,'Database error: Failed to save file!')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    try:
                        userinfo.resume = f
                        userinfo.save()
                    except DatabaseError:
                        re['error'] = error(250,'Database error: Failed to save companyinfo!')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    re['error'] = error(1, 'file upload successfully')
                    re['data'] = str(f.id)
        else:
            re['error'] = error(19,'File is empty,fail to upload file')
            
    else:
        re['error'] = error(2,"error, need POST")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def download_file(request,file_id=""):
    re = dict()
    if request.method == "GET":
        try:
            file = File.objects.get(id = file_id)
        except:
            re['error'] = error(20,'File does not exist,fail to download file')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        resp = HttpResponse(file.value.read(), content_type = file.value.content_type)
        from urllib import quote_plus
        resp['Content-Disposition'] = 'attachment; filename="' + quote_plus(unicode(file.name).encode('utf8')) + '"'
        resp['filename'] = quote_plus(unicode(file.name).encode('utf8'))
        return resp
    else:
        re['error'] = error(3,"error, need GET")
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_filelist(request):
    re = dict()

@user_permission('login')
def delete_file(request,file_id):
    re = dict()
    if request.method ==  'POST':
        #only the superuser can delete file
        try:
            f = File.objects.get(id = file_id)
        except:
            re['error'] = error(31,'File does not exist, fail to delete the file')
        else:
            category  = f.category
            id = category.split('_')[0]
            l  = category.split('_')[1]
            #print l
            index = int(l)
            list = File.objects(description__contains = id).all()
            for i in list:
                if i.file_type in ["memberavatar","CEOavatar"]:
                    category_list = i.category.split('_')
                    index2 = category_list[1]
                    #print (index,index2)
                    try:
                        index_avatar = int(index2)
                        if index_avatar > index:
                            category_list[1] = str(index_avatar - 1)
                        category2 = '_'.join(category_list)
                        i.category = category2
                        i.save()
                    except:
                        pass
            f.value.delete()
            f.delete()
            #if f.file_type == 'memberavatar':
            #    [company_id,index] = f.category.split("_")
            #    index = int(index) + 1
            #    while 1:
            #        try:
            #            category = company_id + "_" + str(index)
            #            file = File.objects.get(file_type='memberavatar',category=category)
            #            c_index = int(file.category.split("_")[1])-1
            #            file.category = company_id + "_" + str(c_index)
            #            file.save()
            #            index = index + 1
            #        except DoesNotExist:
            #            break
            re['error'] = error(1,'delete file successfully!')
    else:
        re['error'] = error(2,'error, need POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')


def download_file_special(request, file_type='', category=''):
    re = ''
    if request.method == 'GET':
        if file_type in ['CEOavatar','memberavatar','qrcode','resume','logo']:
            files = File.objects(file_type=file_type, category=category)
            if files.count() > 1:
                for f in files[0:-1]:
                    f.value.delete()
                    f.delete()
                f = files[-1]
            elif files.count() == 1:
                f = File.objects.get(file_type=file_type, category=category)
            else:
                try:
                    f = File.objects.get(file_type=file_type, category='default_' + category.split('_')[-1])
                except:
                    re = u'文件不存在，下载失败'
                    return HttpResponse(re)
                else:
                    resp = HttpResponse(f.value.read(), content_type=f.value.content_type)
                    from urllib import quote_plus
                    resp['Content-Disposition'] = 'attachment; filename="' + quote_plus(unicode(f.name).encode('utf8')) + '"'
                    return resp

            resp = HttpResponse(f.value.read(), content_type=f.value.content_type)
            from urllib import quote_plus
            resp['Content-Disposition'] = 'attachment; filename="' + quote_plus(unicode(f.name).encode('utf8')) + '"'
            return resp
        else:
            re = '文件不存在，下载失败'
            return HttpResponse(re)
    else:
        re = '错误，需要GET'
    return HttpResponse(re)
