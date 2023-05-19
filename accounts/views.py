import jwt
import json
import bcrypt

from sys import getsizeof
import zlib

from .TimeTableController.ImageFile import file_to_image
from .TimeTableController.Service import calculate_common_time

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
            if User.objects.filter(is_active=1):
                getUser = User.objects.get(email=inputEmail)
                pw = getUser.password
                # ID에 맞는 PW 인지 여부에 따라 response
                # if getUser.password == inputPW:
                if bcrypt.checkpw(inputPW.encode("utf-8"), getUser.password.encode("utf-8")):
                        return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                 return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


# 시간표 등록
@api_view(['POST'])
def TimeTable(request):
    # 데이터 받기
    reqData = request.data
    files = reqData['table']
    prefers = json.loads(reqData["preference"])
    images = []

    # 이미지 -> 배열
    file = files.read()
    images.append(file_to_image(file))
    common_time = calculate_common_time(images)
    # [common_time.table.insert(0, common_time.table.pop()) for _ in range(2)] # 기본 시작 시간 9시 -> 8시

    # # 시간표 배열 정보 압축
    # str_data = ""
    # str_list = []
    # binary_data = []

    # for time in common_time.table:
    #     str_data += ''.join([str(ch) for ch in time]) # 시간 리스트 -> 문자열
    #     str_list.append(''.join([str(ch) for ch in time]))

    # for temp in str_list:
    #      binary_data.append(int(temp, 2))

    # zdata = zlib.compress(str_data.encode(encoding='utf-8'))
    # test = ""
    # for t in range(48):
    #      test += chr(t)

    # print("시간표 이진 변환 리스트 :", binary_data)
    # print("시간표 아스키 코드 변환 문자열 :", test)
    # print(" 시간표 문자열 :", str_data)
    # print("시간표 문자열 압축 (바이너리 문자열)", zdata)

    # print(f"{type(common_time.table)}  타임 테이블 : {getsizeof(common_time.table)}, {getsizeof(common_time.table[0])}")
    # print(f"{type(str_data)}  타임 테이블 : {getsizeof(str_data)}")
    # print(f"{type(binary_data)} 리스트 타임 테이블 : {getsizeof(binary_data)}, {getsizeof(binary_data[0])}")
    # print(f"{type(zdata)} 문자열 압축  타임 테이블 : {getsizeof(zdata)}")
    # print(f"{type(test)} 아스키코드 문자열 타임 테이블 : {getsizeof(test)}")

    # # 데이터 변경
    # if reqData['preference'] != None: reqData['preference'] = 1
    # reqData['table'] = zdata

    # print(reqData)

    # serializer = TimeDataSerializer(data=reqData)
    # print(serializer)
    # if serializer.is_valid():
    #     print("is Valid?")
    #     serializer.save()

    # 우선순위 확인
    # for prefer in prefers:
    #      print(prefers[prefer])
    common_time.print()

    return Response({"test":common_time.table})   









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