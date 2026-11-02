@echo off
title Push HotelPro to GitHub (dhanshree1414)
color 0A
echo ========================================================
echo        Pushing HotelPro to GitHub (dhanshree1414)
echo ========================================================
set PATH=C:\Users\Lenovo\gh;C:\Users\Lenovo\nodejs;C:\Users\Lenovo\git\cmd;%PATH%
cd /d "%~dp0"

echo.
echo [Step 1/2] Checking GitHub Authentication...
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo --------------------------------------------------------
    echo GitHub Login Required:
    echo 1. Press ENTER to open GitHub in your browser.
    echo 2. Enter the one-time code displayed and click 'Authorize'.
    echo --------------------------------------------------------
    echo.
    gh auth login --web -h github.com
)

echo.
echo [Step 2/2] Creating 'hotelpro' repository and pushing code...
gh repo create hotelpro --public --source=. --remote=origin --push

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Project successfully pushed to:
    echo   https://github.com/dhanshree1414/hotelpro
    echo ========================================================
    start "" https://github.com/dhanshree1414/hotelpro
) else (
    echo.
    echo Syncing and pushing main branch...
    git push -u origin main
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================================
        echo   SUCCESS! Pushed to https://github.com/dhanshree1414/hotelpro
        echo ========================================================
        start "" https://github.com/dhanshree1414/hotelpro
    )
)

echo.
echo Press any key to close this window...
pause >nul
