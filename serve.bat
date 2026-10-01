@echo off
REM ============================================================
REM  Cabinet21 - build the site and serve it with the API server
REM  (production mode: http://localhost:8787  and  /#/admin)
REM ============================================================
call npm run build
node server/index.js
pause
