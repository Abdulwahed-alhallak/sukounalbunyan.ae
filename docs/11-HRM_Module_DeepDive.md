# 👥 وحدة الموارد البشرية — HRM Module Deep Dive

> **آخر تحديث:** أبريل 2026  
> **الوحدة:** `packages/noble/Hrm/`

---

## 1. نظرة عامة

وحدة HRM هي الأضخم في المنصة — **51 نموذج (Model)**، **51 متحكم (Controller)**، **30 مجلد صفحات**.
تُغطي الدورة الكاملة للموظف من التوظيف حتى الفصل.

---

## 2. صفحات الوحدة (Frontend Pages)

```
packages/noble/Hrm/src/Resources/js/Pages/
├── Dashboard/
│   ├── company-dashboard.tsx       → لوحة مديري الشركة (KPIs، إحصائيات)
│   └── employee-dashboard.tsx      → لوحة الموظف الشخصية
├── Employees/
│   ├── Index.tsx                   → قائمة الموظفين (بحث، فلتر، جدول)
│   ├── Create.tsx                  → نموذج إضافة موظف (تبويبات: Personal, Employment, Document)
│   ├── Edit.tsx                    → تعديل بيانات موظف
│   └── Show.tsx                    → ملف الموظف الكامل
├── Attendances/
│   ├── Index.tsx                   → سجل الحضور (list + grid view)
│   ├── Create.tsx                  → تسجيل حضور يدوي
│   ├── Edit.tsx                    → تعديل سجل حضور
│   ├── Show.tsx                    → عرض تفاصيل الحضور
│   ├── Tracker.tsx                 → متتبع الحضور الزمني
│   └── types.ts                    → Attendance, PaginatedAttendances, AttendanceFilters
├── Holidays/
│   ├── Index.tsx                   → قائمة الإجازات الرسمية
│   ├── Create.tsx / Edit.tsx / View.tsx
│   └── types.ts
├── LeaveApplications/
│   ├── Index.tsx                   → طلبات الإجازة
│   ├── Create.tsx                  → تقديم طلب إجازة
│   └── types.ts
├── Payrolls/                       → الرواتب والمستحقات
├── Contracts/                      → عقود الموظفين
├── Departments/                    → الأقسام
├── Shifts/                         → جداول مناوبات العمل
├── OrgChart/Index.tsx              → الهيكل التنظيمي (شجرة تفاعلية)
├── Assets/                         → أصول الشركة المخصصة للموظفين
├── Awards/                         → المكافآت والتقديرات
├── SetSalary/                      → تحديد الراتب والقروض
├── LeaveTypes/                     → أنواع الإجازات
├── Resignations/                   → طلبات الاستقالة
├── Recruitment/                    → التوظيف
└── SystemSetup/                    → إعدادات النظام (WorkingDays, IpRestricts, DocumentCategories)
```

---

## 3. النماذج (Models) الأساسية

| النموذج | الوصف |
|---------|-------|
| `Employee` | بيانات الموظف الكاملة — مرتبط بـ `User` |
| `Attendance` | سجلات الحضور: `status: 'present'\|'half_day'\|'absent'` |
| `Holiday` | الإجازات الرسمية المجدولة |
| `LeaveApplication` | طلبات الإجازة مع حالات الموافقة |
| `Payroll` | الرواتب المحتسبة |
| `EmployeeContract` | عقود الموظفين |
| `Shift` | جداول المناوبات |
| `Department` | الأقسام التنظيمية |
| `Award` | المكافآت والجوائز |

---

## 4. أنواع TypeScript للوحدة

### نمط الاستخدام في كل صفحة:
```tsx
import { usePage } from '@inertiajs/react';
import { Attendance, AttendancesIndexProps } from './types';

const { attendances, auth, employees } = usePage<AttendancesIndexProps>().props;
```

### حالة الـ Status — تحذير مهم
```ts
// ✅ الصحيح (يطابق DB enum)
status: 'present' | 'half_day' | 'absent'

// ❌ خطأ شائع تم إصلاحه
a.status === 'half day'   // المسافة خطأ!
a.status === 'half_day'   // ✅ بشرطة سفلية
```

---

## 5. المتحكمات (Controllers)

```
packages/noble/Hrm/src/Http/Controllers/
├── EmployeeController              → CRUD + import/export CSV
├── AttendanceController            → CRUD + إحصائيات
├── HolidayController               → CRUD
├── LeaveApplicationController      → CRUD + workflow الموافقة
├── PayrollController               → احتساب + طباعة Payslip
├── DepartmentController            → CRUD
├── ShiftController                 → CRUD
├── HrmDashboardController          → بيانات لوحة المدير والموظف
└── OrgChartController              → بيانات الهيكل التنظيمي
```

---

## 6. مسارات الوحدة (Routes)

```php
// packages/noble/Hrm/src/Routes/web.php
Route::prefix('hrm')->name('hrm.')->group(function () {
    Route::get('/', ...)->name('index');
    Route::resource('employees', EmployeeController::class);
    Route::resource('attendances', AttendanceController::class);
    Route::resource('holidays', HolidayController::class);
    Route::resource('leave-applications', LeaveApplicationController::class);
    // ... 30+ routes
});
```

---

## 7. مثال على دورة الحضور

```
1. Shift يُحدد ساعات العمل (08:00 → 17:00)
2. Employee يُسجّل Clock-In عبر النظام
3. Attendance record يُنشأ: status='present', clock_in=timestamp
4. Clock-Out يُسجّل → total_hour يُحسب تلقائياً
5. AttendanceController يعرض الإحصائيات في Dashboard
6. Payroll يقرأ total_hour لاحتساب الراتب
```

---

## 8. إصلاحات أبريل 2026

| الملف | الإصلاح |
|-------|---------|
| `Attendances/Index.tsx` | `'half day'` → `'half_day'` في filter |
| `Attendances/Index.tsx` | Pagination type fix (`as any`) |
| `Holidays/Index.tsx` | حذف `= []` default الخاطئ |
| `Holidays/Index.tsx` | Pagination type fix |
| `LeaveApplications/Index.tsx` | مصطلحات احترافية |
| `LeaveApplications/Create.tsx` | مصطلحات احترافية |
| `company-dashboard.tsx` | مصطلحات احترافية |
| `employee-dashboard.tsx` | مصطلحات احترافية |

---

## 9. الترجمات

الملف المرجعي: `resources/lang/ar.json`  
السكريبت المساعد: `_scripts/translations/add_hrm_translations.php`  
مفاتيح HRM موثقة في: `_scripts/translations/hrm_keys.txt`
