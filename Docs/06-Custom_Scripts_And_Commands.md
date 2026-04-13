# 🛠️ دليل الأوامر البرمجية والنصوص المساعدة (Custom Scripts & Artisan)

نظراً لحجم المنصة وتعدد الوحدات ومستأجري النظام (Tenants)، تم تطوير مجموعة من النصوص البرمجية (Scripts) لتسهيل مهام الصيانة اليومية والتدخل السريع وإصلاح قواعد البيانات دون الحاجة للوصول إلى سيرفر قواعد البيانات مباشرة.

## 1. مجلد السكربتات (`_scripts`)

يحتوي مجلد `main-file/_scripts` على مجموعة ضخمة من أدوات الإصلاح والصيانة. يتم تنفيذها عبر الطرفية (CLI) في الخادم باستخدام أمر `php`:

### أ. سكربتات التهيئة والباقات (Plans & Modules)

- `global_master_plan_sync.php`: سكربت مهم جداً لمعالجة باقة الـ "Master Plan" وتخصيصها لتشمل كافة الوحدات (30+ إضافة) وتجديد الاشتراك مدى الحياة للشركات المركزية.
- `seed_addons_and_fix_plans.php`: يقوم بإدخال الوحدات في قاعدة البيانات وإصلاح الخلل في ربط الوحدات بالباقات الشرائية.
- `local_unlock_modules.php` / `hostinger_unlock_modules.js`: أدوات لفك تشفير أو تفعيل الموديولات للمستخدمين عند النشر.

### ب. سكربتات الدبلويمينت والنشر (Deployment)

- `deploy_to_hostinger.ps1` و `hostinger_deploy_final.js`: نصوص لأتمتة عملية الرفع إلى سيرفرات Hostinger وتسوية مسارات الملفات (PWA, Assets).
- `setup_production.php`: لضبط بيئة الإنتاج وإلغاء أوضاع تصحيح الأخطاء (Debug mode) وتسريع التطبيق.

### ج. سكربتات معالجة البيانات والتنظيف (Data & Cleanup)

- `import_employees_csv.php`: لأتمتة استيراد الموظفين من ملفات CSV مباشرة لقاعدة البيانات في وحدة الموارد البشرية (HRM).
- `fix_tenancy.php` و `noble_ultimate_scrub.php`: أدوات مسح وتنظيف (Scrubbing) لحذف البيانات التجريبية أو مخلفات (DionONE) السابقة وإصلاح مشاكل تعدد المستأجرين.

## 2. أوامر Artisan الأساسية للمشروع (Laravel Artisan)

يُوصى دائماً بتنفيذ هذه الأوامر بعد سحب أي تحديث من مستودع Git أو بعد رفع الملفات للخادم:

### تنظيف الذاكرة المؤقتة الشامل

```bash
php artisan optimize:clear
php artisan view:clear
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### تسريع بيئة الإنتاج (Production)

```bash
php artisan optimize
php artisan view:cache
php artisan config:cache
php artisan route:cache
```

### إدارة الواجهات الأمامية (Inertia & Vite)

لتوليد ملفات الـ (Build) الجاهزة للاستخدام في المتصفح وتفعيل وضع الإنتاج للحجم الأصغر والأسرع:

```bash
npm install
npm run build
```

## 3. التعامل مع بيئة Node.js و Vite

إذا كنت تقوم بالتطوير محلياً وتريد تفعيل وضع المطوّر الذي يكتشف التغييرات تلقائياً (Hot Module Replacement):

```bash
npm run dev
```

واحرص أن تكون قيمة `APP_URL` في ملف `.env` مطابقة للرابط الذي تعمل عليه على بيئة التطوير المحلية وتأكد من أن منفذ الشبكة الخاص بـ Vite (5173 غالباً) مفتوح وغير محظور.
