# Detected Module Inventory

The Sukoun Albunyan ecosystem consists of 28 enterprise modules, each functioning as a self-contained suite within the `packages/noble/` directory.

## Core Suites

### 1. Hrm (Human Resource Management)
- **Purpose:** Employee management, leaves, attendance, payroll, and recruitment.
- **Key Files:** `packages/noble/Hrm/src/Models/Employee.php`, `.../Attendance.php`
- **Health:** Mature, deeply integrated with Biometric logs.

### 2. Taskly (Project Management)
- **Purpose:** Kanban boards, task tracking, and project collaboration.
- **Key Files:** `packages/noble/Taskly/src/Models/Project.php`, `.../Task.php`
- **Integration:** Integrated with timesheets.

### 3. Account (Accounting)
- **Purpose:** Chart of accounts, journals, and financial statements.
- **Key Files:** `packages/noble/Account/src/Models/Voucher.php`
- **Dependency:** Works with `DoubleEntry` module.

### 4. Pos (Point of Sale)
- **Purpose:** Retail transaction management, barcodes.
- **Key Files:** `packages/noble/Pos/src/Models/Pos.php`

### 5. Lead (CRM)
- **Purpose:** Sales pipeline, lead tracking, and conversion.
- **Key Files:** `packages/noble/Lead/src/Models/Lead.php`

## Strategic/Enabling Suites

### 6. AIAssistant
- **Purpose:** AI-driven content generation and helpdesk automation.
- **Integration:** Centralized AI services.

### 7. NobleFlow (Workflow Engine)
- **Purpose:** Automation of business processes (Email/WhatsApp triggers).
- **Core Logic:** `app/Services/WorkflowEngine.php`

### 8. DoubleEntry
- **Purpose:** Standard accounting ledger patterns for deep financial accuracy.

## Financial & Payment Suites
- **CustomPaypal / CustomStripe:** Modular payment gateways.
- **BudgetPlanner:** Advanced fiscal forecasting.
- **Quotation:** Proposal and quote management.

## Communication Suites
- **Messenger:** Real-time chat (Pusher).
- **UnifiedInbox:** Consolidated email/ticket view.
- **SupportTicket:** Helpdesk and customer support.

## Full Inventory List (packages/noble/)
- `AIAssistant`, `Account`, `BudgetPlanner`, `Calendar`, `Contract`, `DoubleEntry`, `FormBuilder`, `Goal`, `GoogleCaptcha`, `Hrm`, `LandingPage`, `Lead`, `Paypal`, `Performance`, `Pos`, `ProductService`, `Quotation`, `Recruitment`, `Slack`, `Stripe`, `SupportTicket`, `Taskly`, `Telegram`, `Timesheet`, `Training`, `Twilio`, `Webhook`, `ZoomMeeting`

## Module Health Status
- **Overall:** Highly stable.
- **Missing Pieces:** Some modules (Telegram, Slack) appear to be webhook-heavy wrappers; deep integration tests are recommended.
- **Refactor Priority:** Low, architecture is consistent across all 28 plugins.
