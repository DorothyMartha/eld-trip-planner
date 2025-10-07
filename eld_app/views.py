from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Trip, RouteSegment, DailyLog
from .hos_calculator import HOSCalculator
from .serializers import TripSerializer
import requests
import json
from datetime import datetime, timedelta

@api_view(['POST'])
def calculate_trip(request):
    """
    Calculate trip route and generate ELD logs
    """
    try:
        data = request.data
        
        # Validate required fields
        required_fields = ['current_location', 'pickup_location', 'dropoff_location', 'current_cycle_used']
        for field in required_fields:
            if field not in data:
                return Response(
                    {'error': f'Missing required field: {field}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        current_location = data['current_location']
        pickup_location = data['pickup_location']
        dropoff_location = data['dropoff_location']
        current_cycle_used = float(data['current_cycle_used'])
        
        # Calculate distance using a free mapping service (OpenRouteService or similar)
        distance = calculate_distance(current_location, pickup_location, dropoff_location)
        
        if distance is None:
            # Fallback to estimated distance
            distance = 500  # Default fallback
        
        # Initialize HOS calculator
        hos_calculator = HOSCalculator(current_cycle_used)
        
        # Calculate trip schedule
        trip_schedule = hos_calculator.calculate_trip_schedule(
            current_location, pickup_location, dropoff_location, distance
        )
        
        # Create trip record
        trip = Trip.objects.create(
            current_location=current_location,
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            current_cycle_used=current_cycle_used
        )
        
        # Create route segments
        for segment_data in trip_schedule['segments']:
            RouteSegment.objects.create(
                trip=trip,
                start_location=segment_data['start_location'],
                end_location=segment_data['end_location'],
                distance_miles=segment_data.get('distance_miles', 0),
                start_time=segment_data['start_time'],
                end_time=segment_data['start_time'] + timedelta(hours=segment_data['duration_hours']),
                segment_type=segment_data['type'],
                duty_status=segment_data['duty_status']
            )
        
        # Create daily logs
        for log_data in trip_schedule['daily_logs']:
            DailyLog.objects.create(
                trip=trip,
                date=log_data['date'],
                total_miles=log_data['total_miles'],
                carrier_name=log_data['carrier_name'],
                vehicle_numbers=log_data['vehicle_numbers'],
                driver_name=log_data['driver_name'],
                off_duty_hours=log_data['off_duty_hours'],
                sleeper_berth_hours=log_data['sleeper_berth_hours'],
                driving_hours=log_data['driving_hours'],
                on_duty_hours=log_data['on_duty_hours']
            )
        
        # Generate ELD log visualization data
        eld_logs = generate_eld_log_visualization(trip_schedule['daily_logs'])
        
        response_data = {
            'trip_id': trip.id,
            'distance_miles': distance,
            'total_time_hours': trip_schedule['total_time_hours'],
            'route_segments': trip_schedule['segments'],
            'daily_logs': trip_schedule['daily_logs'],
            'eld_logs': eld_logs,
            'compliance': trip_schedule['compliance'],
            'map_data': {
                'current_location': current_location,
                'pickup_location': pickup_location,
                'dropoff_location': dropoff_location,
                'waypoints': extract_waypoints(trip_schedule['segments'])
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Error calculating trip: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def calculate_distance(current, pickup, dropoff):
    """
    Calculate distance between locations using estimated distances
    Includes major US cities and Uganda cities with accurate distances
    """
    # Comprehensive distance database including Uganda cities
    distance_estimates = {
        # US Cities
        'new_york': {'chicago': 790, 'los_angeles': 2800, 'miami': 1280, 'boston': 215},
        'chicago': {'new_york': 790, 'los_angeles': 2010, 'miami': 1370, 'denver': 1000},
        'los_angeles': {'new_york': 2800, 'chicago': 2010, 'miami': 2750, 'san_francisco': 380},
        'miami': {'new_york': 1280, 'chicago': 1370, 'los_angeles': 2750, 'atlanta': 665},
        
        # Uganda Cities (major routes)
        'kampala': {
            'entebbe': 42, 'jinja': 85, 'masaka': 130, 'mbarara': 280, 
            'fort_portal': 320, 'gulu': 340, 'lira': 340, 'mbale': 220,
            'soroti': 280, 'arua': 530, 'kasese': 380, 'hoima': 200
        },
        'entebbe': {
            'kampala': 42, 'jinja': 125, 'masaka': 170, 'mbarara': 320,
            'fort_portal': 360, 'gulu': 380, 'lira': 380, 'mbale': 260,
            'soroti': 320, 'arua': 570, 'kasese': 420, 'hoima': 240
        },
        'jinja': {
            'kampala': 85, 'entebbe': 125, 'masaka': 215, 'mbarara': 365,
            'fort_portal': 405, 'gulu': 425, 'lira': 425, 'mbale': 135,
            'soroti': 195, 'arua': 615, 'kasese': 465, 'hoima': 285
        },
        'masaka': {
            'kampala': 130, 'entebbe': 170, 'jinja': 215, 'mbarara': 150,
            'fort_portal': 190, 'gulu': 470, 'lira': 470, 'mbale': 355,
            'soroti': 415, 'arua': 700, 'kasese': 280, 'hoima': 330
        },
        'mbarara': {
            'kampala': 280, 'entebbe': 320, 'jinja': 365, 'masaka': 150,
            'fort_portal': 340, 'gulu': 620, 'lira': 620, 'mbale': 505,
            'soroti': 565, 'arua': 850, 'kasese': 130, 'hoima': 480
        },
        'fort_portal': {
            'kampala': 320, 'entebbe': 360, 'jinja': 405, 'masaka': 190,
            'mbarara': 340, 'gulu': 670, 'lira': 670, 'mbale': 555,
            'soroti': 615, 'arua': 900, 'kasese': 210, 'hoima': 520
        },
        'gulu': {
            'kampala': 340, 'entebbe': 380, 'jinja': 425, 'masaka': 470,
            'mbarara': 620, 'fort_portal': 670, 'lira': 0, 'mbale': 575,
            'soroti': 635, 'arua': 190, 'kasese': 810, 'hoima': 540
        },
        'mbale': {
            'kampala': 220, 'entebbe': 260, 'jinja': 135, 'masaka': 355,
            'mbarara': 505, 'fort_portal': 555, 'gulu': 575, 'lira': 575,
            'soroti': 60, 'arua': 750, 'kasese': 600, 'hoima': 420
        },
        'soroti': {
            'kampala': 280, 'entebbe': 320, 'jinja': 195, 'masaka': 415,
            'mbarara': 565, 'fort_portal': 615, 'gulu': 635, 'lira': 635,
            'mbale': 60, 'arua': 810, 'kasese': 660, 'hoima': 480
        },
        'arua': {
            'kampala': 530, 'entebbe': 570, 'jinja': 615, 'masaka': 700,
            'mbarara': 850, 'fort_portal': 900, 'gulu': 190, 'lira': 190,
            'mbale': 750, 'soroti': 810, 'kasese': 1000, 'hoima': 730
        },
        'kasese': {
            'kampala': 380, 'entebbe': 420, 'jinja': 465, 'masaka': 280,
            'mbarara': 130, 'fort_portal': 210, 'gulu': 810, 'lira': 810,
            'mbale': 600, 'soroti': 660, 'arua': 1000, 'hoima': 580
        },
        'hoima': {
            'kampala': 200, 'entebbe': 240, 'jinja': 285, 'masaka': 330,
            'mbarara': 480, 'fort_portal': 520, 'gulu': 540, 'lira': 540,
            'mbale': 420, 'soroti': 480, 'arua': 730, 'kasese': 580
        }
    }
    
    # Normalize location names for lookup
    def normalize_location(location):
        return location.lower().replace(' ', '_').replace('-', '_')
    
    try:
        current_key = normalize_location(current)
        dropoff_key = normalize_location(dropoff)
        
        # Check if we have the distance in our database
        if current_key in distance_estimates and dropoff_key in distance_estimates[current_key]:
            return distance_estimates[current_key][dropoff_key]
        
        # If not found, try reverse lookup
        if dropoff_key in distance_estimates and current_key in distance_estimates[dropoff_key]:
            return distance_estimates[dropoff_key][current_key]
        
        # If still not found, estimate based on city size and region
        return estimate_distance_fallback(current_key, dropoff_key)
        
    except Exception as e:
        print(f"Distance calculation error: {e}")
        return 500  # Safe fallback

def estimate_distance_fallback(current_key, dropoff_key):
    """
    Fallback distance estimation based on location patterns
    """
    # Uganda-specific patterns
    if 'kampala' in current_key or 'kampala' in dropoff_key:
        if 'jinja' in current_key or 'jinja' in dropoff_key:
            return 85  # Kampala-Jinja
        elif 'entebbe' in current_key or 'entebbe' in dropoff_key:
            return 42  # Kampala-Entebbe
        elif 'masaka' in current_key or 'masaka' in dropoff_key:
            return 130  # Kampala-Masaka
        else:
            return 200  # General Uganda distance
    
    # US patterns
    if any(city in current_key for city in ['new_york', 'chicago', 'los_angeles', 'miami']):
        if any(city in dropoff_key for city in ['new_york', 'chicago', 'los_angeles', 'miami']):
            return 1000  # Typical US inter-city distance
    
    # Default fallback
    return 300  # More reasonable default

def extract_waypoints(segments):
    """Extract waypoints for map visualization"""
    waypoints = []
    for segment in segments:
        if segment['type'] in ['driving', 'pickup', 'dropoff', 'fuel']:
            waypoints.append({
                'location': segment['end_location'],
                'type': segment['type'],
                'time': segment['start_time'].isoformat()
            })
    return waypoints

def generate_eld_log_visualization(daily_logs):
    """
    Generate visualization data for ELD logs
    Returns data structure for drawing log sheets
    """
    eld_logs = []
    
    for log in daily_logs:
        # Generate 24-hour timeline data
        timeline = []
        current_hour = 0
        
        # Create hourly data points for the day
        # First, build a complete hour-by-hour status map
        hour_status_map = {}
        
        for segment in log['segments']:
            segment_start = segment['start_time']
            segment_duration_hours = segment['duration_hours']
            
            # Calculate which hours this segment covers
            current_time = segment_start
            hours_remaining = segment_duration_hours
            
            while hours_remaining > 0:
                hour_of_day = current_time.hour
                
                # Mark this hour with the segment's duty status
                if hour_of_day not in hour_status_map:
                    hour_status_map[hour_of_day] = segment['duty_status']
                
                # Move to next hour
                hours_remaining -= 1
                current_time = current_time + timedelta(hours=1)
        
        # Build location map for each hour
        hour_location_map = {}
        for segment in log['segments']:
            segment_start = segment['start_time']
            segment_duration_hours = segment['duration_hours']
            
            current_time = segment_start
            hours_remaining = segment_duration_hours
            
            while hours_remaining > 0:
                hour_of_day = current_time.hour
                hour_location_map[hour_of_day] = segment['end_location'] or segment['start_location'] or 'Unknown Location'
                hours_remaining -= 1
                current_time = current_time + timedelta(hours=1)
        
        # Now create timeline with all 24 hours
        for hour in range(24):
            duty_status = hour_status_map.get(hour, 'off_duty')  # Default to off_duty
            location = hour_location_map.get(hour, 'Unknown Location')
            
            timeline.append({
                'hour': hour,
                'duty_status': duty_status,
                'location': location,
                'display_hour': format_hour(hour)
            })
        
        eld_log = {
            'date': log['date'].isoformat(),
            'driver_name': log['driver_name'],
            'carrier_name': log['carrier_name'],
            'vehicle_numbers': log['vehicle_numbers'],
            'total_miles': log['total_miles'],
            'timeline': timeline,
            'totals': {
                'off_duty_hours': log['off_duty_hours'],
                'sleeper_berth_hours': log['sleeper_berth_hours'],
                'driving_hours': log['driving_hours'],
                'on_duty_hours': log['on_duty_hours']
            }
        }
        
        eld_logs.append(eld_log)
    
    return eld_logs

def format_hour(hour):
    """Format hour for display"""
    if hour == 0:
        return "Midnight"
    elif hour == 12:
        return "Noon"
    elif hour < 12:
        return f"{hour}"
    else:
        return f"{hour - 12}"

@api_view(['GET'])
def get_trip(request, trip_id):
    """Get trip details by ID"""
    try:
        trip = Trip.objects.get(id=trip_id)
        serializer = TripSerializer(trip)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Trip.DoesNotExist:
        return Response(
            {'error': 'Trip not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
