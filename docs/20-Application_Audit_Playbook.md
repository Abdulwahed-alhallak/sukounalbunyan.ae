# دليل الفحص الشامل للتطبيق (Application Audit Playbook)

> آخر تحديث: 2026-04-15  
> مبني على الفحص الفعلي لبنية المشروع الحالية

هذا الدليل يشرح كيف يتم فحص التطبيق بشكل مهني للتأكد من:

1. صحة علاقات الجداول والحقول.
2. أن النتائج المعروضة مبنية على بيانات صحيحة وليست مكسورة أو منقوصة.
3. أن الثيم موحد على مستوى النظام.
4. أن العربية و`RTL` مدعومان بشكل كامل.
5. أن الواجهات مرتبطة بالخلفية عبر `Laravel + Inertia + React` بشكل دقيق.
6. أن المسارات محدثة ومكتوبة بدقة.

## 1. ملاحظة مهمة قبل البدء

لا أحد يستطيع أن يقول "صحيح 100%" من مجرد قراءة الكود فقط.  
الوصول إلى حكم قريب جدًا من `100%` يحتاج 3 طبقات تحقق معًا:

1. فحص المصدر البنيوي: `migrations`, `models`, `controllers`, `routes`, `pages`.
2. فحص البيانات الفعلية: وجود records سليمة وعدم وجود orphan records أو حقول مرجعية مكسورة.
3. فحص تشغيل حي: المتصفح + الطلبات + الواجهات + التنقل + الاختبارات.

بمعنى أوضح: الكود وحده يثبت التصميم، لكن قاعدة البيانات والمتصفح يثبتان الحقيقة التشغيلية.

## 2. فهم المشروع الحالي

المشروع الحالي مبني على:

- `Laravel 12`
- `React 18`
- `Inertia.js`
- `Vite 5`
- هيكل modular عبر `packages/noble/*`

### مصادر الحقيقة الأساسية في المشروع

| الجانب | المصدر الحقيقي |
|---|---|
| الجداول والعلاقات | `database/migrations/*` ثم `app/Models/*` و`packages/noble/*/Models/*` |
| المسارات | `php artisan route:list --json` ثم `routes/*.php` و`packages/noble/*/src/Routes/web.php` |
| ربط الواجهات بالخلفية | `resources/js/app.tsx` + `Inertia::render(...)` داخل المتحكمات |
| الثيم | `resources/css/app.css`, `tailwind.config.js`, `resources/js/contexts/brand-context.tsx` |
| RTL والعربية | `resources/css/rtl.css`, `resources/js/i18n.js`, `resources/lang/ar.json` |
| التخطيط الرئيسي | `resources/js/layouts/authenticated-layout.tsx` |

### مؤشرات مؤكدة من الفحص الحالي

- المشروع يحتوي على `70` migration أساسية في `database/migrations`، مع عدد كبير إضافي من جداول الوحدات.
- سجل Laravel الحالي يحتوي على `1365` route مسجلة.
- المسارات لا تأتي فقط من `routes/web.php`، بل أيضًا من وحدات `packages/noble/*`.
- محرك الواجهة يحمّل الصفحات من:
  - `resources/js/pages/**/*.tsx`
  - `packages/noble/*/src/Resources/js/Pages/**/*.tsx`
- الثيم والاتجاه يطبقان مركزيًا من `BrandProvider`.
- الترجمات تُجلب ديناميكيًا من `/translations/{locale}` عبر `i18next`.

## 3. الترتيب الصحيح للفحص

الفحص يجب أن يتم بهذا الترتيب دائمًا:

1. سلامة البيئة وقاعدة البيانات.
2. صحة العلاقات والمفاتيح.
3. صحة النتائج والأرقام.
4. سلامة المسارات.
5. ربط الواجهة بالخلفية.
6. توحيد الثيم.
7. العربية و`RTL`.
8. الاختبارات المتصفحية النهائية.

إذا تم تبديل هذا الترتيب، قد نصل لنتائج مضللة.

## 4. فحص قاعدة البيانات والعلاقات

### 4.1 الهدف

التحقق من أن:

- كل جدول موجود فعليًا.
- كل مفتاح أجنبي `FK` يشير إلى سجل صالح.
- كل علاقة معرفة في `Model` لها عمود فعلي مناسب في الجدول.
- لا يوجد تعارض بين أسماء الحقول والعلاقات.
- لا يوجد بيانات orphan.

### 4.2 أوامر البداية الإلزامية

```powershell
php artisan migrate:status
php artisan route:list --json > docs/Archive/routes-latest.json
php artisan about
```

### 4.3 ما الذي يجب مراجعته؟

راجع هذه الطبقات معًا:

| الطبقة | ماذا أراجع؟ |
|---|---|
| `migrations` | الأعمدة، الـ indexes، الـ foreign keys، nullable vs required |
| `models` | `belongsTo`, `hasMany`, `hasOne`, casts, appends |
| `controllers` | كيف يتم تحميل العلاقات: `with()`, `load()`, joins |
| الواجهة | هل الصفحة تعتمد على prop أو relation غير محملة؟ |

### 4.4 أمثلة علاقات مركزية يجب التحقق منها

من خلال الفحص الحالي، توجد علاقات مهمة جدًا مثل:

- `SalesInvoice -> items()`
- `SalesInvoice -> customer()`
- `SalesInvoice -> warehouse()`
- `SalesInvoice -> customerDetails()`
- `PurchaseInvoice -> items()`
- `PurchaseInvoice -> vendor()`
- `PurchaseInvoice -> warehouse()`
- `User -> createdBy()`

هذا النوع من العلاقات يجب فحصه على مستويين:

1. هل الأعمدة موجودة فعلًا في الجداول؟
2. هل البيانات الموجودة داخل الأعمدة تشير إلى records صحيحة؟

### 4.5 فحص orphan records

أمثلة SQL يجب تنفيذها على الجداول الحرجة:

```sql
SELECT COUNT(*) AS broken_sales_invoice_customers
FROM sales_invoices si
LEFT JOIN users u ON u.id = si.customer_id
WHERE si.customer_id IS NOT NULL AND u.id IS NULL;

SELECT COUNT(*) AS broken_sales_invoice_warehouses
FROM sales_invoices si
LEFT JOIN warehouses w ON w.id = si.warehouse_id
WHERE si.warehouse_id IS NOT NULL AND w.id IS NULL;

SELECT COUNT(*) AS broken_purchase_invoice_vendors
FROM purchase_invoices pi
LEFT JOIN users u ON u.id = pi.vendor_id
WHERE pi.vendor_id IS NOT NULL AND u.id IS NULL;

SELECT COUNT(*) AS broken_helpdesk_ticket_users
FROM helpdesk_tickets ht
LEFT JOIN users u ON u.id = ht.user_id
WHERE ht.user_id IS NOT NULL AND u.id IS NULL;
```

أي نتيجة أكبر من `0` هنا تعني أن البيانات ليست "صحيحة 100%".

### 4.6 فحص صحة الحقول الحسابية

في الجداول المالية لا يكفي وجود العلاقة، بل يجب التحقق من منطق الأرقام:

- `subtotal`
- `tax_amount`
- `discount_amount`
- `total_amount`
- `paid_amount`
- `balance_amount`

مثال تحقق:

```sql
SELECT id, subtotal, tax_amount, discount_amount, total_amount
FROM sales_invoices
WHERE ROUND((subtotal + tax_amount - discount_amount), 2) <> ROUND(total_amount, 2);
```

إذا خرجت نتائج، فالمشكلة ليست في الواجهة فقط، بل في منطق الحفظ أو التحديث.

### 4.7 معايير النجاح

اعتبر فحص قاعدة البيانات ناجحًا فقط إذا:

- كل الـ migrations المطلوبة بحالة `Ran`.
- لا يوجد orphan records في الجداول الأساسية.
- الحقول الحسابية متسقة.
- العلاقات الموجودة في الـ models تطابق الأعمدة الفعلية.
- لا توجد استعلامات تسبب `SQLSTATE` أو `Trying to get property of non-object`.

## 5. فحص ربط الواجهات بالخلفية

### 5.1 كيف يعمل الربط في هذا المشروع؟

الربط الحالي مبني على:

1. `Route`
2. `Controller`
3. `Inertia::render('PageName')`
4. صفحة React داخل `resources/js/pages` أو `packages/noble/*/src/Resources/js/Pages`

المرجع المركزي لهذا الربط موجود في:

- `resources/js/app.tsx`

وهناك منطق واضح لتحميل الصفحات من المصدرين:

- `./pages/${name}.tsx`
- `../../packages/noble/${packageName}/src/Resources/js/Pages/...`

### 5.2 ماذا يعني “ربط دقيق ومنظم واحترافي”؟

يعني:

- كل route ترجع صفحة موجودة فعليًا.
- كل صفحة تستقبل props متوافقة مع ما يرسله المتحكم.
- النماذج (`forms`) ترسل إلى routes موجودة بالاسم الصحيح.
- أسماء المسارات في React عبر `route('...')` مطابقة لسجل Laravel.
- لا يوجد `Page not found` في `app.tsx`.
- لا يوجد prop مطلوب في الصفحة ولم يتم تمريره من المتحكم.

### 5.3 طريقة الفحص

راجع:

```powershell
Select-String -Path app\Http\Controllers\**\*.php,packages\noble\*\src\Http\Controllers\**\*.php -Pattern "Inertia::render\("
```

ثم طابق النتائج مع صفحات:

```powershell
Get-ChildItem resources\js\pages -Recurse -Filter *.tsx
Get-ChildItem packages\noble -Recurse -Filter *.tsx
```

### 5.4 مؤشرات الفشل

- صفحة معرفة في controller وغير موجودة على القرص.
- صفحة موجودة لكن مسار `name` لا يطابق resolver.
- الصفحة تطلب relation غير محملة.
- ظهور `undefined` أو `null` في عناصر واجهة أساسية.

## 6. فحص الثيم والتصميم الموحد

### 6.1 مصادر الحقيقة

الثيم الحالي يجب التحقق منه عبر:

- `resources/css/app.css`
- `tailwind.config.js`
- `resources/js/contexts/brand-context.tsx`
- `resources/js/layouts/authenticated-layout.tsx`

### 6.2 ما هو المطلوب؟

يجب أن يكون:

- نظام الألوان مبني على CSS variables وليس ألوانًا عشوائية.
- الخطوط موحدة.
- الحواف والظلال والـ spacing ضمن النظام نفسه.
- الـ Dark/Light mode يعملان من نفس التوكنز.
- الشريط الجانبي، الهيدر، البطاقات، النوافذ، الجداول تتبع نفس اللغة البصرية.

### 6.3 فحص عملي سريع

ابحث عن المخالفات التالية:

```powershell
Select-String -Path resources\js\**\*.tsx,packages\noble\*\src\Resources\js\**\*.tsx -Pattern "#[0-9A-Fa-f]{3,6}"
Select-String -Path resources\js\**\*.tsx,packages\noble\*\src\Resources\js\**\*.tsx -Pattern "rounded-\["
Select-String -Path resources\js\**\*.tsx,packages\noble\*\src\Resources\js\**\*.tsx -Pattern "text-red-500|bg-blue-500|border-gray-300"
```

إذا ظهرت نتائج كثيرة، فهذا يعني أن النظام البصري غير موحد بالكامل.

### 6.4 معايير النجاح

- الاعتماد على `hsl(var(--...))` في الغالب.
- عدم وجود ألوان Hex عشوائية داخل الواجهات إلا لحالات نادرة جدًا.
- عدم وجود مكونات تبدو “من نظام آخر”.
- عدم وجود صفحة تستخدم Layout بصريًا مختلفًا بدون مبرر.

## 7. فحص العربية و RTL

### 7.1 ما الذي يدعم العربية حاليًا؟

المشروع فيه بنية جيدة لهذا الجانب:

- `resources/js/i18n.js` لتحميل الترجمات
- `resources/lang/ar.json` للغة العربية
- `resources/css/rtl.css` لتصحيحات RTL
- `BrandProvider` يضبط:
  - `document.documentElement.dir`
  - `document.body.dir`
  - `fontFamily`

### 7.2 ما الذي يجب اختباره؟

يجب اختبار:

- شاشة تسجيل الدخول
- لوحة التحكم
- الجداول
- القوائم المنسدلة
- الـ sidebar
- الـ breadcrumb
- النوافذ المنبثقة
- النماذج الطويلة

### 7.3 فحص الكود ضد مخالفات RTL

الأصل في هذا المشروع هو استخدام logical properties مثل:

- `ms-*`, `me-*`
- `ps-*`, `pe-*`
- `start-*`, `end-*`

لذلك يجب البحث عن استعمالات قديمة مثل:

- `ml-*`, `mr-*`
- `pl-*`, `pr-*`
- `left-*`, `right-*`

أمر المراجعة:

```powershell
Select-String -Path resources\js\**\*.tsx,packages\noble\*\src\Resources\js\**\*.tsx -Pattern "\b(ml-|mr-|pl-|pr-|left-|right-)\S*"
```

أي نتيجة يجب مراجعتها يدويًا: ليست كلها خطأ، لكنها نقاط شك.

### 7.4 معايير النجاح

- `html[dir="rtl"]` و`body[dir="rtl"]` يتغيران فعليًا عند العربية.
- المحاذاة منطقية وليست مكسورة.
- الأيقونات الاتجاهية تنعكس حيث يلزم.
- الجداول والـ dropdowns والـ popovers لا تخرج خارج الشاشة.
- الخط العربي محمّل ويظهر بشكل ثابت.

## 8. فحص دقة المسارات

### 8.1 المصدر الوحيد الموثوق

في هذا المشروع، المصدر الوحيد النهائي للمسارات هو:

```powershell
php artisan route:list --json
```

وليس:

- التوثيق اليدوي القديم
- ملفات الواجهة وحدها
- اختبارات Cypress اليدوية وحدها

### 8.2 نقطة مهمة جدًا من الفحص الحالي

وجدت أن بعض اختبارات Cypress الحالية تحتوي أمثلة routes قديمة أو غير مطابقة للشجرة الفعلية الحالية، مثل:

- `/invoices`
- `/proposals`
- `/contracts`
- `/leads`
- `/deals`
- `/clients`

بينما شجرة المشروع الفعلية اليوم تعتمد جذورًا مثل:

- `purchase-invoices`
- `sales-invoices`
- `sales-proposals`
- `crm/*`
- `account/*`
- `contract/*`

لذلك:

لا يجوز اعتماد ملفات Cypress الحالية كمصدر الحقيقة النهائي للمسارات.

### 8.3 طريقة الفحص الصحيحة

1. استخراج snapshot من `route:list`.
2. تجميعها حسب الجذر.
3. مراجعة route names المستخدمة في الواجهة.
4. مطابقة أي رابط ظاهر في الـ UI مع route فعلي.

### 8.4 معايير النجاح

- لا يوجد route ظاهر في الـ UI غير موجود في Laravel.
- لا يوجد route في Laravel يشير إلى صفحة React مفقودة.
- لا يوجد redirect دائري أو route قديم مستخدم في الواجهة.
- التوثيق الحالي للمسارات يطابق `route:list`.

## 9. فحص النتائج: هل البيانات المعروضة حقيقية وصحيحة؟

هذا السؤال لا يُجاب عنه بالشكل الصحيح إلا بفحص 3 مستويات:

### المستوى الأول: صحة المصدر

- الاستعلامات لا ترجع records مكسورة.
- العلاقات محملة.
- الأرقام متناسقة.

### المستوى الثاني: صحة النقل

- المتحكم يمرر نفس الحقول التي تحتاجها الصفحة.
- لا يوجد تحويلات ناقصة أو أسماء props غير متطابقة.

### المستوى الثالث: صحة العرض

- الصفحة لا تعرض placeholder بدل القيمة الحقيقية.
- لا يوجد fallback صامت يخفي المشكلة.
- لا يوجد rounding أو format يضلل المستخدم.

### الحكم المهني الصحيح

إذا كانت:

- العلاقات سليمة
- الـ joins سليمة
- الـ props سليمة
- الصفحة تعرض نفس القيمة القادمة من الخلفية

عندها نقول إن النتائج موثوقة جدًا.  
أما "100%" فلا تقال إلا بعد فحص حي على بيانات حقيقية وسيناريوهات فعلية.

## 10. خطة تشغيل الفحص المقترحة

نفّذ الفحص بهذا التسلسل:

### المرحلة 1: فحص بنيوي

```powershell
php artisan migrate:status
php artisan route:list --json > docs/Archive/routes-latest.json
npm run build
php artisan test
```

### المرحلة 2: فحص العلاقات والبيانات

- نفّذ SQL checks على الجداول الأساسية.
- تحقق من orphan records.
- تحقق من consistency للحقول المالية.
- راجع العلاقات الحرجة في النماذج.

### المرحلة 3: فحص الواجهة والربط

- افتح الصفحات الأساسية:
  - `/login`
  - `/dashboard`
  - `/settings`
  - `/notifications`
  - `/mission-command/*`
  - أهم صفحات الوحدات
- راقب:
  - Console errors
  - Network 500/422/419
  - Page not found
  - Undefined props

### المرحلة 4: فحص RTL والثيم

- غيّر اللغة إلى العربية.
- اختبر login + dashboard + settings + جدول + form + modal.
- قارن Light وDark.
- راقب الخطوط، الاتجاه، الهوامش، الأيقونات، الجداول.

### المرحلة 5: فحص E2E

```powershell
npm run test:e2e:headless
```

لكن بعد تحديث specs القديمة لتأخذ routes الفعلية من المشروع لا المسارات الافتراضية القديمة.

## 11. المخرجات المطلوبة من أي عملية فحص محترفة

يجب أن ينتهي الفحص بتقرير من 5 أقسام:

1. تقرير العلاقات والجداول.
2. تقرير صحة البيانات والنتائج.
3. تقرير توحيد الثيم.
4. تقرير العربية وRTL.
5. تقرير دقة المسارات وربط الواجهات بالخلفية.

وكل قسم يجب أن ينتهي بحكم واضح:

- `Passed`
- `Passed with warnings`
- `Failed`

## 12. الحكم النهائي الذي يجب أن نتبناه

الحكم الصحيح ليس:

"يبدو جيدًا"

بل:

"تم فحص المصدر البنيوي + البيانات + التشغيل + الواجهة، وهذه هي النقاط المؤكدة، وهذه هي النقاط التي ما زالت تحتاج إثباتًا".

هذا هو الأسلوب المهني الوحيد حتى لا نمنح ثقة زائفة.
