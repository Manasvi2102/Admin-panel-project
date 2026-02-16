# Frontend Deployment Script for Vercel
param(
    [string]$BackendURL = ""
)

Write-Host "🌐 Starting Frontend Deployment..." -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrEmpty($BackendURL)) {
    $BackendURL = Read-Host "Enter your Backend URL (e.g., https://booknest-backend.onrender.com)"
}

# Ensure URL ends with /api
if (-not $BackendURL.EndsWith("/api")) {
    $BackendURL = $BackendURL.TrimEnd("/") + "/api"
}

Write-Host "📝 Please login to Vercel:" -ForegroundColor Yellow
Write-Host "1. A browser window will open"
Write-Host "2. Sign in with GitHub"
Write-Host "3. Come back here when done"
Write-Host ""
$continue = Read-Host "Press Enter to start login process"

# Start login
Write-Host "Opening Vercel login..." -ForegroundColor Green
vercel login

Write-Host ""
Write-Host "✅ Login complete! Now deploying frontend..." -ForegroundColor Green
Write-Host "Setting environment variable: VITE_API_URL=$BackendURL" -ForegroundColor Yellow
Write-Host ""

cd frontend

# Deploy with environment variable
$env:VITE_API_URL = $BackendURL
vercel --prod --yes

Write-Host ""
Write-Host "🎉 Frontend deployment initiated!" -ForegroundColor Green
Write-Host "Your app will be live in a few minutes!" -ForegroundColor Cyan
Write-Host "Check your Vercel dashboard for the URL" -ForegroundColor Cyan

