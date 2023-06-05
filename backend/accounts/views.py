import jwt
import json
import bcrypt
import datetime
import zlib
import os

from .ics2binaryArr import ics_to_binary_array
from .TimeTableController.ImageFile import file_to_image
from .TimeTableController.Service import calculate_common_time

from .models import User, Time, Image
from .serializers import UserDataSerializer, TimeDataSerializer, ImageSerializer
from .tokens import account_activation_token
from .text import message
from my_settings import SECRET_KEY, EMAIL
from rest_framework import viewsets

from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.views import View
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage

KOREAN_DAYS = ['월', '화', '수', '목', '금', '토', '일']

# 시간표 및 우선 순위 초기화
INIT_TIME_TABLE = [[0 for _ in range(7)] for _ in range(48)] # 초기화 시간표 (7일 / 24시간 + 30분 단위 = 48)
INIT_PREFERENCE = {} # 초기화 우선 순위 딕셔너리

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
        user  = serializer.save()

        # payload = {
        #      "id" : reqData['email'],
        #      "exp" : datetime.datetime.now() + datetime.timedelta(minutes=60),
        #      "iat" : datetime.datetime.now()
        # }

        # token = jwt.encode(payload, "secretJWTKey", algorithm="HS256")

        # res = Response()
        # res.set_cookie(key='jwt', value=True, httponly=True)
        # res.data = {
        #      'jwt' : token
        # }

        # return res
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

# 이메일 인증 안 됐을 경우 다시 보내기기
@api_view(['POST'])
def resendEmail(request):
     reqData = request.data
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
     
     return Response(status=status.HTTP_202_ACCEPTED)

# # token
# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#      @classmethod
#      def get_token(cls, user):
#           token = super().get_token(user)
#           token['username'] = user.username
#           return token
     
# class MyTokenObtainPairView(TokenObtainPairView):
#      serializer_class = MyTokenObtainPairSerializer

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
                      payload = {
                           "email" : inputEmail,
                           "exp" : datetime.datetime.now() + datetime.timedelta(minutes=60), # 토큰 만료
                           "iat" : datetime.datetime.now() # 토큰 생성
                      }

                      token = jwt.encode(payload, "secretJWTKey", algorithm="HS256")

                      res = Response(status=status.HTTP_200_OK)
                      res.set_cookie(key='jwt', value=True, httponly=True)
                      res.data = {
                           'jwt' : token
                      }

                      return res
                else:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                 return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
# 로그인 유지
@api_view(['GET'])
def loginRemain(request):
     token = request.COOKIE.get('jwt')

     if not token:
          return Response(status=status.HTTP_401_UNAUTHORIZED)
     
     try:
          payload = jwt.decode(token, "SecretJWTKey", algorithms=['HS256'])

     except jwt.ExpiredSignatureError:
          return Response(status=status.HTTP_401_UNAUTHORIZED)
     
     user = User.objects.filter(email=payload['email']).first()
     serializer = UserDataSerializer(user)

     return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

#로그아웃
@api_view(['POST'])
def logout(request):
     res = Response(status=status.HTTP_200_OK)
     res.delete_cookie('jwt')
     res.data = {
          "message" : "logout success"
     }

     return res

# 이미지 처리를 위한 클래스
class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

# 사용자 시간표 초기화 (일정 없는 시간표 및 값이 없는 우선순위 딕셔너리 생성)
@api_view(['POST'])
def create_time_table(request):
    try:
        if request.method == 'POST':
            reqData = request.data
            post_email = reqData['email']

            if User.objects.filter(email=post_email).exists():
                z_table = compress_table(INIT_TIME_TABLE)
                z_prefer = compress_prefer(INIT_PREFERENCE)

                input_data = {
                    'email':post_email,
                    'time_table':z_table,
                    'preference':z_prefer
                }
                serializer = TimeDataSerializer(data=input_data)

                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_201_CREATED)
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND) 
    except:
        return Response(status=status.HTTP_409_CONFLICT)

# .ics 파일을 입력 받아 시간표 등록
@api_view(['PUT'])
def icsTimeTable(request):
    if request.method == 'PUT':
        try:
            # 데이터 받기
            reqData = request.data
            post_email = reqData['email']
            post_file = reqData['file']

            decode_file = post_file.read().decode() # 파일 읽기
            file_lst = decode_file.split('\n') # 읽은 파일 분리

            time_table, not_weekly_schedule = ics_to_binary_array(file_lst, INIT_TIME_TABLE) # 시간표 설정 및 (1개월 or 1년 or 하루) 주기 분리
            z_table = compress_table(time_table) # 시간표 및 우선 순위 데이터 압축

            # 사용자의 시간표 생성 후 데이터베이스에 저장
            if User.objects.filter(email=post_email).exists():
                if Time.objects.filter(email=post_email).exists(): 
                    # 기존 시간표 -> 새로운 시간표 (업데이트)
                    update_table = Time.objects.get(email=post_email)
                    update_table.time_table = z_table
                    update_table.save()
                    return Response(status=status.HTTP_202_ACCEPTED)
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST) # 잘못된 데이터 입력 받음
            else:
                return Response(status=status.HTTP_404_NOT_FOUND) # 해당 사용자를 찾을 수 없음
        except:
            return Response(status=status.HTTP_409_CONFLICT)  # 에러 발생

# 이미지 파일을 입력 받아 시간표 등록
@api_view(['PUT'])
def imgTimeTable(request):
    if request.method == 'PUT':
        try:
            # 데이터 받기
            reqData = request.data
            post_email = reqData['email']

            # viewset을 통해 저장한 이미지 파일 읽어 오기
            files = os.listdir('./images/') # images 폴더의 파일들 이름
            path = './images/' + files[0] # 첫번째 파일 경로
            
            # 이미지 파일 바이너리로 읽기
            with open(path, "rb") as file:
                # 시작 시간 구하기
                img_obj = Image.objects.all()[0] # viewset에서 읽어 온 시작 시간
                time = img_obj.time.split(':') # 10:30 -> 10 / 30
                start_time = int(int(time[0]) * 2 + int(time[1]) / 30) # 10 / 30 -> 20 + 1
                if start_time > 18: start_time = 18 # 9시 이후 시작 -> 시작 시간 = 9시

                # 시간표 이미지 처리
                time_table = img2arr(file) # 이미지 -> 배열로 변환
                [time_table.table.insert(0, time_table.table.pop()) for _ in range(start_time)] # 시간표 시작 시간 조정
                z_table = compress_table(time_table.table) # 시간표 및 우선 순위 데이터 압축
                
            # 사용한 이미지 데이터 지우기 (in folder and DB)
            [os.remove('./images/' + file) for file in files] # 읽은 이미지 지우기
            img_datas = Image.objects.all() # DB accounts_image의 모든 값 받아 오기
            [data.delete() for data in img_datas] # DB accounts_image의 모든 값 지우기

            # 사용자의 시간표 생성 후 데이터베이스에 저장
            if User.objects.filter(email=post_email).exists():
                if Time.objects.filter(email=post_email).exists(): 
                    update_table = Time.objects.get(email=post_email)
                    update_table.time_table = z_table
                    update_table.save()
                    return Response(status=status.HTTP_202_ACCEPTED)
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST) # 잘못된 데이터 입력 받음
            else:
                return Response(status=status.HTTP_404_NOT_FOUND) # 해당 사용자를 찾을 수 없음
        except:
            return Response(status=status.HTTP_409_CONFLICT)  # 에러 발생

# 텍스트를 입력 받아 시간표 등록
@api_view(['PUT'])
def text_time_table(request):
    if request.method == 'PUT':
        try:
            # 데이터 받기
            reqData = request.data
            post_email = reqData['email']
            post_text = reqData['text']

            # string -> list
            str_to_lst = []
            time = []
            for ch in post_text:
                if ch.isdigit():
                    time.append(int(ch))
                if ch == ']':
                    str_to_lst.append(time)
                    time = []

            z_table = compress_table(str_to_lst) # 시간표 및 우선 순위 데이터 압축

            # 사용자의 시간표 생성 후 데이터베이스에 저장
            if User.objects.filter(email=post_email).exists():
                if Time.objects.filter(email=post_email).exists(): 
                    # 기존 시간표 -> 새로운 시간표 (업데이트)
                    update_table = Time.objects.get(email=post_email)
                    update_table.time_table = z_table
                    update_table.save()
                    return Response(status=status.HTTP_202_ACCEPTED)
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST) # 잘못된 데이터 입력 받음
            else:
                return Response(status=status.HTTP_404_NOT_FOUND) # 해당 사용자를 찾을 수 없음
        except:
            return Response(status=status.HTTP_409_CONFLICT)  # 에러 발생
        
# 우선 순위 등록
@api_view(['PUT'])
def preference(request):
    try:
        if request.method == 'PUT':
            reqData = request.data
            post_email = reqData['email']
            post_prefer = reqData['preference']

            z_prefer = compress_prefer(post_prefer)

            if User.objects.filter(email=post_email).exists():
                if Time.objects.filter(email=post_email).exists(): 
                    update_prefer = Time.objects.get(email=post_email)
                    update_prefer.preference = z_prefer
                    update_prefer.save()
                    return Response(status=status.HTTP_202_ACCEPTED)
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST) # 잘못된 데이터 입력 받음
            else:
                return Response(status=status.HTTP_404_NOT_FOUND) # 해당 사용자를 찾을 수 없음
    except:
        return Response(status=status.HTTP_409_CONFLICT)  # 에러 발생
    

# 시간표 조회 
class ViewTimeTable(GenericAPIView):
    def get(self, request, email):
        if User.objects.filter(email=email).exists():
            if not Time.objects.filter(email=email).exists():
                return Response({"time_table":INIT_TIME_TABLE}, status=status.HTTP_204_NO_CONTENT)
            else:
                res_table, res_prefer = restore_time(email) # 시간표 및 우선순위 받아오기
                res_table = add_prefer(res_table, res_prefer)
                return Response({"time_table":res_table}, status=status.HTTP_200_OK) 
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delTimeTable(request):
    try:
        if request.method == 'DELETE':
            reqData = request.data
            del_email = reqData['email']

            if User.objects.filter(email=del_email).exists():
                if Time.objects.filter(email=del_email).exists():
                    del_time = Time.objects.get(email=del_email)
                    del_time.delete()
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(status=status.HTTP_409_CONFLICT) 

# 이미지 파일 배열로 변환하는 함수
def img2arr(file):
    images = []
    read_file = file.read()
    images.append(file_to_image(read_file))
    return calculate_common_time(images)

# 우선순위 배열에 추가하는 함수
def add_prefer(time_table, prefer):
    for prefer_key in prefer: 
        start_idx = prefer[prefer_key][0]
        end_idx = prefer[prefer_key][1] + start_idx
        for time in range(start_idx, end_idx): # 우선순위 추가
            day = KOREAN_DAYS.index(prefer_key)
            if time_table[time][day] != 1: # 공강인 시간만 처리
                time_table[time][day] = 2
    return time_table

# 시간표 배열  압축하는 함수
def compress_table(time_table):
    str_data = ""
    for time in time_table:
        str_data += ''.join([str(ch) for ch in time]) # 시간 리스트 -> 문자열
    z_table = zlib.compress(str_data.encode(encoding='utf-8'))
    return z_table

# 우선 순위 압축하는 함수
def compress_prefer(prefer):
    str_prefer = str(prefer)
    z_prefer = zlib.compress(str_prefer.encode(encoding='utf-8'))
    return z_prefer

# 압축한 시간표 리스트로 복원하는 함수
def restore_time(req_email=ModuleNotFoundError):
    time = Time.objects.get(email=req_email)
    
    if time.time_table != None:
        str_table = zlib.decompress(time.time_table).decode('utf-8')
    else: 
        str_table = INIT_TIME_TABLE

    if time.preference != None:
        dict_prefer = eval(zlib.decompress(time.preference).decode('utf-8'))
    else: 
        dict_prefer = INIT_PREFERENCE

    lst_table = []
    table_element = []
    i = 0
    for ch in str_table:
        i += 1
        table_element.append(ch)

        if i % 7 == 0 and i != 0: 
            table_element_int = [int(i) for i in table_element]
            lst_table.append(table_element_int)
            table_element = []

    return lst_table, dict_prefer


# 시간표 확인용 출력
def print_table(table):
    count = 0
    for time in table:
        print(count, "\t:\t", end='')
        for day in time:
            print(day, end=' ')
        print()
        count += 0.5
    print()