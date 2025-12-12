$ErrorActionPreference = 'Stop'

Write-Host "🚀 Starting RetailGenie API (production)"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $ScriptDir '..')

function Get-PythonCmd {
    if (Get-Command py -ErrorAction SilentlyContinue) { return 'py -3' }
    elseif (Get-Command python -ErrorAction SilentlyContinue) { return 'python' }
    else { throw 'Python 3 is not installed or not on PATH.' }
}

$python = Get-PythonCmd
Write-Host "✅ Using $python"

$venvPath = Join-Path (Get-Location) '.venv'
if (-not (Test-Path $venvPath)) {
    Write-Host '📦 Creating virtual environment (.venv)...'
    iex "$python -m venv .venv"
}

. .\.venv\Scripts\Activate.ps1

Write-Host '📚 Installing dependencies (requirements.txt)...'
python -m pip install --upgrade pip
pip install -r requirements.txt

$env:FLASK_ENV = 'production'
$env:FLASK_DEBUG = 'False'
$env:SESSION_COOKIE_SECURE = 'True'

Write-Host '🧪 Running a quick health check after startup'
Write-Host '🌐 Running app_production.py on http://localhost:5000'
python app_production.py
