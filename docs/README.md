# 📚 دليل التوثيق الشامل — Noble Architecture

> **آخر تحديث:** أبريل 2026  
> **الإصدار:** Laravel 12 + React 18 + Inertia.js 2 + Vite 5 + Vercel Geist 2026

مرحباً بك في المستودع المرجعي لكل تفاصيل منصة Noble Architecture. هذا المجلد هو المرجع الأساسي للمطورين ومديري النظام.

---

## 🚀 البداية السريعة

```bash
# تثبيت الاعتمادات
composer install
npm install

# إعداد البيئة
cp .env.example .env
php artisan key:generate

# قاعدة البيانات
php artisan migrate --seed

# تشغيل التطوير
php artisan serve          # في نافذة أولى
npm run dev                # في نافذة ثانية
```

---

## 📋 فهرس المحتوى

| # | الفصل | الملف | الوصف |
|---|-------|-------|-------|
| 01 | 💡 نظرة عامة | [`01-Overview_and_Ideas.md`](./01-Overview_and_Ideas.md) | مفهوم النظام، المكونات، الرؤية المستقبلية |
| 02 | 🗄️ قاعدة البيانات | [`02-Database_ERD.md`](./02-Database_ERD.md) | مخطط العلاقات (ERD)، الجداول الرئيسية |
| 03 | 🌐 المسارات | [`03-Routes_Architecture.md`](./03-Routes_Architecture.md) | بنية Routes + Inertia.js Bridge |
| 04 | 🎨 نظام التصميم | [`04-Theme_and_UI_Guidelines.md`](./04-Theme_and_UI_Guidelines.md) | Vercel Geist 2026، RTL، الألوان، Typography |
| 05 | 👨‍💻 دليل المطور | [`05-Development_Guide.md`](./05-Development_Guide.md) | هيكل المشروع، TypeScript، قواعد البرمجة |
| 06 | 🛠️ السكربتات | [`06-Custom_Scripts_And_Commands.md`](./06-Custom_Scripts_And_Commands.md) | _scripts/ الجديد، Artisan، Git |
| 07 | 🚀 النشر | [`07-Deployment_Server_Guide.md`](./07-Deployment_Server_Guide.md) | Hostinger، Linux، متغيرات البيئة |
| 08 | 🧩 الوحدات | [`08-Modules_and_Addons_Guide.md`](./08-Modules_and_Addons_Guide.md) | 31+ وحدة، composer.json، Add-ons |
| 09 | 🛡️ الأمان | [`09-Security_and_Tenancy.md`](./09-Security_and_Tenancy.md) | Roles/Permissions، Multi-tenancy |
| 10 | 🔗 التكاملات | [`10-API_and_Integrations.md`](./10-API_and_Integrations.md) | SMTP، بوابات الدفع، Twilio، Slack |
| 11 | 👥 نظام HRM | [`11-HRM_Module_DeepDive.md`](./11-HRM_Module_DeepDive.md) | الموارد البشرية، Attendance، Payroll |
| 12 | 🔐 الترخيص | [`12-Licensing_and_Master_Plan.md`](./12-Licensing_and_Master_Plan.md) | Noble Master Plan، Lifetime Access |
| 13 | 🖥️ الواجهة | [`13-Frontend_and_Settings.md`](./13-Frontend_and_Settings.md) | React/Inertia، الإعدادات، BrandProvider |
| 14 | 🤖 الذكاء الاصطناعي | [`14-AI_and_Code_Generation.md`](./14-AI_and_Code_Generation.md) | AI Assistant، معالجة الطلبات |
| 15 | 🏷️ TypeScript | [`15-TypeScript_and_Data_Models.md`](./15-TypeScript_and_Data_Models.md) | Types، PaginatedData، common.ts |
| 16 | 📱 PWA | [`16-PWA_and_Mobile_Operations.md`](./16-PWA_and_Mobile_Operations.md) | Service Worker، الإشعارات، Mobile UX |
| 17 | 🔧 استكشاف الأخطاء | [`17-Production_Troubleshooting_and_Maintenance.md`](./17-Production_Troubleshooting_and_Maintenance.md) | تشخيص المشاكل، الصيانة الدورية |
| 18 | 📊 التحليلات | [`18-Data_Visualization_and_Analytics.md`](./18-Data_Visualization_and_Analytics.md) | Dashboards، الرسوم البيانية، KPIs |
| 19 | ✅ قائمة النشر | [`19-Final_Deployment_Checklist.md`](./19-Final_Deployment_Checklist.md) | Checklist النشر النهائي |
| 20 | 🔍 دليل الفحص | [`20-Application_Audit_Playbook.md`](./20-Application_Audit_Playbook.md) | فحص العلاقات، النتائج، الثيم، RTL، الربط، والمسارات |
| 21 | ✨ صقل الواجهات | [`21-Professional_Polish_and_Geofence_Integration.md`](./21-Professional_Polish_and_Geofence_Integration.md) | إلغاء المصطلحات التقنية، دعم RTL كامل، وتوحيد الواجهات |
| 22 | 🛡️ تثبيت الإنتاج | [`22-Production_Stabilization_and_Tenancy_Hardening.md`](./22-Production_Stabilization_and_Tenancy_Hardening.md) | فحص عزل البيانات (SaaS)، وإصلاح فجوات نموذج المهام |

---

## ⚡ مراجع سريعة

### الحالة الحالية للمنصة (أبريل 2026)

| المؤشر | الحالة |
|--------|--------|
| البناء (`npm run build`) | ✅ يعمل (883 ملف، ~16s) |
| TypeScript IDE errors | ✅ محلول (tsconfig يشمل packages/noble/**) |
| RTL/LTR | ✅ Logical Properties كاملة |
| مصطلحات الواجهة | ✅ محترفة (لا sci-fi/military) |
| ملفات الترجمة العربية | ✅ ar.json محدّث |
| `.gitignore` | ✅ منظّم (archives, temp, build مستبعدة) |
| `_scripts/` | ✅ منظّم في 9 مجلدات فرعية |
| الإنتاج `noble.dion.sy` | ✅ منشور (HTTP 200 — 16 أبريل 2026) |
| قاعدة البيانات | ✅ Migration 100% — 71 جدول |
| GitHub | ✅ مرفوع — فرع `master` |

### مسارات مهمة

| الغرض | المسار |
|-------|--------|
| المكونات المشتركة | `resources/js/components/ui/` |
| التوكنز والثيم | `resources/css/app.css` |
| ملفات الترجمة | `resources/lang/` |
| الأنواع العامة | `resources/js/types/common.ts` |
| صفحات الأدوات | `packages/noble/[Module]/src/Resources/js/Pages/` |

---

> ⚠️ **للمطورين الجدد:** اقرأ **الفصل 04** (نظام التصميم) و **الفصل 05** (دليل المطور) قبل أي تعديل.
