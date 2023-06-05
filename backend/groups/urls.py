from django.urls import path
from . import views

urlpatterns = [
    path('generate-group/', views.groupGenerate, name="groupGenerate"),
    path('join-group/', views.joinGroup, name="joinGroup"),
    path('delete-group/<str:code>', views.deleteGroup, name="deleteGroup"),
    path('get-group/', views.getGroupList, name="getGroupList"),

    path('view-group-table/<str:group_code>', views.ViewGroupTable.as_view(), name="ViewGroupTable"),
    path('create-group-table/', views.create_group_table, name="create_group_table"),
    path('integrated-table/', views.integrate_table, name="integrate_table"),
    path('del-group-table/', views.del_group_table, name="del_group_table"),

    path('create-group-project/', views.createGroupProject, name="generateGroupProject"),
    path('get-group-project/', views.getGroupProject, name="getGroupProject"),
    path('group-project/', views.updateGroupProject, name="updateGroupProject"),

    path('create-group-notice/', views.createNotice, name="createNotice"),
    path('get-group-notice/', views.getNotice, name="getNotice"),
    path('update-notice/', views.updateNotice, name="updateNotice"),
]