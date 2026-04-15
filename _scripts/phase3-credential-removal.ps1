#!/usr/bin/env pwsh
# Clean all remaining files of hardcoded credentials PHASE 3

$files = @(
    "_scripts/fixes/final_deploy_fix.php",
    "_scripts/hostinger/import_db.php",
    "_scripts/hostinger/sync_full.cjs",
    "_scripts/sync/b64_upload.cjs",
    "_scripts/sync/disable_captcha.cjs",
    "_scripts/sync/phased_upload.cjs",
    "_scripts/sync/remote_sync_employees.cjs",
    "_scripts/sync/robust_upload.cjs",
    "_scripts/sync/surgical_fix.cjs"
)

Write-Host "=== PHASE 3: FINAL CREDENTIAL REMOVAL ===" -ForegroundColor Cyan
Write-Host ""

$updated = 0

foreach ($file in $files) {
    if (!(Test-Path $file)) {
        Write-Host "⏭️  $file - not found" -ForegroundColor Gray
        continue
    }
    
    Write-Host "Cleaning: $(Split-Path $file -Leaf)..." -ForegroundColor Yellow
    
    $content = Get-Content $file -Raw
    
    # Replace credentials with placeholders  
    $content = $content -replace '4_m_XMkgux@\.AgC', '${CONFIG.DB.password}'
    $content = $content -replace "host:\s*[']62\.72\.25\.117[']", 'host: CONFIG.SSH.host'
    $content = $content -replace "host:\s*[`"]62\.72\.25\.117[`"]", 'host: CONFIG.SSH.host'
    $content = $content -replace 'port:\s*65002', 'port: CONFIG.SSH.port'
    $content = $content -replace "username:\s*u256167180", 'username: CONFIG.SSH.username'
    $content = $content -replace "password:\s*4_m_XMkgux", 'password: CONFIG.SSH.password'
    
    Set-Content $file $content -Encoding UTF8
    Write-Host "  ✅ Updated" -ForegroundColor Green
    $updated++
}

Write-Host ""
Write-Host "✅ Cleaned $updated files" -ForegroundColor Green
