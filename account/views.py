#coding=utf-8
import sys
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.contrib import auth
from rest_framework import status,parsers, renderers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.views import APIView

# Create your views here.
from .models import *
from .serializers import UserinfoSerializer,UserSerializer,CompanyinfoSerializer

@api_view(['POST'])
def register(request):
    re=dict()
    VALID_USER_FIELDS = [f.name for f in User._meta.fields]
    serialized = UserSerializer(data=request.DATA)
    try:
        session_captcha = request.session.get('captcha', False)
        request_captcha = request.data['captcha']
    except KeyError:
        re['error']=error(100,"Need captcha!")
        return HttpResponse(json.dumps(re), content_type='application/json')

    if session_captcha.upper() != request_captcha.upper():
        return HttpResponse(json.dumps(re), content_type='application/json')

    if serialized.is_valid():
        user_data = {field: data for (field, data) in request.data.items() if field in VALID_USER_FIELDS}
        for (field, data) in request.data.items():
            if field == "role":
                user_data.is_staff = data
        user = User.objects.create_user(**user_data)
        #try:
        #    user = User.objects.create_user(**user_data)
        #except MySQLdb.IntegrityError:
        #    return Response({'email': 'Email 已经注册。'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(UserSerializer(instance=user).data, status=status.HTTP_201_CREATED)

    return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def check_username(request):
    try:
        name = request.data['username']
    except KeyError:
        return Response({'username': '请填写要检查的用户名。'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=name).count() != 0:
        return Response({'exist': 'True'})
    else:
        return Response({'exist': 'False'})

#login
class ObtainAuthToken(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key,'role':user.is_staff})


@api_view(['POST', 'PUT'])
@permission_classes((IsAuthenticated, ))
def userinfo_create_or_update(request):
    try:
        userinfo = Userinfo.objects.get(user=request.user)

    except ObjectDoesNotExist:
        serialized = UserinfoSerializer(data=request.DATA)

        if serialized.is_valid():
            serialized.save(user=request.user)
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    serialized = UserinfoSerializer(userinfo, data=request.DATA)

    if serialized.is_valid():
        serialized.save(user=request.user)
        return Response(serialized.data, status=status.HTTP_202_ACCEPTED)
    else:
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def userinfo_retrieve(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"username": "用户不存在。"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        userinfo = Userinfo.objects.get(user=user)
    except Userinfo.DoesNotExist:
        return Response({"username": "用户尚未填写资料。"}, status=status.HTTP_400_BAD_REQUEST)

    serialized = UserinfoSerializer(userinfo)
    return Response(serialized.data)

#todo: complete the company info create or update
@api_view(['POST,PUT'])
@permission_classes((IsAuthenticated, ))
def companyinfo_create_or_update(request):
    pass

#todo: complete the company info retrieve
@api_view(['GET'])
def companyinfo_retrieve(request, companyname):
    pass
