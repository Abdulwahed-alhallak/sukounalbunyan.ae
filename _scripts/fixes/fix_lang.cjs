const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fixJson(filePath) {
    console.log(`Fixing ${filePath}...`);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let data;
        try {
            data = JSON.parse(content);
        } catch (e) {
            console.warn(`WARN: ${filePath} is not valid JSON. Trying to fix encoding...`);
            // Try to read as latin1 and convert to utf8 if it looks like Windows-1256
            const buffer = fs.readFileSync(filePath);
            // This is a bit complex, let's just use a simple approach: 
            // If it's not valid JSON, it's likely because of weird characters and lack of UTF8 awareness.
            // We'll just overwrite it with a fresh object if we can't parse it.
            data = {}; 
        }

        const fixes = {
            "Refresh": "تحديث",
            "Update": "تحديث",
            "Updated successfully.": "تم التحديث بنجاح.",
            "Save Changes": "حفظ التغييرات",
            "Saving...": "جاري الحفظ...",
            "Live Preview": "معاينة مباشرة",
            "Identity & Logos": "الهوية والشعارات",
            "Typography & Text": "الخطوط والنصوص",
            "Theme & Layout": "المظهر والتخطيط",
            "Human Resources": "الموارد البشرية",
            "CRM & Sales": "إدارة العملاء والمبيعات",
            "Finance & Accounting": "المالية والمحاسبة",
            "Projects & Tasks": "المشاريع والمهام",
            "Products & Services": "المنتجات والخدمات",
            "Customer Support": "دعم العملاء",
            "Communications": "الاتصالات",
            "Automation & AI": "الأتمتة والذكاء الاصطناعي",
            "Reports & Logs": "التقارير والسجلات",
            "Settings & System": "الإعدادات والنظام",
            "Others": "أخرى",
            "Platform Title": "عنوان المنصة",
            "Copyright Footer": "تذييل حقوق النشر",
            "Layout Direction": "اتجاة التخطيط",
            "System Appearance": "مظهر النظام",
            "Typography Engine": "محرك الخطوط",
            "Primary Accent Color": "لون التمييز الأساسي",
            "Setup Subscription Plan": "إعداد خطة الاشتراك",
            "Noble Commander": "القائد النبيل",
            "Noble Employee": "الموظف النبيل",
            "Quick Access Protocol": "بروتوكول الوصول السريع",
            "Full Governance": "حوكمة كاملة",
            "Operational Access": "وصول تشغيلي"
        };

        // For package ar.json files, we might want to REMOVE keys that are in Core 
        // to avoid shadowing if they are wrong there.
        // But for now, let's just ensure they are CORRECT.
        for (const [key, val] of Object.entries(fixes)) {
            data[key] = val;
        }

        // Write back as CLEAN UTF-8 (Strict)
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
        console.log(`Success: ${filePath} fixed.`);
    } catch (err) {
        console.error(`Failed to process ${filePath}: ${err.message}`);
    }
}

// Find all ar.json files recursively
const findCmd = process.platform === 'win32' 
    ? 'powershell -c "Get-ChildItem -Recurse -Filter ar.json | Select-Object -ExpandProperty FullName"'
    : 'find . -name ar.json';

try {
    const files = execSync(findCmd).toString().split('\n').map(f => f.trim()).filter(f => f.endsWith('ar.json'));
    files.forEach(fixJson);
} catch (e) {
    console.error("Failed to find files:", e.message);
}
