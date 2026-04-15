#!/usr/bin/env pwsh
# Final Credential Removal - Additional Files
# Handles sync/ and fixes/ folders plus PHP files

Write-Host ""
Write-Host "=========================================================="
Write-Host "  🔒 FINAL CREDENTIAL REMOVAL PASS"
Write-Host "=========================================================="
Write-Host ""

$updated = 0
$errors = @()

# List of remaining files with credentials
$filesToFix = @(
    "_scripts/hostinger/sync_full.cjs",
    "_scripts/sync/b64_upload.cjs",
    "_scripts/sync/disable_captcha.cjs",
    "_scripts/sync/phased_upload.cjs",
    "_scripts/sync/remote_sync_employees.cjs",
    "_scripts/sync/robust_upload.cjs",
    "_scripts/sync/surgical_fix.cjs",
    "_scripts/database/database.php",
    "_scripts/fixes/final_deploy_fix.php",
    "_scripts/database/import_db.php"
)

foreach ($filePath in $filesToFix) {
    if (!(Test-Path $filePath)) {
        Write-Host "⏭️  File not found: $filePath" -ForegroundColor Gray
        continue
    }
    
    $fileName = Split-Path $filePath -Leaf
    $folder = Split-Path $filePath -Parent
    Write-Host "Processing: $fileName..." -ForegroundColor Yellow
    
    try {
        $content = Get-Content $filePath -Raw -ErrorAction Stop
        
        # Determine required path for secureConfig based on file location
        $depth = ($folder -split '\\').Count - ($folder -replace '[^\\]').Length
        $relativePath = "../" * $depth + "deployment/secureConfig.js"
        
        # Different handling for different file types
        if ($filePath -match "\.php$") {
            # PHP files - require phpdotenv
            if ($content -notmatch "Dotenv") {
                Write-Host "  ⚠️  PHP file - requires phpdotenv handling, skipping" -ForegroundColor Gray
                continue
            }
        } elseif ($filePath -match "\.cjs$") {
            # Node.js CJS files
            if ($content -notmatch "require.*secureConfig") {
                # Add require if not present
                $lines = $content.Split("`n")
                $importLine = "const CONFIG = require('$relativePath');"
                
                # Find best place to insert
                $insertIdx = 0
                for ($i = 0; $i -lt $lines.Length; $i++) {
                    if ($lines[$i] -match "^(const|var|let|require|const.*require)" -or $lines[$i].Trim() -eq "") {
                        $insertIdx = $i + 1
                    } else {
                        break
                    }
                }
                
                $lines = @($lines[0..($insertIdx-1)]) + @($importLine, "") + @($lines[$insertIdx..($lines.Length-1)])
                $content = $lines -join "`n"
            }
            
            # Replace SSH config references
            $content = $content -replace "host:\s*['`"]62\.72\.25\.117['`"]", "host: CONFIG.SSH.host"
            $content = $content -replace "port:\s*65002", "port: CONFIG.SSH.port"
            $content = $content -replace "username:\s*['`"]u256167180['`"]", "username: CONFIG.SSH.username"
            $content = $content -replace "password:\s*['`"]4_m_XMkgux@\.AgC['`"]", "password: CONFIG.SSH.password"
            
            # Replace inline SSH connection
            $content = $content -replace "\.connect\(\s*\{\s*host:\s*['`"]?62\.72\.25\.117['`"]?,\s*port:\s*65002,\s*username:\s*['`"]?u256167180['`"]?,\s*password:\s*['`"]?4_m_XMkgux@\.AgC['`"]?\s*\}\s*\)", ".connect(CONFIG.SSH)"
        }
        
        # Replace embedded database credentials  
        $content = $content -replace "4_m_XMkgux@\.AgC", "`$\{CONFIG.DB.password\}"
        $content = $content -replace "u256167180_noble", "`$\{CONFIG.DB.database\}"
        $content = $content -replace "'u256167180_noble'", "`$(CONFIG.DB.database)"
        $content = $content -replace "'u256167180'", "`$(CONFIG.DB.username)"
        
        Set-Content $filePath $content -Encoding UTF8
        Write-Host "  ✅ Updated" -ForegroundColor Green
        $updated++
        
    } catch {
        Write-Host "  ❌ Error: $_" -ForegroundColor Red
        $errors += "$filePath : $_"
    }
}

Write-Host ""
Write-Host "=========================================================="
Write-Host "  📝 SUMMARY"
Write-Host "=========================================================="
Write-Host "  Updated: $updated files" -ForegroundColor Green
if ($errors.Count -gt 0) {
    Write-Host "  Errors: $($errors.Count) files" -ForegroundColor Red
}
Write-Host ""
