import os
import re

files = [
    r"packages/dionone/Account/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/BudgetPlanner/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Calendar/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Contract/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/DoubleEntry/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/FormBuilder/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Goal/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Hrm/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/LandingPage/src/Resources/js/menus/superadmin-menu.ts",
    r"packages/dionone/Lead/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Performance/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Pos/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/ProductService/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Quotation/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Recruitment/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/SupportTicket/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Taskly/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Timesheet/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/Training/src/Resources/js/menus/company-menu.ts",
    r"packages/dionone/ZoomMeeting/src/Resources/js/menus/company-menu.ts"
]

pattern = re.compile(r'declare global\s*\{[^\}]+\}', re.DOTALL)

for rel_path in files:
    full_path = os.path.join(r"c:\Users\DION-SERVER\Desktop\codecanyon-FOhzjwS6-erpgo-saas-all-in-one-business-erp-with-project-account-hrm-crm-pos\main-file", rel_path)
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = pattern.sub('', content)
        
        if new_content != content:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned {rel_path}")
        else:
            print(f"No changes in {rel_path}")
    else:
        print(f"File not found: {rel_path}")
