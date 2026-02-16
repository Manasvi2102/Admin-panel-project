# BookNest Deployment Script
# This script helps deploy the application

Write-Host "🚀 BookNest Deployment Script" -ForegroundColor Cyan
Write-Host ""

# Check if user wants to deploy
$deployChoice = Read-Host "Deploy Backend (B), Frontend (F), or Both (A)? [B/F/A]"

if ($deployChoice -eq "B" -or $deployChoice -eq "A") {
    Write-Host "`n📦 Backend Deployment Setup" -ForegroundColor Yellow
    Write-Host "1. Install Render CLI: npm install -g render-cli"
    Write-Host "2. Login: render login"
    Write-Host "3. Deploy: cd backend && render deploy"
    Write-Host ""
    Write-Host "Or use Railway:"
    Write-Host "1. Install Railway CLI: npm install -g @railway/cli"
    Write-Host "2. Login: railway login"
    Write-Host "3. Deploy: cd backend && railway up"
}

if ($deployChoice -eq "F" -or $deployChoice -eq "A") {
    Write-Host "`n🌐 Frontend Deployment Setup" -ForegroundColor Yellow
    Write-Host "1. Install Vercel CLI: npm install -g vercel"
    Write-Host "2. Login: vercel login"
    Write-Host "3. Deploy: cd frontend && vercel --prod"
    Write-Host ""
    Write-Host "Or use Netlify:"
    Write-Host "1. Install Netlify CLI: npm install -g netlify-cli"
    Write-Host "2. Login: netlify login"
    Write-Host "3. Deploy: cd frontend && netlify deploy --prod"
}

Write-Host "`n✅ Deployment files are ready in the repository!" -ForegroundColor Green
Write-Host "Check DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan

