# 🗄️ مخطط قاعدة البيانات والعلاقات (Database Constraints & ERD)

يعتمد النظام على هيكل قواعد بيانات متطور ومترابط يخدم أغراض (SaaS) وتعدد الشركات وتعدد الوحدات. لتوضيح العلاقات، نورد أدناه التصميم المفاهيمي والمخطط الكياني للعلاقات (ERD):

## 1. نموذج الكيانات (Mermaid ERD Diagram)

```mermaid
erDiagram
    USERS ||--o{ ROLES : "assign"
    USERS {
        int id PK
        string name
        string email
        string password
        int plan_id FK
        boolean is_active
        datetime created_at
    }

    ROLES ||--o{ PERMISSIONS : "has"
    ROLES {
        int id PK
        string name
        string guard_name
    }

    PLANS ||--o{ USERS : "subscribed by"
    PLANS {
        int id PK
        string name
        float price
        int max_users
        string duration
    }

    PLANS ||--o{ PLAN_MODULES : "contains"
    PLAN_MODULES {
        int id PK
        int plan_id FK
        string module_name
    }

    COMPANIES ||--o{ USERS : "belongs to"
    COMPANIES {
        int id PK
        string company_name
        string tax_number
    }

    INVOICES ||--|{ INVOICE_ITEMS : "has"
    INVOICES {
        int id PK
        int user_id FK
        date invoice_date
        float total_amount
        string status
    }

    SALES ||--|{ ITEMS : "sells"
    SALES {
        int id PK
        int user_id FK
        float total
        date sale_date
    }

    HELP_DESK_TICKETS ||--o{ TICKET_REPLIES : "contains"
    HELP_DESK_TICKETS {
        int id PK
        int user_id FK
        string subject
        string priority
        string status
    }
```

## 2. شرح الجداول والعلاقات الأساسية

1. **جدول المستخدمين `users`:**
   المحور الأساسي في النظام، يمتلك الصلاحيات، ويكون مرتبطاً بـ (Roles) لتحديد مستوى وصوله. إذا كان المستخدم هو مدير شركة، فإنه يرتبط بباقة (Plan) معينة تحدد الموارد المسموحة له.

2. **جدول الباقات `plans`:**
   يحتوي على تفاصيل الأسعار، فترات الاشتراك، والوحدات المضافة (Add-ons) المتاحة لتلك الباقة وتتصل بجدول وسيط لتنظيم الوحدات المسموحة لكل خطة شرائية.

3. **جداول الفواتير والمبيعات `invoices` & `sales`:**
   تمثل الشق المالي للشركات. الفاتورة الواحدة تحتوي على عناصر `invoice_items` متصلة بقاعدة المنتجات والخدمات والمخازن `warehouses`.

4. **جداول المساندة والدعم `helpdesk_tickets`:**
   تتيح للمستخدمين فتح تذاكر يتم تصنيفها بحسب الفئات (Categories) ويتم الرد عليها من قبل المشرفين، مما يؤسس نظام دعم داخلي للـ SaaS.

## 3. التدرج الأمني وصلاحيات Spatie

يتم تطبيق حزمة `Spatie/laravel-permission` كطريقة قياسية لربط المستخدمين والمهام بالصلاحيات. هذا يضمن أن لا يتمكن المستخدم إلا من رؤية الوحدات المفعلة له ولشركته ضمن الخطة المدفوعة، ولا يستطيع التحكم ببيانات مستأجر (Tenant) آخر في نفس مساحة التخزين الخاصة بالمنصة.
