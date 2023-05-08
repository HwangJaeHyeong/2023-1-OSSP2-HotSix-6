# from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User
from .serializers import UserDataSerializer
from rest_framework import status

# Create your views here.

@api_view(['GET'])
def getUserDatas(request):
    datas = User.objects.all()
    serializer = UserDataSerializer(datas, many=True)
    return Response(serializer.data)

# def duplicateCheck(request):
#     user_id = request.GET.get('user_id')
#     # user_id = request.get('user_id') 위, 아래 중에 뭔지 모르겠습니다...

#     try:
#         _id = User.objects.get(user_id = user_id)
#     except:
#         _id = None
        
#     if _id is None:
#         duplicate = "pass"
#     else:
#         duplicate = "fail"
#     context = {'duplicate' : duplicate}
#     return Response(context)

@api_view(['POST'])
def postMember(request):
    reqData = request.data
    serializer = UserDataSerializer(data=reqData)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)