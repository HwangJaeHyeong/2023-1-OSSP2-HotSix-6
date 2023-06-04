from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from accounts.views import restore_table, print_table, login_check
from accounts.models import Group, GroupMember, User, GroupProject
from accounts.serializers import GroupDataSerializer, GroupMemberSerializer, UserDataSerializer, GroupProjectSerializer
from django.core.exceptions import ValidationError
from django.db.models import Q

import uuid
import base64
import codecs
import jwt

# def login_check(func):
#     def wrapper(self, request, *args, **kwargs):
#         try:
#             access_token = request.COOKIE.get('jwt')

#             if not access_token:
#                 return Response(status=status.HTTP_401_UNAUTHORIZED)
            
#             payload = jwt.decode(access_token, "SecretJWTKey", algorithms=['HS256'])

#             user = User.objects.filter(email=payload['email']).first()
#             serializer = UserDataSerializer(user)

#         except jwt.ExpiredSignatureError:
#             return Response(status=status.HTTP_401_UNAUTHORIZED)

#         except User.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)
        
#         return func(self, request, *args, **kwargs)
#     return wrapper


# generate 8-character random code mixed with English case and number
def generateRandomCode(length=8):
    return base64.urlsafe_b64encode(
        codecs.encode(uuid.uuid4().bytes, "base64").rstrip()
    ).decode()[:length]


# Group
# generate group
@api_view(['POST'])
@login_check
def groupGenerate(request):
    reqData = request.data # user email, group_name by request
    Creator_ID = reqData['email']
    Group_Name = reqData['group_name']
    Group_Code = generateRandomCode()

    group = Group(group_code=Group_Code, group_name=Group_Name, creator_id=Creator_ID)
    group.save()

    res = Response(status=status.HTTP_201_CREATED)
    res.data = Group_Code
       
    return res


# join group with group code
@api_view(['POST'])
@login_check
def joinGroup(request):
    reqData = request.data # user email, group_code
    Group_Code = reqData['group_code']
    Member_ID = reqData['email']

    if Group.objects.filter(group_code=Group_Code).exists():
        groupMember = GroupMember(group_code=Group.objects.get(pk=Group_Code), member_id=Member_ID)
        groupMember.save()
        return Response(status=status.HTTP_202_ACCEPTED)
    return Response(status=status.HTTP_404_NOT_FOUND)


# get user group list
@api_view(['GET'])
@login_check
def getGroupList(request):
    try:
        user = request.GET['email']

        group_codes = GroupMember.objects.filter(member=user).values('group_code')
        group_list = Group.objects.filter(Q(group_code__in=group_codes) | Q(creator_id=user))
        serializer = GroupDataSerializer(group_list, many=True)
        
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    except ValidationError:
        return Response({"error" : "TYPE_ERROR"}, status=status.HTTP_400_BAD_REQUEST)
    except KeyError:
        return Response({"error" : "KEY_ERROR"}, status=status.HTTP_400_BAD_REQUEST)


# group delete
@api_view(['DELETE'])
# @login_check
def deleteGroup(self, code):
    try:
        group = Group.objects.get(group_code=code)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    group.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# GroupProject
# 할 일 생성 - progress를 default로 지정하기 위해 serializer가 아니라 수동으로 save
@api_view(['POST'])
@login_check
def generateGroupProject(request):
    reqData = request.data
    
    if request.method == 'POST':
        # 할 일 생성
        project_name = reqData['project_name']
        project_id = generateRandomCode()
        group_code = reqData['group_code'] # 현재 사용자가 어떤 그룹에 있는지 request가 아니라 다른 식으로 받아와얄 것 같은데
        responsibility = reqData['responsibility']
        project_progress = 0 # 0 = not started, 1 = ~ing, 2 = done

        group_project = GroupProject(project_id=project_id, project_name=project_name, 
                                     project_progress=project_progress, group_code=group_code, responsibility=responsibility)
        group_project.save()

        return Response(status=status.HTTP_201_CREATED)


# task name, progress, responsibility 수정 시 - project_id는 pk로 쓰기 때문에 변경 X
@api_view(['GET', 'PUT', 'DELETE'])
@login_check
def updateGroupProject(request):
    reqData = request.data
    group_code = reqData['group_code']
    project_id = reqData['project_id']

    try:
        project = GroupProject.objects.get(project_id=project_id)
    except GroupProject.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        group_project = GroupProject.objects.filter(group_code=group_code)
        serializer = GroupProjectSerializer(group_project, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        update_serializer = GroupProjectSerializer(project, data=reqData)
        if update_serializer.is_valid():
            update_serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        project.delete()
        return Response(status=status.HTTP_200_OK)


# 그룹 멤버들의 시간표 통합 
@api_view(['GET'])
@login_check
def groupTable(request):
    reqData = request.data
    get_group_code = reqData['group_code']

    if Group.objects.filter(group_code=get_group_code).exists():
        get_group_members = GroupMember.objects.filter(group_code=get_group_code).values()

        # 그룹 멤버 각각의 시간표 읽어 오기
        members_time_table = []
        for member in get_group_members:
            group_user = User.objects.get(email=member['email_id']) # 해당 그룹 멤버
            user_table = restore_table(group_user.email) # 해당 그룹 멤버의 시간표
            members_time_table.append(user_table) 

        # 그룹 멤버들의 시간표가 존재하면 그룹 시간표 통합
        if members_time_table:
            group_table = integrate_table(members_time_table)

        return Response({"integrated table":group_table})
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

# 그룹 멤버들의 시간표를 통합하는 함수
def integrate_table(members_time_table):
    group_table = members_time_table[0] # 첫 시간표 미리 추가

    # 시간표 통합
    for idx in range(1, len(members_time_table)): # 그룹 멤버 각각의 시간표 (첫 시간표 건너뛰기)
        for time in range(len(members_time_table[idx])): # 시간표의 각 시간대
            for day in range(7): # 시간대의 각 요일
                if group_table[time][day] == 0 or group_table[time][day] >= 2: # (그룹 테이블) 공강일 시
                    if members_time_table[idx][time][day] == 1: # (개인 시간표) 강의 있을 시 => (그룹 테이블) 공강 -> 일정
                        group_table[time][day] = 1
                    else: # (개인 시간표) 강의 없을 시 => (그룹 테이블) 공강 -> 일정
                        group_table[time][day] += members_time_table[idx][time][day]

    return group_table