@echo off
chcp 65001 >nul
echo Taximate 서버 종료 중...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8501" ^| findstr "LISTENING"') do (
  taskkill /PID %%a /F >nul 2>&1
)

echo 완료. (8501 포트 사용 프로세스를 종료했습니다.)
pause
