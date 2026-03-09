@echo off
cd /d "%~dp0"
echo Starting Backend Server on http://localhost:8080
py -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload



