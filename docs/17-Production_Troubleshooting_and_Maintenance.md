# 🛠️ الصيانة واستكشاف الأخطاء في الإنتاج

> **آخر تحديث:** أبريل 2026  
> **السيرفر:** Hostinger · `62.72.25.117:65002` · PHP: `/opt/alt/php82/usr/bin/php`

---

## 1. المشاكل الشائعة وحلولها السريعة

### ⛔ 500 Internal Server Error

```bash
# 1. فحص سجل Laravel
cat storage/logs/laravel-$(date +%Y-%m-%d).log | tail -50

# 2. مسح الكاش كاملاً
/opt/alt/php82/usr/bin/php artisan optimize:clear

# 3. إعادة بناء الكاش
/opt/alt/php82/usr/bin/php artisan optimize
```

**أسباب شائعة:**
- `.env` بيانات DB خاطئة → تحقق من `DB_PASSWORD`
- ملفات مفقودة → تحقق أن `public/build/manifest.json` موجود
- صلاحيات `storage/` → `chmod -R 755 storage/ bootstrap/cache/`

---

### ⛔ 404 على كل الصفحات

```bash
# تحقق من .htaccess
cat public/.htaccess

# تأكد من أن mod_rewrite مفعّل
# أضف في .htaccess:
# Options +FollowSymLinks
# RewriteEngine On
```

---

### ⛔ الأصول لا تُحمّل (CSS/JS 404)

```bash
# 1. تأكد أن public/build موجود بعد npm run build
ls public/build/

# 2. تأكد من manifest.json
cat public/build/manifest.json | head -10

# 3. إذا لم يوجد، أعد البناء محلياً وارفع public/build/
npm run build
# ثم ارفع public/build/ عبر SFTP
```

---

### ⛔ مشكلة قاعدة البيانات (Access Denied)

```
SQLSTATE[HY000] [1045] Access denied for user
```

**الحل:**
1. في لوحة Hostinger → MySQL Databases
2. تأكد من Remote Access مفعّل للـ IP
3. أو أضف `%` للسماح بكل الـ IPs

```
Host: srv1142.hstgr.io
DB: u256167180_noble
User: u256167180_noble
Pass: 4_m_XMkgux@.AgC
```

---

### ⛔ CSRF Token Mismatch (419)

التطبيق يعالجه تلقائياً في `app.tsx` عبر interceptor.  
إذا استمر: `php artisan config:clear` ثم أعد تحميل الصفحة.

---

### ⛔ أيقونات أو صور مفقودة

```bash
# إعادة ربط storage
/opt/alt/php82/usr/bin/php artisan storage:link

# التحقق
ls -la public/storage
```

---

### ⛔ أخطاء TypeScript في IDE (لا تؤثر على البناء)

| الخطأ | الحل |
|-------|------|
| `Cannot find module '@/...'` | أعد تشغيل TS Server (Ctrl+Shift+P → Restart TS) |
| `Cannot find name 'route'` | نفس الحل أعلاه — بعد tsconfig fix |
| قواعد الأنواع | راجع `docs/15-TypeScript_and_Data_Models.md` |

---

### ⛔ npm run build يفشل

```bash
# فحص الأخطاء
npm run build 2>&1

# مشاكل شائعة:
# 1. import مفقود → فحص السطر المُشار إليه
# 2. TypeScript error في esbuild → نادر (esbuild يقبل معظم الأخطاء)
# 3. ملف مفقود → تأكد من وجود الملف المستورد
```

---

## 2. أوامر الصيانة الدورية

### بعد كل رفع للكود

```bash
# على السيرفر (Hostinger SSH)
/opt/alt/php82/usr/bin/php artisan optimize:clear
/opt/alt/php82/usr/bin/php artisan optimize

# إذا كان هناك migrations جديدة
/opt/alt/php82/usr/bin/php artisan migrate --force
```

### فحص الصحة العام

```bash
# محلياً
php _scripts/debug/nobel_health_check.php

# التحقق من المستخدمين
php _scripts/debug/list_users.php

# التحقق من الباقات
php _scripts/debug/list_plans.php
```

---

## 3. SSH إلى Hostinger

```bash
ssh -p 65002 u256167180@62.72.25.117
# Password: 4_m_XMkgux@.AgC

# مسار التطبيق
cd domains/noble.dion.sy/public_html/

# PHP binary
/opt/alt/php82/usr/bin/php artisan --version
```

---

## 4. سجلات الأخطاء

### Laravel Logs

```bash
# آخر 100 سطر
tail -100 storage/logs/laravel-$(date +%Y-%m-%d).log

# البحث عن خطأ محدد
grep "ERROR" storage/logs/laravel-$(date +%Y-%m-%d).log
```

### Vite/Build Logs

```bash
# في بيئة التطوير
npm run dev 2>&1 | tail -20
```

---

## 5. استعادة بيانات ar.json

إذا تعطلت ملفات الترجمة العربية:

```bash
php _scripts/translations/recover_ar_json.php
```

---

## 6. إعادة ضبط الباقات والصلاحيات

```bash
# إعادة تفعيل كل الوحدات (Noble Master Plan)
php _scripts/setup/global_master_plan_sync.php

# منح صلاحيات كاملة
php _scripts/setup/grant_permissions.php
```

---

## 7. مصفوفة أوقات الاستجابة (Performance)

| المقياس | الهدف | الفعلي |
|---------|-------|--------|
| `npm run build` | < 30s | ~16s ✅ |
| Time to First Byte | < 500ms | — |
| Total Blocking Time | < 200ms | — |
| Largest Contentful Paint | < 2.5s | — |

---

## 8. الدعم الفني

| المشكلة | المرجع |
|---------|--------|
| خطأ TypeScript | `docs/15-TypeScript_and_Data_Models.md` |
| نشر جديد | `docs/07-Deployment_Server_Guide.md` |
| سكريبتات المساعدة | `docs/06-Custom_Scripts_And_Commands.md` |
| HRM محدداً | `docs/11-HRM_Module_DeepDive.md` |
