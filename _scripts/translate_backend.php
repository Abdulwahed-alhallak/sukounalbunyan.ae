<?php
$arFile = 'resources/lang/ar.json';
$arObj = json_decode(file_get_contents($arFile), true) ?: [];

$dictionary = [
    // Reporting Categories
    'Financial Reports' => 'التقارير المالية',
    'HR & Workforce Reports' => 'تقارير الموارد البشرية',
    'CRM & Sales Pipeline' => 'تقارير المبيعات وعلاقات العملاء',
    'Project & Task Reports' => 'تقارير المشاريع والمهام',
    'Point of Sale Reports' => 'تقارير نقاط البيع',
    'Platform Analytics' => 'تحليلات المنصة',

    // Financial Reports
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

    // SuperAdmin Analytics
    'Subscription Analytics' => 'تحليلات الاشتراكات',
    'MRR, churn rate, and plan distribution' => 'الإيرادات المتكررة، معدل الإلغاء، وتوزيع الخطط',
    'Company Growth' => 'نمو الشركات',
    'New registrations and active companies over time' => 'تسجيلات جديدة وشركات نشطة بمرور الوقت',
    'Revenue Breakdown' => 'تحليل الإيرادات',
    'Revenue by plan, payment method, and period' => 'الإيرادات حسب الخطة وطريقة الدفع والفترة',

    // Email Templates & Roles
    'New User' => 'مستخدم جديد',
    'Customer Invoice Send' => 'إرسال فاتورة العميل',
    'Payment Reminder' => 'تذكير بالدفع',
    'Invoice Payment Create' => 'تسجيل دفعة فاتورة',
    'Proposal Send' => 'إرسال عرض أسعار',
    'New Helpdesk Ticket' => 'تذكرة دعم فني جديدة',
    'general' => 'عام',

    // HR & CRM & POS Reports from backend setup
    'Attendance Summary' => 'ملخص الحضور',
    'Monthly attendance by employee/department' => 'الحضور الشهري حسب الموظف أو القسم',
    'Leave Balance Report' => 'تقرير أرصدة الإجازات',
    'Leave balances and usage by employee' => 'أرصدة واستخدام الإجازات حسب الموظف',
    'Headcount Report' => 'تقرير القوى العاملة',
    'Employees by department, designation, and status' => 'الموظفون حسب القسم والمسمى والحالة',
    'Employee Turnover' => 'دوران الموظفين (التسرب)',
    'New hires vs terminations over time' => 'التعيينات الجديدة مقابل الاستقالات بمرور الوقت',
    'Lead Funnel Analysis' => 'تحليل مسار المبيعات',
    'Leads by stage with conversion rates' => 'العملاء المحتملون حسب المرحلة مع معدلات التحويل',
    'Deal Pipeline Report' => 'تقرير خط الصفقات',
    'Active deals by stage and expected value' => 'الصفقات النشطة حسب المرحلة والقيمة المتوقعة',
    'Lead Source Analysis' => 'تحليل مصدر العملاء',
    'Lead generation by source/channel' => 'توليد العملاء المحتملين حسب المصدر / القناة',
    'Project Status Report' => 'تقرير حالة المشاريع',
    'All projects with completion rates and deadlines' => 'كافة المشاريع مع معدلات الإنجاز والمواعيد النهائية',
    'Task Productivity' => 'إنتاجية المهام',
    'Tasks completed vs assigned per team member' => 'المهام المنجزة مقابل المسندة لكل عضو في الفريق',
    'Overdue Tasks Report' => 'تقرير المهام المتأخرة',
    'All overdue tasks with priority and assignee' => 'كافة المهام المتأخرة مع الأولوية والمسؤول',
    'Daily Sales Report' => 'تقرير المبيعات اليومي',
    'Transactions and revenue by day' => 'المعاملات والإيرادات حسب اليوم',
    'Top Selling Products' => 'المنتجات الأكثر مبيعاً',
    'Best performing products by quantity and revenue' => 'أفضل المنتجات أداءً من حيث الكمية والإيرادات',

    // Menus
    'Tickets' => 'التذاكر',
    'Data Audit' => 'تدقيق البيانات',
    'Security Audit' => 'التدقيق الأمني',
    'Plans' => 'الخطط',

    // Database Strings
    'Professional Plan' => 'الخطة الاحترافية',
    'Basic Plan' => 'الخطة الأساسية',
    'Premium Plan' => 'الخطة المميزة',
    'payments' => 'المدفوعات',
    'orders' => 'الطلبات',
    
    // Months
    'Jan' => 'يناير',
    'Feb' => 'فبراير',
    'Mar' => 'مارس',
    'Apr' => 'أبريل',
    'May' => 'مايو',
    'Jun' => 'يونيو',
    'Jul' => 'يوليو',
    'Aug' => 'أغسطس',
    'Sep' => 'سبتمبر',
    'Oct' => 'أكتوبر',
    'Nov' => 'نوفمبر',
    'Dec' => 'ديسمبر',
    'N/A' => 'غير متوفر',
];

$modified = false;
foreach ($dictionary as $en => $ar) {
    if (!isset($arObj[$en]) || $arObj[$en] === $en) {
        $arObj[$en] = $ar;
        $modified = true;
    }
}

if ($modified) {
    file_put_contents($arFile, json_encode($arObj, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "Dynamic reporting and DB translations merged successfully.\n";
} else {
    echo "No new translations added.\n";
}
