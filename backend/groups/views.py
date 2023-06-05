from django.shortcuts import render, redirect
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from django.views import View
from rest_framework import renderers
from rest_framework import viewsets

from accounts.views import restore_time, add_prefer, compress_table, print_table, login_check, INIT_TIME_TABLE, INIT_PREFERENCE
from accounts.models import Group, GroupMember, GroupTimetable, Time, User, GroupProject, GroupNotice
from accounts.serializers import GroupDataSerializer, GroupMemberSerializer, GroupTimetableSerializer, UserDataSerializer, GroupProjectSerializer, GroupNoticeSerializer
from django.core.exceptions import ValidationError
from django.db.models import Q

import uuid
import base64
import codecs
import zlib
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


# current date 'yyyy-mm-dd' format
def current_date():
    now = timezone.now()
    date = now.strftime("%Y-%m-%d")
    return date


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

  
# 그룹 멤버들의 시간표 조회
class ViewGroupTable(GenericAPIView):
    def get(self, request, group_code):
        if Group.objects.filter(group_code=group_code).exists():
            if GroupTimetable.objects.filter(group_code=group_code).exists():
                group = GroupTimetable.objects.get(group_code=group_code)
                group_table = group.time_table
                res_group_table = restore_group_time(group_table)

                return Response({"integrated_table": res_group_table}, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

# 그룹 시간표 초기화 (일정 없는 시간표 생성)
@api_view(['POST'])
def create_group_table(request):
    if request.method == 'POST':
        try:
            reqData = request.data
            post_group_code = reqData['group_code']

            z_table = compress_table(INIT_TIME_TABLE)

            if Group.objects.filter(group_code=post_group_code).exists():
                input_data = {
                    'group_code':post_group_code,
                    'time_table':z_table
                }
                serializer = GroupTimetableSerializer(data=input_data)

                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_201_CREATED)
                else: 
                    return Response(status=status.HTTP_400_BAD_REQUEST) 
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(status=status.HTTP_409_CONFLICT) 
        

# 그룹 멤버들의 시간표를 통합
@api_view(['PUT'])
def integrate_table(request):
    if request.method == 'PUT':
        try:
            reqData = request.data
            post_group_code = reqData['group_code']
            
            if Group.objects.filter(group_code=post_group_code).exists():
                if GroupMember.objects.filter(group_code=post_group_code).exists():
                    # 그룹 멤버들의 시간표 통합
                    group_members = GroupMember.objects.filter(group_code=post_group_code).values() # 그룹 멤버들 받아 오기
                    group_table = integrated_members_table(group_members) # 그룹 멤버들의 시간표 통합
                    z_table = compress_table(group_table)
                    if GroupTimetable.objects.filter(group_code=post_group_code).exists(): 
                        update_table = GroupTimetable.objects.get(group_code=post_group_code)
                        update_table.time_table = z_table
                        update_table.save()
                        return Response(status=status.HTTP_202_ACCEPTED)
                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST) # 잘못된 데이터 입력 받음
                else:
                    return Response(status=status.HTTP_404_NOT_FOUND) # 해당 사용자를 찾을 수 없음
            else:
                return Response(status=status.HTTP_404_NOT_FOUND) # 해당 사용자를 찾을 수 없음
        except:
            return Response(status=status.HTTP_409_CONFLICT) 
       
@api_view(['DELETE'])
def del_group_table(request):
    if request.method == 'DELETE':
        try:
            reqData = request.data
            del_group_code = reqData['group_code']

            if Group.objects.filter(group_code=del_group_code).exists():
                if GroupTimetable.objects.filter(group_code=del_group_code).exists():
                    del_group_table =  GroupTimetable.objects.get(group_code=del_group_code)
                    del_group_table.delete()
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(status=status.HTTP_409_CONFLICT) 

          
# GroupProject
# 할 일 생성 - progress를 default로 지정하기 위해 serializer가 아니라 수동으로 save
@api_view(['POST'])
@login_check
def createGroupProject(request):
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
    

# @api_view(['GET'])
# @login_check
# def getGroupProject(request):
#     reqData = request.data
#     group_code = reqData['group_code']

#     try:
#         group = Group.objects.filter(group_code=group_code)
#     except Group.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         group_project = GroupProject.objects.filter(group_code=group_code)
#         serializer = GroupProjectSerializer(group_project, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@login_check
def getGroupProject(request):
    token = request.COOKIE.get('jwt')
    payload = jwt.decode(token, "SecretJWTKey", algorithms=['HS256'])
    user = payload['email']

    reqData = request.data
    group_code = reqData['group_code']

    try:
        group = Group.objects.filter(group_code=group_code)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    my_project = GroupProject.objects.filter(group_code=group_code, responsibility=user)
    my_serializer = GroupProjectSerializer(my_project, many=True)
    others = GroupProject.objects.filter(group_code=group_code & ~Q(responsibility=user))
    other_serializer = GroupProjectSerializer(others, many=True)
    data = {
        "my project" : my_serializer.data,
        "others" : other_serializer.data,
    }
    return Response(data, status=status.HTTP_200_OK) # 잘 가는지 확인해얄 듯..



# task name, progress, responsibility 수정 시 - project_id는 pk로 쓰기 때문에 변경 X
@api_view(['PUT', 'DELETE'])
@login_check
def updateGroupProject(request):
    reqData = request.data
    project_id = reqData['project_id']

    try:
        project = GroupProject.objects.get(project_id=project_id)
    except GroupProject.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        project.project_name = reqData['project_name']
        project.project_progress = reqData['project_progress']
        project.responsibility = reqData['responsibility']
        project.save()

        return Response(status=status.HTTP_200_OK)

        # update_serializer = GroupProjectSerializer(project, data=reqData)
        # if update_serializer.is_valid():
        #     update_serializer.save()
        #     return Response(status=status.HTTP_200_OK)
        # else:
        #     return Response(status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        project.delete()
        return Response(status=status.HTTP_200_OK)


# 그룹 프로젝트 진행 상황 - 어디에 갖다 붙일까요..
def totalProgress(request):
    reqData = request.data
    group_code = reqData['group_code']

    task_list = GroupProject.objects.filter(group_code=group_code)
    total = len(task_list)
    prob = 0

    for t in task_list:
        if t.project_progress == 1:
            prob += 50
        elif t.project_progress == 2:
            prob += 100
    
    prog = prob / total

    return prog


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
            user_table = restore_group_time(group_user.email) # 해당 그룹 멤버의 시간표
            members_time_table.append(user_table) 

        # 그룹 멤버들의 시간표가 존재하면 그룹 시간표 통합
        if members_time_table:
            group_table = integrate_table(members_time_table)

        return Response({"integrated table":group_table})
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


# 그룹 멤버들의 시간표를 통합하는 함수
def integrated_members_table(group_members):
    # 그룹의 멤버들의 시간표 받아 오기
    members_time_table = []
    for member in group_members:
        user_time = Time.objects.get(email=member['email_id']) # 해당 그룹 멤버
        user_table, user_prefer = restore_time(user_time.email) # 해당 그룹 멤버의 시간표
        integrated_table = add_prefer(user_table, user_prefer) # 해당 그룹 멤버의 시간표와 우선 순위 통합
        members_time_table.append(integrated_table) # 그룹 멤버들의 시간표 리스트에 추가

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


# 압축한 그룹 시간표 리스트로 복원하는 함수
def restore_group_time(group_time_table):
    if group_time_table != None:
        str_table = zlib.decompress(group_time_table).decode('utf-8')
    else: 
        str_table = INIT_TIME_TABLE

    lst_table = []
    table_element = []
    i = 0
    for ch in str_table:
        i += 1
        table_element.append(ch)

        if i % 7 == 0 and i != 0: 
            table_element_int = [int(i) for i in table_element]
            lst_table.append(table_element_int)
            table_element = []

    return lst_table
  

# group notice
@api_view(['POST'])
@login_check
def createNotice(request):
    if request.method == 'POST':
        reqData = request.data

        notice_id = generateRandomCode()
        notice_title = reqData['notice_title']
        notice_content = reqData['notice_content']
        notice_date = current_date()
        group_code = reqData['group_code']

        notice = GroupNotice(notice_id=notice_id, notice_title=notice_title, notice_content=notice_content,
                             notice_date=notice_date, group_code=group_code)
        notice.save()
        
        return Response(status=status.HTTP_201_CREATED)


@api_view(['GET'])
@login_check
def getNotice(request):
    reqData = request.data

    if request.method == 'GET':
        group_code = reqData['group_code']

        notice_list = GroupNotice.objects.filter(group_code=group_code)
        serializer = GroupNoticeSerializer(notice_list, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', 'DELETE'])
@login_check
def updateNotice(request):
    reqData = request.data
    notice_id = reqData['notice_id']
    group_code = reqData['group_code']
    
    try:
        notice = GroupNotice.objects.filter(notice_id=notice_id, group_code=group_code)
    except GroupNotice.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        notice.notice_title = reqData['notice_title']
        notice.notice_content = reqData['notice_content']
        notice.notice_date = current_date()
        
        notice.save()

        return Response(status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        notice.delete()
        return Response(status=status.HTTP_200_OK)
