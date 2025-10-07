"""
Hours of Service (HOS) Calculator for ELD Application
Implements the 70-hour/8-day rule for property-carrying drivers
"""

from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import math

class HOSCalculator:
    """
    Calculator for Hours of Service compliance
    Assumes: Property-carrying driver, 70hrs/8days, no adverse driving conditions
    """
    
    # HOS Limits
    MAX_DRIVING_HOURS = 11
    MAX_DUTY_HOURS = 14
    MAX_CYCLE_HOURS = 70
    CYCLE_DAYS = 8
    MIN_REST_HOURS = 10
    MIN_BREAK_MINUTES = 30
    
    def __init__(self, current_cycle_used: float = 0):
        """
        Initialize calculator with current cycle usage
        
        Args:
            current_cycle_used: Hours already used in current 8-day cycle
        """
        self.current_cycle_used = current_cycle_used
        self.current_driving_hours = 0
        self.current_duty_hours = 0
        self.last_rest_end = None
        self.driving_start = None
        
    def calculate_trip_schedule(self, 
                              current_location: str,
                              pickup_location: str, 
                              dropoff_location: str,
                              distance_miles: float) -> Dict:
        """
        Calculate complete trip schedule with HOS compliance
        
        Args:
            current_location: Starting location
            pickup_location: Pickup location  
            dropoff_location: Final destination
            distance_miles: Total trip distance
            
        Returns:
            Dictionary with route segments, daily logs, and compliance info
        """
        
        # Calculate basic trip parameters
        avg_speed = 55  # mph (conservative estimate)
        total_driving_time = distance_miles / avg_speed
        
        # Add time for pickup/dropoff (1 hour each as per requirements)
        pickup_time = 1.0
        dropoff_time = 1.0
        
        # Calculate fuel stops (every 1000 miles)
        fuel_stops = math.ceil(distance_miles / 1000) - 1  # Subtract 1 since we don't need fuel at start
        fuel_time = max(0, fuel_stops * 0.5)  # 30 minutes per fuel stop
        
        # Total time needed
        total_trip_time = total_driving_time + pickup_time + dropoff_time + fuel_time
        
        # Check if we need rest periods
        needs_rest = self._needs_rest_period(total_driving_time)
        
        segments = []
        current_time = datetime.now().replace(tzinfo=None)
        current_pos = current_location
        miles_remaining = distance_miles
        miles_driven = 0
        
        # Start with pickup
        segments.append({
            'type': 'pickup',
            'segment_type': 'pickup',
            'start_location': current_pos,
            'end_location': pickup_location,
            'start_time': current_time,
            'duration_hours': pickup_time,
            'duty_status': 'on_duty',
            'distance_miles': 0
        })
        current_time += timedelta(hours=pickup_time)
        current_pos = pickup_location
        
        # Track pickup as on-duty time
        self.current_duty_hours += pickup_time
        self.current_cycle_used += pickup_time
        
        # Calculate driving segments
        segment_distance = 500  # Drive in 500-mile segments for fuel stops
        
        while miles_remaining > 0:
            # Check if we need rest before continuing
            if self._needs_rest_period(0):  # Check current driving hours
                # Add 10-hour rest period
                rest_end_time = current_time + timedelta(hours=self.MIN_REST_HOURS)
                segments.append({
                    'type': 'rest',
                    'segment_type': 'rest',
                    'start_location': current_pos,
                    'end_location': current_pos,
                    'start_time': current_time,
                    'end_time': rest_end_time,
                    'duration_hours': self.MIN_REST_HOURS,
                    'duty_status': 'off_duty',
                    'distance_miles': 0
                })
                current_time = rest_end_time
                self._reset_daily_limits()
            
            # Calculate next driving segment
            drive_distance = min(segment_distance, miles_remaining)
            drive_time = drive_distance / avg_speed
            
            # Check if this would exceed daily driving limit
            if self.current_driving_hours + drive_time > self.MAX_DRIVING_HOURS:
                # Need to stop for rest
                remaining_drive_time = self.MAX_DRIVING_HOURS - self.current_driving_hours
                if remaining_drive_time > 0:
                    drive_distance = remaining_drive_time * avg_speed
                    drive_time = remaining_drive_time
                
                # Add driving segment
                segments.append({
                    'type': 'driving',
                    'segment_type': 'driving',
                    'start_location': current_pos,
                    'end_location': f"Stop {len(segments)}",  # Generic location
                    'start_time': current_time,
                    'duration_hours': drive_time,
                    'duty_status': 'driving',
                    'distance_miles': drive_distance
                })
                current_time += timedelta(hours=drive_time)
                current_pos = f"Stop {len(segments)}"
                miles_remaining -= drive_distance
                miles_driven += drive_distance
                
                # Add rest period
                rest_end_time = current_time + timedelta(hours=self.MIN_REST_HOURS)
                segments.append({
                    'type': 'rest',
                    'segment_type': 'rest',
                    'start_location': current_pos,
                    'end_location': current_pos,
                    'start_time': current_time,
                    'end_time': rest_end_time,
                    'duration_hours': self.MIN_REST_HOURS,
                    'duty_status': 'off_duty',
                    'distance_miles': 0
                })
                current_time = rest_end_time
                self._reset_daily_limits()
            
            # Track if fuel stop was added
            fuel_stop_added = False
            
            if not self._needs_rest_period(0):
                # Add driving segment (only if we didn't just add a rest period above)
                segments.append({
                    'type': 'driving',
                    'segment_type': 'driving',
                    'start_location': current_pos,
                    'end_location': f"Stop {len(segments)}",
                    'start_time': current_time,
                    'duration_hours': drive_time,
                    'duty_status': 'driving',
                    'distance_miles': drive_distance
                })
                current_time += timedelta(hours=drive_time)
                current_pos = f"Stop {len(segments)}"
                miles_remaining -= drive_distance
                miles_driven += drive_distance
                
                # Add fuel stop if needed (every 1000 miles)
                if miles_driven > 0 and miles_driven % 1000 < drive_distance and miles_driven >= 1000:
                    fuel_location = f"Fuel Stop {miles_driven // 1000}"
                    segments.append({
                        'type': 'fuel',
                        'segment_type': 'fuel',
                        'start_location': current_pos,
                        'end_location': fuel_location,
                        'start_time': current_time,
                        'duration_hours': 0.5,
                        'duty_status': 'on_duty',
                        'distance_miles': 0
                    })
                    current_time += timedelta(hours=0.5)
                    fuel_stop_added = True
                
                # Update current driving hours
                self.current_driving_hours += drive_time
                self.current_duty_hours += drive_time
                self.current_cycle_used += drive_time
                
                # Add fuel stop time to duty hours if a fuel stop was added
                if fuel_stop_added:
                    self.current_duty_hours += 0.5
                    self.current_cycle_used += 0.5
        
        # Add dropoff
        segments.append({
            'type': 'dropoff',
            'segment_type': 'dropoff',
            'start_location': current_pos,
            'end_location': dropoff_location,
            'start_time': current_time,
            'duration_hours': dropoff_time,
            'duty_status': 'on_duty',
            'distance_miles': 0
        })
        current_time += timedelta(hours=dropoff_time)
        
        # Track dropoff as on-duty time
        self.current_duty_hours += dropoff_time
        self.current_cycle_used += dropoff_time
        
        # Generate daily logs
        daily_logs = self._generate_daily_logs(segments, distance_miles)
        
        return {
            'segments': segments,
            'daily_logs': daily_logs,
            'total_distance': distance_miles,
            'total_time_hours': (current_time - datetime.now()).total_seconds() / 3600,
            'compliance': self._check_compliance()
        }
    
    def _needs_rest_period(self, additional_driving: float = 0) -> bool:
        """Check if rest period is needed"""
        return (self.current_driving_hours + additional_driving > self.MAX_DRIVING_HOURS or
                self.current_duty_hours + additional_driving > self.MAX_DUTY_HOURS)
    
    def _reset_daily_limits(self):
        """Reset daily driving and duty hour limits"""
        self.current_driving_hours = 0
        self.current_duty_hours = 0
        self.driving_start = None
    
    def _generate_daily_logs(self, segments: List[Dict], total_distance: float) -> List[Dict]:
        """Generate daily log entries from segments"""
        daily_logs = []
        current_date = datetime.now().date()
        daily_segments = {}
        
        # Group segments by date
        for segment in segments:
            date = segment['start_time'].date()
            if date not in daily_segments:
                daily_segments[date] = []
            daily_segments[date].append(segment)
        
        # Create daily log for each date
        for date, day_segments in daily_segments.items():
            daily_miles = sum(s.get('distance_miles', 0) for s in day_segments)
            
            # Calculate HOS totals for the day
            off_duty_hours = sum(s['duration_hours'] for s in day_segments if s['duty_status'] == 'off_duty')
            sleeper_berth_hours = sum(s['duration_hours'] for s in day_segments if s['duty_status'] == 'sleeper_berth')
            driving_hours = sum(s['duration_hours'] for s in day_segments if s['duty_status'] == 'driving')
            on_duty_hours = sum(s['duration_hours'] for s in day_segments if s['duty_status'] == 'on_duty')
            
            daily_logs.append({
                'date': date,
                'total_miles': daily_miles,
                'carrier_name': 'Sample Carrier',
                'vehicle_numbers': 'TRUCK-001',
                'driver_name': 'John Doe',
                'off_duty_hours': off_duty_hours,
                'sleeper_berth_hours': sleeper_berth_hours,
                'driving_hours': driving_hours,
                'on_duty_hours': on_duty_hours,
                'segments': day_segments
            })
        
        return daily_logs
    
    def _check_compliance(self) -> Dict:
        """Check HOS compliance status"""
        return {
            'driving_hours_remaining': max(0, self.MAX_DRIVING_HOURS - self.current_driving_hours),
            'duty_hours_remaining': max(0, self.MAX_DUTY_HOURS - self.current_duty_hours),
            'cycle_hours_remaining': max(0, self.MAX_CYCLE_HOURS - self.current_cycle_used),
            'compliant': (self.current_driving_hours <= self.MAX_DRIVING_HOURS and
                         self.current_duty_hours <= self.MAX_DUTY_HOURS and
                         self.current_cycle_used <= self.MAX_CYCLE_HOURS)
        }
