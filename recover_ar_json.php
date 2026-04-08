<?php
function translateChunk($queries) {
    if (empty($queries)) return [];
    
    // Join with a unique delimiter that Google won't mess up too much
    $text = implode(" ||| ", $queries);
    $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" . urlencode($text);
    
    for ($i = 0; $i < 3; $i++) {
        $response = @file_get_contents($url);
        if ($response !== false) {
            $data = json_decode($response, true);
            $translatedText = '';
            foreach ($data[0] as $segment) {
                $translatedText .= $segment[0];
            }
            // Split back by our delimiter
            $translatedArray = explode(" ||| ", $translatedText);
            // Trim and clean
            return array_map('trim', $translatedArray);
        }
        sleep(2);
    }
    return $queries; // fallback
}

$enFile = 'resources/lang/en.json';
$arFile = 'resources/lang/ar.json';

$enData = json_decode(file_get_contents($enFile), true);
$arData = json_decode(file_get_contents($arFile), true) ?: [];

$dictionary = [
    'Financial Reports' => 'التقارير المالية',
    'HR & Workforce Reports' => 'تقارير الموارد البشرية',
    'CRM & Sales Pipeline' => 'تقارير المبيعات وعلاقات العملاء',
    'Project & Task Reports' => 'تقارير المشاريع والمهام',
    'Point of Sale Reports' => 'تقارير نقاط البيع',
    'Platform Analytics' => 'تحليلات المنصة',
    'Profit & Loss Statement' => 'بيان الأرباح والخسائر',
    'Revenue, expenses, and net profit over a period' => 'الإيرادات والمصروفات وصافي الربح خلال فترة',
    'Receivables Aging' => 'أعمار الذمم المدينة',
    'Outstanding invoices grouped by age' => 'الفواتير المدينة غير المسددة مجمعة حسب العمر',
    'Payables Aging' => 'أعمار الذمم الدائنة',
    'Outstanding purchase invoices by age' => 'فواتير المشتريات غير المسددة حسب العمر',
    'Sales Summary' => 'ملخص المبيعات',
    'Total sales by period, customer, or product' => 'إجمالي المبيعات حسب الفترة، العميل، أو المنتج',
    'Purchase Summary' => 'ملخص المشتريات',
    'Total purchases by period and vendor' => 'إجمالي المشتريات حسب الفترة والمورد',
    'Tax Summary' => 'ملخص الضرائب',
    'Collected and paid taxes summary' => 'ملخص الضرائب المحصلة والمدفوعة',
    'Subscription Analytics' => 'تحليلات الاشتراكات',
    'MRR, churn rate, and plan distribution' => 'الإيرادات المتكررة، معدل الإلغاء، وتوزيع الخطط',
    'Company Growth' => 'نمو الشركات',
    'New registrations and active companies over time' => 'تسجيلات جديدة وشركات نشطة بمرور الوقت',
    'Revenue Breakdown' => 'تحليل الإيرادات',
    'Revenue by plan, payment method, and period' => 'الإيرادات حسب الخطة وطريقة الدفع والفترة',
    'Total Revenue' => 'إجمالي الإيرادات',
    'Companies' => 'الشركات',
    'Total Users' => 'إجمالي المستخدمين',
    'Plan Distribution' => 'توزيع الخطط',
    'New User' => 'مستخدم جديد',
    'Customer Invoice Send' => 'إرسال فاتورة العميل',
    'Payment Reminder' => 'تذكير بالدفع',
    'Invoice Payment Create' => 'تسجيل دفعة فاتورة',
    'Proposal Send' => 'إرسال عرض أسعار',
    'New Helpdesk Ticket' => 'تذكرة دعم فني جديدة',
    'general' => 'عام',
    'Tickets' => 'التذاكر',
    'Data Audit' => 'تدقيق البيانات',
    'Security Audit' => 'التدقيق الأمني',
    'Plans' => 'الخطط',
    'Dashboard' => 'لوحة القيادة',
    'Report Center' => 'مركز التقارير',
    'Helpdesk' => 'مركز المساعدة',
    'Professional Plan' => 'الخطة الاحترافية',
    'Basic Plan' => 'الخطة الأساسية',
    'Premium Plan' => 'الخطة المميزة',
    'payments' => 'المدفوعات',
    'orders' => 'الطلبات',
    'Jan' => 'يناير', 'Feb' => 'فبراير', 'Mar' => 'مارس', 'Apr' => 'أبريل',
    'May' => 'مايو', 'Jun' => 'يونيو', 'Jul' => 'يوليو', 'Aug' => 'أغسطس',
    'Sep' => 'سبتمبر', 'Oct' => 'أكتوبر', 'Nov' => 'نوفمبر', 'Dec' => 'ديسمبر',
    'N/A' => 'غير متوفر',
];

foreach ($dictionary as $en => $ar) {
    if (!isset($arData[$en]) || $arData[$en] === $en) {
        $arData[$en] = $ar;
    }
}

$keysToTranslate = [];
foreach ($enData as $k => $v) {
    if (!isset($arData[$k]) || $arData[$k] === $k) {
        if (!preg_match('/^[0-9]+$/', $k)) {
            $keysToTranslate[] = $k;
        }
    }
}

echo "Found " . count($keysToTranslate) . " keys to translate.\n";

$chunkSize = 30; // ~30 sentences max to avoid 414 URI Too Long
$chunks = array_chunk($keysToTranslate, $chunkSize);

foreach ($chunks as $index => $chunk) {
    echo "Translating chunk " . ($index + 1) . " of " . count($chunks) . "...\n";
    $translatedChunk = translateChunk($chunk);
    
    foreach ($chunk as $i => $key) {
        if (isset($translatedChunk[$i]) && !empty($translatedChunk[$i])) {
            $arData[$key] = $translatedChunk[$i];
        } else {
            $arData[$key] = $key;
        }
    }
    file_put_contents($arFile, json_encode($arData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    usleep(500000); // 0.5s pause
}

echo "Done restoring ar.json. Total keys now: " . count($arData) . "\n";
