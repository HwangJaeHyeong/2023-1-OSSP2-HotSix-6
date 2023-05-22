from django.urls import path
from . import views

urlpatterns = [
    path('generate-group/', views.groupGenerate, name="groupGenerate"),
    path('group-table/', views.groupTable, name="groupTable"),
]