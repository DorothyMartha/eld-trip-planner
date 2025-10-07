from rest_framework import serializers
from .models import Trip, RouteSegment, DailyLog

class RouteSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteSegment
        fields = '__all__'

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    segments = RouteSegmentSerializer(many=True, read_only=True)
    daily_logs = DailyLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'

