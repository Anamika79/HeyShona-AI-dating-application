# AI Dating Platform - Local Setup & Development Guide

This guide describes how to run and verify both the frontend and backend applications independently on Windows.

---

## Prerequisites

* **Python**: Python 3.11+ (verified on Python 3.14.x)
* **Node.js**: Node.js v18+ (verified on Node.js v26.13.x with npm v11.20.x)
* **Git**: Installed and available in PATH (optional for local running)

---

## 1. Backend Setup (`FastAPI`)

Open a terminal (PowerShell) and navigate to `backend/`:

```powershell
cd backend
```

### 1.1 Create and Activate a Virtual Environment
```powershell
# Create virtual environment
python -m venv .venv

# Activate virtual environment in PowerShell
.\.venv\Scripts\Activate.ps1

# (If PowerShell script execution is restricted, run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass)
```

### 1.2 Install Backend Dependencies
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 1.3 Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
Default values in `.env.example` point to local SQLite and enable local development with CORS for `http://localhost:5173`.

### 1.4 Run Backend Unit Tests
```powershell
pytest -v
```

### 1.5 Start the Backend Server
```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
* **API Root**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **Health Check**: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
* **Interactive OpenAPI Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 2. Frontend Setup (`React 19` + `TypeScript` + `Vite`)

Open a second terminal (PowerShell) and navigate to `frontend/`:

```powershell
cd frontend
```

### 2.1 Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
Default value:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 2.2 Install Frontend Dependencies
```powershell
# If node is in default Program Files location but not in PATH for the current terminal:
# $env:PATH = "C:\Program Files\nodejs;" + $env:PATH

npm install
```

### 2.3 Run Production Build & Type Check
```powershell
npm run build
```

### 2.4 Start Frontend Development Server
```powershell
npm run dev
```
Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 3. Verifying the System
1. Start the backend on port 8000.
2. Start the frontend on port 5173.
3. Open [http://localhost:5173](http://localhost:5173) in your browser.
4. The frontend will query `GET /api/v1/health` and display a live "System Online" badge, the current database connectivity status, and service latency.
