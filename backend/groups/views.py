from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Group, GroupMember
from accounts.serializers import GroupDataSerializer

import uuid
import base64
import codecs

# generate 8-character random code mixed with English case
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

# # get group code by group name
# @api_view(['GET'])
# def getGroupCode(request): # only group name
#     Group_Name = request.data
#     Group_Code = Group.objects.filter(group_name=Group_Name)

#     if Group_Code is not None:
#         return Response(Group_Code)
#     return Response()

@api_view(['DELETE'])
def deleteGroup(self, code):
    try:
        group = Group.objects.get(group_code=code)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    group.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

    # reqData = request.data # group code
    # Group_Code = reqData['group_code']

    # if Group.objects.filter(group_code=Group_Code).exists():
    #     group = Group.objects.get(group_code=Group_Code)
    #     group.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
    # return Response(status=status.HTTP_404_NOT_FOUND)