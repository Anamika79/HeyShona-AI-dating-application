@echo off
cd /d "%~dp0"
set PYTHONPATH=backend
echo Starting Hey Shona backend server with virtual environment...
".\backend\.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000
pause
