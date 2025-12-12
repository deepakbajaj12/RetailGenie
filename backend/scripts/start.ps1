$ErrorActionPreference = 'Stop'

Write-Host "🚀 Starting RetailGenie API (development)"

# Move to backend root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $ScriptDir '..')

function Get-PythonCmd {
    if (Get-Command py -ErrorAction SilentlyContinue) { return 'py -3' }
    elseif (Get-Command python -ErrorAction SilentlyContinue) { return 'python' }
    else { throw 'Python 3 is not installed or not on PATH.' }
}

$python = Get-PythonCmd
Write-Host "✅ Using $python"

# Create venv if missing
$venvPath = Join-Path (Get-Location) '.venv'
if (-not (Test-Path $venvPath)) {
    Write-Host '📦 Creating virtual environment (.venv)...'
    iex "$python -m venv .venv"
}

# Activate venv
Write-Host '🔧 Activating virtual environment...'
. .\.venv\Scripts\Activate.ps1

# Install deps
Write-Host '📚 Installing dependencies (requirements.txt)...'
python -m pip install --upgrade pip
pip install -r requirements.txt

# Load env file if present
if (Test-Path '.env') {
    Write-Host '🔐 Loading .env (via python-dotenv in app)'
}

# Set dev-friendly defaults
if (-not $env:FLASK_ENV) { $env:FLASK_ENV = 'development' }
if (-not $env:FLASK_DEBUG) { $env:FLASK_DEBUG = 'True' }

Write-Host '🌐 Running app.py on http://localhost:5000'
python app.py
