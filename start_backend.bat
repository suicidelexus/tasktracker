@echo off
cd /d "%~dp0"
echo ========================================
echo   Task Tracker - Запуск Backend
echo ========================================
echo.
echo Запуск сервера на http://0.0.0.0:8080
echo Для доступа из локальной сети используйте ваш IP адрес
echo.
py main.py
pause

