# from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User
from .serializers import UserDataSerializer
from rest_framework import status

# Create your views here.

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