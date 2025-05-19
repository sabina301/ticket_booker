from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, default='user', required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': "Пароли не совпадают."})
        return attrs

    def create(self, validated_data):
        role = validated_data.pop('role', 'user')
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        
        # Update the profile that was automatically created by the signal
        # instead of creating a new one
        profile = Profile.objects.get(user=user)
        profile.role = role
        profile.save()
        
        return user 