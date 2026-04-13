# ============================================================
# NOBLE ARCHITECTURE - DIRECT SFTP BYPASS UPLOAD
# ============================================================
# Use this when GitHub PAT tokens fail and you need a direct physical upload.

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🚀 INITIATING SECURE DIRECT UPLOAD TO HOSTINGER 🚀" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$File = "noble_production_ecosystem.tar.gz"
if (-Not (Test-Path $File)) {
    Write-Host "❌ Deployment bundle $File not found! Run the tar archive command first." -ForegroundColor Red
    exit 1
}

Write-Host "Transferring $File via SFTP..." -ForegroundColor Yellow
Write-Host "Target: u256167180@62.72.25.117:65002 " -ForegroundColor Gray
Write-Host "Destination: Hostinger Root Directory (~/) " -ForegroundColor Gray
Write-Host "Please wait, uploading massive production binary..." -ForegroundColor Magenta

# Secure SFTP execution via curl
curl.exe -k --insecure -T $File -u "u256167180:4_m_XMkgux@.AgC" "sftp://62.72.25.117:65002/~/noble_production_ecosystem.tar.gz"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Upload Successful! The tar file is now sitting in your Hostinger File Manager root folder." -ForegroundColor Green
    Write-Host "Step 1: Open Hostinger File Manager." -ForegroundColor Yellow
    Write-Host "Step 2: Right-click noble_production_ecosystem.tar.gz and select 'Extract to public_html'." -ForegroundColor Yellow
} else {
    Write-Host "❌ Upload Failed. Check your network or Hostinger IP blocklist." -ForegroundColor Red
}
