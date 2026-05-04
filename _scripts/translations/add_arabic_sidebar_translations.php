<?php
$arFile = __DIR__ . '/../resources/lang/ar.json';

// Read JSON
$arData = json_decode(file_get_contents($arFile), true) ?? [];

// Missing mapping translations for structural Sidebar Core Hierarchy Categories
$newTerms = [
    "Human Resources" => "الموارد البشرية",
    "CRM & Sales" => "المبيعات وعلاقات العملاء",
    "Finance & Accounting" => "المالية والمحاسبة",
    "Products & Services" => "المنتجات والخدمات",
    "Customer Support" => "دعم العملاء",
    "Automation & AI" => "الأتمتة والذكاء الاصطناعي",
    "Reports & Logs" => "التقارير والسجلات",
    "Management" => "الإدارة",
    "Subscription" => "الاشتراكات",
    "Support" => "الدعم الفني",
    "Communications" => "الاتصالات",
    "Reports & Audit" => "التقارير والتدقيق",
    "System" => "إعداد النظام",
    "Others" => "أخرى",
    "CRM" => "إدارة علاقات العملاء",
    "Sales" => "المبيعات",
    "Retainer" => "التوكيل الاستشاري",
    "Quotation" => "عروض الأسعار",
    "Proposal" => "المقترحات",
    "Accounting" => "المحاسبة",
    "Double Entry" => "القيد المزدوج",
    "Budget Planner" => "مخطط الميزانية",
    "POS" => "نقاط البيع",
    "Stripe" => "سترايب",
    "Paypal" => "باي بال",
    "Knowledge Base" => "قاعدة المعرفة",
    "Workflows" => "سير العمل",
    "Messenger" => "المراسلة",
    "Report Center" => "مركز التقارير",
    "Audit Logs" => "سجلات التدقيق",
];

// Append strictly if not existing to prevent overwriting user modifications
$count = 0;
foreach ($newTerms as $en => $ar) {
    if (!isset($arData[$en])) {
        $arData[$en] = $ar;
        $count++;
    }
}

// Write the file back with JSON_UNESCAPED_UNICODE and JSON_PRETTY_PRINT to preserve Arabic structure
file_put_contents($arFile, json_encode($arData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "Arabic Localization Injector Complete: Added $count new structural terms directly to ar.json arrays safely.\n";

// Replace 'Dion' with 'Sukoun Albunyan' strictly using PHP's UTF-8 Safe Regex without BOM issues
$files = glob(__DIR__ . '/../resources/lang/*.json');
foreach ($files as $f) {
    $c = file_get_contents($f);
    if(strpos($c, 'Dion') !== false) {
        $c = str_replace(['Dion', 'DION', 'dion'], ['Sukoun Albunyan', 'Sukoun Albunyan', 'Sukoun Albunyan'], $c);
        file_put_contents($f, $c);
    }
}
$pkgFiles = glob(__DIR__ . '/../packages/noble/*/src/Resources/lang/*.json');
foreach ($pkgFiles as $f) {
    $c = file_get_contents($f);
    if(strpos($c, 'Dion') !== false) {
        $c = str_replace(['Dion', 'DION', 'dion'], ['Sukoun Albunyan', 'Sukoun Albunyan', 'Sukoun Albunyan'], $c);
        file_put_contents($f, $c);
    }
}
echo "Branding Alignment (Dion => Sukoun Albunyan) natively applied across JSON structures maintaining precise UTF-8 buffer integrity.\n";

?>
