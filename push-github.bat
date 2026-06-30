@echo off
chcp 65001 >nul
cd /d "%~dp0"

where git >nul 2>&1
if errorlevel 1 (
  echo Git이 설치되어 있지 않습니다.
  echo.
  echo [설치] https://git-scm.com/download/win
  echo        또는: winget install Git.Git
  echo.
  echo 설치 후 이 파일을 다시 실행하세요.
  pause
  exit /b 1
)

if not exist ".git" (
  git init
  git branch -M main
)

git add .
git status

echo.
echo ========================================
echo  GitHub에 올릴 준비가 됐습니다.
echo  아래 명령을 순서대로 실행하세요:
echo ========================================
echo.
echo  git remote add origin https://github.com/wls031046-hash/Taximate.git
echo  git commit -m "Initial commit: Taximate Streamlit app"
echo  git push -u origin main
echo.
echo  (이미 remote가 있으면 add 대신 push만 하세요)
echo ========================================
echo.

set /p DO="지금 commit + push 할까요? (Y/N): "
if /i not "%DO%"=="Y" pause & exit /b 0

git remote remove origin 2>nul
git remote add origin https://github.com/wls031046-hash/Taximate.git
git commit -m "Initial commit: Taximate Streamlit app"
git push -u origin main

if errorlevel 1 (
  echo.
  echo push 실패. GitHub 로그인이 필요할 수 있습니다.
  echo 브라우저로 로그인하거나 Personal Access Token을 사용하세요.
) else (
  echo.
  echo [완료] https://github.com/wls031046-hash/Taximate
  echo.
  echo 다음: https://share.streamlit.io 에서 이 저장소를 Deploy
)

pause
