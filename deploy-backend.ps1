# Backend Deployment Script for Render
Write-Host "🚀 Starting Backend Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if render CLI is installed
$renderInstalled = npm list -g render-cli 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing Render CLI..." -ForegroundColor Yellow
    npm install -g render-cli
}

Write-Host "📝 Please login to Render:" -ForegroundColor Yellow
Write-Host "1. A browser window will open"
Write-Host "2. Sign in with GitHub"
Write-Host "3. Come back here when done"
Write-Host ""
$continue = Read-Host "Press Enter to start login process"

# Start login
Write-Host "Opening Render login..." -ForegroundColor Green
render login

Write-Host ""
Write-Host "✅ Login complete! Now deploying backend..." -ForegroundColor Green
Write-Host ""

cd backend
render deploy

Write-Host ""
Write-Host "🎉 Backend deployment initiated!" -ForegroundColor Green
Write-Host "Check your Render dashboard for deployment status" -ForegroundColor Cyan

