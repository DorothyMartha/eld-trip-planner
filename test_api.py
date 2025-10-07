#!/usr/bin/env python3
"""
Simple test script for the ELD Trip Planner API
"""

import requests
import json
import sys

def test_api():
    """Test the API endpoints"""
    
    # Test data
    test_data = {
        "current_location": "New York",
        "pickup_location": "Chicago", 
        "dropoff_location": "Los Angeles",
        "current_cycle_used": 10
    }
    
    try:
        print("Testing ELD Trip Planner API...")
        print(f"Test data: {json.dumps(test_data, indent=2)}")
        
        # Test the calculate-trip endpoint
        response = requests.post(
            "http://localhost:8000/api/calculate-trip/",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ API Test Successful!")
            print(f"Trip ID: {result.get('trip_id')}")
            print(f"Distance: {result.get('distance_miles')} miles")
            print(f"Total Time: {result.get('total_time_hours')} hours")
            print(f"Compliance: {result.get('compliance', {}).get('compliant', 'Unknown')}")
            print(f"Number of daily logs: {len(result.get('daily_logs', []))}")
            print(f"Number of route segments: {len(result.get('route_segments', []))}")
            
            # Test compliance details
            compliance = result.get('compliance', {})
            if compliance:
                print(f"\nHOS Compliance Details:")
                print(f"  Driving hours remaining: {compliance.get('driving_hours_remaining', 0):.1f}")
                print(f"  Duty hours remaining: {compliance.get('duty_hours_remaining', 0):.1f}")
                print(f"  Cycle hours remaining: {compliance.get('cycle_hours_remaining', 0):.1f}")
            
            return True
            
        else:
            print(f"❌ API Test Failed!")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Could not connect to the API server")
        print("Make sure the Django server is running on http://localhost:8000")
        return False
    except requests.exceptions.Timeout:
        print("❌ Timeout Error: API request timed out")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_api()
    sys.exit(0 if success else 1)

