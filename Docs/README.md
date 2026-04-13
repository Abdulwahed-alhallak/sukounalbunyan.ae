# 📚 دليل التوثيق الشامل لنظام (Noble Architecture)

مرحباً بك في المستودع المرجعي لكل تفاصيل المنصة. تم تجهيز هذا المجلد ليكون المرجع الأساسي للمطورين، مديري النظام، ومهندسي البنية التحتية.

## 📋 فهرس المحتوى (Index Directory)

تم تقسيم التوثيق إلى 10 فصول رئيسية تغطي كافة جوانب النظام:

| الفصل (Chapter) | الملف المرجعي (File) | الوصف (Description) |
| :--- | :--- | :--- |
| **💡 الفصل الأول** | [`01-Overview_and_Ideas.md`](./01-Overview_and_Ideas.md) | الأفكار الأساسية، طبيعة النظام السحابي (SaaS)، وأهم الأدوات الحصرية للمنظومة. |
| **🗄️ الفصل الثاني** | [`02-Database_ERD.md`](./02-Database_ERD.md) | مخطط العلاقات الشامل لقاعدة البيانات (ERD) وارتباط الشركات بالاشتراكات. |
| **🌐 الفصل الثالث** | [`03-Routes_Architecture.md`](./03-Routes_Architecture.md) | بنية المسارات والروابط وطريقة عمل جسر Inertia.js بين الخلفية والواجهة. |
| **🎨 الفصل الرابع** | [`04-Theme_and_UI_Guidelines.md`](./04-Theme_and_UI_Guidelines.md) | القواعد الثابتة لواجهات المستخدم، خصائص Vercel، دعم اللغة العربية، والـ Glassmorphism. |
| **👨‍💻 الفصل الخامس** | [`05-Development_Guide.md`](./05-Development_Guide.md) | دليل المطورين لكيفية بناء الشيفرات الصحيحة ضمن بيئة العمل، وفهم دورة حياة الكود. |
| **🛠️ الفصل السادس** | [`06-Custom_Scripts_And_Commands.md`](./06-Custom_Scripts_And_Commands.md) | شرح أدوات السيرفر والأوامر المخصصة (أكثر من 100 سكربت صيانة وتفعيل). |
| **🚀 الفصل السابع** | [`07-Deployment_Server_Guide.md`](./07-Deployment_Server_Guide.md) | دليل النشر (Deployment) على خوادم الـ Linux و Hostinger وتجهيزات البيئة. |
| **🧩 الفصل الثامن** | [`08-Modules_and_Addons_Guide.md`](./08-Modules_and_Addons_Guide.md) | الشرح الفني لطبيعة الوحدات الإضافية (Add-ons)، وكيف تعمل الـ 28+ وحدة بشكل مستقل ومترابط. |
| **🛡️ الفصل التاسع** | [`09-Security_and_Tenancy.md`](./09-Security_and_Tenancy.md) | معايير الأمان، الصلاحيات (Roles/Permissions)، وكيفية فصل البيانات بين الشركات المختلفة. |
| **🔗 الفصل العاشر** | [`10-API_and_Integrations.md`](./10-API_and_Integrations.md) | بوابات الدفع الإلكتروني، البريد (SMTP)، المراسلات الداخلية وأتمتة المهام (DionFlow). |
| **👥 الفصل الحادي عشر** | [`11-HRM_Module_DeepDive.md`](./11-HRM_Module_DeepDive.md) | شرح متعمق لنظام الموارد البشرية ودورة حياة الموظف داخل كود النظام. |
| **🔐 الفصل الثاني عشر** | [`12-Licensing_and_Master_Plan.md`](./12-Licensing_and_Master_Plan.md) | طبيعة الباقات والرخصة الشاملة (Noble Master Plan) وآلية مزامنة الملفات. |
| **🖥️ الفصل الثالث عشر** | [`13-Frontend_and_Settings.md`](./13-Frontend_and_Settings.md) | واجهة المستخدم (Tailwind, React/Inertia) وهيكلية إعدادات المنظومة الشاملة. |
| **🤖 الفصل الرابع عشر** | [`14-AI_and_Code_Generation.md`](./14-AI_and_Code_Generation.md) | شرح وتوظيف أدوات الذكاء الاصطناعي (AI Assistant) وكيفية معالجتها في مختلف أجزاء النظام. |
| **🏷️ الفصل الخامس عشر** | [`15-TypeScript_and_Data_Models.md`](./15-TypeScript_and_Data_Models.md) | دليل تعريفات الأنواع (TypeScript Definitions) ونماذج البيانات لضمان تطابق السيرفر مع الواجهة الأمامية. |

---

### ملاحظة للمطورين الجدد ⚠️
قبل البدء بتعديل الواجهات أو فتح ملفات الـ (Controllers) تأكد من قراءة **الفصل الرابع** و **الفصل الخامس** لتجنب تكرار كتابة الأكواد وحفاظاً على استقرار الأداء.

*تم توليد هذا التوثيق ليتماشى مع متطلبات بيئة التطوير في المنظومة.*
