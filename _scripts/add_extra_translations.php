<?php
$ar = json_decode(file_get_contents(__DIR__ . '/../packages/noble/Hrm/src/Resources/lang/ar.json'), true);
$main = json_decode(file_get_contents(__DIR__ . '/../resources/lang/ar.json'), true);

$extras = [
    'Half day' => 'نصف يوم',
    'Combat Hours' => 'ساعات العمل',
    'System clear. No personnel movement detected in the current matrix.' => 'النظام سليم. لم يتم اكتشاف حركة موظفين في المصفوفة الحالية.',
    'Contract details effectively assigned.' => 'تم تعيين تفاصيل العقد بنجاح.',
    'Contract updated securely.' => 'تم تحديث العقد بنجاح.',
    'Contract effectively unbound.' => 'تم إلغاء العقد بنجاح.',
    'Transferred' => 'منقول',
    'Search employees...' => 'البحث عن موظفين...',
    'Apply Filters' => 'تطبيق المرشحات',
    'Toggle Sidebar' => 'تبديل الشريط الجانبي',
    'Toggle theme' => 'تبديل المظهر',
    'PRESENT' => 'حاضر',
    'ABSENT' => 'غائب',
    'HALF DAY' => 'نصف يوم',
    'No data available' => 'لا توجد بيانات',
    'Rows per page' => 'صفوف لكل صفحة',
    'Showing' => 'عرض',
    'of' => 'من',
    'results' => 'نتائج',
    'per page' => 'لكل صفحة',
    'Search...' => 'بحث...',
    'No results found' => 'لم يتم العثور على نتائج',
    'Loading...' => 'جاري التحميل...',
    'Confirm' => 'تأكيد',
    'Are you sure you want to continue?' => 'هل أنت متأكد أنك تريد المتابعة؟',
    'Success' => 'نجاح',
    'Error' => 'خطأ',
    'Close' => 'إغلاق',
    'Back' => 'رجوع',
    'Home' => 'الرئيسية',
    'Dashboard' => 'لوحة التحكم',
    'Notifications' => 'الإشعارات',
    'Settings' => 'الإعدادات',
    'Logout' => 'تسجيل الخروج',
    'Profile' => 'الملف الشخصي',
    'Help' => 'مساعدة',
    'All' => 'الكل',
    'Filter' => 'تصفية',
    'Sort' => 'ترتيب',
    'Ascending' => 'تصاعدي',
    'Descending' => 'تنازلي',
    'Filters' => 'المرشحات',
    'Selected' => 'محدد',
    'Deselect all' => 'إلغاء تحديد الكل',
    'Select all' => 'تحديد الكل',
    'Empty' => 'فارغ',
    'More' => 'المزيد',
    'Less' => 'أقل',
    'Upload' => 'رفع',
    'File' => 'ملف',
    'Add' => 'إضافة',
    'New' => 'جديد',
    'Refresh' => 'تحديث',
    'Live Preview' => 'معاينة مباشرة',
    'Identity & Logos' => 'الهوية والشعارات',
    'Typography & Text' => 'الخطوط والنصوص',
    'Theme & Layout' => 'المظهر والتخطيط',
    'HRM' => 'الموارد البشرية',
];

$count = 0;
foreach ($extras as $k => $v) {
    if (!isset($ar[$k]) || $ar[$k] === $k) {
        $ar[$k] = $v;
        $count++;
    }
    if (!isset($main[$k]) || $main[$k] === $k) {
        $main[$k] = $v;
    }
}

ksort($ar, SORT_STRING | SORT_FLAG_CASE);
ksort($main, SORT_STRING | SORT_FLAG_CASE);
file_put_contents(__DIR__ . '/../packages/noble/Hrm/src/Resources/lang/ar.json', json_encode($ar, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
file_put_contents(__DIR__ . '/../resources/lang/ar.json', json_encode($main, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

echo "Added $count extra translations\n";
