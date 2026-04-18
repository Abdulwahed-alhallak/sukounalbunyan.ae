# Next Best Module: Hrm (Human Resource Management)

## Selected Module
**Hrm (Workforce pillar)**

## Rationale
Hrm is the foundation of the Nobel ecosystem's "Company" structure. It holds the core `Employee` and `Attendance` data which dictates permissions, timesheets, and payroll. Solving Hrm stabilization reduces the risk for Taskly, Timesheet, and Performance modules.

## Prerequisites
- **Database:** Standard `employees`, `attendance`, `leaves` tables must be migrated.
- **Common:** `spatie/laravel-permission` must be seeded.

## Expected Outputs
- Stable attendance check-in/out logic.
- Corrected Biometric log parsing service.
- RTL-compliant Employee dashboard.

## Verification Checklist
1. `[ ]` Employee record creation via React form.
2. `[ ]` Attendance calculation (Present/Absent/Late).
3. `[ ]` Arabic language toggle switches all UI labels correctly.
4. `[ ]` `auto_sync.cjs` successfully pushes Hrm-specific built assets.

## PASS/FAIL Criteria
- **PASS:** Zero SQL errors during attendance generation; Dashboard metrics match DB count.
- **FAIL:** UI crashes on RTL transition; Attendance metrics return NULL for valid date ranges.
