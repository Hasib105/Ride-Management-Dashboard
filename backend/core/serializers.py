from rest_framework import serializers
from .models import Trip, Driver , Earning

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