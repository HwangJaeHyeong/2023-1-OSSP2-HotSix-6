from rest_framework.serializers import ModelSerializer
from .models import User, Group

class UserDataSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class GroupDataSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'