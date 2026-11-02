@echo off
title HotelPro - Complete Hotel Booking & Management Solution
echo ========================================================
echo        Starting HotelPro Management Solution...
echo ========================================================
set PATH=C:\Users\Lenovo\nodejs;C:\Users\Lenovo\git\cmd;%PATH%
cd /d "%~dp0"

echo.
echo [1/2] Launching Browser to http://localhost:5000 ...
timeout /t 2 /nobreak >nul
start "" http://localhost:5000

echo [2/2] Starting HotelPro Server...
echo --------------------------------------------------------
echo Web App URL: http://localhost:5000
echo Admin Login: admin@hotelpro.com / adminpassword123
echo Guest Login: guest@hotelpro.com / guestpassword123
echo --------------------------------------------------------
echo (Keep this window open while using HotelPro)
echo.

node server/server.js
pause
