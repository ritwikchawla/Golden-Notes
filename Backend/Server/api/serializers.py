from rest_framework import serializers
from .models import User,Notes
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = ['id','fullname','email','phone','password','confirm_password']


    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError('Password does not match!')
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = '__all__'
    def create(self, validated_data):
        return super().create(validated_data)    