<?php
$file = 'resources/lang/ar.json';
$data = json_decode(file_get_contents($file), true) ?? [];

$newTranslations = [
    "AI-Powered Enterprise Ecosystem" => "بيئة مؤسسية متطورة بالذكاء الاصطناعي",
    "The ultimate workspace for your business." => "مساحة العمل المتكاملة المتطورة لأعمالك.",
    "Manage projects, accounting, HR, CRM, and more in one unified ecosystem." => "أدر مشاريعك، المحاسبة، الموارد البشرية والعملاء في نظام بيئي واحد.",
    "Unified modular architecture" => "بنية نمطية موحدة",
    "Seamless integration across all modules" => "تكامل سلس بين جميع وحدات النظام",
    "Real-time comprehensive reporting" => "تقارير شاملة ولحظية",
    "Advanced analytics & insights" => "تحليلات برمجية ورؤى متقدمة",
    "Multi-company & multi-currency" => "إدارة شركات متعددة وعملات مختلفة",
    "Global reach with localized precision" => "توسع عالمي بأدوات وواجهات محلية",
    "Copyright" => "حقوق النشر",
    "Privacy" => "سياسة الخصوصية",
    "Terms" => "شروط الاستخدام",
    "Login as Super Admin" => "الدخول كفريق الإدارة العليا",
    "Login as Noble Company" => "الدخول كشركة Noble",
    "Login as Noble Employee" => "التجربة كموظف",
    "S-Admin" => "مدير النظام",
    "Noble Corp" => "شركة نوبل",
    "Emp (Samad)" => "صمد (موظف)"
];

foreach ($newTranslations as $key => $value) {
    if (!isset($data[$key])) {
        $data[$key] = $value;
    }
}

file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
echo "Translations added successfully!\n";

