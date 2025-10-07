#!/bin/bash

echo "Starting ELD Trip Planner Locally..."
echo

echo "Starting Django Backend Server..."
gnome-terminal -- bash -c "python manage.py runserver; exec bash"

echo
echo "Waiting 5 seconds for backend to start..."
sleep 5

echo
echo "Starting React Frontend..."
gnome-terminal -- bash -c "cd frontend && npm start; exec bash"

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to exit..."
wait

