# Module Execution Roadmap

Wave-based delivery plan for Sukoun Albunyan stabilization and expansion.

## Wave 0: Foundation and Blockers
**Objective:** Stabilize core services and unify delivery mechanisms.
- **Included:** Core `WorkflowEngine`, `ReportingService`, `Deployment/CI Sync`.
- **Action:** 
    - Fix asset desync between GHA and `auto_sync.cjs`.
    - Harden `ReportingService` memory management.
- **Exit Condition:** Clean `npm run build` on Hostinger; no 419 CSRF failures.

## Wave 1: Core Pillar Stabilization (Financial & HR)
**Objective:** Ensure the "functional monolith" baseline is 100% reliable.
- **Included:** `Account`, `Hrm`, `ProductService`.
- **Action:**
    - Resolve `Hrm` attendance/biometric sync defects.
    - Schema normalization for core Financials (Invoices/Vouchers).
- **Exit Condition:** Passing payroll calculation test suite.

## Wave 2: Operation Suite Completion (Taskly & POS)
**Objective:** Deliver fully functional Project and Retail suites.
- **Included:** `Taskly`, `Pos`, `Lead`.
- **Action:**
    - Refactor `project_tasks` schema to support completion metrics.
    - Implement missing POS item-level reporting fields.
- **Exit Condition:** POS Daily Sales summary matches ledger totals.

## Wave 3: Secondary Suite Delivery
**Objective:** Expand into supporting business functions.
- **Included:** `AIAssistant`, `Zatca`, `Recruitment`, `Contract`, `DoubleEntry`.
- **Action:**
    - Register and enable secondary modules in `AddOn` system.
    - Finalize Zatca QR signing logic.
- **Exit Condition:** Successful Zatca-compliant XML generation.

## Wave 4: Hardening and Handover
**Objective:** Final polish, i18n hardening, and 100% test coverage.
- **Included:** All modules (All 28 Suites).
- **Action:**
    - Full i18n audit for hardcoded strings.
    - Final security audit on cross-package permissions.
- **Exit Condition:** 100% language coverage; zero high-risk security findings.

## Verification Requirements
- Every wave must pass a "Production Mirror" sync via `auto_sync.cjs`.
- All database migrations must be forward-only and non-destructive.
