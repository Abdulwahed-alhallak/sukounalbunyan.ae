const fs = require('fs');

const arPath = 'resources/lang/ar.json';
const enPath = 'resources/lang/en.json';

// New translations to add
const newAr = {
    "Rental & Sales Management": "إدارة التأجير والمبيع",
    "Rental Contracts": "عقود التأجير",
    "Security Deposit Check (ضمان الشيك)": "ضمان الشيك",
    "Check submitted by client to guarantee return of rented items": "شيك يقدمه العميل كضمان لإعادة المواد المستأجرة",
    "Check Number": "رقم الشيك",
    "Check Amount": "قيمة الشيك",
    "Check Notes": "ملاحظات الشيك",
    "Bank name, expiry, etc.": "اسم البنك، تاريخ الانتهاء...",
    "Sales Proposals": "عروض المبيعات",
    "Consolidated Billing": "الفواتير الموحدة",
};

const newEn = {
    "Rental & Sales Management": "Rental & Sales Management",
    "Rental Contracts": "Rental Contracts",
    "Security Deposit Check (ضمان الشيك)": "Security Deposit Check",
    "Check submitted by client to guarantee return of rented items": "Check submitted by client to guarantee return of rented items",
    "Check Number": "Check Number",
    "Check Amount": "Check Amount",
    "Check Notes": "Check Notes",
    "Bank name, expiry, etc.": "Bank name, expiry, etc.",
    "Sales Proposals": "Sales Proposals",
    "Consolidated Billing": "Consolidated Billing",
};

function updateLang(path, newKeys) {
    const content = JSON.parse(fs.readFileSync(path, 'utf8'));
    const updated = { ...content, ...newKeys };
    fs.writeFileSync(path, JSON.stringify(updated, null, 2), 'utf8');
    console.log(`✅ Updated ${path} with ${Object.keys(newKeys).length} new keys`);
}

updateLang(arPath, newAr);
updateLang(enPath, newEn);
