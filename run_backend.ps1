Set-Location $PSScriptRoot
$env:PYTHONPATH = "backend"
Write-Host "Starting Hey Shona backend server with virtual environment on http://127.0.0.1:8000..." -ForegroundColor Cyan
& ".\backend\.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000
