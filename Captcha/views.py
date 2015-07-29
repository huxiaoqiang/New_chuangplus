from django.shortcuts import render
from django.http import HttpResponse

from .tools import getNewCaptcha


def image(request):
    response = HttpResponse(content_type="image/png")

    randstr,img = getNewCaptcha()
    img.save(response, 'png',quality=100)

    request.session['captcha'] = randstr
    return response

def check(request):
    if request.session['captcha'].upper() == request.GET['s'].upper():
        return HttpResponse('yes')
    return HttpResponse('%s != %s'%(request.session['captcha'],request.GET['s']))
