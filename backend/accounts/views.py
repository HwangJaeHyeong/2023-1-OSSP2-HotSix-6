import jwt
import json
import bcrypt

from .models import User
from .serializers import UserDataSerializer
from .tokens import account_activation_token
from .text import message
from my_settings import SECRET_KEY, EMAIL

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.views import View
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage


# 이메일 중복 확인
def duplicateCheck(request):
    email = request.POST.get('email')

    try:
        _email = User.objects.get(email = email)
    except:
        _email = None
        
    if _email is None:
        duplicate = "pass"
    else:
        duplicate = "fail"
    context = {'duplicate' : duplicate}
    return Response(context)

# 회원가입 시 DB에 data 저장
@api_view(['POST'])
def register(request):
    reqData = request.data
    password = reqData['password']
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    reqData['password'] = hashed_password.decode("utf-8")
    
    serializer = UserDataSerializer(data=reqData)
    
    if serializer.is_valid():
        serializer.save()
        
        user = reqData['email']

        current_site = get_current_site(request)
        domain = current_site.domain

        uidb64 = urlsafe_base64_encode(force_bytes(user)) # user.pk
        token = account_activation_token.make_token(user)
        message_data = message(domain, uidb64, token)

        mail_title = "이메일 인증을 완료해주세요"
        mail_to = user
        email = EmailMessage(mail_title, message_data, to=[mail_to])
        email.send()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Activate(View):
     def get(self, request, uidb64, token):
          try:
               uid = force_str(urlsafe_base64_decode(uidb64))
               user = User.objects.get(pk=uid)
               if user is not None:
                if account_activation_token.check_token(uid, token):
                        User.objects.filter(pk=uid).update(is_active=True) # membership_id=2
                        return redirect(EMAIL['REDIRECT_PAGE'])
               return Response({"error" : "AUTH_FAIL"}, status=status.HTTP_400_BAD_REQUEST)
          except ValidationError:
               return Response({"error" : "TYPE_ERROR"}, status=status.HTTP_400_BAD_REQUEST)
          except KeyError:
               return Response({"error" : "KEY_ERROR"}, status=status.HTTP_400_BAD_REQUEST)

# 로그인
@api_view(['POST'])
def login(request):
        reqData = request.data
        
        inputEmail = reqData['email']
        inputPW = reqData['password']

        # serializer = UserDataSerializer(data=reqData)

        # DB에 ID가 있는 여부에 따라 response
        if User.objects.filter(email=inputEmail).exists():
            getUser = User.objects.get(email=inputEmail)
            pw = getUser.password
            # ID에 맞는 PW 인지 여부에 따라 response
            # if getUser.password == inputPW:
            if bcrypt.checkpw(inputPW.encode("utf-8"), getUser.password.encode("utf-8")):
                    return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)







# DB 확인을 위한 view 함수 - 나중에 지우기
@api_view(['GET'])
def getUserDatas(request):
    datas = User.objects.all()
    serializer = UserDataSerializer(datas, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def postMember(request):
    reqData = request.data
    serializer = UserDataSerializer(data=reqData)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)