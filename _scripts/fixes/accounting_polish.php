<?php
$path = 'resources/lang/ar.json';
$data = json_decode(file_get_contents($path), true);
$new = [
    'Sales Invoice Returns' => 'مرتجعات فواتير المبيعات',
    'LIVE PRODUCTION' => 'الإنتاج المباشر',
    'Export Data' => 'تصدير البيانات',
    'Full Timeline' => 'الجدول الزمني الكامل',
    'Account Dashboard' => 'لوحة قيادة المحاسبة',
    'Accounts Dashboard' => 'لوحة قيادة المحاسبة',
    'Accounting' => 'المحاسبة',
    'Account' => 'المحاسبة',
    'Hrm Dashboard' => 'لوحة قيادة الموارد البشرية',
    'Jan' => 'يناير', 'Feb' => 'فبراير', 'Mar' => 'مارس', 'Apr' => 'أبريل',
    'May' => 'مايو', 'Jun' => 'يونيو', 'Jul' => 'يوليو', 'Aug' => 'أغسطس',
    'Sep' => 'سبتمبر', 'Oct' => 'أكتوبر', 'Nov' => 'نوفمبر', 'Dec' => 'ديسمبر',
    'January' => 'يناير', 'February' => 'فبراير', 'March' => 'مارس', 'April' => 'أبريل',
    'June' => 'يونيو', 'July' => 'يوليو', 'August' => 'أغسطس', 'September' => 'سبتمبر',
    'October' => 'أكتوبر', 'November' => 'نوفمبر', 'December' => 'ديسمبر'
];
$data = array_merge($data, $new);
ksort($data);
file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo "DONE fixing accounting and chart gaps\n";
