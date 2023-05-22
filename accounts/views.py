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

DAYS = ['월', '화', '수', '목', '금', '토','일']

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
            # 이메일 인증 여부에 따라 response
            if User.objects.filter(is_active=1):
                getUser = User.objects.get(email=inputEmail)
                # ID에 맞는 PW 인지 여부에 따라 response
                if bcrypt.checkpw(inputPW.encode("utf-8"), getUser.password.encode("utf-8")):
                        return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                 return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


# 시간표 등록 및 조회
@api_view(['PUT', 'GET'])
def TimeTable(request):
    # 시간표 등록
    if request.method == 'PUT':
        # 데이터 받기
        reqData = request.data
        put_email = reqData['email']
        put_file = reqData['table']
        put_start_time = int(reqData['start_time'])
        put_prefers = json.loads(reqData["preference"])

        # 시간표 이미지 처리
        common_time = img2arr(put_file) # 이미지 -> 배열
        [common_time.table.insert(0, common_time.table.pop()) for _ in range(put_start_time)] # 시간표 시작 시간 조정
        add_prefer(common_time, put_prefers) # 우선순위 배열에 추가
        zdata = compress_table(common_time) # 시간표 데이터 압축

        # 시간표 업데이트
        if User.objects.filter(email=put_email).exists():
            UserDataSerializer.update_user_time_table(put_email, zdata)
            return Response(status=status.HTTP_200_OK) 
        return Response(status=status.HTTP_404_NOT_FOUND)   
    
    # 시간표 조회
    elif request.method == 'GET':
        getData = request.data
        get_email = getData['email']
        res_table = restore_table(get_email)
        return Response({"Connect Success":res_table}) 

# 이미지 파일 배열로 변환하는 함수
def img2arr(file):
    images = []
    read_file = file.read()
    images.append(file_to_image(read_file))
    return calculate_common_time(images)

# 우선순위 배열에 추가하는 함수
def add_prefer(common_time, prefers):
    for prefer in prefers: 
         for element in prefers[prefer]: # 우선순위 요일별로 분리
              start_idx = int(element[0])
              end_idx = element[1] + start_idx
              for time in range(start_idx, end_idx): # 우선순위 추가
                day = DAYS.index(prefer)
                if common_time.table[time][day] != 1: # 공강인 시간만 처리
                    common_time.table[time][day] = 2
    return common_time

# 시간표 배열 문자열 변환 후 압축하는 함수
def compress_table(common_time):
    str_data = ""
    for time in common_time.table:
        str_data += ''.join([str(ch) for ch in time]) # 시간 리스트 -> 문자열
    return zlib.compress(str_data.encode(encoding='utf-8'))

# 압축한 시간표 리스트로 복원하는 함수
def restore_table(req_email):
    user = User.objects.get(email=req_email)
    str_table = zlib.decompress(user.time_table).decode('utf-8')

    lst_table = []
    table_element = []
    i = 0
    for ch in str_table:
        i += 1
        table_element.append(ch)

        if i % 7 == 0 and i != 0:
            lst_table.append(table_element)
            table_element = []

    return lst_table








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