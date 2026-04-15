# 🚀 NOBLE ARCHITECTURE - QUICK START GUIDE

**Version**: 1.1 (Security Hardened)  
**Last Updated**: April 15, 2026  
**Status**: ✅ Production Ready

---

## 🎯 للبدء بسرعة

### 1️⃣ **التحضير الأول** (لمرة واحدة)

```bash
# اختر أحد الخيارات:

# الخيار أ: إذا كان عندك .env.production من المسؤول
cp .env.production.example .env.production
# ثم أضف البيانات الحقيقية

# الخيار ب: للتطوير المحلي (فقط)
cp .env.example .env
php artisan key:generate
```

### 2️⃣ **تثبيت المكتبات**

```bash
# PHP Dependencies
composer install

# JavaScript/Node Dependencies  
npm install

# Build Frontend Assets
npm run build
```

### 3️⃣ **إعداد قاعدة البيانات**

```bash
# Create database
php artisan migrate

# Seed data (optional)
php artisan db:seed

# Create storage link
php artisan storage:link
```

### 4️⃣ **تشغيل التطبيق**

```bash
# Development
npm run dev

# In another terminal
php artisan serve
```

ثم اذهب إلى: `http://localhost:8000`

---

## 🔐 لـ Production (النشر)

### قبل النشر مباشرة

```bash
# 1. تأكد من وجود .env.production
ls -la .env.production    # يجب أن يكون موجوداً

# 2. اختبر الاتصال بالخادم
node _scripts/deployment/_check_production_db.cjs

# 3. ثم نشّر
node _scripts/deployment/auto_sync.cjs "رسالتك هنا"
```

### ماذا يفعل auto_sync.cjs؟
1. ✅ بناء assets محليّاً  
2. ✅ Push إلى GitHub
3. ✅ SSH للخادم الإنتاجي
4. ✅ Pull أحدث الكود
5. ✅ تشغيل migrations
6. ✅ تحسين و cache
7. ✅ اختبار النتيجة

---

## 📁 هيكل المشروع

```
noble.dion.sy/
├── app/                    # Laravel Application Code
├── resources/              # Views, CSS, JS, Translations
├── routes/                 # Web, API, Console Routes
├── database/               # Migrations, Seeders
├── config/                 # Application Configuration
├── storage/                # Logs, Files, Cache
├── public/                 # Web Root (served by web server)
│   ├── index.php          # Entry point
│   └── build/             # Vite compiled assets
├── packages/noble/         # 28 Premium Modules
├── _scripts/deployment/    # Deployment automation
│   ├── secureConfig.js    # Credential manager
│   ├── auto_sync.cjs      # Full deployment
│   └── ...
├── .env.production.example # Production env template
├── SECURITY_AUDIT_*        # Security documentation
└── APPLICATION_AUDIT_*     # Comprehensive audit
```

---

## 🔑 ملفات البيئة المهمة

### `.env` (Local Development)
```bash
APP_ENV=local
APP_DEBUG=true
DB_PASSWORD=root        # أو فارغ للـ SQLite
```

### `.env.production` (Production - NOT in Git)
```bash
PRODUCTION_HOST=62.72.25.117
PRODUCTION_USERNAME=u256167180
PRODUCTION_PASSWORD=***secure***    # من المسؤول فقط!
PRODUCTION_DB_PASSWORD=***secure*** # من المسؤول فقط!
```

⚠️ **لا تضع `.env.production` في Git أبداً!** هو بالفعل في `.gitignore`

---

## 📚 أهم الأوامر

### Development
```bash
# تشغيل الخادم
php artisan serve

# بناء الـ frontend
npm run build

# مراقبة التغييرات
npm run dev

# تشغيل اختبارات
php artisan test

# إنشاء migration
php artisan make:migration create_table_name
```

### Production Deployment
```bash
# اختبر الاتصال أولاً
node _scripts/deployment/_check_production_db.cjs

# ثم انشر
node _scripts/deployment/auto_sync.cjs "fix: critical bug"

# أو نشّر assets فقط
node _scripts/deployment/upload_build_sftp.cjs

# أو تفحص الخادم
node _scripts/deployment/_diagnose_404.cjs
```

---

## 🔒 الأمان (مهم جداً!)

### كيفية حماية البيانات الحساسة

✅ **ممنوع**: إضافة كلمات مرور مباشرة في الكود  
✅ **ممنوع**: Commit `.env.production` إلى Git  
✅ **ممنوع**: مشاركة credentials عبر Slack/Email

✅ **صحيح**: استخدم متغيرات البيئة فقط  
✅ **صحيح**: احصل على credentials من المسؤول شخصياً  
✅ **صحيح**: استخدم pre-commit hook (مُفعّل تلقائياً)

**ملخص الحماية**:
```javascript
// ❌ WRONG - لا تفعل هذا أبداً!
const password = '4_m_XMkgux@.AgC';

// ✅ CORRECT - افعل هذا
const CONFIG = require('./secureConfig.js');
const password = CONFIG.SSH.password;  // من .env.production
```

---

## 🆘 حل المشاكل الشائعة

### ❓ "Pre-commit hook فشل"
```
🚨 SECURITY CHECK FAILED - CREDENTIALS DETECTED

الحل:
1. أزِل كلمات المرور من الملف
2. استخدم متغيرات البيئة
3. جرّب مرة أخرى
```

### ❓ "Cannot find module 'dotenv'"
```bash
npm install dotenv
# أعِد محاولة النشر
```

### ❓ "Deployment failed"
```bash
# اقرأ السجلات
tail storage/logs/laravel-*.log

# أو على الخادم
ssh -p 65002 u256167180@62.72.25.117
cat public_html/storage/logs/laravel-*.log
```

### ❓ "Port 8080 already in use"
```bash
php artisan serve --port=8081
```

---

## 👥 للفريق

### أدوار ومسؤوليات

| الدور | المهام | البيانات المطلوبة |
|------|--------|----------------|
| **مطور** | كود + اختبار | `.env` (محلي فقط) |
| **DevOps** | نشر + صيانة | `.env.production` |
| **مسؤول** | إدارة كلمات المرور | كل الـ credentials |

### عملية الـ Code Review

1. ✅ قم بـ fork أو branch
2. ✅ اكتب الكود وأضِف تعليقات واضحة
3. ✅ اعمل git commit محلياً
4. ✅ انشئ Pull Request
5. ✅ انتظر المراجعة والتوافقات
6. ✅ دمّج في master

### سياسة الـ Git

```bash
# Commits يجب أن تكون واضحة ومختصرة
git commit -m "feat: add employee management"
git commit -m "fix: resolve 403 permission issue"
git commit -m "docs: update README"

# Branches يجب أن تكون وصفية
git checkout -b feature/hrm-module
git checkout -b bugfix/login-error
```

---

## 📖 التوثيق الكاملة

| الملف | الوصف |
|------|---------|
| [SECURE_DEPLOYMENT_GUIDE.md](_scripts/deployment/SECURE_DEPLOYMENT_GUIDE.md) | دليل النشر الآمن |
| [SECURITY_AUDIT_SUMMARY.md](_scripts/deployment/SECURITY_AUDIT_SUMMARY.md) | ملخص تقني |
| [SECURITY_AUDIT_FINAL_REPORT.md](SECURITY_AUDIT_FINAL_REPORT.md) | تقرير شامل |
| [APPLICATION_AUDIT_FINAL_REPORT.md](APPLICATION_AUDIT_FINAL_REPORT.md) | تقرير التطبيق |

---

## 🚀 Next Steps

1. ✅ اقرأ هذا الملف (انت هنا الآن!)
2. ✅ اطلب `.env.production` من المسؤول
3. ✅ جرّب `_check_production_db.cjs`
4. ✅ ابدأ بالتطوير أو النشر
5. ✅ اقرأ التوثيق الكاملة عند الحاجة

---

## 💬 الدعم

- 📧 تواصل مع الفريق
- 📖 اقرأ التوثيق أولاً
- 🔍 تحقق من السجلات (logs)
- 🤝 اطلب مساعدة الفريق

---

**Happy Coding! 🎉**
