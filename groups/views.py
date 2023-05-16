from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Group
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
    reqData = request.data # get user email, group_name by request
    Creator_ID = reqData['email']
    Group_Name = reqData['group_name']
    Group_Code = generateRandomCode()

    group = Group(group_code=Group_Code, group_name=Group_Name, creator_id=Creator_ID)
    group.save()
    
    return Response(status=status.HTTP_201_CREATED)

