from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import User, Time, Group, GroupMember, AccountsImage, GroupTimetable

class UserDataSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class TimeDataSerializer(ModelSerializer):
    class Meta:
        model = Time
        fields = '__all__'
        extra_kwargs = {
            'time_table': {'read_only': False},
            'preference': {'read_only': False}
        }

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountsImage
        fields = ('image', 'time')

class GroupDataSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class GroupMemberSerializer(ModelSerializer):
    class Meta:
        model = GroupMember
        fields = ['group_code']

class GroupTimetableSerializer(ModelSerializer):
    class Meta:
        model = GroupMember
        fields = ['group_code']