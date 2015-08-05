from django.shortcuts import render, render_to_response
from django.http import HttpResponse
from django.template import RequestContext
import json
# Create your views here.

#desktop index
def index(request):
    request.META["CSRF_COOKIE_USED"] = True
    context = {
        'role': request.session.get('role', 0)
    }
    return render_to_response('index.html', context_instance=RequestContext(request))

#mobile index
def mobile_index(request):
    request.META["CSRF_COOKIE_USED"] = True
    context = {
        'role': request.session.get('role', 0)
    }
    return render_to_response('mobile_index.html', context_instance=RequestContext(request))
