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

@api_view(['POST'])
def groupGenerate(request):
    reqData = request.data # user email, group_name by request
    Creator_ID = reqData['email']
    Group_Name = reqData['group_name']
    Group_Code = generateRandomCode()

    group = Group(group_code=Group_Code, group_name=Group_Name, creator_id=Creator_ID)
    group.save()
       
    return Response(Group_Code) # return group_code

@api_view(['POST'])
def joinGroup(request):
    # if request.method == 'POST':
        reqData = request.data # user email, group_code
        Group_Code = reqData['group_code']
        Member_ID = reqData['email']

        # group = Group.objects.get(group_code=Group_Code)
        # if group is not None:
        #     groupMember = GroupMember(group_code = group.group_code, member_id=Member_ID)
        #     groupMember.save()
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