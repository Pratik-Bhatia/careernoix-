# Startup Script for Smart Job Matching

Write-Host "Starting Smart Job Matching Services..." -ForegroundColor Cyan

$ScriptRoot = $PSScriptRoot
$BackendPath = Join-Path $ScriptRoot "backend"
$FrontendPath = Join-Path $ScriptRoot "frontend"
$VenvPath = Join-Path $ScriptRoot "venv"

# 1. Backend Setup & Start
Write-Host "Configuring Backend..." -ForegroundColor Green

# Create Virtual Environment if it doesn't exist
if (-not (Test-Path $VenvPath)) {
    Write-Host "Creating Python virtual environment..."
    python -m venv $VenvPath
}

# Command to run in the backend window
# Note: We use 'call' operator & for the activate script
$BackendCommand = "
    Write-Host 'Initializing Backend...' -ForegroundColor Cyan;
    & '$VenvPath\Scripts\activate';
    Write-Host 'Installing backend dependencies...' -ForegroundColor Yellow;
    pip install -r '$BackendPath\requirements.txt';
    Write-Host 'Starting FastAPI Server on Port 8000...' -ForegroundColor Green;
    cd '$BackendPath';
    uvicorn app.main:app --reload --port 8000;
    if (`$LASTEXITCODE -ne 0) { Read-Host 'Backend crashed. Press Enter to exit...' }
"

# Start Backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "$BackendCommand" -WindowStyle Normal
Write-Host "Backend service started in a new window." -ForegroundColor Gray

# 2. Frontend Setup & Start
Write-Host "Configuring Frontend..." -ForegroundColor Green

# Command to run in the frontend window
$FrontendCommand = "
    Write-Host 'Initializing Frontend...' -ForegroundColor Cyan;
    cd '$FrontendPath';
    Write-Host 'Installing frontend dependencies...' -ForegroundColor Yellow;
    npm install;
    Write-Host 'Starting Next.js Server on Port 3000...' -ForegroundColor Green;
    npm run dev -- -p 3000;
    if (`$LASTEXITCODE -ne 0) { Read-Host 'Frontend crashed. Press Enter to exit...' }
"

# Start Frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "$FrontendCommand" -WindowStyle Normal
Write-Host "Frontend service started in a new window." -ForegroundColor Gray

Write-Host "All services launched!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000/docs"
Write-Host "Frontend: http://localhost:3000"
