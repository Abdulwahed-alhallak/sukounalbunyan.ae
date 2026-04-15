# 🛠️ دليل النصوص البرمجية والأوامر (Scripts & Commands)

> **آخر تحديث:** أبريل 2026

---

## 1. هيكل مجلد `_scripts/`

تم تنظيم جميع السكربتات في 9 مجلدات فرعية حسب الغرض:

| المجلد | الغرض |
|--------|-------|
| `_scripts/setup/` | إعداد المشروع أول مرة، الباقات، الصلاحيات |
| `_scripts/database/` | البذور، التحقق من قاعدة البيانات، الاستيراد |
| `_scripts/translations/` | معالجة ملفات اللغة (ar.json, en.json) |
| `_scripts/debug/` | تشخيص الأخطاء، مراقبة النظام |
| `_scripts/deployment/` | النشر على Hostinger، رفع الملفات |
| `_scripts/fixes/` | إصلاحات متخصصة لمشاكل محددة |
| `_scripts/hostinger/` | إعدادات وأدوات Hostinger |
| `_scripts/imports/` | استيراد البيانات من CSV أو مصادر خارجية |
| `_scripts/sync/` | المزامنة بين البيئات والرفع عبر SFTP |

---

## 2. السكربتات الأساسية

### أ. `_scripts/setup/`

```bash
# تهيئة الباقة الشاملة (Noble Master Plan) لكل الوحدات
php _scripts/setup/global_master_plan_sync.php

# منح الصلاحيات الكاملة
php _scripts/setup/grant_permissions.php

# إعداد بيئة الإنتاج
php _scripts/setup/setup_production.php

# إعداد SMTP للبريد الإلكتروني
php _scripts/setup/setup_smtp.php
```

### ب. `_scripts/deployment/`

```bash
# نشر كامل على Hostinger (PowerShell)
powershell _scripts/deployment/deploy_to_hostinger.ps1

# رفع سريع للملفات
node _scripts/deployment/upload_chunks.cjs

# نشر خفيف (بدون node_modules/vendor)
php _scripts/deployment/deploy_quick.php
```

### ج. `_scripts/database/`

```bash
# بذر بيانات الحضور للاختبار
php _scripts/database/seed_attendance.php

# بذر بيانات HRM كاملة
php _scripts/database/seed_hrm.php

# فحص التصاريح والعقود
php _scripts/database/check_contracts.php
```

### د. `_scripts/translations/`

```bash
# إضافة مفاتيح ترجمة HRM
php _scripts/translations/add_hrm_translations.php

# استخراج مفاتيح جديدة من الكود
php _scripts/translations/extract-translations.php

# مزامنة الترجمات بين البيئات
php _scripts/translations/sync_translations.php

# استرداد ar.json
php _scripts/translations/recover_ar_json.php
```

---

## 3. أوامر Artisan الأساسية

### تنظيف الكاش (بعد كل تحديث)

```bash
php artisan optimize:clear
php artisan view:clear
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### تسريع الإنتاج

```bash
php artisan optimize
php artisan view:cache
php artisan config:cache
php artisan route:cache
```

### قاعدة البيانات

```bash
# تشغيل جميع الـ Migrations
php artisan migrate

# تشغيل الـ Seeders
php artisan db:seed

# Rollback آخر مجموعة
php artisan migrate:rollback

# إعادة البناء الكاملة (⚠️ يحذف كل البيانات)
php artisan migrate:fresh --seed
```

---

## 4. أوامر Frontend

```bash
# تثبيت الحزم
npm install

# بيئة التطوير (Hot Reload)
npm run dev

# بناء الإنتاج
npm run build

# فحص TypeScript
npx tsc --noEmit
```

> **ملاحظة:** ملفات `public/build/` مستبعدة من Git. يجب بناؤها في كل سيرفر.

---

## 5. سير عمل Git

```bash
# سحب آخر التحديثات
git pull origin master

# مراجعة التغييرات
git status
git diff

# الحفظ والدفع
git add -A
git commit -m "feat: وصف التغيير"
git push origin master
```

### فروع Git

| الفرع | الغرض |
|-------|-------|
| `master` | الإنتاج الرئيسي |

---

## 6. فحص صحة النظام

```bash
# فحص شامل للنظام
php _scripts/debug/nobel_health_check.php

# قائمة المستخدمين
php _scripts/debug/list_users.php

# قائمة الباقات
php _scripts/debug/list_plans.php
```

---

## 7. إعادة تشغيل السيرفر على Hostinger

بعد رفع ملفات PHP:
```bash
php artisan optimize:clear
php artisan optimize
```

بعد رفع ملفات Frontend:
```bash
# تأكد من أن public/build/ موجودة على السيرفر
# لا يلزم تشغيل npm run build على الـ Hostinger
```
