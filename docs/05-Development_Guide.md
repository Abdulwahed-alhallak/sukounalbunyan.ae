# 👨‍💻 دليل المطور (Development Guide)

> **آخر تحديث:** أبريل 2026

## 1. حزمة التكنولوجيا (Technology Stack)

| الطبقة | التقنية | الإصدار |
|--------|---------|---------|
| Backend | Laravel | 12 (PHP 8.2+) |
| Frontend | React + TypeScript | 18 + TSX |
| Bridge | Inertia.js | 2.0 |
| Styling | Tailwind CSS | v3+ |
| Bundler | Vite.js | 5 |
| Design System | Vercel Geist | 2026 Edition |
| State | Inertia Props + useState | — |
| Translations | react-i18next | JSON files |

---

## 2. هيكل المشروع (Project Structure)

```
noble.dion.sy/
├── app/                        # Laravel core (Controllers, Models, Services)
├── bootstrap/                  # Laravel bootstrap
├── config/                     # Laravel config files
├── database/                   # Migrations, seeders, factories
├── docs/                       # ← هذه الوثائق
├── packages/
│   └── noble/                  # وحدات النظام المستقلة
│       ├── Account/            # المحاسبة
│       ├── AIAssistant/        # مساعد الذكاء الاصطناعي
│       ├── BudgetPlanner/      # تخطيط الميزانية
│       ├── Contract/           # إدارة العقود
│       ├── DoubleEntry/        # القيد المزدوج
│       ├── Goal/               # إدارة الأهداف
│       ├── Hrm/                # إدارة الموارد البشرية
│       ├── Lead/               # إدارة العملاء المحتملين (CRM)
│       ├── Pos/                # نقطة البيع
│       ├── ProductService/     # المنتجات والخدمات
│       ├── Recruitment/        # التوظيف
│       ├── SupportTicket/      # الدعم الفني
│       ├── Taskly/             # إدارة المهام والمشاريع
│       └── ...                 # 31+ وحدة إجمالاً
├── resources/
│   ├── css/
│   │   ├── app.css             # التوكنز + الثيم + المكونات العامة
│   │   └── rtl.css             # تجاوزات RTL
│   ├── js/
│   │   ├── components/
│   │   │   └── ui/             # مكونات ذرية (Button, Input, Card, ...)
│   │   ├── contexts/           # React Contexts (BrandProvider, ...)
│   │   ├── hooks/              # Custom hooks (useDeleteHandler, ...)
│   │   ├── layouts/            # authenticated-layout, auth-layout
│   │   ├── pages/              # صفحات النظام الرئيسي (غير الوحدات)
│   │   ├── types/              # TypeScript types (common.ts, global.d.ts)
│   │   └── utils/              # helpers, i18n, menus, settings
│   └── lang/                   # ملفات الترجمة (ar.json, en.json, ...)
├── routes/                     # web.php, api.php
├── _scripts/                   # سكربتات الصيانة (مصنفة بمجلدات فرعية)
│   ├── database/               # البذور وقاعدة البيانات
│   ├── debug/                  # تشخيص ومراقبة
│   ├── deployment/             # نشر على Hostinger
│   ├── fixes/                  # إصلاحات لمرة واحدة
│   ├── hostinger/              # إعدادات خاصة بـ Hostinger
│   ├── imports/                # استيراد بيانات
│   ├── setup/                  # إعداد أولي للمشروع
│   ├── sync/                   # مزامنة ورفع
│   └── translations/           # معالجة ملفات اللغة
├── tsconfig.json               # TypeScript config (يشمل packages/noble/**)
├── tailwind.config.js          # Tailwind + Geist scales
└── vite.config.js              # Vite + @/ alias
```

### هيكل كل وحدة (Package Structure)

كل وحدة في `packages/noble/[ModuleName]/` تتبع هذا الهيكل:

```
ModuleName/
└── src/
    ├── Http/
    │   └── Controllers/        # Laravel Controllers
    ├── Models/                 # Eloquent Models
    ├── Services/               # Business Logic Services
    ├── Routes/                 # web.php للوحدة
    ├── Migrations/             # جداول قاعدة البيانات
    └── Resources/
        └── js/
            └── Pages/
                ├── Index.tsx   # قائمة العناصر
                ├── Create.tsx  # نموذج الإنشاء
                ├── Edit.tsx    # نموذج التعديل
                ├── Show.tsx    # عرض التفاصيل
                └── types.ts    # TypeScript types للوحدة
```

---

## 3. إعداد TypeScript والمسارات

### `tsconfig.json`
يشمل الآن `packages/noble/**` كاملاً لحل أخطاء IDE:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./resources/js/*"]
    }
  },
  "include": [
    "resources/js/**/*.ts",
    "resources/js/**/*.tsx",
    "resources/js/**/*.d.ts",
    "packages/noble/**/*.ts",
    "packages/noble/**/*.tsx"
  ]
}
```

### النوع العام للبيانات المرقمة (Pagination)

`resources/js/types/common.ts` يحتوي على:

```ts
export interface PaginatedData<T> {
    data: T[];
    links: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    [key: string]: any;
}
```

استخدمه في كل `types.ts` للوحدة:
```ts
export type PaginatedAttendances = PaginatedData<Attendance>;
```

### `route()` Global Type
معرّف في `resources/js/types/global.d.ts` — لا تضفه يدوياً.

---

## 4. تدفق البيانات (Data Flow)

```
HTTP Request
    ↓
routes/web.php  |  packages/noble/*/Routes/web.php
    ↓
Controller::index()
    ↓
Inertia::render('Hrm/Attendances/Index', ['attendances' => ..., 'auth' => ...])
    ↓
packages/noble/Hrm/src/Resources/js/Pages/Attendances/Index.tsx
    ↓
usePage<AttendancesIndexProps>().props
    ↓
React renders UI
```

---

## 5. قواعد البرمجة الإلزامية

### ✅ يجب دائماً:

1. **الترجمة عبر `useTranslation`:**
   ```tsx
   const { t } = useTranslation();
   <h1>{t('Manage Employees')}</h1>
   ```

2. **استخدام المكونات المشتركة:** `Button`, `Input`, `DataTable`, `Pagination`, `Badge`, `Dialog` من `@/components/ui/`

3. **الخصائص المنطقية لـ RTL/LTR:**
   | ❌ ممنوع | ✅ صحيح |
   |----------|---------|
   | `ml-4` | `ms-4` |
   | `mr-4` | `me-4` |
   | `pl-4` | `ps-4` |
   | `left-0` | `start-0` |

4. **TypeScript صارم:** كل صفحة لها ملف `types.ts` مرافق.

5. **توكنز التصميم بدلاً من ألوان خام:**
   | ❌ ممنوع | ✅ صحيح |
   |----------|---------|
   | `text-red-500` | `text-destructive` |
   | `bg-gray-100` | `bg-muted` |
   | `border-gray-200` | `border-border` |

### ❌ ممنوع:
- كتابة نصوص مباشرة (Hardcoded strings) بدون `t()`
- تعديل DOM مباشرة (`document.querySelector`, jQuery)
- مصطلحات Sci-Fi أو عسكرية في الواجهة (Mission, Deploy, Vector, ...)
- استخدام ألوان Hex مباشرة في JSX

---

## 6. تشغيل البيئة المحلية

```bash
# في نافذة أولى (Backend)
php artisan serve

# في نافذة ثانية (Frontend)
npm run dev
```

> تأكد أن `APP_URL` في `.env` يطابق الرابط المحلي وأن منفذ Vite (5173) مفتوح.

---

## 7. بناء الإنتاج

```bash
npm run build
```

يولد الملفات في `public/build/` (مستبعد من Git عبر `.gitignore`).

---

## 8. إضافة وحدة جديدة

1. إنشاء المجلد في `packages/noble/ModuleName/`
2. تسجيل مزود الخدمة في `config/app.php`
3. تسجيل namespace في `composer.json`:
   ```json
   "Noble\\ModuleName\\": "packages/noble/ModuleName/src/"
   ```
4. تنفيذ `composer dump-autoload`
5. رفع الـ Add-on في جداول `addons` و `plan_addons`
