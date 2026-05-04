# ✅ قائمة التحقق النهائي للنشر

> **آخر تحديث:** أبريل 2026

---

## 📋 قائمة تحقق كاملة قبل كل نشر

### 1. جودة الكود (Code Quality)

- [ ] `npm run build` ينجح (exit code 0)
- [ ] لا أخطاء بناء في terminal
- [ ] `npx tsc --noEmit` إما نظيف أو فقط تحذيرات غير حرجة
- [ ] لا نصوص مباشرة (Hardcoded) — كل النصوص عبر `t('...')`
- [ ] لا مصطلحات Sci-Fi في واجهة المستخدم
- [ ] كل الأزرار والروابط تعمل

---

### 2. التصميم والواجهة (UI/UX)

- [ ] RTL يعمل بشكل صحيح (Arabic layout mirror)
- [ ] Dark mode — كل العناصر تستخدم semantic tokens
- [ ] لا ألوان Hex مباشرة (`#ff0000`) بدلاً من `text-destructive`
- [ ] Logical CSS properties محترمة (`ms-` لا `ml-`)
- [ ] الصفحات تعمل على Mobile (Responsive)
- [ ] الأيقونات تظهر بشكل صحيح

---

### 3. الترجمات (Localization)

- [ ] `ar.json` محدّث لكل المصطلحات الجديدة
- [ ] `en.json` محدّث كـ reference
- [ ] لا مفاتيح ترجمة مفقودة في وحدات HRM, Taskly, Lead
- [ ] الأرقام والتواريخ تُعرض بالتنسيق الصحيح

---

### 4. قاعدة البيانات (Database)

- [ ] جميع الـ Migrations موجودة (`php artisan migrate:status`)
- [ ] لا migrations معلقة
- [ ] بيانات الخطة (Noble Master Plan) مُفعّلة
- [ ] الـ Seeders أُجريت للبيانات الأساسية
- [ ] إعدادات النظام الأساسية مضبوطة في `settings`

---

### 5. الأداء والأمان (Performance & Security)

- [ ] `APP_DEBUG=false` في `.env.hostinger`
- [ ] `APP_ENV=production` في `.env.hostinger`
- [ ] لا بيانات حساسة في Git (PAT, passwords)
- [ ] `.gitignore` يشمل `.env`, `*.sql`, `*.tar.gz`
- [ ] `public/build/` **مستبعد** من Git (يُبنى على السيرفر أو يُرفع منفصلاً)
- [ ] `storage:link` مُنجز على السيرفر
- [ ] مجلد `storage/` صلاحياته `755`

---

### 6. نشر الإنتاج (Deployment Steps)

```bash
# 1. بناء الأصول محلياً
npm run build

# 2. حفظ ورفع للـ GitHub
git add -A
git commit -m "release: v[X.X] - وصف التحديث"
git push origin master

# 3. على سيرفر Hostinger (عبر SSH)
ssh -p 65002 u256167180@62.72.25.117
cd domains/noble.dion.sy/public_html/
/opt/alt/php82/usr/bin/php artisan optimize:clear
/opt/alt/php82/usr/bin/php artisan migrate --force
/opt/alt/php82/usr/bin/php artisan optimize

# 4. رفع public/build/ عبر SFTP (إذا لا يوجد بناء على السيرفر)
node _scripts/deployment/upload_noble_sftp.cjs
```

---

### 7. فحص ما بعد النشر (Post-Deploy Verification)

- [ ] `curl https://noble.dion.sy/login` يعيد `200 OK`
- [ ] تسجيل الدخول يعمل
- [ ] لوحة التحكم تحمل بدون أخطاء
- [ ] وحدة HRM تعمل (Employees, Attendances)
- [ ] وحدة Taskly تعمل (Projects, Tasks)
- [ ] الإشعارات تعمل
- [ ] شهادة SSL سارية (`https://`)
- [ ] ملف `storage/logs/laravel-*.log` لا يحتوي على ERRORs جديدة

---

## 🔄 حالة المنصة الحالية (أبريل 2026)

| العنصر | الحالة | ملاحظة |
|--------|--------|--------|
| `npm run build` | ✅ نظيف | exit 0, ~16s |
| TypeScript IDE | ✅ محلول | tsconfig + packages/noble/** |
| HRM Pages | ✅ محدّثة | Attendances, Holidays, LeaveApps, Dashboard |
| Taskly Pages | ✅ محدّثة | Tasks, Kanban, Create, Dashboard |
| Lead/CRM Pages | ✅ محدّثة | Leads, Dashboard |
| Arabic ar.json | ✅ محدّث | Bug→خلل، Lead→عميل محتمل |
| RTL Properties | ✅ كامل | Logical properties فقط |
| مصطلحات sci-fi | ✅ مُزالة | صفر مصطلحات عسكرية |
| `.gitignore` | ✅ منظم | archives/temp/build مستبعدة |
| `_scripts/` | ✅ منظم | 9 مجلدات فرعية |
| GitHub | ✅ مرفوع | فرع: master |
| التوثيق | ✅ محدّث | 19 ملف في docs/ |

---

## 📞 مراجع سريعة

| الحاجة | المرجع |
|--------|--------|
| بيانات السيرفر | `docs/07-Deployment_Server_Guide.md` |
| TypeScript errors | `docs/15-TypeScript_and_Data_Models.md` |
| مشاكل الإنتاج | `docs/17-Production_Troubleshooting_and_Maintenance.md` |
| الأوامر والسكريبتات | `docs/06-Custom_Scripts_And_Commands.md` |
| دليل المطور | `docs/05-Development_Guide.md` |

---

> **Sukoun Albunyan 2026** — نظام SaaS متكامل، لارافيل 12، ريآكت 18، انيرشيا 2، فيرسيل جييست 2026
