@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  ========================================
echo   Taximate 시작 중...
echo  ========================================
echo.

py --version >nul 2>&1
if errorlevel 1 (
  echo [오류] Python이 없습니다. https://python.org 에서 설치해 주세요.
  pause
  exit /b 1
)

echo [1/2] 패키지 확인 중...
py -m pip install -q -r requirements.txt
if errorlevel 1 (
  echo [오류] 패키지 설치에 실패했습니다.
  pause
  exit /b 1
)

echo [2/2] 서버 실행 중... 브라우저가 자동으로 열립니다.
echo        이 PC:     http://127.0.0.1:8501
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /c:"IPv4"') do (
  set IP=%%i
  goto :found
)
:found
if defined IP echo        같은 Wi-Fi: http://%IP:~1%:8501
echo        종료하려면 이 창에서 Ctrl+C 를 누르세요.
echo.

py -m streamlit run app.py --server.address 0.0.0.0 --server.port 8501

pause
