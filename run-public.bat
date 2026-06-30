@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  ========================================
echo   Taximate - 인터넷 공개 모드
echo  ========================================
echo.

where cloudflared >nul 2>&1
if errorlevel 1 (
  echo [1/3] cloudflared 설치 중... (최초 1회, 1~2분 소요)
  winget install --id Cloudflare.cloudflared -e --accept-package-agreements --accept-source-agreements
  if errorlevel 1 (
    echo.
    echo [오류] 자동 설치 실패. 아래에서 직접 설치해 주세요:
    echo https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
    pause
    exit /b 1
  )
  echo 설치 완료. 이 창을 닫고 run-public.bat 을 다시 실행해 주세요.
  pause
  exit /b 0
)

echo [1/3] Taximate 서버 시작...
netstat -ano | findstr ":8501" | findstr "LISTENING" >nul
if errorlevel 1 (
  start "" "%~dp0run-background.vbs"
  timeout /t 4 /nobreak >nul
) else (
  echo        이미 실행 중입니다.
)

echo [2/3] 인터넷 터널 연결 중...
echo.
echo  ========================================
echo   아래 https://....trycloudflare.com 주소를
echo   다른 네트워크( LTE, 다른 Wi-Fi )에서도
echo   브라우저에 입력하면 접속됩니다.
echo.
echo   이 검은 창을 닫으면 공개 접속이 끊깁니다.
echo  ========================================
echo.

cloudflared tunnel --url http://127.0.0.1:8501

pause
