from django.urls import path
from . import views

urlpatterns = [
    path('duplicate/', views.duplicateCheck, name="duplicateCheck"),
    path('register/', views.register, name="register"),

    # DB 확인을 위한 임시 - 나중에 지우기
    path('userdatas/', views.getUserDatas, name="userdatas"),
    path('postMember/', views.postMember, name="postMember"), # 이 경로로 json 데이터 던지면 db에 insert
]