const fs = require('fs');
const data = JSON.parse(fs.readFileSync('resources/lang/ar.json', 'utf8'));

const translations = {
    "Reports": "التقارير",
    "Rental Analytics & Reports": "تحليلات وتقارير التأجير",
    "Material on Site": "المواد في المواقع",
    "Total units currently with customers": "إجمالي الوحدات الموجودة لدى العملاء حالياً",
    "Avg. Efficiency": "متوسط الكفاءة",
    "Active Customers": "العملاء النشطون",
    "Unique customers with rental billing": "العملاء الذين لديهم فواتير إيجار نشطة",
    "Material Efficiency": "كفاءة المواد",
    "Tracking scaffolding availability vs site distribution": "تتبع توفر السقالات مقابل التوزيع في المواقع",
    "Product": "المنتج",
    "On Site": "في الموقع",
    "Efficiency": "الكفاءة",
    "Revenue by Customer": "الإيرادات حسب العميل",
    "Total invoiced rent across the lifecycle": "إجمالي مبالغ الإيجار المفوترة خلال دورة العقد",
    "Customer": "العميل",
    "Total Revenue": "إجمالي الإيرادات",
    "AED": "د.إ",
    "Unknown": "غير معروف"
};

for (const [key, value] of Object.entries(translations)) {
    data[key] = value;
}

fs.writeFileSync('resources/lang/ar.json', JSON.stringify(data, null, 2));
console.log('Added more translations to ar.json!');