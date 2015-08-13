#coding=utf-8
from .models import *
from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.contrib import auth
from django.db import DatabaseError
from django.db.models import Q
from account.models import Companyinfo,Userinfo
from datetime import datetime, timedelta
from django.core.mail import EmailMessage
from StringIO import StringIO
import zipfile
import traceback
import time
from app.common_api import error,user_permission,if_legal

TYPE = ('technology','product','design','operate','marketing','functions','others')
FIELD = ('social','e-commerce','education','health_medical','culture_creativity','living_consumption','hardware','O2O','others')
STATUS = ('open','hidden','closed')
POSITIONS_PER_PAGE = 10

'''
def dump_position(posi):
    re = dict()
    re['name'] = posi.name
    re['type'] = posi.type
    re['work_city'] = posi.work_city
    re['work_address'] = posi.work_address
    re['release_time'] = int(time.mktime(posi.release_time.timetuple()))
    re['end_time'] = int(time.mktime(posi.end_time.timetuple()))
    re['position_description'] = posi.position_description
    re['position_request'] = posi.position_request
    re['daysperweek'] = posi.daysperweek
    re['internship_time'] = posi.internship_time
    re['salary_min'] = posi.salary_min
    re['salary_max'] = posi.salary_max
    re['delivery_number'] = posi.delivery_number
    re['status'] = posi.status
    return re
'''
def error(code, message):
    return {'code':code, 'message':message}

def if_legal(str,enter = False):
    str_uni = str.decode('utf8')
    for c in str_uni:
        if (c >= u'\u0021' and c <= u'\u00fe') or (c >= u'\u4e00' and c <= u'\u9fa5'):
            continue;
        if (c == u'\u000a' or c == u'\u000d' or c == u'\u0020') and enter:
            continue;
        raise ValueError,c
    return True

@user_permission('login')
def create_position(request):
    re = dict()
    cpn = Companyinfo()
    try:
        assert request.method == "POST"
    except:
        re['error'] = error(2, 'error, need post!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
        
    try:
        assert request.user != None
        assert request.user.is_staff
        cpn = Companyinfo.objects.get(user = request.user)
    except:
        re['error'] = error(100,"Permission denied!")
  
    name = request.POST.get('name','')
    position_type = request.POST.get('position_type','')
    work_city = request.POST.get('work_city','')
    work_address = request.POST.get('work_address','')
    release_time = datetime.now()
    et = request.POST.get('end_time','')
    position_description = request.POST.get('position_description','')
    position_request = request.POST.get('position_request','')
    days = request.POST.get('days_per_week','0')
    intime = request.POST.get('internship_time','0')
    samin = request.POST.get('salary_min','0')
    samax = request.POST.get('salary_max','1000000')
    status = request.POST.get("status","hidden")
    
    print "ok"
    
    try:
        assert len(name) in range(1,30)
        if_legal(name,False)
    except (AssertionError):
        re['error'] = error(210,'Position name is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(211,'Illeage character found in position name!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    print "check name ok"
    
    try:
        assert position_type in TYPE
    except (AssertionError):
        re['error'] = error(212,'Invaild position type')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert len(work_city) in range(1,50)
        if_legal(work_city,False)
    except (AssertionError):
        re['error'] = error(213,'Work city is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(214,'Illeage character found in work city!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    
    try:
        assert len(work_address) in range(1,100)
        if_legal(work_address,False)
    except (AssertionError):
        re['error'] = error(215,'The length of work address is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(216,'Illeage character found in work address!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        etint = int(et)
        end_time = datetime.utcfromtimestamp(etint)
        assert end_time > release_time
    except (ValueError):
        re['error'] = error(217,'Invaild end time format!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (AssertionError):
        re['error'] = error(218,'End time is too early!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    print "done0"
    
    try:
        assert len(position_description) in range(0,500)
        if_legal(position_description,True)
    except (AssertionError):
        re['error'] = error(219,'The length of description is too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(220,'Illegal character found in description!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert len(position_request) in range(0,500)
        if_legal(position_request,True)
    except (AssertionError):
        re['error'] = error(221,'The length of request is too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(222,'Illegal character found in request!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    print "done1"
    
    try:
        days_per_week = int(days)
        assert days_per_week in range(0,7)
    except (ValueError,AssertionError):
        re['error'] = error(223,'Invaild days perweek!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        internship_time = int(intime)
        assert internship_time >= 0
    except (ValueError,AssertionError):
        re['error'] = error(224,'Invaild internship time!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        salary_min = int(samin)
        assert salary_min in range(0,1000000)
    except (ValueError,AssertionError):
        re['error'] = error(225,'Invaild min salary!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    print 'done2'
    
    try:
        salary_max = int(samax)
        assert salary_max in range(0,1000000)
    except (ValueError,AssertionError):
        re['error'] = error(226,'Invaild max salary!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert salary_min < salary_max
    except:
        re['error'] = error(227,'Max salary should be more than min salary')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert status in STATUS
    except (AssertionError):
        re['error'] = error(228,'Invaild position status')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    posi = Position(name = name,position_type = position_type,work_city = work_city,work_address = work_address,
                    end_time = end_time,position_description = position_description,
                    position_request = position_request,days_per_week = days_per_week,
                    internship_time = internship_time,salary_min = salary_min,salary_max = salary_max,status = status, company = cpn)
    
    print "done3"
    
    try:
        posi.save()
    except (DatabaseError):
        re['error'] = error(250,'Database error: Failed to save')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    #except:
    #    re['error'] = error(299,'Unknown Error!')
    #    return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    re['error'] = error(1,'Create position succeed!')
    cpn.positions.append(posi)
    cpn.save()

    return HttpResponse(json.dumps(re),content_type = 'application/json')

@user_permission('login')
def delete_position(request,position_id):
    re = dict()
    try:
        assert request.method == "POST"
    except:
        re['error'] = error(2, 'error, need post!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    
    try:
        posi = Position.objects.get(id = position_id)
    except (ObjectDoesNotExist):
        re['error'] = error(249,"Object does not exist")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except (DatabaseError):
        re['error'] = error(251,"Database error: Failed to search!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert request.user != None
        assert request.user.is_staff
        cpn = Companyinfo.objects.get(user = request.user)
        assert posi in cpn.position    
    except:
        re['error'] = error(100,"Permission denied!")
    
    cpn.positions.remove(posi)
    cpn.save()

    try:
        posi.delete()
    except (DatabaseError):
        re['error'] = error(252,"Database error: Failed to delete!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
      
    re['error'] = error(1,'Delete position succeed!')
    return HttpResponse(json.dumps(re),content_type = 'application/json')

def search_position(request):
    re = dict()
    #try:
    #assert request.mothod == "GET"
    #except:
    #    re['error'] = error(3, 'error, need get!')
    #    return HttpResponse(json.dumps(re), content_type = 'application/json')
    
    qs = Position.objects.all()
    
    if "id" in request.GET.keys():
        if len(request.GET["id"]) > 0:
            try:
                id = request.GET["id"]
                qs = qs.filter(id = id)
            except (ValueError):
                re['error'] = error(230,"Invaild search id!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
      
    
    if "name" in request.GET.keys():
        if len(request.GET["name"]) > 0:
            try:
                name = request.GET["name"]
                assert len(name) < 30
                if_legal(name)
                qs = qs.filter(name = name)
            except (AssertionError, ValueError, UnicodeDecodeError):
                re['error'] = error(231,"Invaild search name!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    #types is a string which connected by ',' it is like "technology,design"
    if "types" in request.GET.keys():
        if len(request.GET["types"]) > 0:
            try:
                position_types = request.GET["types"]
                position_types = position_types.split(',')
                for position_type in position_types:
                    assert position_type in TYPE
                qs = qs.filter(position_type_in = position_types)
            except (AssertionError,ValueError,UnicodeDecodeError):
                re['error'] = error(238,"Invaild search type!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')

    #todo: tobe tested
    if "fields" in request.GET.keys():
        if len(request.GET["fields"]) > 0:
            try:
                fields = request.GET["fields"]
                fields = fields.split(',')
                for field in fields:
                    assert field in FIELD
                qs = qs.filter(company__field__in = fields)

            except (AssertionError,ValueError,UnicodeDecodeError):
                re['error'] = error(238,"Invaild search type!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')

    ##single
    #if "type" in request.GET.keys():
    #    if len(request.GET["type"]) > 0:
    #        try:
    #            position_type = request.GET["type"]
    #            assert position_type in TYPE
    #            qs = qs.filter(position_type = position_type)
    #        except (AssertionError,ValueError,UnicodeDecodeError):
    #            re['error'] = error(238,"Invaild search type!")
    #            return HttpResponse(json.dumps(re), content_type = 'application/json')
    #        except (DatabaseError):
    #            re['error'] = error(251,"Database error: Failed to search!")
    #            return HttpResponse(json.dumps(re), content_type = 'application/json')
    #        except:
    #            re['error'] = error(299,'Unknown Error!')
    #            return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    if "work_city" in request.GET.keys():
        if len(request.GET["work_city"]) > 0:
            try:
                work_city = request.GET["work_city"]
                assert len(work_city) < 50
                if_legal(work_city)
                qs = qs.filter(work_city = work_city)
            except (AssertionError,ValueError,UnicodeDecodeError):
                re['error'] = error(232,"Invaild search work city!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    if "mindays" in request.GET.keys():
        if len(request.GET["mindays"]) > 0:
            try:
                mindays = int(request.GET["mindays"])
                qs = qs.filter(days_per_week__gte = mindays)
            except (ValueError):
                re['error'] = error(233,"Invaild search min daysperweek!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    if "maxdays" in request.GET.keys():
        if len(request.GET["maxdays"]) > 0:
            try:
                maxdays = int(request.GET["maxdays"])
                qs = qs.filter(Q(days_per_week__lte = maxdays) | Q(days_per_week = 0))
            except (ValueError):
                re['error'] = error(234,"Invaild search max daysperweek!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    #todo: to be tested
    #"workdays" is a string, it is like "3,4,6,0" (0 is for flexible time)
    if "workdays" in request.GET.keys():
        if request.GET["workdays"] != 0:
            try:
                workdays = request.GET["workdays"]
                workdays = workdays.split(',')
                wd_list = []
                for workday in workdays:
                    wd_list.append(int(workday))
                qs = qs.filter(days_per_week_in = wd_list)
            except (ValueError):
                re['error'] = error(234,"Invaild search max daysperweek!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    if "salary_min" in request.GET.keys():
        if len(request.GET["salary_min"]) > 0:
            try:
                sa_min = int(request.GET["salary_min"])
                qs = qs.filter(Q(salary_max__gte = sa_min) | Q(salary_max = 0))
            except (ValueError):
                re['error'] = error(235,"Invaild search min salary!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')

    if "salary_max" in request.GET.keys():
        if len(request.GET["salary_max"]) > 0:
            try:
                sa_max = int(request.GET["salary_max"])
                qs = qs.filter(salary_min__lte = sa_max)
            except (ValueError):
                re['error'] = error(236,"Invaild search max salary!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')

    if "status" in request.GET.keys():
        if len(request.GET["status"]) > 0:
            try:
                status = request.GET["status"]
                assert status in STATUS
                qs = qs.filter(status = status)
            except (AssertionError):
                re['error'] = error(237,"Invaild search status!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    
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
    qs.order_by(orderValue)
    qs = qs[(page - 1) * POSITIONS_PER_PAGE: page * POSITIONS_PER_PAGE]
    
    re["positions"] = json.loads(qs.to_json())
    re["error"] = error(1,"Search succeed!")
    return HttpResponse(json.dumps(re),content_type = 'application/json')


@user_permission("login")
def get_position(request,position_id):
    re = dict()
    p = Position.objects.get(id = position_id)
    re['position'] = json.loads(p.to_json())

    re["error"] = error(1,"Get succeed!")
    return HttpResponse(json.dumps(re),content_type = 'application/json')

@user_permission("login")
def update_position(request,position_id):
    re = dict()
    try:
        assert request.method == "POST"
    except:
        re['error'] = error(2, 'error, need post!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    
    '''
    try:
        id = int(request.POST['id'])
        assert id >= 0
    except (KeyError):
        re['error'] = error(200,"Illegal request!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except (ValueError,AssertionError):
        re['error'] = error(230,"Invaild search id!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    '''    
    try:
        posi = Position.objects.get(id = position_id)
    except (ObjectDoesNotExist):
        re['error'] = error(249,"Object does not exist")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except (DatabaseError):
        re['error'] = error(251,"Database error: Failed to search!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert request.user != None
        assert request.user.is_staff
        cpn = Companyinfo.objects.filter(user = request.user)
        assert posi in cpn.position    
    except:
        re['error'] = error(100,"Permission denied!")
    
    name = request.POST.get('name','')
    position_type = request.POST.get('type','')
    work_city = request.POST.get('work_city','')
    work_address = request.POST.get('work_address','')
    et = request.POST.get('end_time','')
    position_description = request.POST.get('position_description','')
    position_request = request.POST.get('position_request','')
    days = request.POST.get('days_per_week','0')
    intime = request.POST.get('internship_time','0')
    samin = request.POST.get('salary_min','0')
    samax = request.POST.get('salary_max','1000000')
    status = request.POST.get("status","hidden")
    
    try:
        assert len(name) in range(1,30)
        if_legal(name,False)
    except (AssertionError):
        re['error'] = error(210,'Position name is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(211,'Illeage character found in position name!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        assert position_type in TYPE
    except (AssertionError):
        re['error'] = error(212,'Invaild position type')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert len(work_city) in range(1,50)
        if_legal(work_city,False)
    except (AssertionError):
        re['error'] = error(213,'Work city is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(214,'Illeage character found in work city!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    
    try:
        assert len(work_address) in range(1,100)
        if_legal(work_address,False)
    except (AssertionError):
        re['error'] = error(215,'The length of work address is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(216,'Illeage character found in work address!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        etint = int(et)
        end_time = datetime.utcfromtimestamp(etint)
        assert end_time > datetime.now()
    except (ValueError):
        re['error'] = error(217,'Invaild end time format!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (AssertionError):
        re['error'] = error(218,'End time is too early!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    
    try:
        assert len(position_description) in range(0,500)
        if_legal(position_description,False)
    except (AssertionError):
        re['error'] = error(219,'The length of description is too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(220,'Illegal character found in work address!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert len(position_request) in range(0,500)
        if_legal(position_request,False)
    except (AssertionError):
        re['error'] = error(221,'The length of request is too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(222,'Illegal character found in request!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        days_per_week = int(days)
        print days_per_week
        assert days_per_week in range(0,7)
    except (ValueError,AssertionError):
        re['error'] = error(223,'Invaild days perweek!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        internship_time = int(intime)
        assert internship_time >= 0
    except (ValueError,AssertionError):
        re['error'] = error(224,'Invaild internship time!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        salary_min = int(samin)
        assert salary_min in range(0,1000000)
    except (ValueError,AssertionError):
        re['error'] = error(225,'Invaild min salary!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        salary_max = int(samax)
        assert salary_max in range(0,1000000)
    except (ValueError,AssertionError):
        re['error'] = error(226,'Invaild max salary!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert salary_min < salary_max
    except:
        re['error'] = error(227,'Max salary should be more than min salary')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert status in STATUS
    except (AssertionError):
        re['error'] = error(228,'Invaild position status')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    posi.name = name
    posi.position_type = position_type
    posi.work_city = work_city
    posi.work_address = work_address
    posi.end_time = end_time
    posi.position_description = position_description
    posi.position_request = position_request
    posi.days_per_week = days_per_week
    posi.internship_time = internship_time
    posi.salary_min = salary_min
    posi.salary_max = salary_max
    posi.status = status
    
    try:
        posi.save()
    except (DatabaseError):
        re['error'] = error(250,'Database error: Failed to save')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unknown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    re['error'] = error(1,'Update position succeed!')
    return HttpResponse(json.dumps(re),content_type = 'application/json')
    
'''
def edit_position(request):
    re = dict()
    try:
        assert request.method == "POST"
    except:
        re['error'] = error(2, 'error, need post!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
   
    try:
        assert request.POST['operation'] == 'delete' or request.POST['operation'] == 'update'
    except:
        re['error'] = error(200,"Invaild request!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    
    if request.POST['operation'] == 'delete':
        return delete_position(request)
    
    if request.POST['operation'] == 'update':
        return update_position(request)
'''

@user_permission('login')
def submit_resume(request,position_id):
    re = dict()
    if request.method == 'POST':
        try:
            username = request.user.username
            userinfo = Userinfo.objects.get(username = username)
        except:
            re['error'] = error(110, 'User do not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        resume_choice = request.POST.get('resume_choice', '1')
        
        # use the long-term resume
        if resume_choice == '1': 
            if userinfo.resume: 
                resume = userinfo.resume.value
            else:
                re['error'] = error(120, 'Resume does not exist')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
        # use the resume uploaded
        elif resume_choice == '2': 
            file_obj = request.FILES.get('file', None)
            if file_obj:
                if file_obj.size > 10000000:
                    re['error'] = error(15, 'Error, file size is bigger than 10M!')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                else:
                    resume = file_obj
            else:
                re['error'] = error(19, 'File is empty')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
        
        try:
            position = Position.objects.get(id = position_id)    
        except:
            re['error'] = error(260, 'Position does not exist') 
            return HttpResponse(json.dumps(re), content_type = 'application/json')

        submit_date = datetime.now()
        UP = UserPosition(submit_date = submit_date, resume_submitted = resume, position = position, user = request.user)
        UP.save()
        re['error'] = error(1, 'Success!')
    else:
        re['error'] = error(2, 'Error, need post!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def email_resume(request):
    re = dict()

    '''
    if not request.user.is_superuser:
        re['error'] = error(100,"Permission denied!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    ''' 

    t = datetime.now()
    # 8am Today
    time_end = datetime(year=t.year, month=t.month, day=t.day, hour=8)
    time_delta = timedelta(days=1)
    # 8am Yesterday
    time_start = time_end - time_delta
    
    for company in Companyinfo.objects.all():
        f_company = StringIO()
        zip_company = zipfile.ZipFile(f_company, 'w', zipfile.ZIP_DEFLATED)
        
        for position in company.positions: 
            f_position = StringIO()
            zip_position = zipfile.ZipFile(f_position, 'w', zipfile.ZIP_DEFLATED)

            empty = True
            for up in UserPosition.objects.filter(position = position, submit_date__gte = time_start, submit_date__lte = time_end): 
                empty = False
                zip_position.writestr('%s.pdf' % up.user.username, up.resume_submitted.read())
            zip_position.close()
            
            if not empty:
                zip_company.writestr('%s.zip' % position.name, f_position.getvalue())

        zip_company.close()

        mail = EmailMessage('[创+]简历%s' % time.strftime('%Y%m%d'), '附件为昨天8am至今天8am之间投递到您公司的简历。', 'support@chuangplus.com', [company.email_resume]);
        mail.attach('%s.zip' % company.abbreviation, f_company.getvalue(), 'application/zip')
        mail.send()
        re['error'] = error(1,"Send success")
        return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission("login")
def user_like_position(request,position_id):
    re = dict()
    if request.method == 'POST':
        try:
            position = Position.objects.get(id = position_id)    
        except:
            re['error'] = error(260, 'Position does not exist') 
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        
        up = UP_Relationship(position = position, user = request.user)
        up.save()
        re['error'] = error(1, "success!")
    else:
        re['error'] = error(2, 'error, need POST!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

