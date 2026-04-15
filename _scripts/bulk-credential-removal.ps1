#!/usr/bin/env pwsh
# Bulk Security Fix for Nobel Architecture
# Removes all hardcoded SSH credentials from _scripts folder

Write-Host ""
Write-Host "=========================================================="
Write-Host "  🔒 NOBEL ARCHITECTURE - BULK CREDENTIAL REMOVAL"
Write-Host "=========================================================="
Write-Host ""

$updated = 0
$skipped = 0
$errors = @()

# Get path to secureConfig
$secureConfigPath = "_scripts/deployment/secureConfig.js"
if (!(Test-Path $secureConfigPath)) {
    Write-Host "❌ secureConfig.js not found at $secureConfigPath" -ForegroundColor Red
    exit 1
}

# Find all JS files with hardcoded credentials (excluding deployment folder - already done)
$filesToFix = Get-ChildItem -Path "_scripts" -Filter "*.js" -Recurse | 
    Where-Object {
        $_.FullName -notmatch 'node_modules' -and 
        $_.FullName -notmatch '_scripts[\\\/]deployment' -and
        (Get-Content $_.FullName -Raw) -match '4_m_XMkgux@\.AgC'
    }

Write-Host "Found: $($filesToFix.Count) files to update" -ForegroundColor Cyan
Write-Host ""

foreach ($file in $filesToFix) {
    $filePath = $file.FullName
    $fileName = Split-Path $filePath -Leaf
    $fileContent = Get-Content $filePath -Raw
    $relativePath = $filePath -replace [regex]::Escape((Get-Location).Path + '\'), ''
    
    Write-Host "Processing: $fileName..." -ForegroundColor Yellow
    
    try {
        # Check if file already has the require statement
        if ($fileContent -match "require\(['`"]\.\/secureConfig") {
            Write-Host "  ⏭️  Already using secureConfig - skipping" -ForegroundColor Gray
            $skipped++
            continue
        }
        
        # Pattern 1: Replace hardcoded SSH connection object
        # Match: .connect({ host: '62.72.25.117', port: 65002, username: '...', password: '...' })
        $oldPattern = @"
\.connect\(\s*\{\s*host:\s*['"]?62\.72\.25\.117['"]?,\s*port:\s*65002,\s*username:\s*['"]?u256167180['"]?,\s*password:\s*['"]?4_m_XMkgux@\.AgC['"]?\s*\}\s*\)
"@
        
        if ($fileContent -match $oldPattern) {
            # Add require if not present
            if ($fileContent -notmatch "const\s+CONFIG\s*=\s*require\(['`"]") {
                $lines = $fileContent.Split("`n")
                $importLine = "const CONFIG = require('../deployment/secureConfig.js');"
                
                # Find best place to insert (after other requires)
                $insertIdx = 0
                for ($i = 0; $i -lt $lines.Length; $i++) {
                    if ($lines[$i] -match "^(import|const.*require|const.*from)" -or $lines[$i].Trim() -eq "") {
                        $insertIdx = $i + 1
                    } else {
                        break
                    }
                }
                
                $lines = @($lines[0..($insertIdx-1)]) + @($importLine, "") + @($lines[$insertIdx..($lines.Length-1)])
                $fileContent = $lines -join "`n"
            }
            
            # Replace the connection
            $newConnection = ".connect(CONFIG.SSH)"
            $fileContent = $fileContent -replace $oldPattern, $newConnection
            
            Set-Content $filePath $fileContent -Encoding UTF8
            Write-Host "  ✅ Updated connection" -ForegroundColor Green
            $updated++
            continue
        }
        
        # Pattern 2: Replace individual hardcoded const/var declarations
        # host: '62.72.25.117', port: 65002, etc.
        $hasHardcodedHost = $fileContent -match "host:\s*['`"]62\.72\.25\.117['`"]"
        $hasHardcodedUser = $fileContent -match "username:\s*['`"]u256167180['`"]"
        $hasHardcodedPass = $fileContent -match "password:\s*['`"]4_m_XMkgux@\.AgC['`"]"
        
        if ($hasHardcodedHost -or $hasHardcodedUser -or $hasHardcodedPass) {
            # Add require if not present
            if ($fileContent -notmatch "const\s+CONFIG\s*=\s*require\(['`"]") {
                $lines = $fileContent.Split("`n")
                $importLine = "const CONFIG = require('../deployment/secureConfig.js');"
                
                # Find best place to insert
                $insertIdx = 0
                for ($i = 0; $i -lt $lines.Length; $i++) {
                    if ($lines[$i] -match "^(import|const.*require|const.*from)" -or $lines[$i].Trim() -eq "") {
                        $insertIdx = $i + 1
                    } else {
                        break
                    }
                }
                
                $lines = @($lines[0..($insertIdx-1)]) + @($importLine, "") + @($lines[$insertIdx..($lines.Length-1)])
                $fileContent = $lines -join "`n"
            }
            
            # Replace hardcoded values
            $fileContent = $fileContent -replace "host:\s*['`"]62\.72\.25\.117['`"]", "host: CONFIG.SSH.host"
            $fileContent = $fileContent -replace "port:\s*65002", "port: CONFIG.SSH.port"
            $fileContent = $fileContent -replace "username:\s*['`"]u256167180['`"]", "username: CONFIG.SSH.username"
            $fileContent = $fileContent -replace "password:\s*['`"]4_m_XMkgux@\.AgC['`"]", "password: CONFIG.SSH.password"
            
            Set-Content $filePath $fileContent -Encoding UTF8
            Write-Host "  ✅ Updated inline credentials" -ForegroundColor Green
            $updated++
        }
        
    } catch {
        $errorMsg = "Error processing $fileName : $_"
        Write-Host "  ❌ $errorMsg" -ForegroundColor Red
        $errors += $errorMsg
    }
}

Write-Host ""
Write-Host "=========================================================="
Write-Host "  📊 BULK OPERATIONS SUMMARY"
Write-Host "=========================================================="
Write-Host ""
Write-Host "  Updated: $updated files" -ForegroundColor Green
Write-Host "  Skipped: $skipped files" -ForegroundColor Cyan

if ($errors.Count -gt 0) {
    Write-Host "  Errors:  $($errors.Count) files" -ForegroundColor Red
    Write-Host ""
    foreach ($err in $errors) {
        Write-Host "    - $err" -ForegroundColor Red
    }
} else {
    Write-Host "  Errors:  0 files" -ForegroundColor Green
}

Write-Host ""

# Verify results
Write-Host "Running verification scan..." -ForegroundColor Cyan
$remaining = (Get-ChildItem -Path "_scripts" -Filter "*.js" -Recurse | 
    Where-Object {
        $_.FullName -notmatch 'node_modules' -and
        (Get-Content $_.FullName -Raw) -match '4_m_XMkgux@\.AgC'
    }).Count

Write-Host ""
if ($remaining -eq 0) {
    Write-Host "=========================================================="
    Write-Host "  ✅ SECURITY AUDIT PASSED - NO HARDCODED CREDENTIALS"
    Write-Host "=========================================================="
    Write-Host ""
    Write-Host "  All SSH credentials have been moved to environment variables!"
    Write-Host "  Next step: git add && git commit && git push"
    Write-Host ""
} else {
    Write-Host "=========================================================="
    Write-Host "  ⚠️  VERIFICATION FAILED - $remaining FILES STILL HAVE CREDENTIALS"
    Write-Host "=========================================================="
    Write-Host ""
    Write-Host "  Please manually review the following files:" -ForegroundColor Yellow
    Get-ChildItem -Path "_scripts" -Filter "*.js" -Recurse | 
        Where-Object {
            $_.FullName -notmatch 'node_modules' -and
            (Get-Content $_.FullName -Raw) -match '4_m_XMkgux@\.AgC'
        } | ForEach-Object {
            Write-Host "    - $(Split-Path $_.FullName -Leaf)" -ForegroundColor Yellow
        }
    Write-Host ""
}
