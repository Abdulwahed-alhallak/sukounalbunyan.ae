# 🚀 قائمة التحقق والنشر النهائي (Final Deployment & Audit Checklist) v4.0.1

قبل اعتبار المشروع جاهزاً تماماً للإنتاج، يجب المرور عبر قائمة التحقق النهائية لضمان عدم وجود ثغرات تقنية أو بصرية.

## 1. مرجع تدقيق الواجهة (UI Audit)
- [x] **Arabic Localization:** فحص ملف `ar.json` لضمان عدم وجود كلمات إنجليزية متبقية (تم التحديث لـ HRM, Accounting, CRM, Taskly).
- [x] **RTL Consistency:** التحقق من أن جميع الهوامش تستخدم `ms-` و `me-` بدلاً من `ml-` و `mr-`.
- [x] **Sidebar Tooltips:** توطين كامل لـ Tooltips السايدبار باللغة العربية.
- [ ] **Theme Switch:** التأكد من أن جميع الكائنات تستخدم التوكنز (`bg-background`, `text-foreground`) لتعمل بشكل صحيح في الوضع الليلي.

## 2. مرجع تدقيق البيانات والمنطق (Data & Logic)
- [x] **Taskly Dashboard Fix:** إزالة `abort(403)` التي كانت تسبب شاشات بيضاء.
- [x] **Accounting Breadcrumbs:** توحيد مسميات التنقل إلى "المحاسبة" بدلاً من "Account".
- [x] **Script Organization:** نقل سكريبتات الإصلاح إلى مجلد `_scripts/fixes` للتنظيم.

## 3. خطوات النشر النهائي (Deployment Steps)
1. **مزامنة البيانات:** مزامنة قاعدة البيانات من XAMPP المحلي إلى Hostinger Remote.
2. **التحضير المحلي:**
   ```bash
   npm run build
   ```
3. **التغليف:** تشغيل سكريبت `hostinger_pack.cjs` لإنشاء ملف `noble_production_build.tar.gz`.
4. **الرفع والفك:** تشغيل `hostinger_deploy_final.js` لنقل الملفات وتطبيق الـ Migrations.
5. **تحديث الكاش (على السيرفر):**
   ```bash
   php artisan optimize
   php artisan route:cache
   ```

---
> ** Noble Architecture 2026** - نظام متكامل، آمن، وموثق بالكامل.
