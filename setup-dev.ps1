#!/usr/bin/env pwsh
# Quick setup script for Steam Limbus AI Notifier development environment
# Run this script with: ./setup-dev.ps1

Write-Host "🚀 Setting up Steam Limbus AI Notifier development environment..." -ForegroundColor Green

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js v20.x LTS" -ForegroundColor Red
    Write-Host "Run: winget install --exact OpenJS.NodeJS.LTS --version 20.17.0" -ForegroundColor Cyan
    exit 1
}

# Check if npm is available
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm not found. Please reinstall Node.js" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}
else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
}
else {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created from template" -ForegroundColor Green
        Write-Host "🔧 Please edit .env file with your Steam API key and other settings" -ForegroundColor Cyan
    }
    else {
        Write-Host "❌ .env.example template not found" -ForegroundColor Red
    }
}

# Check for Steam API key
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "STEAM_API_KEY=your_steam_api_key" -or $envContent -match "STEAM_API_KEY=$") {
        Write-Host "⚠️  Please set your Steam API key in .env file" -ForegroundColor Yellow
        Write-Host "Get your API key from: https://steamcommunity.com/dev/apikey" -ForegroundColor Cyan
    }
    else {
        Write-Host "✅ Steam API key appears to be configured" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your Steam API key" -ForegroundColor White
Write-Host "2. Run 'npm start' to start the application" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For more detailed instructions, see DEVELOPMENT_SETUP.md" -ForegroundColor Gray
