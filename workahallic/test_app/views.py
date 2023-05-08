from .models import User
from rest_framework.response import Response
from .serializers import serializers
from rest_framework import status
from rest_framework import generics

# Create your views here.
def login(request):
    if request.method == 'POST':
        data = request.POST
        # 넘어오는 데이터 값에 대해서 인수 값 변경
        inputEmail = data['email']
        inputPW = data['pw']

        # True false로 반환
        if User.objects.filter(user_id=inputEmail).exists():
            getUser = User.objects.get(user_id=inputEmail)
            if getUser.password == inputPW:
                    return Response(serializers.data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializers.errors, status=status.HTTP_404_NOT_FOUND)
        
        else:
            return Response(serializers.errors, status=status.HTTP_404_NOT_FOUND)    
    
    # elif request.method == 'GET':
    #     return render(request, 'login.html')