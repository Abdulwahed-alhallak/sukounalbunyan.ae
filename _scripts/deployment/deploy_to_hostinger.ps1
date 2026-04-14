# ============================================================
# NOBLE ARCHITECTURE ERP - PRODUCTION DEPLOYMENT & SYNC PIPELINE
# ============================================================
# TARGET: noble.dion.sy (Hostinger)
# MySQL Remote Push: srv1142.hstgr.io

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🚀 INITIATING DEPLOYMENT TO NOBLE.DION.SY 🚀" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1/3] SYNCING CODE TO GITHUB MASTER..." -ForegroundColor Yellow

# Use the Fine-grained PAT to authenticate silently
$PAT = "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"
$REPO_URL = "https://x-access-token:$PAT@github.com/Abdulwahed-alhallak/nobel.dion.sy.git"

git add .
git commit -m "Auto-Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Noble Architecture Master Sync"
git push $REPO_URL HEAD:main --force
# (Note: Using HEAD:main or master depending on your repo branch, typically main on GitHub but adjust if your branch is 'master')

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
Write-Host "The pipeline has staged your database and code. To apply the live files, log into Hostinger SSH:" -ForegroundColor Gray
Write-Host "ssh -p 65002 u256167180@62.72.25.117" -ForegroundColor Cyan
Write-Host "Password: 4_m_XMkgux@.AgC" -ForegroundColor Cyan
Write-Host "Then type: git pull origin main (or master)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Deployment Pipeline Execution Finished!" -ForegroundColor Green
