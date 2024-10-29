from rest_framework import serializers
from .models import Trip, Driver , Earning
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError  

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id', 'name', 'status', 'latitude', 'longitude', 'updated_at']


class TripSerializer(serializers.ModelSerializer):
    driver = DriverSerializer(read_only=True)  # Nesting Driver details in Trip

    class Meta:
        model = Trip
        fields = ['id', 'driver', 'status', 'pickup_location', 'dropoff_location', 'start_time', 'end_time']



class EarningSerializer(serializers.ModelSerializer):
    trip = TripSerializer(read_only=True)  # Nesting Trip details in Earning

    class Meta:
        model = Earning
        fields = ['id', 'trip', 'date', 'amount']





class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    re_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 're_password')

    def validate(self, attrs):
        if attrs['password'] != attrs['re_password']:
            raise ValidationError({'password': "Password fields didn't match."})
        
        if len(attrs['password']) < 8:
            raise ValidationError({'password': "Password must be at least 8 characters."})
        
        if User.objects.filter(username=attrs['username']).exists():
            raise ValidationError({'username': "Username is already taken."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise ValidationError({'email': "Email is already taken."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user