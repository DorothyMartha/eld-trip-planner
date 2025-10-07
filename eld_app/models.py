from django.db import models
from django.utils import timezone
import json

class Trip(models.Model):
    """Model to store trip information"""
    current_location = models.CharField(max_length=200)
    pickup_location = models.CharField(max_length=200)
    dropoff_location = models.CharField(max_length=200)
    current_cycle_used = models.FloatField(help_text="Hours already used in current cycle")
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Trip from {self.current_location} to {self.dropoff_location}"

class RouteSegment(models.Model):
    """Model to store route segments with timing and HOS calculations"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='segments')
    start_location = models.CharField(max_length=200)
    end_location = models.CharField(max_length=200)
    distance_miles = models.FloatField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    segment_type = models.CharField(max_length=20, choices=[
        ('driving', 'Driving'),
        ('rest', 'Rest'),
        ('pickup', 'Pickup'),
        ('dropoff', 'Dropoff'),
        ('fuel', 'Fuel Stop'),
    ])
    duty_status = models.CharField(max_length=20, choices=[
        ('off_duty', 'Off Duty'),
        ('sleeper_berth', 'Sleeper Berth'),
        ('driving', 'Driving'),
        ('on_duty', 'On Duty (Not Driving)'),
    ])
    
    def __str__(self):
        return f"{self.segment_type}: {self.start_location} to {self.end_location}"

class DailyLog(models.Model):
    """Model to store daily log information"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField()
    total_miles = models.FloatField()
    carrier_name = models.CharField(max_length=200, default='ELD Logistics', blank=True)
    vehicle_numbers = models.CharField(max_length=200, default='TRUCK-001', blank=True)
    driver_name = models.CharField(max_length=200, default='Professional Driver', blank=True)
    
    # HOS totals
    off_duty_hours = models.FloatField(default=0)
    sleeper_berth_hours = models.FloatField(default=0)
    driving_hours = models.FloatField(default=0)
    on_duty_hours = models.FloatField(default=0)
    
    def __str__(self):
        return f"Daily Log - {self.date} - {self.driver_name}"
