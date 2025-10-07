#!/usr/bin/env python3
"""
Simple deployment test script
"""

import subprocess
import sys
import time
import webbrowser
import requests

def test_backend():
    """Test if backend is running"""
    try:
        response = requests.get("http://localhost:8000/api/", timeout=5)
        print("✅ Backend is running on http://localhost:8000")
        return True
    except:
        print("❌ Backend is not running. Start it with: python manage.py runserver")
        return False

def test_frontend():
    """Test if frontend is running"""
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        print("✅ Frontend is running on http://localhost:3000")
        return True
    except:
        print("❌ Frontend is not running. Start it with: cd frontend && npm start")
        return False

def main():
    print("🚛 ELD Trip Planner - Deployment Test")
    print("=" * 50)
    
    # Test backend
    print("\n1. Testing Backend...")
    backend_ok = test_backend()
    
    # Test frontend
    print("\n2. Testing Frontend...")
    frontend_ok = test_frontend()
    
    # Summary
    print("\n" + "=" * 50)
    if backend_ok and frontend_ok:
        print("🎉 Both servers are running successfully!")
        print("\nYour app is ready for deployment!")
        print("📖 Follow the DEPLOYMENT_GUIDE.md for next steps")
        
        # Ask if user wants to open the app
        try:
            response = input("\nWould you like to open the app in your browser? (y/n): ")
            if response.lower() == 'y':
                webbrowser.open("http://localhost:3000")
        except:
            pass
            
    else:
        print("⚠️  Some servers are not running.")
        print("\nTo start the servers:")
        print("1. Backend: python manage.py runserver")
        print("2. Frontend: cd frontend && npm start")
        print("\nOr use the start_local.bat (Windows) or start_local.sh (Mac/Linux) script")

if __name__ == "__main__":
    main()

