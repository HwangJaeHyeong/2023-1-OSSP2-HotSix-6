from rest_framework.serializers import ModelSerializer
from .models import User

class UserDataSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'