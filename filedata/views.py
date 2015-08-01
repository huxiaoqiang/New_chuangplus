from django.shortcuts impoort render
from django.http import HttpResponse

# Create your views here.

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

