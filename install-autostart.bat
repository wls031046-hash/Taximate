@echo off
chcp 65001 >nul
set STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set LINK=%STARTUP%\Taximate.lnk"

echo Taximate 자동 실행 등록 중...
echo.

powershell -NoProfile -Command ^
  "$s = New-Object -ComObject WScript.Shell; ^
   $sc = $s.CreateShortcut('%LINK%'); ^
   $sc.TargetPath = '%~dp0run-background.vbs'; ^
   $sc.WorkingDirectory = '%~dp0'; ^
   $sc.Description = 'Taximate 택시 합승'; ^
   $sc.Save()"

if errorlevel 1 (
  echo [오류] 등록에 실패했습니다.
  pause
  exit /b 1
)

echo [완료] PC 로그인할 때마다 Taximate가 백그라운드에서 실행됩니다.
echo        주소: http://127.0.0.1:8501
echo.
echo 지금 바로 켤까요? (Y/N)
set /p NOW=
if /i "%NOW%"=="Y" start "" "%~dp0run-background.vbs"

pause
