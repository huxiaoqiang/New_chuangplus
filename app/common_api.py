#coding = utf-8
from django.http import HttpResponse
import json
import sys
reload(sys)
sys.setdefaultencoding('utf8')


def error(code, message):
    return {'code':code, 'message':message}


def user_permission(level):
    def check_login_state(func):
        def __decorator(*args, **kwargs):
            request = args[0]
            if request.user.is_authenticated():
                return func(*args, **kwargs)
            return HttpResponse(json.dumps({'error':error(100,'please login')}), content_type = 'application/json')
        return __decorator

    def check_roles(func):
        def __decorator(*args, **kwargs):
            request = args[0]
            try:
                if request.session['role'] <= level:
                    return func(*args, **kwargs)
                return HttpResponse(json.dumps({'error':error(100+level,'permission error')}), content_type = 'application/json')
            except:
                import traceback
                traceback.print_exc()
                return HttpResponse(json.dumps({'error':error(100+level,'permission error')}), content_type = 'application/json')
        return __decorator

    if level == 'login':
        return check_login_state
    else:
        return check_roles

def if_legal(str,enter = False):
    str_uni = str.decode('utf8')
    for c in str_uni:
        if c in range (u'\u0021',u'\u00fe') or c in range (u'\u4e00',u'\u9fa5'):
            continue;
        if (c == u'\u000a' or c == u'\u000d') and enter:
            continue;
        raise ValueError,c
    return True
