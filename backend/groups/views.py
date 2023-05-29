from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


from accounts.views import restore_table, print_table, loginRemain
from accounts.models import Group, GroupMember, User
from accounts.serializers import GroupDataSerializer, GroupMemberSerializer
from django.core.exceptions import ValidationError

import uuid
import base64
import codecs

# generate 8-character random code mixed with English case and number
def generateRandomCode(length=8):
    return base64.urlsafe_b64encode(
        codecs.encode(uuid.uuid4().bytes, "base64").rstrip()
    ).decode()[:length]

# generate group
@api_view(['POST'])
def groupGenerate(request):
    reqData = request.data # user email, group_name by request
    Creator_ID = reqData['email']
    Group_Name = reqData['group_name']
    Group_Code = generateRandomCode()

    group = Group(group_code=Group_Code, group_name=Group_Name, creator_id=Creator_ID)
    group.save()
       
    return Response(Group_Code) # return group_code

# join group with group code
@api_view(['POST'])
def joinGroup(request):
    reqData = request.data # user email, group_code
    Group_Code = reqData['group_code']
    Member_ID = reqData['email']

    if Group.objects.filter(group_code=Group_Code).exists():
        groupMember = GroupMember(group_code=Group.objects.get(pk=Group_Code), member_id=Member_ID)
        groupMember.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_404_NOT_FOUND)

# get user group list
@api_view(['GET'])
def getGroupList(request):
    try:
        user = request.GET['email']

        group_codes = GroupMember.objects.filter(member=user).values('group_code')
        group_list = Group.objects.filter(group_code__in=group_codes).values('group_name')

        # 그룹 전체 정보 받아오고 싶으면?
        # group_list = Group.objects.filter(group_code__in=group_codes)
        # serializer = GroupDataSerializer(group_list, many=True)
        # return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

        return Response({"group_name" : group_list}, status=status.HTTP_202_ACCEPTED)
    except ValidationError:
        return Response({"error" : "TYPE_ERROR"}, status=status.HTTP_400_BAD_REQUEST)
    except KeyError:
        return Response({"error" : "KEY_ERROR"}, status=status.HTTP_400_BAD_REQUEST)

# group delete
@api_view(['DELETE'])
def deleteGroup(self, code):
    try:
        group = Group.objects.get(group_code=code)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    group.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# 그룹 멤버들의 시간표 통합 
@api_view(['GET'])
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