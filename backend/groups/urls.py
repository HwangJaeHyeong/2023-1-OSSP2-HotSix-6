from django.urls import path
from . import views

urlpatterns = [
    path('generate-group/', views.groupGenerate, name="groupGenerate"),
    path('join-group/', views.joinGroup, name="joinGroup"),
    path('delete-group/<str:code>', views.deleteGroup, name="deleteGroup"),
    path('get-group/', views.getGroupList, name="getGroupList"),
    
    path('group-table/', views.groupTable, name="groupTable"),

    path('generate-group-project', views.generateGroupProject, name="generateGroupProject"),
    path('group-project/', views.updateGroupProject, name="updateGroupProject"),
]