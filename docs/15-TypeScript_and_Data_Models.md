# 🏷️ TypeScript والنماذج البرمجية

> **آخر تحديث:** أبريل 2026

---

## 1. إعداد tsconfig.json

`tsconfig.json` في جذر المشروع مُعدّ ليشمل **جميع** ملفات النظام:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./resources/js/*"]
    }
  },
  "include": [
    "resources/js/**/*.ts",
    "resources/js/**/*.tsx",
    "resources/js/**/*.d.ts",
    "packages/dionone/**/*.ts",
    "packages/dionone/**/*.tsx",
    "packages/noble/**/*.ts",
    "packages/noble/**/*.tsx"
  ]
}
```

> ⚠️ بدون `packages/noble/**` في `include`، سيظهر IDE خطأ لكل `@/` import داخل الوحدات.

---

## 2. الأنواع المشتركة (Common Types)

ملف `resources/js/types/common.ts` يحتوي على الأنواع العامة لكل الوحدات:

```ts
// بيانات مرقّمة (Paginated API response)
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

// حالة النوافذ المنبثقة
export interface ModalState<T = any> {
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view' | '';
    data: T | null;
}

// المستخدم المصادق عليه
export interface AuthUser {
    id: number;
    type?: string;
    permissions: string[];
    [key: string]: any;
}

export interface AuthContext {
    user: AuthUser;
    [key: string]: any;
}
```

---

## 3. نمط types.ts لكل وحدة

كل صفحة لها ملف `types.ts` مجاور. النمط القياسي:

```ts
// packages/noble/Hrm/src/Resources/js/Pages/Attendances/types.ts

import { PaginatedData, ModalState, AuthContext } from '@/types/common';

// نموذج البيانات الأساسي
export interface Attendance {
    id: number;
    employee_id: number;
    date: string;
    clock_in: string;
    clock_out?: string;
    status: 'present' | 'half_day' | 'absent';  // ← union type محدد
    total_hour?: number;
    notes?: string;
    [key: string]: any;
}

// بيانات النموذج (Create)
export interface CreateAttendanceFormData {
    employee_id: string;
    date: string;
    clock_in: string;
    clock_out: string;
    notes: string;
    [key: string]: any;
}

// أنواع مشتقة
export type PaginatedAttendances = PaginatedData<Attendance>;
export type AttendanceModalState = ModalState<Attendance>;

// Props للصفحة الرئيسية
export interface AttendancesIndexProps {
    attendances: PaginatedAttendances;
    auth: AuthContext;
    employees: any[];
    [key: string]: any;
}
```

---

## 4. استخدام Props في الصفحة

```tsx
// Index.tsx
import { usePage } from '@inertiajs/react';
import { AttendancesIndexProps } from './types';

export default function Index() {
    const { attendances, auth, employees } = usePage<AttendancesIndexProps>().props;
    //      ↑ TypeScript يعرف الأنواع الدقيقة الآن
}
```

---

## 5. مكوّن Pagination

`Pagination` من `@/components/ui/pagination` يقبل:

```ts
interface PaginationProps {
    data: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    routeName?: string;
    filters?: Record<string, any>;
    onPageChange?: (page: number) => void;
}
```

> `PaginatedData<T>` يلتزم بهذه الواجهة تلقائياً (يحتوي على كل الحقول المطلوبة).

**الاستخدام الصحيح:**
```tsx
<Pagination
    data={attendances}
    routeName="hrm.attendances.index"
    filters={{ ...filters, per_page: perPage }}
/>
```

---

## 6. الأنواع الشائعة الأخرى

### `global.d.ts` — دوال عالمية

```ts
// resources/js/types/global.d.ts
import { route as ziggyRoute } from 'ziggy-js';

declare global {
    var route: typeof ziggyRoute;  // ← متاح عالمياً بدون import
}
```

### أنواع فلاتر

```ts
export interface AttendanceFilters {
    search: string;
    status: string;         // string وليس union - لأنه قد يكون ''
    employee_id: string;
    date_from: string;
    date_to: string;
    [key: string]: any;
}
```

---

## 7. أخطاء TypeScript الشائعة وحلولها

| الخطأ | السبب | الحل |
|-------|-------|------|
| `Cannot find module '@/...'` | `packages/noble/**` غير مدرج في tsconfig | تمت إضافته — أعد تشغيل TS Server |
| `Cannot find name 'route'` | نفس السبب أعلاه | إعادة تشغيل TS Server بعد tsconfig fix |
| `has no overlap` | مقارنة `'half day'` بدل `'half_day'` | استخدم القيمة الدقيقة من union type |
| `Type X is not assignable to Y` | تمرير `PaginatedData` كاملاً لـ `Pagination` | `data={attendances}` مباشرة (متوافق) |
| `Property 'total' does not exist` | default value خاطئ `holidays = []` | احذف `= []` إذا كان النوع `PaginatedHolidays` |

---

## 8. التحقق من الأنواع

```bash
# فحص TypeScript بدون بناء
npx tsc --noEmit

# بناء كامل (يمر عبر Vite/esbuild - لا يفحص الأنواع)
npm run build
```

> **ملاحظة:** `npm run build` يستخدم esbuild الذي يستقلّ بتجريد الأنواع ولا يتحقق منها. استخدم `tsc --noEmit` للتحقق الكامل.
