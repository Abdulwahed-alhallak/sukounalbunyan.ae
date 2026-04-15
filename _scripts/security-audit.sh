#!/bin/bash
# Noble Architecture - Security Audit Script
# This script performs comprehensive security checks on the application
# 
# Usage: bash _scripts/security-audit.sh
# or: chmod +x _scripts/security-audit.sh && ./_scripts/security-audit.sh

echo ""
echo "=========================================================="
echo "🔒 NOBLE ARCHITECTURE - SECURITY AUDIT"
echo "=========================================================="
echo ""

PASS=0
FAIL=0
WARN=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================
# Test 1: Check if .env.production exists and is in .gitignore
# ============================================================
echo "[1/10] Checking .env.production protection..."

if git check-ignore -q .env.production 2>/dev/null; then
    echo -e "${GREEN}✅ .env.production is in .gitignore${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ .env.production is NOT in .gitignore${NC}"
    ((FAIL++))
fi

if [ -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  .env.production exists locally (expected for production only)${NC}"
    ((WARN++))
else
    echo -e "${GREEN}✅ .env.production not in working directory (expected for local dev)${NC}"
    ((PASS++))
fi

# ============================================================
# Test 2: Check for hardcoded credentials in source code
# ============================================================
echo ""
echo "[2/10] Scanning for hardcoded credentials..."

CREDENTIAL_PATTERNS=(
    "4_m_XMkgux@\.AgC"
    "github_pat_11AKJYOUA0pHIflNSo"
    "password.*=.*['\"].*['\"]"
)

FOUND_CREDENTIALS=0
for pattern in "${CREDENTIAL_PATTERNS[@]}"; do
    # Search in JS/TS/PHP files only (exclude .env.production.example)
    if grep -r "$pattern" \
        --include="*.js" \
        --include="*.ts" \
        --include="*.php" \
        --include="*.jsx" \
        --include="*.tsx" \
        --exclude-dir=node_modules \
        --exclude-dir=vendor \
        --exclude=".env.production.example" \
        . 2>/dev/null | grep -v "SECURE_DEPLOYMENT_GUIDE\|SECURITY_AUDIT\|APPLICATION_AUDIT"; then
        echo -e "${RED}❌ Found potential credential: $pattern${NC}"
        FOUND_CREDENTIALS=1
        ((FAIL++))
    fi
done

if [ $FOUND_CREDENTIALS -eq 0 ]; then
    echo -e "${GREEN}✅ No hardcoded credentials detected in source code${NC}"
    ((PASS++))
fi

# ============================================================
# Test 3: Check if secureConfig.js exists
# ============================================================
echo ""
echo "[3/10] Checking secure configuration module..."

if [ -f "_scripts/deployment/secureConfig.js" ]; then
    echo -e "${GREEN}✅ secureConfig.js exists${NC}"
    ((PASS++))
    
    if grep -q "process.env\[" "_scripts/deployment/secureConfig.js"; then
        echo -e "${GREEN}✅ secureConfig.js uses environment variables${NC}"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠️  secureConfig.js may not be loading environment variables properly${NC}"
        ((WARN++))
    fi
else
    echo -e "${RED}❌ secureConfig.js not found${NC}"
    ((FAIL++))
fi

# ============================================================
# Test 4: Check deployment scripts use secureConfig
# ============================================================
echo ""
echo "[4/10] Checking deployment scripts..."

DEPLOYMENT_SCRIPTS=(
    "auto_sync.cjs"
    "upload_build_sftp.cjs"
    "sync_full_production.cjs"
)

for script in "${DEPLOYMENT_SCRIPTS[@]}"; do
    if [ -f "_scripts/deployment/$script" ]; then
        if grep -q "secureConfig" "_scripts/deployment/$script"; then
            echo -e "${GREEN}✅ $script uses secureConfig${NC}"
            ((PASS++))
        else
            echo -e "${YELLOW}⚠️  $script may not use secureConfig${NC}"
            ((WARN++))
        fi
    fi
done

# ============================================================
# Test 5: Check pre-commit hook exists
# ============================================================
echo ""
echo "[5/10] Checking Git pre-commit hook..."

if [ -f ".git/hooks/pre-commit" ]; then
    echo -e "${GREEN}✅ Pre-commit hook exists${NC}"
    ((PASS++))
    
    if [ -x ".git/hooks/pre-commit" ]; then
        echo -e "${GREEN}✅ Pre-commit hook is executable${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ Pre-commit hook is not executable${NC}"
        chmod +x ".git/hooks/pre-commit"
        echo -e "${GREEN}✅ Made pre-commit hook executable${NC}"
        ((PASS++))
    fi
else
    echo -e "${RED}❌ Pre-commit hook not found${NC}"
    ((FAIL++))
fi

# ============================================================
# Test 6: Check .env.production.example exists
# ============================================================
echo ""
echo "[6/10] Checking environment template..."

if [ -f ".env.production.example" ]; then
    echo -e "${GREEN}✅ .env.production.example exists${NC}"
    ((PASS++))
    
    if grep -q "PRODUCTION_" ".env.production.example"; then
        echo -e "${GREEN}✅ Template has required variables${NC}"
        ((PASS++))
    fi
else
    echo -e "${RED}❌ .env.production.example not found${NC}"
    ((FAIL++))
fi

# ============================================================
# Test 7: Check documentation
# ============================================================
echo ""
echo "[7/10] Checking security documentation..."

DOC_FILES=(
    "SECURE_DEPLOYMENT_GUIDE.md"
    "SECURITY_AUDIT_SUMMARY.md"
    "SECURITY_AUDIT_FINAL_REPORT.md"
)

for doc in "${DOC_FILES[@]}"; do
    if [ -f "_scripts/deployment/$doc" ]; then
        echo -e "${GREEN}✅ $(basename $doc) exists${NC}"
        ((PASS++))
    elif [ -f "$doc" ]; then
        echo -e "${GREEN}✅ $(basename $doc) exists${NC}"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠️  $doc not found${NC}"
        ((WARN++))
    fi
done

# ============================================================
# Test 8: Check git status
# ============================================================
echo ""
echo "[8/10] Checking Git status..."

if git diff --quiet; then
    echo -e "${GREEN}✅ No uncommitted changes in tracked files${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  Uncommitted changes exist${NC}"
    ((WARN++))
fi

if git diff --cached --quiet; then
    echo -e "${GREEN}✅ No staged changes${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  Some changes are staged${NC}"
    ((WARN++))
fi

# ============================================================
# Test 9: Check dependencies
# ============================================================
echo ""
echo "[9/10] Checking dependencies..."

if [ -f "composer.json" ] && [ -d "vendor" ]; then
    echo -e "${GREEN}✅ PHP dependencies installed${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  PHP dependencies may not be installed (run: composer install)${NC}"
    ((WARN++))
fi

if [ -f "package.json" ] && [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Node dependencies installed${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  Node dependencies may not be installed (run: npm install)${NC}"
    ((WARN++))
fi

# ============================================================
# Test 10: Check build artifacts
# ============================================================
echo ""
echo "[10/10] Checking build artifacts..."

if [ -f "public/build/manifest.json" ]; then
    echo -e "${GREEN}✅ Build artifacts exist${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  Build artifacts not found (run: npm run build)${NC}"
    ((WARN++))
fi

# ============================================================
# Summary
# ============================================================
echo ""
echo "=========================================================="
echo "📊 SECURITY AUDIT RESULTS"
echo "=========================================================="

TOTAL=$((PASS + FAIL + WARN))

echo -e "${GREEN}✅ Passed: $PASS${NC}"
echo -e "${RED}❌ Failed: $FAIL${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARN${NC}"
echo "Total Tests: $TOTAL"

echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}=========================================================="
    echo "🎉 ALL CRITICAL CHECKS PASSED!"
    echo "🟢 SECURITY STATUS: EXCELLENT"
    echo "=========================================================${NC}"
    exit 0
else
    echo -e "${RED}=========================================================="
    echo "❌ CRITICAL ISSUES FOUND"
    echo "🔴 SECURITY STATUS: NEEDS ATTENTION"
    echo "=========================================================${NC}"
    exit 1
fi
