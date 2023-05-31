from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import ImageViewSet
    
router = DefaultRouter()
router.register(r'images', ImageViewSet)

urlpatterns = [
    path('', include(router.urls)), # 이미지 처리를 위한 url

    path('duplicate/', views.duplicateCheck, name="duplicateCheck"),
    path('register/', views.register, name="register"),
    path('login/', views.login, name="login"),
    path('activate/<str:uidb64>/<str:token>', views.Activate.as_view(), name="activate"),
    path('send-email/', views.resendEmail, name="resendEmail"),
    path('login-remain/', views.loginRemain, name="loginRemain"),
    path('logout/', views.logout, name="logout"),

    path('img-time-table/', views.imgTimeTable, name="imgTimeTable"),
    path('ics-time-table/', views.icsTimeTable, name="icsTimeTable"),
    path('preference/', views.preference, name="preference"),
    path('view-time-table/', views.viewTimeTable, name="viewTimeTable"),
    path('del-time-table/', views.delTimeTable, name="delTimeTable"),
]