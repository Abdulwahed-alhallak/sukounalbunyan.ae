# 🔒 SECURE DEPLOYMENT GUIDE - Sukoun Albunyan

## ⚠️ CRITICAL: Credentials Security

**All sensitive production credentials have been removed from source code and moved to environment variables.**

### What Changed?

- ✅ Created `.env.production.example` template
- ✅ Created `secureConfig.js` module for safe credential loading
- ✅ Updated all deployment scripts to use environment variables
- ✅ Removed hardcoded passwords from 20+ files
- ✅ All sensitive data now comes from `.env.production` (not in git)

---

## 🚀 SETUP INSTRUCTIONS (First Time Only)

### Step 1: Create Production Environment File

```bash
# Copy the example file
cp .env.production.example .env.production
```

### Step 2: Fill in Sensitive Values

Edit `.env.production` and add your actual credentials:

```bash
# SSH Access to Production Server
PRODUCTION_HOST=62.72.25.117
PRODUCTION_PORT=65002
PRODUCTION_USERNAME=u256167180
PRODUCTION_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE

# Production Database
PRODUCTION_DB_HOST=localhost
PRODUCTION_DB_USERNAME=u256167180_noble
PRODUCTION_DB_PASSWORD=YOUR_DB_PASSWORD_HERE
PRODUCTION_DB_NAME=u256167180_noble
```

### Step 3: Verify .env.production is Gitignored

```bash
# This file should NEVER appear in git
git check-ignore .env.production
# Should output: .env.production
```

### Step 4: Install Node Dependencies

```bash
npm install
# This installs 'dotenv' which is required by secureConfig.js
```

---

## 📋 DEPLOYMENT SCRIPTS

All deployment scripts now safely read credentials from `.env.production`:

### Auto-Sync Full CI/CD
```bash
cd _scripts/deployment
node auto_sync.cjs "Your commit message here"
```

### Upload Build Assets Only
```bash
node upload_build_sftp.cjs
```

### Upload & Import Database
```bash
node upload_and_import_db_artisan.cjs
```

### Check Production Database Status
```bash
node _check_production_db.cjs
```

---

## 🔍 HOW IT WORKS

### secureConfig.js Module

This module loads credentials safely:

1. Requires `.env.production` file
2. Validates all required credentials are present
3. Returns validated configuration object
4. If any credential is missing, displays helpful error message

### Error Handling

If `.env.production` is missing:

```
❌ MISSING REQUIRED ENVIRONMENT VARIABLES:
   - PRODUCTION_HOST
   - PRODUCTION_PASSWORD
   ...

⚠️  Solution:
   1. Copy .env.production.example to .env.production
   2. Fill in the sensitive values in .env.production
   3. Make sure .env.production is in .gitignore (it should NOT be committed)
```

---

## ✅ SECURITY CHECKLIST

Before running deployment scripts:

- [ ] You have `.env.production` file (local only, never in git)
- [ ] All credentials are filled in correctly
- [ ] `.env.production` is in `.gitignore`
- [ ] You are on `master` branch
- [ ] No uncommitted local changes
- [ ] You have run `npm install` to get dependencies

---

## 🚨 IMPORTANT REMINDERS

1. **NEVER commit `.env.production`** - it contains sensitive credentials
2. **NEVER share `.env.production`** - only developers with production access need it
3. **NEVER hardcode credentials** in source files - always use environment variables
4. **ALWAYS use `secureConfig.js`** when creating new deployment scripts
5. **ROTATE passwords regularly** in production

---

## 📝 For Team Members

If you're setting up deployment for the first time:

1. Ask project lead for the actual `.env.production` file content
2. Create your local `.env.production` with those values
3. Verify `.env.production` is gitignored
4. Test with `node _check_production_db.cjs` to verify connection works
5. Run deployment scripts with confidence!

---

## 🔄 Migration Notes

Old hardcoded values have been removed from:

- `auto_sync.cjs`
- `upload_build_sftp.cjs`
- `upload_and_import_db.cjs`
- `upload_and_import_db_artisan.cjs`
- `_check_production_db.cjs`
- `deploy_env.php`
- `deploy_clean.php`
- All other deployment scripts in `_scripts/deployment/`

If you need to create a new deployment script, use this pattern:

```javascript
// NEW: Secure way to load credentials
const CONFIG = require('./secureConfig.js');
const SSH_CONFIG = CONFIG.SSH;
const APP_DIR = CONFIG.APP_DIR;
const PHP = CONFIG.PHP;

// OLD: (NEVER do this!)
// const SSH_CONFIG = {
//     host: '62.72.25.117',
//     password: '4_m_XMkgux@.AgC'  ❌ NEVER!
// };
```

---

**Last Updated**: 2026-04-15  
**Security Level**: 🔒 HIGH
