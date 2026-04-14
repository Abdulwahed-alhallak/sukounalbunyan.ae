# 👨‍💻 دليل المطور وطريقة البرمجة (Development Guide)

تهدف هذه الوثيقة إلى شرح سير أسلوب التطوير للمبرمجين الجدد في نظام Noble Architecture والتعرف على دورة حياة الكود.

## 1. حزمة التكنولوجيا (Technology Stack)
- **الواجهة الخلفية (Backend):** Laravel 12 (PHP 8.2+).
- **الواجهة الأمامية (Frontend):** React 18 + TypeScript (TSX).
- **الجسر الناقل (Bridge):** Inertia.js 2.0 (التوافق التام مع الـ Single Page Application).
- **التصميم (Styling):** Tailwind CSS v3+ مع الاعتماد الكلي على **الخصائص المنطقية (Logical Properties)** لدعم RTL/LTR تلقائياً.
- **البناء والمجمع (Bundler):** Vite.js (الإصدار الخامس).

## 2. الهيكلية النظيفة الموحدة (Standardized Folder Structure)
تم تنظيف المشروع من الملفات المكررة والمسارات المتداخلة. القواعد الهيكلية الآن:
- **المكونات المشتركة:** `resources/js/components/ui` (مكونات ذرية مثل الـ Button, Input) و `resources/js/components` (مكونات وظيفية).
- **الصفحات:** `resources/js/Pages` (كل صفحة تتبع اسم الوحدة الخاصة بها، مثال: `MissionCommand`).
- **التنسيق:** ملف CSS رئيسي واحد `resources/css/app.css` يحتوي على جميع التوكنز والنماذج البصرية.

لتجنب تضخم النظام، تم فصل الخصائص إلى "حزم مستقلة" تجد مسارها داخل `packages/noble/`.
كل مجلد بداخلها يحتوي على منطق متكامل خاص بالوحدة المبرمجة وتشمل (Controllers, Models, Views, Routes).
من أبرز الحزم المتوفرة:

- `Account`, `AIAssistant`, `BudgetPlanner`, `Calendar`, `Contract`, `Goal`, `Hrm`, `Lead`, `Pos`, `ProductService`, `Quotation`, `Recruitment`, `SupportTicket`, `Taskly`, الخ.

نظام استدعاء (Autoloading) يعثر على فضاء الأسماء (Namespaces) الخاص بها عبر إعدادات `composer.json` ، كالتالي:
`"Noble\\Hrm\\": "packages/noble/Hrm/src/"`.

## 3. التدفق وأسلوب تدفق البيانات (Data Flow)

1. يرسل العميل طلباً للمتصفح. يستقبله الـ Route في `web.php` أو ملف مسارات الحزمة (Package route).
2. يحيل الروات الطلب للمتحكم (Controller).
3. يجمع المتحكم البيانات من قواعد البيانات (Models).
4. بدلاً من إعادة ملف `blade.php`، يقوم بإرجاع:
    ```php
    return Inertia::render('ModuleName/ViewComponent', ['data' => $data]);
    ```
5. يستقبل مكون `React (tsx)` البيانات كـ Props ويقوم ببناء الواجهة اعتماداً على مكونات الواجهة المشتركة `resources/js/components`.

## 4. خطوات وبروتوكولات البرمجة في المشروع

1. **لا توجد كائنات DOM مباشرة:** تعامل دائماً مع واجهة الـ React كواجهة تفاعلية خاضعة لحالة تطبيق (State). لا تقم بتعديل كائنات DOM عن طريق الجيكويري (jQuery) أو استدعاء `document.getElementById` بأي شكل من الأشكال.
2. **استغلال مساحات المكونات العامة (Shared Components):** عند إضافة زر أو جدول البيانات، استخدم المكونات المتاحة مسبقاً (مثل `AppButton` أو `DataGrid` أو `PageHeader`).
3. **التوطين والترجمات (Localization):** لا تقم بكتابة النصوص الصلبة (Hardcoded Strings) أبدًا. يجب تمرير كافة النصوص عبر دالة الترجمة المتصلة بقاعدة البيانات وملفات JSON والتي تقدم عن طريق `useTranslation` hook أو المتوفرة بشكل عام ليتغير محتواها تلقائياً عند تغيير اللغة.

## 5. العمليات المتكررة للمطورين

- **تشغيل بيئة العمل (خادم التخديم والخادم الأمامي):**
    - في النافذة الأولى شغّل (Backend): `php artisan serve`
    - في النافذة الثانية شغّل (Frontend Bundler): `npm run dev`
- **التعديلات الدورية وإضافات الهيكلية لقاعدة البيانات:**
  يتم إنشاؤها دوماً عن طريق ملفات (Migrations).
- **حزم الأنظمة (Packages):**
  عند صناعة وحدة جديدة يتم فصل المسار الخاص بها تماماً وتفعيله ديناميكياً من لوحة تحكم `Add-ons` ليتم قفل وفتح التصاريح بشكل آلي تبعا لجدول التراخيص المشتراة من قبل المؤسسة (Tenant).
