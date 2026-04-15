#!/usr/bin/env pwsh
# Noble Architecture - Security Audit (PowerShell Version)
# 
# Usage: pwsh security-audit.ps1

Write-Host ""
Write-Host "=========================================================="
Write-Host "  🔒 NOBEL ARCHITECTURE - SECURITY AUDIT"
Write-Host "=========================================================="
Write-Host ""

$pass = 0
$fail = 0
$warn = 0

# Test 1: .env.production protection
Write-Host "[1/5] Checking .env.production protection..."
if (Test-Path ".env.production") {
    Write-Host "  ⚠️  .env.production exists locally (expected for production team)" -ForegroundColor Yellow
    $warn++
} else {
    Write-Host "  ✅ .env.production not in working directory (correct)" -ForegroundColor Green
    $pass++
}

# Test 2: Check secureConfig.js
Write-Host ""
Write-Host "[2/5] Checking secure configuration module..."
if (Test-Path "_scripts/deployment/secureConfig.js") {
    Write-Host "  ✅ secureConfig.js exists" -ForegroundColor Green
    $pass++
    
    $content = Get-Content "_scripts/deployment/secureConfig.js" -Raw
    if ($content -match "process\.env") {
        Write-Host "  ✅ Uses environment variables" -ForegroundColor Green
        $pass++
    }
} else {
    Write-Host "  ❌ secureConfig.js NOT FOUND" -ForegroundColor Red
    $fail++
}

# Test 3: Check for known hardcoded credentials
Write-Host ""
Write-Host "[3/5] Scanning for hardcoded credentials..."
$dangerous = @(
    "4_m_XMkgux@\.AgC",                    # Known prod password
    "github_pat_11AKJYOUA0pHIflNSo"        # Known GitHub PAT
)

$foundBad = 0
$scanExtensions = @("*.cjs", "*.js", "*.php")
$excludeDirs = @("node_modules", "vendor", "Archive")

foreach ($ext in $scanExtensions) {
    $files = Get-ChildItem -Path . -Filter $ext -Recurse -ErrorAction SilentlyContinue | 
        Where-Object { 
            $path = $_.FullName
            $isExcluded = $false
            foreach ($dir in $excludeDirs) {
                if ($path -match $dir) { $isExcluded = $true }
            }
            -not $isExcluded -and $path -notmatch "example|AUDIT|GUIDE"
        }
    
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        foreach ($pattern in $dangerous) {
            if ($content -match $pattern) {
                Write-Host "  ❌ Found credential in: $($file.Name)" -ForegroundColor Red
                $foundBad = 1
                $fail++
            }
        }
    }
}

if ($foundBad -eq 0) {
    Write-Host "  ✅ No hardcoded credentials detected" -ForegroundColor Green
    $pass++
}

# Test 4: Check essential security files
Write-Host ""
Write-Host "[4/5] Checking essential security files..."
$requiredFiles = @(
    ".env.production.example",
    "_scripts/deployment/secureConfig.js",
    "_scripts/deployment/SECURE_DEPLOYMENT_GUIDE.md",
    ".git/hooks/pre-commit",
    "SECURITY_BEST_PRACTICES.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $(Split-Path $file -Leaf)" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "  ⚠️  $(Split-Path $file -Leaf) not found" -ForegroundColor Yellow
        $warn++
    }
}

# Test 5: Check deployment scripts updated
Write-Host ""
Write-Host "[5/5] Checking deployment scripts..."
$criticalScripts = @(
    "auto_sync.cjs",
    "upload_build_sftp.cjs",
    "sync_full_production.cjs"
)

foreach ($script in $criticalScripts) {
    $path = "_scripts/deployment/$script"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        if ($content -match "secureConfig") {
            Write-Host "  ✅ $script uses secureConfig" -ForegroundColor Green
            $pass++
        } else {
            Write-Host "  ⚠️  $script may need update to use secureConfig" -ForegroundColor Yellow
            $warn++
        }
    }
}

# Summary
Write-Host ""
Write-Host "=========================================================="
Write-Host "  📊 SECURITY AUDIT RESULTS"
Write-Host "=========================================================="
Write-Host ""
Write-Host "  ✅ Passed:   $pass" -ForegroundColor Green
Write-Host "  ❌ Failed:   $fail" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Red" })
Write-Host "  ⚠️  Warnings: $warn" -ForegroundColor Yellow
Write-Host ""

if ($fail -eq 0) {
    Write-Host "=========================================================="
    Write-Host "  🎉 SECURITY STATUS: EXCELLENT ✅" -ForegroundColor Green
    Write-Host "=========================================================="
    Write-Host ""
    Write-Host "  All critical security measures are in place!"
    Write-Host ""
    exit 0
} else {
    Write-Host "=========================================================="
    Write-Host "  ❌ SECURITY STATUS: NEEDS ATTENTION" -ForegroundColor Red
    Write-Host "=========================================================="
    Write-Host ""
    exit 1
}
