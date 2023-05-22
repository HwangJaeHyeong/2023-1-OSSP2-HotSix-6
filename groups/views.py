from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Group, GroupMember, User
from accounts.serializers import GroupDataSerializer
from accounts.views import restore_table, print_table

import uuid
import base64
import codecs

# generate 8-character random code mixed with English case
def generateRandomCode(length=8):
    return base64.urlsafe_b64encode(
        codecs.encode(uuid.uuid4().bytes, "base64").rstrip()
    ).decode()[:length]

@api_view(['POST'])
def groupGenerate(request):
    reqData = request.data # get user email, group_name by request
    Creator_ID = reqData['email']
    Group_Name = reqData['group_name']
    Group_Code = generateRandomCode()

    group = Group(group_code=Group_Code, group_name=Group_Name, creator_id=Creator_ID)
    group.save()
    
    return Response(status=status.HTTP_201_CREATED)

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
            print_table(group_table)

        return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
# 그룹 멤버들의 시간표를 통합하는 함수
def integrate_table(members_time_table):
    group_table = members_time_table[0] # 첫 시간표 미리 추가

    ##### 시간표 통합1 (속도 느릴 듯) => 테스트 1 성공
    # for idx in range(len(members_time_table)): # 그룹 멤버 각각의 시간표
    #     if idx != 0: # 첫 시간표 건너뛰기
    #         for time in range(len(members_time_table[idx])): # 시간표의 각 시간대
    #             for day in range(7): # 시간대의 각 요일
    #                 if group_table[time][day] == 0 or group_table[time][day] >= 2: # (그룹 테이블) 공강일 시
    #                     if members_time_table[idx][time][day] == 1: # (개인 시간표) 강의 있을 시 => (그룹 테이블) 공강 -> 일정
    #                         group_table[time][day] = 1
    #                     else: # (개인 시간표) 강의 없을 시 => (그룹 테이블) 공강 -> 일정
    #                         group_table[time][day] += members_time_table[idx][time][day]

    # 시간표 통합2 (속도 향상 될까?)
    # 반복문 time, day는 그대로 => idx를 가장 깊게 배치하여 1 존재 여부에 따라 break


    return group_table