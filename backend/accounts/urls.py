from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('duplicate/', views.duplicateCheck, name="duplicateCheck"),
    path('register/', views.register, name="register"),
    path('login/', views.login, name="login"),
    path('activate/<str:uidb64>/<str:token>', views.Activate.as_view(), name="activate"),
    path('send-email/', views.resendEmail, name="resendEmail"),
    path('login-remain/', views.loginRemain, name="loginRemain"),
    path('logout/', views.logout, name="logout"),
]