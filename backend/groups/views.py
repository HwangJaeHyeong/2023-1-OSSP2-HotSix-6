from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Group, GroupMember
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
@api_view(['GET', 'POST'])
def joinGroup(request):
    reqData = request.data # user email, group_code
    Group_Code = reqData['group_code']
    Member_ID = reqData['email']

    if request.method == 'POST':
        if Group.objects.filter(group_code=Group_Code).exists():
            groupMember = GroupMember(group_code=Group.objects.get(pk=Group_Code), member_id=Member_ID)
            groupMember.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_404_NOT_FOUND)

# 그룹 목록 가져오기
@api_view(['GET'])
def getGroupList(request):
    try:
        user = request.GET['email']

        group_list = GroupMember.objects.filter(member=user)
        serializer = GroupMemberSerializer(group_list, many=True)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    except ValidationError:
        return Response({"error" : "TYPE_ERROR"}, status=status.HTTP_400_BAD_REQUEST)
    except KeyError:
        return Response({"error" : "KEY_ERROR"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def deleteGroup(self, code):
    try:
        group = Group.objects.get(group_code=code)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    group.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)