from rest_framework.serializers import ModelSerializer
from .models import User, Group, GroupMember, GroupProject

class UserDataSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def update_user_time_table(update_user, zdata):
        user = User.objects.get(email=update_user)
        user.time_table = zdata
        user.save()

class GroupDataSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class GroupMemberSerializer(ModelSerializer):
    class Meta:
        model = GroupMember
        fields = ['group_code']

class GroupProjectSerializer(ModelSerializer):
    class Meta:
        model = GroupProject
        fields = '__all__'