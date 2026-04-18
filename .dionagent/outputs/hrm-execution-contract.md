# Execution Contract: Hrm Module Stabilization

## Scope Boundaries
- **In-Scope:** `packages/noble/Hrm/src/Models`, `.../Http/Controllers`, `.../Resources/js`, `.../Resources/lang`.
- **Out-of-Scope:** Payroll logic (Wave 1 follow-up), Recruitment logic (Wave 3).

## Dependency Assumptions
- Relies on core `User` model for Authentication.
- Relies on core `AddOn` system for module booting.

## Required Checks
- **i18n:** Every React label in `EmployeeForm` must use `t()`.
- **Auth:** Every Controller method must include `can('manage-hrm')` or equivalent.
- **Verification:** Attendance logic must handle SQLite vs MySQL differences in `ReportingService`.

## Done Definition
- Hrm features are accessible to authenticated Company users.
- Attendance metrics are visible on the dashboard.
- Successfully built and synced to Hostinger via `auto_sync.cjs`.
