# 🌐 بنية المسارات وخريطة الروابط (Routes Architecture)

تعتمد بنية الروابط الأساسية في المشروع على توجيهات إطار العمل Laravel مع تكامل حزمة Inertia.js لتخديم مكونات واجهة React. تم تنظيم جميع مسارات الويب المركزية عبر ملف `web.php`، وتشمل الأقسام التالية:

## 1. التوجيه الأساسي وتوثيق الدخول

يتم التوجيه الأولي إلى مسار الدخول كمسار افتراضي:

```php
Route::get('/', function () {
    return redirect('login');
});
```

كافة المسارات المحمية تتطلب الصلاحيات عبر الـ Middlewares (`auth`, `verified`, `PlanModuleCheck`). دور `PlanModuleCheck` هو التحقق من أن المستخدم لديه اشتراك فعال ومصرح له بالدخول لهذه الوحدة من النظام.

## 2. المسارات التشغيلية للوحة التحكم (Dashboard & Operations)

- **لوحة القيادة الرئيسية:** `/dashboard` مع إمكانية مسح ذاكرة التخزين المؤقت.
- **إدارة الإشعارات والتقارير:** يتم استدعاؤها عبر `UserNotificationController` و `ReportCenterController`.

## 3. مسارات Mission Command (التحكم المركزي)

يضم النظام وحدة فريدة للقيادة تُدعى بـ "Mission Command"، وتشمل:

- `/mission-command/gamification`: نظام التلعيب والمكافآت.
- `/mission-command/dionflow`: نظام أتمتة الإجراءات (No-code Engine).
- `/mission-command/unified-inbox`: صندوق المحادثات الموحد للرد على العملاء.

## 4. مسارات تخطيط الموارد والعمليات اليومية

- مسارات **الـ Invoices والـ Sales** والتي تعتمد في أغلبيتها على أنظمة الاستعلام `Resource Routes` مما يوفر مسارات للقيام بإنشاء وتعديل وقراءة وحذف الفواتير والموارد بكل سهولة:

```php
Route::resource('purchase-invoices', PurchaseInvoiceController::class);
Route::resource('sales-invoices', SalesInvoiceController::class);
```

- مسارات **مرتجعات المبيعات والمشتريات** مع وجود نقاط لاعتماد (approve) واتمام (complete) دورة المستند بالكامل.

## 5. نظام مساحات العمل والمستخدمين (Tenants & Roles)

- مسارات **المستخدمين والصلاحيات (`roles` / `users`)** توفر إدارة كاملة للمنصة وربط الباقات (الخطط الشرائية) بالمستخدم عبر `/users/{user}/assign-plan`

## 6. نظام الباقات والتوسعات (Plans & Add-ons)

- يحتوي النظام على مسارات متقدمة لاشتراكات المنصة مثل `/subscriptions` ومسارات لدعم الكوبونات والتجارب المجانية وتفعيل إضافات (Add-ons) جديدة للعميل بشكل تلقائي `/add-ons/install` و `/add-on/{name}/enable`.

## 7. الربط مع المحرك الأمامي (Inertia Routing Bridge)

جميع أوامر الـ Return داخل المتحكمات (Controllers) تعتمد على استدعاء `Inertia::render('ViewName')`، ليتم عرض صفحات `tsx` المطورة بـ React دون الحاجة لصفحات Blade تقليدية مما يسرع عملية التنقل بين الصفحات بنظام تطبيق الصفحة الواحدة (SPA).
