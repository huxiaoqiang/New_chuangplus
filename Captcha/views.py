from django.http import HttpResponse
from .tools import getNewCaptcha
import random, string
from app.common_api import error
import json
from Captcha.models import InvitationCode
from django.core.exceptions import ObjectDoesNotExist

def image(request):
    response = HttpResponse(content_type="image/png")

    randstr,img = getNewCaptcha()
    img.save(response, 'png',quality=100)

    request.session['captcha'] = randstr
    return response

def check(request):
    if request.session['captcha'].upper() == request.POST.get('captcha','').upper():
        return HttpResponse('yes')
    return HttpResponse('%s != %s'%(request.session['captcha'],request.POST.get('captcha','')))

class LengthError(ValueError):
    def __init__(self,arg):
        self.args = arg

class InvitationCodeClass():
    def __init__(self,quantity,lengthOfRandom,lengthOfKey,count):
        self.quantity = quantity
        self.lengthOfRandom = lengthOfRandom
        self.lengthOfKey = lengthOfKey
        self.count = count

    def pad_zero_to_left(self,inputNumString,totalLength):
        lengthOfInput = len(inputNumString)
        if lengthOfInput > totalLength:
             raise LengthError("The length of input is greater than the total length.")
        else:
            return '0' *  (totalLength - lengthOfInput) + inputNumString

    def invitation_code_generator(self):
        poolOfChars  = string.ascii_letters + string.digits
        random_codes = lambda x, y: ''.join([random.choice(x) for i in range(y)])
        placeHolder = 'H'
        for index in range(self.quantity):
            tempString = ''
            try:
                yield random_codes(poolOfChars,self.lengthOfRandom) + placeHolder + self.pad_zero_to_left(str(index+self.count),self.lengthOfKey)
            except LengthError:
                print "Index exceeds the length of master key."

def generate_invitation_code(request):
    re = dict()
    quantity = request.POST.get('quantity',100)
    quantity = int(quantity)
    if request.method == 'POST':
        try:
            ic = InvitationCode.objects.all()
            count = len(ic)
        except ObjectDoesNotExist:
            count = 0
        code =  InvitationCodeClass(quantity,6,4,count)
        for c in code.invitation_code_generator():
            invitationcode = InvitationCode(code = c)
            invitationcode.save()
        re['error'] = error(1,'succeed')
    else:
        re['error'] = error(2,'Error, need POST')
    return HttpResponse(json.dumps(re),content_type = 'application/json')

def check_invitation_code(request):
    re = dict()
    code = request.POST.get('code','')
    if request.method == 'POST':
        try:
            ic = InvitationCode.objects.get(code=code)
        except InvitationCode.DoesNotExist:
            re['error'] = error(269,'Invitation code does not exist!')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        if ic.status == False:
            re['checked'] = False
        else:
            re['checked'] = True
        re['error'] = error(1,'succeed')
    else:
        re['error'] = error(2,'Error,need POST')
    return HttpResponse(json.dumps(re),content_type = 'application/json')

def register_invitation_code(request):
    re = dict()
    code = request.POST.get('code','')
    if request.method == "POST":
        try:
            ic = InvitationCode.objects.get(code=code)
        except:
            re['error'] = error(269,'Invitation code does not exist!')
            return HttpResponse(json.dumps(re),content_type = 'application/json')
        ic.status = True
        ic.save()
        re['error'] = error(1,'succeed')
    else:
        re['error'] = error(2,"Error, need POST")
    return HttpResponse(json.dumps(re),content_type = 'application/json')