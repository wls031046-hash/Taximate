@echo off
cd /d "%~dp0"
py -m pip install -q -r requirements.txt 2>nul
py -m streamlit run app.py --server.address 0.0.0.0 --server.port 8501 --server.headless true
