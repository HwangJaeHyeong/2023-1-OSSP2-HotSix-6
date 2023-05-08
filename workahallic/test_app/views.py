from django.shortcuts import render
from .models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework import api_view
from .serializers import UserDataSerializer

# Create your views here.
# 로그인 시 (ID, PW) 정보를 통해 회원 확인 -> GET
@api_view(['GET'])
def login(request):
    if request.method == 'GET':
        reqData = request.data
        
        inputEmail = reqData['email']
        inputPW = reqData['pw']

        serializer = UserDataSerializer(data=reqData)

        # DB에 ID가 있는 여부에 따라 response
        if User.objects.filter(email=inputEmail).exists():
            getUser = User.objects.get(email=inputEmail)
            # ID에 맞는 PW 인지 여부에 따라 response
            if getUser.password == inputPW:
                    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
        
        else:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)    
        
    # elif request.method == 'GET':
    #     return render(request, 'login.html')