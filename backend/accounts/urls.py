from django.urls import path
from . import views

urlpatterns = [
    path('userdatas/', views.getUserDatas, name="userdatas"),
    path('postMember/', views.postMember, name="postMember"), # 이 경로로 json 데이터 던지면 db에 insert
]