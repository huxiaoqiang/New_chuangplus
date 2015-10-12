#coding=utf-8
from .models import *
from filedata.models import *
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
STATUS = ('open','closed')
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
        #todo change here
        #cpn = Companyinfo.objects.get(user = request.user)
        cpn = Companyinfo.objects.get(username = request.user.username)
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
    poft = request.POST.get('part_or_full_time','0')
    status = request.POST.get("status","open")
    
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
        assert len(work_address) in range(1,100)
        if_legal(work_address,False)
    except (AssertionError):
        re['error'] = error(215,'The length of work address is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(216,'Illeage character found in work address!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        end_time = datetime.strptime(et,'%Y-%m-%d')
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
#        if_legal(position_description,True)
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
#        if_legal(position_request,True)
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
        part_or_full_time = int(poft)
        assert part_or_full_time in range(0,2)
    except (AssertionError):
        re['error'] = error(263,'Position can only be part time or full time')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        assert status in STATUS
    except (AssertionError):
        re['error'] = error(228,'Invaild position status')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    posi = Position(name = name,position_type = position_type,work_address = work_address,
                    end_time = end_time,position_description = position_description,
                    position_request = position_request,days_per_week = days_per_week,
                    internship_time = internship_time,salary_min = salary_min,salary_max = salary_max,part_or_full_time=part_or_full_time,status = status, company = cpn)
    
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
def get_company_position_list(request,company_id):
    re=dict()
    try:
        assert request.method == "GET"
    except:
        re['error'] = error(3,'error, need get!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    try:
        company = Companyinfo.objects.get(id=company_id)
        position_list = company.positions
    except ObjectDoesNotExist:
        re['error'] = error(249,"Object does not exist")
        return HttpResponse(json.dumps(re), content_type = 'application/json')

    datalist = []
    for position in position_list:
        datalist.append(json.loads(position.to_json()))
    re['data'] = datalist
    re['error'] = error(1,'get company position list successfully!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def delete_position(request,position_id):
    re = dict()
    try:
        assert request.method == "GET"
    except:
        re['error'] = error(3, 'error, need get')
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
    ##cpn = Companyinfo.objects.all()
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
                qs = qs.filter(name__contains = name)
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
                qs = qs.filter(position_type__in = position_types)
            except (AssertionError,ValueError,UnicodeDecodeError):
                re['error'] = error(238,"Invaild search type!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')

    ##todo: tobe tested
    if "fields" in request.GET.keys():
        if len(request.GET["fields"]) > 0:
            try:
                fields = request.GET["fields"]
                fields = fields.split(',')
                for field in fields:
                    assert field in FIELD
                cmp = Companyinfo.objects(field__in = fields)
                qs = qs.filter(company__in = cmp)
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
                qs = qs.filter(days_per_week__in = wd_list)
            except (ValueError):
                re['error'] = error(234,"Invaild search max daysperweek!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except (DatabaseError):
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unknown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')

    if "min_workday" in request.GET.keys():
        if request.GET["min_workday"] != 0:
            try:
                min_workday = request.GET["min_workday"]
                qs = qs.filter(days_per_week__gte  = min_workday)
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
                qs = qs.filter(salary_max__gte = sa_min)
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

    if "part_or_full_time" in request.GET.keys():
        if request.GET["part_or_full_time"] != '0' or request.GET["part_or_full_time"] != '1':
            re['error'] = error(262,'Position can only be part time or full time')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        else:
            try:
                poft = request.GET["part_or_full_time"]
                part_or_full_time = int(poft)
                qs = qs.filter(part_or_full_time = part_or_full_time)
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
    #todo fen ye
    orderValue = "id"
    qs.order_by(orderValue)
    shang = qs.count() / POSITIONS_PER_PAGE
    yushu = 1 if qs.count() % POSITIONS_PER_PAGE else 0
    page_number =  shang + yushu
    qs = qs[(page - 1) * POSITIONS_PER_PAGE: page * POSITIONS_PER_PAGE]
    positions = json.loads(qs.to_json())

    for position in positions:
        try:
            #print position["company"]["$oid"]
            company = Companyinfo.objects.get(id=position["company"]["$oid"])
            position["company"] = json.loads(company.to_json())
        except DoesNotExist:
            re['error'] = error(105,'Companyinfo does not exist!')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
    re['positions'] = positions
    re['page_number'] = page_number
    re['page'] =page
    re["error"] = error(1,"Search succeed!")
    return HttpResponse(json.dumps(re),content_type = 'application/json')



def get_position_with_company(request,position_id):
    re = dict()
    if request.method == "GET":
        try:
            position = Position.objects.get(id = position_id)
        except DoesNotExist:
            re['error'] = error(260,'Position does not exist')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        try:
            company = Companyinfo.objects.get(id=position.company.id)
        except:
            re['error'] = error(105,'Companyinfo does not exist!')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        re['data'] = json.loads(position.to_json())
        companie_re = json.loads(company.to_json())
        position_type = []
        for p in companie_re['positions']:
            try:
                position = Position.objects.get(id=p['$oid'])
            except DoesNotExist:
                re['error'] = error(260,'Position does not exist')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            if position.position_type not in position_type:
                position_type.append(position.position_type)
        companie_re['position_type'] = position_type
        re['data']['company'] = companie_re
        re["error"] = error(1,"Get position succeed!")
    else:
        re['error'] = error(2,'error, need get!')
    return HttpResponse(json.dumps(re),content_type = 'application/json')

@user_permission("login")
def get_position(request,position_id):
    re = dict()
    if request.method == "GET":
        try:
            position = Position.objects.get(id = position_id)
            re['data'] = json.loads(position.to_json())
            re["error"] = error(1,"Get position succeed!")
        except DoesNotExist:
            re['error'] = error(260,'Position does not exist')
    else:
        re['error'] = error(2,'error, need get!')
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
    position_type = request.POST.get('position_type','')
    work_address = request.POST.get('work_address','')
    et = request.POST.get('end_time','')
    position_description = request.POST.get('position_description','')
    position_request = request.POST.get('position_request','')
    days = request.POST.get('days_per_week','0')
    intime = request.POST.get('internship_time','0')
    samin = request.POST.get('salary_min','0')
    samax = request.POST.get('salary_max','1000000')
    part_or_full_time = request.POST.get('part_or_full_time','0')
    status = request.POST.get("status","open")
    
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
        assert len(work_address) in range(1,100)
        if_legal(work_address,False)
    except (AssertionError):
        re['error'] = error(215,'The length of work address is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (UnicodeDecodeError,ValueError):
        re['error'] = error(216,'Illeage character found in work address!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        end_time = datetime.strptime(et,'%Y-%m-%d')
        assert end_time > datetime.now()
    except (ValueError):
        re['error'] = error(217,'Invaild end time format!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except (AssertionError):
        re['error'] = error(218,'End time is too early!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    
    try:
        assert len(position_description) in range(0,500)
        #if_legal(position_description,False)
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
        #if_legal(position_request,False)
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
        assert int(part_or_full_time) in range(0,2)
    except (AssertionError):
        re['error'] = error(262,'Position can only be part time or full time')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        assert status in STATUS
    except (AssertionError):
        re['error'] = error(228,'Invaild position status')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    posi.name = name
    posi.position_type = position_type
    posi.work_address = work_address
    posi.end_time = end_time
    posi.position_description = position_description
    posi.position_request = position_request
    posi.days_per_week = days_per_week
    posi.internship_time = internship_time
    posi.salary_min = salary_min
    posi.salary_max = salary_max
    posi.part_or_full_time = int(part_or_full_time)
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
            if userinfo.resume_id:
                try:
                    r = File.objects.get(id=userinfo.resume_id) 
                    resume = r.value
                except:
                    re['error'] = error(120, 'Resume does not exist')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
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
        elif resume_choice == '3':
            resume = None 

        try:
            position = Position.objects.get(id = position_id)    
        except:
            re['error'] = error(260, 'Position does not exist') 
            return HttpResponse(json.dumps(re), content_type = 'application/json')


        try:
            UP = UserPosition.objects.get(position = position, user = request.user)
            re['error'] = error(266,'Already submit the position');
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        except DoesNotExist:
            submit_date = datetime.now()
            position.submit_num = position.submit_num+1
            position.save()
            UP = UserPosition(company = position.company, submit_date = submit_date, resume_submitted = resume, position = position, user = request.user)
            UP.save()
        re['error'] = error(1, 'Success!')
    else:
        re['error'] = error(2, 'Error, need post!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def check_submit(request,position_id):
    re = dict()
    if request.method == 'GET':
        try:
            position = Position.objects.get(id=position_id)
        except DoesNotExist:
            re['error'] = error(260,'Position does not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            up = UserPosition.objects.get(user = request.user,position = position)
            re['exist'] = True
        except DoesNotExist:
            re['exist'] = False
        re['error'] = error(1,'Response succeed!')
    else:
        re['error'] = error(3,'Error,need GET')
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
        try:
            up = UP_Relationship.objects.get(user=request.user,position = position)
        except DoesNotExist:
            up = UP_Relationship(position = position, user = request.user)
            position.attention_num = position.attention_num + 1
            position.save()
        up.save()
        re['error'] = error(1, "success!")
    else:
        re['error'] = error(2, 'error, need POST!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def user_unlike_position(request,position_id):
    re = dict()
    if request.method == 'POST':
        try:
            position = Position.objects.get(id = position_id)
        except:
            re['error'] = error(260, 'Position does not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            up = UP_Relationship.objects.get(position = position, user = request.user)
        except DoesNotExist:
            re['error'] = error(261,'UP_Relationship does not exist')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        try:
            up.delete()
            position.attention_num = position.attention_num - 1
            position.save()
            re['error'] = error(1,'detele UP_Relationship successfully')
        except DatabaseError:
            re['error'] = error(252,"Database error: Failed to delete!")
            return HttpResponse(json.dumps(re), content_type = 'application/json')
    else:
        re['error'] = error(2,'error, need post!')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def close_position(request,position_id):
    re = dict()
    if request.method == 'POST':
        try:
            position = Position.objects.get(id=position_id)
        except DoesNotExist:
            re['error'] = error(260,'Position does not exist!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        position.status = 'closed'
        position.save()
        re['error'] = error(1,'succeed!')
    else:
        re['error'] = error(2,'Error, need POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

@user_permission('login')
def open_position(request,position_id):
    re = dict()
    if request.method == 'POST':
        try:
            position = Position.objects.get(id=position_id)
        except DoesNotExist:
            re['error'] = error(260,'Position does not exist!')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        position.status = 'open'
        position.save()
        re['error'] = error(1,'succeed!')
    else:
        re['error'] = error(2,'Error, need POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def test(request):
    re = dict()
    if request.method == "GET":
        UP = UserPosition.objects.all()
        for i in UP:
            print i.user.username + " " + str(i.position.id)
    else:
        re['error'] = error(3,"Error, need Get")
    return HttpResponse(json.dumps(re),content_type = 'application/json')
    

  


#def check_position_status(request):

