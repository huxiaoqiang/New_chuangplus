import sys
from .models import *
from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.contrib import auth
from django.db import DatabaseError
from django.db.models import Q
from account.models import Companyinfo


TYPE = ('technology','product','design','operate','marketing','functions','others')
STATUS = ('employing','hide','delete')
POSITIONS_PER_PAGE = 10

def error(code, message):
    return {'code':code, 'message':message}

def if_legal(str,enter = False):
    str_uni = str.decode('utf8')
    for c in str_uni:
        if c in range (u'\u0021',u'\u00fe') or c in range (u'\u4e00',u'\u9fa5'):
            continue;
        if (c == u'\u000a' or c == u'\u000d') and enter:
            continue;
        raise ValueError,c
    return True

def create_position(request):
    re = dict()
    try:
        assert request.method == "POST"
    except:
        re['error'] = error(2, 'error, need post!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
        
    try:
        assert request.User != None
        assert request.User.is_stuff
        assert request.User.is_authenticated()
        cpn = Companyinfo.objects.all().filter(User = request.User)
    except:
        re['error'] = error(100,"Permission denied!")
  
    name = request.POST.get('name','')
    type = request.POST.get('type','')
    work_city = request.POST.get('work_city','')
    work_address = request.POST.get('work_address','')
    release_time = datetime.datetime.now()
    et = request.POST.get('end_time','')
    position_description = request.POST.get('position_description','')
    position_request = request.POST.get('position_request','')
    days = request.POST.get('daysperweek','0')
    intime = request.POST.get('internship_time','0')
    samin = request.POST.get('salary_min','0')
    samax = request.POST.get('salary_max','1000000')
    status = request.POST.get("status","hide")
    
    try:
        assert len(name) in range(1,30)
        if_legal(name,False)
    except AssertionError:
        re['error'] = error(210,'Position name is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(211,'Illeage character found in position name!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        assert type in TYPE
    except AssertionError:
        re['error'] = error(212,'Invaild position type')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert len(work_city) in range(1,50)
        if_legal(work_city,False)
    except AssertionError:
        re['error'] = error(213,'Work city is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(214,'Illeage character found in work city!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    
    try:
        assert len(work_address) in range(1,100)
        if_legal(work_address,False)
    except AssertionError:
        re['error'] = error(215,'The length of work address is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(216,'Illeage character found in work address!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        etint = int(et)
        end_time = datetime.datetime.utcfromtimestamp(etint)
        assert end_time > release_time
    except ValueError:
        re['error'] = error(217,'Invaild end time format!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except AssertionError:
        re['error'] = error(218,'End time is too early!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    
    try:
        assert len(position_description) in range(0,500)
        if_legal(position_description,False)
    except AssertionError:
        re['error'] = error(219,'The length of description is too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(220,'Illegal character found in work address!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert len(position_request) in range(0,500)
        if_legal(position_request,False)
    except AssertionError:
        re['error'] = error(221,'The length of request is too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(222,'Illegal character found in request!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        daysperweek = int(days)
        assert days in range(0,7)
    except ValueError,AssertionError:
        re['error'] = error(223,'Invaild days perweek!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        internship_time = int(intime)
        assert internship_time >= 0
    except ValueError,AssertionError:
        re['error'] = error(224,'Invaild internship time!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        salary_min = int(samin)
        assert salary_min in range(0,1000000)
    except ValueError,AssertionError:
        re['error'] = error(225,'Invaild min salary!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        salary_max = int(samax)
        assert salary_max in range(0,1000000)
    except ValueError,AssertionError:
        re['error'] = error(226,'Invaild max salary!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert salary_min < salary_max
    except:
        re['error'] = error(227,'Max salary should be more than min salary')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert status in STATUS
    except AssertionError:
        re['error'] = error(228,'Invaild position status')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    posi = Position(name = name,type = type,work_city = work_city,work_address = work_address,release_time = release_time,end_time = end_time,position_description = position_description,position_request = position_request,daysperweek = daysperweek,internship_time = internship_time,salary_min = salary_min,salary_max = salary_max,status = status)
    
    try:
        posi.save()
    except DatabaseError:
        re['error'] = error(250,'Database error: Failed to save')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    re['error'] = error(1,'Create position succeed!')
    cpn.position.append(posi)
    cpn.position_number = cpn.position_number + 1
    return HttpResponse(json.dumps(re),content_type = 'application/json')

def delete_position(request):

    re = dict()
    try:
        assert request.method == "POST"
    except:
        re['error'] = error(2, 'error, need post!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    
    try:
        id = int(request.POST['id'])
        assert id >= 0
    except KeyError:
        re['error'] = error(200,"Illegal request!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except ValueError,AssertionError:
        re['error'] = error(230,"Invaild search id!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    
    try:
        posi = Position.objects.get(id = id)
    except ObjectDoesNotExist:
        re['error'] = error(249,"Object does not exist")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except DatabaseError:
        re['error'] = error(251,"Database error: Failed to search!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert request.User != None
        assert request.User.is_stuff
        assert request.User.is_authenticated()
        cpn = Companyinfo.objects.all().filter(User = request.User)
        assert posi in cpn.position    
    except:
        re['error'] = error(100,"Permission denied!")
    
    try:
        posi.delete()
    except DatabaseError:
        re['error'] = error(252,"Database error: Failed to delete!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
      
    re['error'] = error(1,'Delete position succeed!')
    return HttpResponse(json.dumps(re),content_type = 'application/json')

def search_position(request):
    re = dict()
    try:
        assert request.mothod == "GET"
    except:
        re['error'] = error(3, 'error, need get!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    
    qs = Position.objects.all()
    
    if "id" in request.GET.keys():
        if len(request.GET["id"]) > 0:
            try:
                id = request.GET["id"]
                qs = qs.filter(id = id)
            except ValueError:
                re['error'] = error(230,"Invaild search id!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except DatabaseError:
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unkown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
      
    
    if "name" in request.GET.keys():
        if len(request.GET["name"]) > 0:
            try:
                name = request.GET["name"]
                assert len(name) < 30
                if_legal(name)
                qs = qs.filter(name = name)
            except AssertionError, ValueError: #UnicodeDecodeError is missing
                re['error'] = error(231,"Invaild search name!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except DatabaseError:
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unkown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')

    if "work_city" in request.GET.keys():
        if len(request.GET["work_city"]) > 0:
            try:
                work_city = request.GET["work_city"]
                assert len(work_city) < 50
                if_legal(work_city)
                qs = qs.filter(work_city = work_city)
            except AssertionError,ValueError: #UnicodeDecodeError is missing
                re['error'] = error(232,"Invaild search work city!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except DatabaseError:
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unkown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    if "mindays" in request.GET.keys():
        if len(request.GET["mindays"]) > 0:
            try:
                mindays = int(request.GET["mindays"])
                qs = qs.filter(daysperweek__gte = mindays)
            except ValueError:
                re['error'] = error(233,"Invaild search min daysperweek!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except DatabaseError:
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unkown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    if "maxdays" in request.GET.keys():
        if len(request.GET["maxdays"]) > 0:
            try:
                maxdays = int(request.GET["maxdays"])
                qs = qs.filter(Q(daysperweek__lte = maxdays) | Q(daysperweek = 0))
            except ValueError:
                re['error'] = error(234,"Invaild search max daysperweek!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except DatabaseError:
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unkown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
                
    if "salary_min" in request.GET.keys():
        if len(request.GET["salary_min"]) > 0:
            try:
                sa_min = int(request.GET["salary_min"])
                qs = qs.filter(Q(salary_max__gte = sa_min) | Q(salary_max = 0))
            except ValueError:
                re['error'] = error(235,"Invaild search min salary!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except DatabaseError:
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unkown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
                
    if "salary_max" in request.GET.keys():
        if len(request.GET["salary_max"]) > 0:
            try:
                sa_max = int(request.GET["salary_max"])
                qs = qs.filter(salary_min__lte = sa_max)
            except ValueError:
                re['error'] = error(236,"Invaild search max salary!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except DatabaseError:
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unkown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    if "status" in request.GET.keys():
        if len(request.GET["status"]) > 0:
            try:
                status = request.GET["status"]
                assert status in STATUS
            except AssertionError:
                re['error'] = error(237,"Invaild search status!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except DatabaseError:
                re['error'] = error(251,"Database error: Failed to search!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unkown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    page = 1
    if "page" in request.GET.keys():
        if len(request.GET["page"]) > 0:
            try:
                page = int(request.GET["page"])
                assert page > 0
            except ValueError,AssertionError:
                re['error'] = error(200,"Invaild request!")
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            except:
                re['error'] = error(299,'Unkown Error!')
                return HttpResponse(json.dumps(re),content_type = 'application/json')
    orderValue = "id"            
    qs.order_by(orderValue)
    qs = qs[(page - 1) * POSITIONS_PER_PAGE: page * POSITIONS_PER_PAGE]
    
    re["positions"] = qs
    re["error"] = error(1,"Search succeed!")
    return HttpResponse(json.dumps(re),content_type = 'application/json')

def update_position(request):
    re = dict()
    try:
        assert request.method == "POST"
    except:
        re['error'] = error(2, 'error, need post!')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    
    try:
        id = int(request.POST['id'])
        assert id >= 0
    except KeyError:
        re['error'] = error(200,"Illegal request!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except ValueError,AssertionError:
        re['error'] = error(230,"Invaild search id!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
        
    try:
        posi = Position.objects.get(id = id)
    except ObjectDoesNotExist:
        re['error'] = error(249,"Object does not exist")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except DatabaseError:
        re['error'] = error(251,"Database error: Failed to search!")
        return HttpResponse(json.dumps(re), content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert request.User != None
        assert request.User.is_stuff
        assert request.User.is_authenticated()
        cpn = Companyinfo.objects.all().filter(User = request.User)
        assert posi in cpn.position    
    except:
        re['error'] = error(100,"Permission denied!")
    
    name = request.POST.get('name','')
    type = request.POST.get('type','')
    work_city = request.POST.get('work_city','')
    work_address = request.POST.get('work_address','')
    et = request.POST.get('end_time','')
    position_description = request.POST.get('position_description','')
    position_request = request.POST.get('position_request','')
    days = request.POST.get('daysperweek','0')
    intime = request.POST.get('internship_time','0')
    samin = request.POST.get('salary_min','0')
    samax = request.POST.get('salary_max','1000000')
    status = request.POST.get("status","hide")
    
    try:
        assert len(name) in range(1,30)
        if_legal(name,False)
    except AssertionError:
        re['error'] = error(210,'Position name is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(211,'Illeage character found in position name!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        assert type in TYPE
    except AssertionError:
        re['error'] = error(212,'Invaild position type')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert len(work_city) in range(1,50)
        if_legal(work_city,False)
    except AssertionError:
        re['error'] = error(213,'Work city is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(214,'Illeage character found in work city!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    
    try:
        assert len(work_address) in range(1,100)
        if_legal(work_address,False)
    except AssertionError:
        re['error'] = error(215,'The length of work address is too short or too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(216,'Illeage character found in work address!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        etint = int(et)
        end_time = datetime.datetime.utcfromtimestamp(etint)
        assert end_time > datetime.now()
    except ValueError:
        re['error'] = error(217,'Invaild end time format!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except AssertionError:
        re['error'] = error(218,'End time is too early!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    
    try:
        assert len(position_description) in range(0,500)
        if_legal(position_description,False)
    except AssertionError:
        re['error'] = error(219,'The length of description is too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(220,'Illegal character found in work address!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert len(position_request) in range(0,500)
        if_legal(position_request,False)
    except AssertionError:
        re['error'] = error(221,'The length of request is too long!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except UnicodeDecodeError,ValueError:
        re['error'] = error(222,'Illegal character found in request!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        daysperweek = int(days)
        assert days in range(0,7)
    except ValueError,AssertionError:
        re['error'] = error(223,'Invaild days perweek!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        internship_time = int(intime)
        assert internship_time >= 0
    except ValueError,AssertionError:
        re['error'] = error(224,'Invaild internship time!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        salary_min = int(samin)
        assert salary_min in range(0,1000000)
    except ValueError,AssertionError:
        re['error'] = error(225,'Invaild min salary!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')

    try:
        salary_max = int(samax)
        assert salary_max in range(0,1000000)
    except ValueError,AssertionError:
        re['error'] = error(226,'Invaild max salary!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert salary_min < salary_max
    except:
        re['error'] = error(227,'Max salary should be more than min salary')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    try:
        assert status in STATUS
    except AssertionError:
        re['error'] = error(228,'Invaild position status')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    posi.name = name
    posi.type = type
    posi.work_city = work_city
    posi.work_address = work_address
    posi.end_time = end_time
    posi.position_description = position_description
    posi.position_request = position_request
    posi.daysperweek = daysperweek
    posi.internship_time = internship_time
    posi.salary_min = salary_min
    posi.salary_max = salary_max
    posi.status = status
    
    try:
        posi.save()
    except DatabaseError:
        re['error'] = error(250,'Database error: Failed to save')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    except:
        re['error'] = error(299,'Unkown Error!')
        return HttpResponse(json.dumps(re),content_type = 'application/json')
    
    re['error'] = error(1,'Create position succeed!')
    return HttpResponse(json.dumps(re),content_type = 'application/json')
    
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
