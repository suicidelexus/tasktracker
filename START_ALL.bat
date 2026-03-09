@echo off
title Task Tracker - Launcher
color 0A

echo ========================================
echo   Task Tracker - Automated Launcher
echo ========================================
echo.
echo Starting Backend and Frontend servers...
echo.

REM Start Backend in new window
start "Task Tracker Backend" cmd /k "cd /d %~dp0 && color 0A && echo Starting Backend on http://localhost:8080 && py -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend in new window
start "Task Tracker Frontend" cmd /k "cd /d %~dp0frontend && echo Starting Frontend on http://localhost:3000 && npm start"

echo.
echo ========================================
echo   Servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8080/docs
echo.
echo Press any key to close this window...
pause > nul

