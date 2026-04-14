# 🎨 قواعد التصميم والثيم المرئي — Vercel Geist 2026 Edition

> **آخر تحديث:** أبريل 2026  
> **الإصدار:** Geist Design System 2026  
> **المصادر الرسمية:**
> - [Introduction](https://vercel.com/geist/introduction)
> - [Colors](https://vercel.com/geist/colors)
> - [Typography](https://vercel.com/geist/typography)
> - [Materials](https://vercel.com/geist/materials)

يعتبر المظهر المرئي جزءاً ثابتاً غير قابل للتجاوز في بناء أي صفحة أو وحدة جديدة. تم بناء منصة Noble Architecture على نظام تصميم **Geist** الرسمي من Vercel بنسخة 2026، مع دعم كامل للغة العربية و RTL.

---

## 1. الخطوط (Typography)

> المصدر: [vercel.com/geist/typography](https://vercel.com/geist/typography)

### 1.1 عائلات الخطوط

| الغرض | الخط | CSS Variable |
|-------|------|-------------|
| النصوص اللاتينية | `Geist Sans` | `--font-geist-sans` |
| النصوص العربية (RTL) | `IBM Plex Sans Arabic` | — |
| الأكواد والأرقام | `Geist Mono` | `--font-geist-mono` |

**Font Stack المعتمد:**
```css
font-family: 'Geist Sans', 'IBM Plex Sans Arabic', ui-sans-serif, system-ui, 
             -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

### 1.2 مقياس الخطوط (Typography Scale)

Geist يعرّف 3 فئات من النصوص: **Headings** (عناوين)، **Labels** (تسميات)، و **Copy** (جسم النص).

#### العناوين (Headings)
تُستخدم لتقديم الصفحات والأقسام.

| الفئة CSS | الحجم | ارتفاع السطر | تباعد الحروف | الوزن |
|-----------|-------|-------------|-------------|-------|
| `.text-heading-72` | 72px | 72px | -4.32px | 600 |
| `.text-heading-48` | 48px | 56px | -2.88px | 600 |
| `.text-heading-32` | 32px | 40px | -1.28px | 600 |
| `.text-heading-24` | 24px | 32px | -0.96px | 600 |
| `.text-heading-20` | 20px | 28px | -0.4px | 600 |
| `.text-heading-16` | 16px | 24px | -0.32px | 600 |

#### الأزرار (Buttons)
تُستخدم **حصرياً** داخل مكونات الأزرار.

| الفئة CSS | الحجم | ارتفاع السطر | الوزن |
|-----------|-------|-------------|-------|
| `.text-button-16` | 16px | 24px | 500 |
| `.text-button-14` | 14px | 20px | 500 |
| `.text-button-12` | 12px | 16px | 500 |

#### التسميات (Labels)
مصمّمة للأسطر المفردة مع ارتفاع سطر ملائم للأيقونات.

| الفئة CSS | الحجم | ارتفاع السطر | الوزن |
|-----------|-------|-------------|-------|
| `.text-label-16` | 16px | 24px | 400 |
| `.text-label-14` | 14px | 20px | 400 |
| `.text-label-13` | 13px | 20px | 400 |
| `.text-label-12` | 12px | 16px | 400 |

#### جسم النص (Copy)
مصمّم لعدة أسطر مع ارتفاع سطر أعلى من Label.

| الفئة CSS | الحجم | ارتفاع السطر | الوزن |
|-----------|-------|-------------|-------|
| `.text-copy-16` | 16px | 24px | 400 |
| `.text-copy-14` | 14px | 22px | 400 |
| `.text-copy-13` | 13px | 20px | 400 |

#### المُعدِّلات (Modifiers)
لاستخدام **Strong** (غامق) داخل أي فئة نصية:
```html
<p class="text-copy-16">نص عادي <strong>مع نص غامق</strong></p>
```
- العناوين: `strong` يرفع الوزن إلى **700**
- النسخ والتسميات: `strong` يرفع الوزن إلى **600**

### 1.3 خصائص خطية إضافية
```css
letter-spacing: -0.011em;           /* Body tracking */
font-feature-settings: "rlig" 1, "calt" 1;
-webkit-font-smoothing: antialiased;
```

> ⛔ **ممنوع:** استخدام أي خطوط خارجية أخرى أو الخطوط الافتراضية للمتصفح.

---

## 2. نظام الألوان (Colors)

> المصدر: [vercel.com/geist/colors](https://vercel.com/geist/colors)

يحتوي النظام على **10 سلالم لونية** (Color Scales)، كل سلّم يتألف من 10 درجات مرقمة. الألوان تتبدل تلقائياً بين Light و Dark.

### 2.1 هيكل السلالم اللونية

وفقاً لتوثيق Geist الرسمي، تُقسّم الدرجات حسب الوظيفة:

| الدرجات | الوظيفة | الاستخدام |
|---------|---------|-----------|
| **Background 1-2** | خلفيات الصفحة | `--background` و `--background-2` |
| **Colors 1-3** | خلفيات المكونات | Default → Hover → Active |
| **Colors 4-6** | الحدود | Default → Hover → Active |
| **Colors 7-8** | خلفيات عالية التباين | Solid → Hover |
| **Colors 9-10** | النصوص والأيقونات | Secondary → Primary |

### 2.2 سلّم الرمادي (Gray Scale)

| # | Light | Dark | Tailwind |
|---|-------|------|----------|
| 1 | `#F2F2F2` | `#1A1A1A` | `bg-geist-gray-1` |
| 2 | `#EDEDED` | `#232323` | `bg-geist-gray-2` |
| 3 | `#DEDEDE` | `#2B2B2B` | `bg-geist-gray-3` |
| 4 | `#EBEBEB` (Border) | `#2E2E2E` | `border-geist-gray-4` |
| 5 | `#D9D9D9` (Hover Border) | `#383838` | `border-geist-gray-5` |
| 6 | `#C7C7C7` (Active Border) | `#474747` | `border-geist-gray-6` |
| 7 | `#8F8F8F` (HC Background) | `#737373` | `bg-geist-gray-7` |
| 8 | `#707070` (HC Hover) | `#8F8F8F` | `bg-geist-gray-8` |
| 9 | `#4D4D4D` (2ry Text) | `#A1A1A1` | `text-geist-gray-9` |
| 10 | `#171717` (1ry Text) | `#EDEDED` | `text-geist-gray-10` |

### 2.3 سلّم الأزرق (Blue Scale)

| # | Light | Dark | الدور |
|---|-------|------|-------|
| 1 | `#F0F7FF` | Deep dark | Badge background |
| 7 | `#0070F3` ⭐ | `#52A8FF` | Vercel Blue / Links / Actions |
| 10 | `#05264E` | Light | Dark text on blue BG |

### 2.4 سلّم الأحمر (Red Scale)

| # | Light | Dark | الدور |
|---|-------|------|-------|
| 1 | `#FFF0F0` | — | Error badge background |
| 7 | `#E00000` ⭐ | `#FF3333` | Vercel Error |
| 10 | `#4E0505` | — | Dark text on red BG |

### 2.5 سلّم الكهرماني (Amber Scale)

| # | Light | Dark | الدور |
|---|-------|------|-------|
| 1 | `#FFF8F0` | — | Warning badge background |
| 6 | `#F5A623` ⭐ | — | Vercel Amber / Warning |
| 10 | `#412E0A` | — | Dark text on amber BG |

### 2.6 سلّم الأخضر (Green Scale)

| # | Light | Dark | الدور |
|---|-------|------|-------|
| 1 | `#EFFFF4` | — | Success badge background |
| 7 | `#0D7844` ⭐ | `#1EA54A` | Vercel Green / Success |
| 10 | `#0F3320` | — | Dark text on green BG |

### 2.7 سلالم إضافية

| السلّم | اللون المميز (#7) | Tailwind Prefix |
|--------|-------------------|-----------------|
| **Teal** سيان | `#0A8A87` | `geist-teal` |
| **Purple** بنفسجي | `#8B33E0` | `geist-purple` |
| **Pink** وردي | `#F81CE5` | `geist-pink` |

### 2.8 الخلفيات (Backgrounds)

| التوكن | Light | Dark | الوصف |
|--------|-------|------|-------|
| `--background` | `#FFFFFF` | `#000000` | خلفية الصفحة الأساسية |
| `--background-2` | `#FAFAFA` | `#0A0A0A` | خلفية ثانوية (Sidebar) |

### 2.9 استخدام الألوان في Tailwind

```html
<!-- الاستخدام عبر Semantic Tokens (مُوصى) -->
<div class="bg-background text-foreground border-border">...</div>

<!-- الاستخدام عبر Geist Scales (للحالات المتقدمة) -->
<div class="bg-geist-blue-1 text-geist-blue-7 border-geist-blue-4">...</div>
<span class="bg-geist-red-1 text-geist-red-7">خطأ</span>
<span class="bg-geist-green-1 text-geist-green-7">نشط</span>
```

> ⛔ **ممنوع:** استخدام ألوان Hex مباشرة مثل `text-red-500`.  
> ✅ **واجب:** استخدام التوكنز الدلالية أو سلالم Geist.

---

## 3. المواد (Materials)

> المصدر: [vercel.com/geist/materials](https://vercel.com/geist/materials)

Geist يعرّف **مُسبقات** (Presets) للأنصاف القطرية (Radii)، والتعبئات (Fills)، والحدود (Strokes)، و الظلال (Shadows).

### 3.1 نوعان أساسيان

| النوع | الوصف | الاستخدام |
|-------|-------|-----------|
| **Surface** (على الصفحة) | عناصر ثابتة على سطح الصفحة | بطاقات، جداول، أقسام |
| **Floating** (فوق الصفحة) | عناصر طافية فوق المحتوى | قوائم، تلميحات، نوافذ |

### 3.2 توكنز الظلال (Shadow Tokens)

```css
/* Light Theme */
--shadow-surface: 0 0 0 1px rgba(0,0,0,0.08);
--shadow-tooltip: 0 0 0 1px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04);
--shadow-menu:    0 0 0 1px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06);
--shadow-modal:   0 0 0 1px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.12);

/* Dark Theme */
--shadow-surface: 0 0 0 1px rgba(255,255,255,0.14);
--shadow-tooltip: 0 0 0 1px rgba(255,255,255,0.14), 0 4px 8px rgba(0,0,0,0.25);
--shadow-menu:    0 0 0 1px rgba(255,255,255,0.14), 0 8px 24px rgba(0,0,0,0.4);
--shadow-modal:   0 0 0 1px rgba(255,255,255,0.14), 0 24px 48px rgba(0,0,0,0.65);
```

> **ملاحظة:** ظلال Vercel تبدأ دائماً بـ `inset ring` بسمك 1px، ثم ظل خارجي. في الوضع الليلي، الحلقة الداخلية تستخدم اللون الأبيض بشفافية 14%.

### 3.3 فئات المواد الجاهزة

| الفئة CSS | نصف القطر | الظل | الاستخدام |
|-----------|----------|------|-----------|
| `.geist-surface` | 6px | `--shadow-surface` | بطاقات وعناصر ثابتة |
| `.geist-tooltip-material` | 6px | `--shadow-tooltip` | تلميحات وعناصر صغيرة |
| `.geist-menu-material` | 12px | `--shadow-menu` | قوائم منسدلة |
| `.geist-modal-material` | 12px | `--shadow-modal` | نوافذ حوار |
| `.geist-fullscreen-material` | 16px | `--shadow-modal` | أدراج وصفحات كاملة |

### 3.4 أنصاف الأقطار (Radii)

| نصف القطر | القيمة | الاستخدام | Tailwind |
|-----------|--------|-----------|----------|
| Base | `6px` (`var(--radius)`) | مدخلات، أزرار، بطاقات عادية | `rounded-lg` |
| Small | `4px` | شارات، عناصر صغيرة | `rounded-sm` |
| Medium | `4px` | — | `rounded-md` |
| Large | `12px` | قوائم، نوافذ | `rounded-xl` |
| XLarge | `16px` | شاشات كاملة | `rounded-2xl` |
| Full | `9999px` | شارات دائرية | `rounded-full` |

| Full | `9999px` | شارات دائرية | `rounded-full` |

> ⛔ **ممنوع:** كتابة `rounded-[12px]` أو أي قيمة عشوائية.

### 3.5 مادة الزجاج الفاخر (Noble Glass)
تُستخدم لإبراز العناصر فوق الخلفيات المزخرفة.
- **الفئة:** `.geist-glass` (أو `variant="glass"` في البطاقة)
- **الخصائص:** `bg-background/90`, `backdrop-blur-xl`, `border-border/50`.

---

## 4. كثافة المعلومات (Information Density)
يعتمد Noble Architecture على نمط "High Density" المناسب للنظم الإدارية المعقدة.

### 4.1 مبادئ الكثافة
- **الهوامش:** استخدام `gap-1` و `gap-2` للارتباط الوثيق، و `gap-6` للفصل بين الأقسام الكبرى.
- **الأحجام:** الارتفاع القياسي للمدخلات والأزرار هو `h-8` أو `h-10`.
- **الخطوط:** استخدام `text-label-13` كخط أساسي للجداول والقوائم بدلاً من 14 للوصول لكثافة أعلى.
- **الأيقونات:** الحجم القياسي للأيقونات هو `h-4 w-4` مع `strokeWidth={1.5}`.

---

## 5. المكونات البصرية (UI Components)

### 4.1 البطاقات (Cards)

| الفئة | المادة | الاستخدام |
|-------|--------|-----------|
| `.vercel-card` | Surface | جداول، قوائم، عناصر عامة |
| `.premium-card` | Surface → Menu (hover) | لوحات KPI، إحصائيات |

```html
<div class="vercel-card p-6">
    <h3 class="text-heading-16 text-foreground">عنوان</h3>
    <p class="text-copy-14 text-geist-gray-9">وصف</p>
</div>
```

### 4.2 الشارات (Badges)

```html
<span class="vercel-badge vercel-badge-success">نشط</span>
<span class="vercel-badge vercel-badge-error">خطأ</span>
<span class="vercel-badge vercel-badge-warning">تحذير</span>
<span class="vercel-badge vercel-badge-info">معلومة</span>
<span class="vercel-badge vercel-badge-neutral">محايد</span>
```

الشارات تستخدم **Color 1** كخلفية و **Color 7** كنص من السلّم المناسب.

### 4.3 المدخلات (Inputs)

```html
<input class="vercel-input" placeholder="اكتب هنا..." />
```

- **Hover:** حدود `Gray-5`
- **Focus:** حلقة زرقاء `Blue-7` مع ظل `0 0 0 3px hsl(--blue-7 / 0.1)`
- **ممنوع** استخدام `<select>` الافتراضي

### 4.4 لوحة المفاتيح (KBD)

```html
<kbd>⌘</kbd> <kbd>K</kbd>
```

تستخدم خلفية `Gray-1`، نص `Gray-9`، حدود `Gray-4`.

### 4.5 الخلفيات الزخرفية

| الفئة | الوصف |
|-------|-------|
| `.vercel-dots` | نقاط دائرية (24px) |
| `.vercel-grid` | شبكة خطية (64px) باستخدام `Gray-4` |
| `.grain-overlay` | ضوضائي رقيق |
| `.vercel-gradient-line` | تدرج (cyan → blue → purple → pink) |

---

## 5. الأنيميشن (Animations)

### 5.1 أنيميشن CSS مدمجة

| الفئة | التأثير | المدة |
|-------|---------|------|
| `.animate-fade-in` | ظهور تدريجي | 0.3s |
| `.animate-slide-up` | انزلاق من الأسفل | 0.3s |
| `.animate-scale-in` | تكبير تدريجي | 0.2s |

### 5.2 تأثيرات خاصة

| الفئة | الوصف |
|-------|-------|
| `.vercel-skeleton` | بريق بين `Gray-1` و `Gray-3` |
| `.vercel-pulse` | نبض حيوي |
| `.vercel-spinner` | دوران بحد `Gray-4` و رأس `foreground` |
| `.premium-shimmer` | تدرج نصي (foreground → blue → foreground) |

### 5.3 Tailwind Keyframes

```
animate-accordion-down    animate-accordion-up
animate-fade-in           animate-fade-out
animate-slide-up          animate-slide-down
animate-scale-in          animate-scale-out
animate-slide-in-right    animate-slide-in-left
```

---

## 6. نظام الثيم (Theme Switching)

### 6.1 البنية

```
app.tsx
  └─ ThemeProvider (next-themes — class على <html>)
       └─ BrandProvider (brand-context.tsx)
            └─ ThemeToggle (theme-toggle.tsx)
```

### 6.2 آلية التبديل

1. المستخدم يضغط زر ☀️/🌙
2. فئة `.dark` / `.light` تُطبّق فوراً على `<html>` و `<body>`
3. POST إلى `settings.theme.update` لحفظ التفضيل
4. الوضع التلقائي يستخدم `prefers-color-scheme`

---

## 7. إمكانية الوصول (Accessibility)

### 7.1 حلقات التركيز
```css
*:focus-visible {
    outline: 2px solid hsl(var(--geist-blue));  /* Blue-7 */
    outline-offset: 2px;
}
```

### 7.2 التحديد النصي
```css
::selection { background: hsl(var(--geist-blue) / 0.15); }
.dark ::selection { background: hsl(var(--geist-blue) / 0.30); }
```

### 7.3 P3 Color Gamut
الألوان محسّنة للعرض على P3 displays عبر HSL مُعايرة.

---

## 8. دعم RTL

### القاعدة الذهبية

| ممنوع | البديل | الوصف |
|-------|--------|-------|
| `ml-4` | `ms-4` | هامش بداية |
| `mr-4` | `me-4` | هامش نهاية |
| `pl-4` | `ps-4` | حشو بداية |
| `pr-4` | `pe-4` | حشو نهاية |
| `left-0` | `start-0` | موقع بداية |
| `right-0` | `end-0` | موقع نهاية |

---

## 9. ملخص الملفات

| الملف | الدور |
|-------|-------|
| `resources/css/app.css` | التوكنز + سلالم الألوان + Typography + Materials + المكونات + Dark Mode + Sidebar |
| `resources/css/rtl.css` | تجاوزات RTL |
| `tailwind.config.js` | ألوان Tailwind + سلالم Geist + أنيميشن |
| `resources/js/contexts/brand-context.tsx` | سياق العلامة التجارية والثيم |
| `resources/js/components/theme-toggle.tsx` | زر تبديل الثيم |
| `resources/js/components/theme-provider.tsx` | مزوّد الثيم (next-themes) |
| `resources/js/layouts/authenticated-layout.tsx` | التخطيط الرئيسي + Header |
