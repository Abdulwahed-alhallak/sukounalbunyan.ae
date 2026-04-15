# 🔐 SECURITY BEST PRACTICES - Noble Architecture

**Version**: 1.0  
**Last Updated**: April 15, 2026  
**Audience**: Developers, DevOps, Security Teams

---

## 📋 قائمة فحص الأمان للمطورين

### ✅ قبل كل commit

```bash
# 1. اختبر الأمان
bash _scripts/security-audit.sh

# 2. تحقق من git status
git status

# 3. راجع التغييرات
git diff

# 4. commit (سيفحص pre-commit hook تلقائياً)
git commit -m "feat: add new feature"
```

### ✅ قبل كل push

```bash
# 1. اشحنت أحدث التغييرات؟
git log -1 --oneline

# 2. هل من ملفات غير مؤكدة؟
git status

# 3. push بأمان
git push origin branch-name
```

### ✅ قبل كل نشر للإنتاج

```bash
# 1. اختبر الاتصال
node _scripts/deployment/_check_production_db.cjs

# 2. عاين الملفات المتغيرة
git diff origin/master

# 3. ابدأ النشر
node _scripts/deployment/auto_sync.cjs "release: v1.1"

# 4. تحقق من النتيجة
curl -k https://noble.dion.sy/login
```

---

## 🚫 ممنوعات صارمة

### ❌ لا تفعل هذا أبداً!

```javascript
// ❌ NEVER: Hardcoded passwords
const password = 'my-secret-password-123';
const dbPassword = 'user123!@#';

// ❌ NEVER: GitHub tokens in code
const GITHUB_TOKEN = 'github_pat_xxxxx';

// ❌ NEVER: API keys in code
const STRIPE_KEY = 'sk_live_xxxxxxxxxxxxx';

// ❌ NEVER: Commit .env files
git add .env.production  // ❌ DON'T
git push

// ❌ NEVER: Share credentials via email/Slack
email: "Here's the password: 4_m_XMkgux@.AgC"  // ❌ DON'T
slack: "SSH password in DM"  // ❌ DON'T
```

---

## ✅ الطريقة الصحيحة

### ✅ استخدم متغيرات البيئة

```javascript
// ✅ CORRECT: Load from environment
const CONFIG = require('./secureConfig.js');
const password = CONFIG.SSH.password;      // من .env.production
const dbPassword = CONFIG.DATABASE.password; // من .env.production

// ✅ CORRECT: في Node.js البسيط
const password = process.env.PRODUCTION_PASSWORD;
const apiKey = process.env.STRIPE_API_KEY;

// ✅ CORRECT: في PHP
$password = $_ENV['PRODUCTION_PASSWORD'];
$apiKey = getenv('STRIPE_API_KEY');
```

### ✅ إدارة الاعتماديات بأمان

```bash
# 1. احصل على .env.production من المسؤول شخصياً
# (أو عبر قناة آمنة مصرحة)

# 2. ضعها في المجلد الجذري
cp .env.production .  # محلياً فقط

# 3. تحقق أنها مخفية
git check-ignore -v .env.production
# يجب أن يطبع: .env.production

# 4. استخدمها فقط محلياً
# لا تنسخها لأحد
# لا تعرضها في screenshots
```

---

## 🔑 أنواع الاعتماديات وكيفية إدارتها

### 1. SSH Credentials (خادم الإنتاج)

```
الموقع: .env.production
المثال: PRODUCTION_PASSWORD=***
التذكير: ✅ محمي بـ .gitignore
```

**الأفضل**: استخدام SSH keys بدلاً من كلمات المرور

```bash
# Generate SSH key (once)
ssh-keygen -t rsa -b 4096

# Add to production server
ssh-copy-id -i ~/.ssh/id_rsa.pub user@server

# Then in .env.production or .ssh/config
# استخدم key-based auth (أكثر أماناً)
```

### 2. Database Credentials

```
الموقع: .env و .env.production
المثال: DB_PASSWORD=***
التذكير: ✅ لا تكتبها في الكود
```

**الأفضل**: استخدم معرّف مخصص لكل بيئة

```
Local:      root (أو فارغ)
Staging:    user_staging
Production: user_production
```

### 3. API Keys (Stripe, PayPal, etc)

```
الموقع: .env و .env.production
المثال: STRIPE_API_KEY=sk_live_xxxx
التذكير: ✅ محمي من commit
```

**الأفضل**: استخدام keys مختلفة لكل بيئة

```
Development:  sk_test_xxxxx (test keys)
Production:   sk_live_xxxxx (live keys)
```

### 4. GitHub PAT Tokens

```
الموقع: متغير بيئة نظام التشغيل أو .env
المثال: GITHUB_PAT=github_pat_xxxx
التذكير: ✅ لا تكتبها في الـ scripts
```

**الأفضل**: استخدم Personal Access Token مع الأقل صلاحيات

```bash
# في PowerShell (Windows)
$env:GITHUB_PAT = 'your_token'

# في Bash (Mac/Linux)
export GITHUB_PAT='your_token'

# ثم استخدمه في الـ script
const token = process.env.GITHUB_PAT;
```

---

## 🔄 دورة حياة الاعتماديات

### 1️⃣ التوليد (Generation)

```
✅ اطلب من المسؤول
✅ استخدم أدوات موثوقة
✅ اختر كلمات مرور قوية
```

### 2️⃣ التخزين (Storage)

```
✅ في .env.production فقط (locally)
✅ نسخ احتياطية آمنة (بواسطة المسؤول)
✅ مصرح لأشخاص محددين فقط
```

### 3️⃣ الاستخدام (Usage)

```
✅ قراءتها من متغيرات البيئة
✅ عدم تسجيلها في الـ logs
✅ عدم طباعتها في الـ errors
```

### 4️⃣ الدوران (Rotation)

```
✅ كل 90 يوم (أو عند الحاجة)
✅ قم بنسخ مؤقتة من الـ credentials القديمة
✅ حدّث جميع الأماكن التي تستخدمها
✅ اختبر بدقة
```

### 5️⃣ الإلغاء (Revocation)

```
✅ عند ترك شخص الفريق
✅ عند اكتشاف تسريب
✅ بعد نقل المسؤولية
```

---

## 🛡️ حماية Pre-Commit Hook

### ماذا يفعل؟

Pre-commit hook يعمل **تلقائياً** قبل كل commit ويمنع:
- ✅ كلمات المرور المعروفة
- ✅ GitHub PAT tokens
- ✅ SSH hosts معروفة
- ✅ ملف `.env.production` الفعلي

### إذا فشل الـ hook

```bash
# المشكلة: تحاول commit ملف بكلمات مرور

# الحل:
# 1. أزِل كلمات المرور من الملف
# 2. استخدم متغيرات البيئة
# 3. حاول commit مرة أخرى

# ONLY if you're 100% sure (not recommended):
git commit --no-verify

# But discuss with security team first!
```

---

## 📊 مقاييس الأمان

### اختبر نفسك

```bash
# تشغيل فحص الأمان
bash _scripts/security-audit.sh

# النتيجة المتوقعة:
# ✅ Passed: X
# ❌ Failed: 0 (يجب أن يكون صفر!)
# ⚠️  Warnings: X
```

### الدرجات

| النقطة | الدرجة |
|--------|--------|
| ✅ 20+ | A+ (Excellent) |
| ✅ 18-19 | A (Very Good) |
| ✅ 16-17 | B (Good) |
| ⚠️ 14-15 | C (Acceptable) |
| ❌ <14 | F (Needs Attention) |

---

## 🚨 حالات طارئة

### اكتشفت تسريب credentials

```bash
# 1. فوراً: غيّر كلمات المرور على الخادم
ssh -p 65002 u256167180@62.72.25.117
# غيّر كلمات المرور الحساسة

# 2. ابدأ: اطلب من المسؤول تحديث .env.production

# 3. الفحص: ابحث في git history عن أي تسريب آخر
git log -p | grep -i password

# 4. التنظيف: اعد كتابة git history إذا لزم الأمر
# (مهمة معقدة - اطلب المساعدة!)

# 5. الإبلاغ: أخبر الفريق فوراً
```

### اخترق شخص ما حسابي

```bash
# 1. غيّر كلمة المرور GitHub فوراً
# 2. أبطِل جميع الـ tokens القديمة
# 3. فعّل 2FA (Two-Factor Authentication)
# 4. راجع git history للتغييرات المريبة
# 5. أخبر المسؤول فوراً
```

---

## 📚 المراجع والموارد

### الممارسات الموصى بها (OWASP)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Secure Coding Guidelines](https://cheatsheetseries.owasp.org/)

### معايير الصناعة
- [12-Factor App](https://12factor.net/) - منها: Store config in env
- [CWE-798](https://cwe.mitre.org/data/definitions/798.html) - Hardcoded Credentials

### أدوات
- [dotenv](https://github.com/motdotla/dotenv) - Environment variables
- [git-secrets](https://github.com/awslabs/git-secrets) - Prevent secrets in git
- [OWASP ZAP](https://www.zaproxy.org/) - Security scanning

---

## ✅ قائمة الفحص النهائية

قبل إطلاق أي إصدار:

- [ ] تشغيل `bash _scripts/security-audit.sh` بنجاح
- [ ] لا توجد تحذيرات security في الـ logs
- [ ] تم اختبار deployment على staging
- [ ] تم مراجعة جميع التغييرات من قبل فريق
- [ ] تم تأكيد الاعتماديات لم تتسرب
- [ ] تم إبلاغ الفريق بخطة النشر

---

## 💬 للمزيد من المعلومات

- اقرأ: [SECURE_DEPLOYMENT_GUIDE.md](_scripts/deployment/SECURE_DEPLOYMENT_GUIDE.md)
- اسأل: فريق الأمان
- ابحث: في التوثيق الكاملة

---

**Remember: Security is a team effort! 🛡️**
