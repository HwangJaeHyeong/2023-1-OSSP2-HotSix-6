from rest_framework.serializers import ModelSerializer
from .models import User, Group

class UserDataSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
    # 유저 시간표 업데이트
    def update_user_time_table(update_user, zdata):
        user = User.objects.get(email=update_user)
        user.time_table = zdata
        user.save()

class GroupDataSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'