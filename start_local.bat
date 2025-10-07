@echo off
echo Starting ELD Trip Planner Locally...
echo.

echo Starting Django Backend Server...
start "Django Backend" cmd /k "python manage.py runserver"

echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul

