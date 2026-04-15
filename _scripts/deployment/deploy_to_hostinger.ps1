# ============================================================
# NOBLE ARCHITECTURE ERP - PRODUCTION DEPLOYMENT & SYNC PIPELINE
# ============================================================
# TARGET: noble.dion.sy (Hostinger)
# MySQL Remote Push: srv1142.hstgr.io

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🚀 INITIATING DEPLOYMENT TO NOBLE.DION.SY 🚀" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Load credentials from .env.production
$envFile = "$PSScriptRoot/../../.env.production"
if (!(Test-Path $envFile)) {
    Write-Host "❌ ERROR: .env.production file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.production.example to .env.production and fill in your credentials." -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/3] SYNCING CODE TO GITHUB MASTER..." -ForegroundColor Yellow

# Use GitHub PAT from environment variable (NOT hardcoded)
$PAT = $env:GITHUB_PAT
if (!$PAT) {
    Write-Host "❌ ERROR: GITHUB_PAT environment variable not set!" -ForegroundColor Red
    Write-Host "Set it using: \$env:GITHUB_PAT = 'your_token_here'" -ForegroundColor Yellow
    exit 1
}

$REPO_URL = "https://x-access-token:$PAT@github.com/Abdulwahed-alhallak/nobel.dion.sy.git"

git add .
git commit -m "Auto-Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Noble Architecture Master Sync"
git push $REPO_URL HEAD:main --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ GitHub Sync Failed (Token/Permissions error). Skipping to Database Sync..." -ForegroundColor Yellow
} else {
    Write-Host "✅ Code successfully pushed to GitHub vault." -ForegroundColor Green
}
Write-Host ""

Write-Host "[2/3] SYNCHRONIZING LOCAL DATABASE SCHEMA TO HOSTINGER REMOTE MYSQL..." -ForegroundColor Yellow
Write-Host "Target: u256167180_noble @ srv1142.hstgr.io" -ForegroundColor Gray

# Force pushing migrations to the remote database using the 'hostinger' connection we defined previously.
php artisan migrate --database=hostinger --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database Synchronization Failed! Ensure your IP is whitelisted on Hostinger Remote MySQL." -ForegroundColor Red
} else {
    Write-Host "✅ Database structures synced to Production flawlessly." -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/3] HOSTINGER SERVER PULL" -ForegroundColor Yellow
Write-Host "The pipeline has staged your database and code. To apply the live files, use:" -ForegroundColor Gray
Write-Host "  node _scripts/deployment/auto_sync.cjs 'Your commit message'" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or manually SSH and pull:" -ForegroundColor Gray
Write-Host "  ssh -p 65002 u256167180@62.72.25.117" -ForegroundColor Cyan
Write-Host "  Then: cd public_html && git pull origin master" -ForegroundColor Cyan
Write-Host ""
Write-Host "Deployment Pipeline Execution Finished!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  NOTE: Never commit sensitive credentials to Git. Use .env.production instead." -ForegroundColor Yellow
