@echo off
REM ============================================================
REM  Cabinet21 - start the message server + the website together
REM ============================================================
start "Cabinet21 - Message Server" cmd /k node server/index.js
timeout /t 2 >nul
start "Cabinet21 - Website" cmd /k npm run dev
timeout /t 4 >nul
echo.
echo   Website : http://localhost:5173
echo   Panel   : http://localhost:5173/#/admin
echo.
pause
