# بنية المسارات وخريطة الروابط (Routes Architecture)

> آخر تحقق فعلي: 2026-04-15  
> مصدر الاستخراج: `php artisan route:list --json`

هذا المستند يلخّص المسارات السطحية والفرعية الفعلية للتطبيق كما هي مسجلة داخل Laravel وقت الفحص، وليس فقط ما هو مذكور يدويًا في `routes/web.php`.

## 1. من أين تأتي المسارات؟

المسارات في هذا المشروع تأتي من خمسة مصادر رئيسية:

| المصدر | المسار | الدور |
|---|---|---|
| مسارات الويب الأساسية | `routes/web.php` | لوحة التحكم، الإعدادات، المستخدمون، العمليات اليومية |
| مسارات API الأساسية | `routes/api.php` | تسجيل الدخول البرمجي، HRM API، Taskly API، Support Ticket API |
| مسارات التوثيق والدخول | `routes/auth.php` | `login`, `register`, `forgot-password`, `verify-email` |
| مسارات النظام | `routes/installer.php`, `routes/updater.php` | التثبيت والتحديث |
| مسارات الوحدات | `packages/noble/*/src/Routes/web.php` | كل وحدة تضيف شجرة مساراتها الخاصة |

## 2. ملخص سريع بالأرقام

| المؤشر | القيمة |
|---|---|
| إجمالي المسارات المسجلة | `1365` |
| المسارات التطبيقية بعد استبعاد Debugbar/Ignition | `1356` |
| مسارات API تحت `/api/*` | `65` |
| أكثر الجذور ازدحامًا | `hrm`, `recruitment`, `account`, `crm`, `project` |

## 3. المسارات السطحية الأساسية للتطبيق

هذه هي الجذور الأساسية المعرفة مباشرة في التطبيق الأساسي:

| الجذر | أمثلة على المسارات الفرعية | الوظيفة |
|---|---|---|
| `/` | `/` | يعيد التوجيه إلى `login` |
| `dashboard` | `dashboard/cache-clear` | لوحة التحكم الرئيسية |
| `notifications` | `notifications/unread-count`, `notifications/{notification}/read` | مركز الإشعارات |
| `reports` | `reports/{reportType}`, `reports/{reportType}/export-csv` | مركز التقارير |
| `workflows` | `workflows/logs`, `workflows/{workflow}/toggle` | أتمتة سير العمل |
| `portal` | `portal/invoices`, `portal/projects`, `portal/contracts` | بوابة العميل أو المورّد |
| `mission-command` | `mission-command/dionflow`, `mission-command/unified-inbox`, `mission-command/security-audit` | مركز العمليات المتقدمة |
| `profile` | `profile` | تعديل الحساب الشخصي |
| `users` | `users/create`, `users/login/history`, `users/{user}/assign-plan` | إدارة المستخدمين |
| `roles` | `roles/create`, `roles/{role}/edit` | إدارة الأدوار والصلاحيات |
| `warehouses` | `warehouses/create`, `warehouses/{warehouse}/edit` | إدارة المستودعات |
| `transfers` | `transfers/create`, `transfers/{transfer}` | التحويلات |
| `purchase-invoices` | `purchase-invoices/{purchaseInvoice}/post`, `purchase-invoices/{purchaseInvoice}/print` | فواتير الشراء |
| `sales-invoices` | `sales-invoices/services/list`, `sales-invoices/warehouse/products` | فواتير البيع |
| `purchase-returns` | `purchase-returns/{return}/approve`, `purchase-returns/{return}/complete` | مرتجعات الشراء |
| `sales-returns` | `sales-returns/{salesReturn}/approve`, `sales-returns/{salesReturn}/complete` | مرتجعات البيع |
| `sales-proposals` | `sales-proposals/{salesProposal}/sent`, `sales-proposals/{salesProposal}/convert-to-invoice` | العروض والمقترحات |
| `helpdesk-categories` | `helpdesk-categories/create`, `helpdesk-categories/{helpdesk_category}` | تصنيفات التذاكر |
| `helpdesk-tickets` | `helpdesk-tickets/{ticket}/replies`, `helpdesk-tickets/{helpdesk_ticket}/edit` | التذاكر |
| `plans` | `plans/{plan}/subscribe`, `plans/{plan}/start-trial`, `plans/apply-coupon` | الخطط والاشتراكات |
| `coupons` | `coupons/create`, `coupons/{coupon}/edit` | الكوبونات |
| `orders` | `orders/{order}` | الطلبات |
| `add-ons` | `add-ons/install` | إدارة الإضافات |
| `add-on` | `add-on/upload`, `add-on/{name}/enable` | تفعيل وإدخال إضافة محددة |
| `user` | `user/active-modules`, `user/active-modules/{moduleId}` | الوحدات المفعلة للمستخدم |
| `settings` | `settings/brand`, `settings/system`, `settings/email/test`, `settings/cookie/download` | الإعدادات العامة |
| `bank-transfer` | `bank-transfer/update/{id}`, `bank-transfer/{payment}/reject` | التحويلات البنكية |
| `languages` | `languages/manage`, `languages/change`, `languages/{locale}/package/{packageName}` | إدارة اللغات |
| `email-templates` | `email-templates/{emailTemplate}/language/{lang}` | قوالب البريد |
| `notification-templates` | `notification-templates/{notificationTemplate}/language/{lang}` | قوالب الإشعارات |
| `messenger` | `messenger/contacts`, `messenger/messages/{userId}`, `messenger/toggle-pin` | الرسائل الداخلية |
| `media-library` | `media-library` | صفحة مكتبة الوسائط |
| `media` | `media/batch`, `media/directories`, `media/{id}/download` | API الوسائط |
| `audit-logs` | `audit-logs/security`, `audit-logs/export` | سجلات التدقيق |
| `invoices` | `invoices/{id}/download`, `invoices/{id}/stream` | تنزيل وعرض PDF |
| `translations` | `translations/{locale}` | تحميل ترجمات الواجهة |
| `cookie-consent-log` | `cookie-consent-log` | تسجيل موافقة الكوكيز |

## 4. مسارات التوثيق والدخول والنظام

| الجذر | أمثلة | الملاحظة |
|---|---|---|
| `login` | `GET login`, `POST login` | دخول المستخدم |
| `register` | `GET register`, `POST register` | إنشاء حساب |
| `forgot-password` | `GET forgot-password`, `POST forgot-password` | استعادة كلمة المرور |
| `reset-password` | `reset-password/{token}` | إعادة التعيين |
| `verify-email` | `verify-email`, `verify-email/{id}/{hash}` | التحقق من البريد |
| `confirm-password` | `GET confirm-password`, `POST confirm-password` | تأكيد كلمة المرور |
| `password` | `PUT password` | تحديث كلمة المرور للمستخدم الحالي |
| `logout` | `POST logout` | تسجيل الخروج |
| `install` | `install/requirements`, `install/environment`, `install/database`, `install/final` | معالج التثبيت |
| `updater` | `updater`, `updater/update` | معالج التحديث |

## 5. الجذور الكبيرة القادمة من الوحدات

هذه الوحدات تضيف الجزء الأكبر من المسارات الفرعية:

| الجذر | عدد المسارات | أمثلة على المسارات الفرعية |
|---|---:|---|
| `hrm` | `258` | `hrm/branches`, `hrm/departments`, `hrm/attendance`, `hrm/payroll` |
| `recruitment` | `104` | `recruitment/jobs`, `recruitment/interviews`, `recruitment/offers` |
| `account` | `95` | `account/chart-of-accounts`, `account/customers`, `account/bank-transfers` |
| `crm` | `87` | `crm/leads`, `crm/calls`, `crm/deal-stages` |
| `project` | `62` | `project/bug-stages`, `project/tasks`, `project/milestones` |
| `support-ticket` | `38` | `support-ticket/contact-information`, `support-ticket/cta-sections` |
| `training` | `36` | `training/tasks/{task}/feedbacks` |
| `double-entry` | `33` | `double-entry/balance-sheets`, `double-entry/journals` |
| `performance` | `28` | `performance/employee-goals`, `performance/employee-reviews` |
| `contract` | `25` | `contract/contract-types`, `contract/comments`, `contract/attachments` |
| `goal` | `24` | `goal/categories`, `goal/contributions` |
| `product-service` | `21` | `product-service/items`, `product-service/item-categories` |
| `budget-planner` | `19` | `budget-planner/budget-allocations`, `budget-planner/budget-monitoring` |
| `quotations` | `14` | `quotations/create`, `quotations/{quotation}/approve` |
| `pos` | `13` | `pos/create`, `pos/orders`, `pos/barcode/{sale}` |

الوحدات الأخرى ذات الجذور الأصغر تشمل:

`ai-assistant`, `calendar`, `landing-page`, `marketplace`, `paypal`, `stripe`, `slack`, `telegram`, `twilio`, `webhook`, `zoom-meeting`, `zoom-meetings`, `newsletter`, `faq`, `knowledge`, `custom-pages`.

## 6. المسارات الديناميكية العامة

بعض المسارات ليست ثابتة الجذر، بل تعتمد على slug ديناميكي:

| النمط | الوظيفة |
|---|---|
| `{slug}/public-support/*` | مركز دعم عام مرتبط بجهة أو شركة |
| `{userSlug}/careers/*` | صفحات التوظيف العامة |
| `page/{slug}` | صفحات CMS ديناميكية |
| `marketplace/{slug?}` | صفحات السوق أو الواجهة الخارجية |
| `paypal/{userSlug?}/beauty-spa/*` | مسارات دفع عامة مرتبطة بواجهة خارجية |
| `stripe/{userSlug?}/beauty-spa/*` | نفس الفكرة مع Stripe |

هذه المسارات يجب التعامل معها بحذر أثناء بناء الروابط أو إضافة middlewares لأن الجذر هنا متغير وليس ثابتًا.

## 7. خريطة API الحالية

الجذر البرمجي الأساسي هو `api/*`، وأبرز الفروع الحالية:

| الفرع | أمثلة |
|---|---|
| `api/login`, `api/logout`, `api/refresh` | المصادقة البرمجية |
| `api/user`, `api/change-password`, `api/edit-profile` | إدارة حساب المستخدم |
| `api/projects/clock-in`, `api/projects/clock-out` | تتبع المشاريع الجغرافي |
| `api/hrm/*` | الحضور، الإجازات، المزامنة الحيوية |
| `api/lead/*` | بيانات وإجراءات الـ Lead Board |
| `api/taskly/*` | المشاريع والمهام ولوحة Taskly |
| `api/support-ticket/*` | تذاكر الدعم وFAQs والمقالات |
| `api/product-service/items` | جلب عناصر المنتجات والخدمات |

## 8. أين أبحث لاحقًا إذا أردت تعديل مسار؟

| نوع المسار | أول مكان يجب مراجعته |
|---|---|
| مسار أساسي في التطبيق | `routes/web.php` |
| API أساسي | `routes/api.php` |
| تسجيل الدخول والتوثيق | `routes/auth.php` |
| تثبيت أو تحديث | `routes/installer.php`, `routes/updater.php` |
| مسار وحدة مثل HRM أو CRM | `packages/noble/<Module>/src/Routes/web.php` |

## 9. ملاحظات مهمة بعد الفحص

1. التطبيق ليس أحادي المسارات؛ هو منصة معيارية كبيرة تعتمد على وحدات تضيف Routes خاصة بها من داخل `packages/noble`.
2. مسارات `Mission Command` الفعلية مكتوبة بصيغة lowercase: `mission-command/*` وليس `MissionCommand/*`.
3. جزء كبير من الشجرة هو CRUD متكرر بصيغة Laravel Resource، لذلك أي وحدة جديدة غالبًا ستضيف الجذر الرئيسي ثم فروع `create`, `{id}`, `{id}/edit` ومسارات تشغيلية إضافية.
4. توجد مسارات داخلية للتطوير مثل `_debugbar/*` و `_ignition/*` لكنها ليست جزءًا من مسارات التطبيق الوظيفية.

## 10. مرجع محفوظ

تم حفظ هذا الملخص في هذا الملف، ويمكن الرجوع إلى اللقطة الخام الكاملة للمسارات داخل:

`docs/Archive/routes-2026-04-15.json`
