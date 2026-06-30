@echo off
chcp 65001 >nul
set LINK=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Taximate.lnk

if exist "%LINK%" del "%LINK%"
echo Taximate 자동 실행이 해제되었습니다.
pause
