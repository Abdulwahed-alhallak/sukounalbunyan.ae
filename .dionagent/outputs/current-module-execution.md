# Current Module Execution: Hrm (Hard Lockdown)

## Phase 0: Pre-Flight Validation
- **Selected Module**: Hrm
- **Pre-flight Checks**: Confirmed prerequisite files exist.
- **Blocker Check**: No unresolved blockers found.
- **Intelligence Sufficiency**: Sufficient.
- **PASS/FAIL**: PASS

---

## Phase 1: Lock the Execution Contract
- **Module Name**: Hrm (Human Resource Management)
- **Status**: LOCKED
- **Objective**: Stabilize the biometric processing engine, unify attendance logic, and ensure 100% Arabic coverage for dashboards.

### Scope
- **In-Scope**:
    - `app/Console/Commands/ProcessBiometrics.php`
    - `packages/noble/Hrm/src/Resources/js/Pages/Dashboard/*.tsx`
    - `packages/noble/Hrm/src/Resources/js/Pages/BiometricLogs/Index.tsx`
    - `packages/noble/Hrm/src/Resources/lang/ar.json`
- **Out-of-Scope**:
    - Performance module integration.
    - Payroll disbursement logic (beyond basic hours calculation).

### Success Criteria (Done Definition)
1. `ProcessBiometrics.php` processes full `Y-m-d H:i:s` DateTimes without loss.
2. Attendance logic calculates standard/overtime hours and status correctly.
3. Hrm dashboards (Company/Employee) display correctly in RTL.
4. `ar.json` contains translations for all tactical UI keys identified in audit.
5. Verification script `test_bio.php` passes with zero SQL/PHP errors.

### PASS/FAIL Criteria
- **PASS**: Verification script reports "SUCCESS"; No untranslated keys in Hrm Dashboard; Accurate hour calculation.
- **FAIL**: Any PHP/SQL errors during biometric processing; Unprotected non-multilingual strings in UI.

---

## Phase 2: Dependency and Boundary Re-check
- **Action**: Check for unsafe coupling.
- **Status**: PENDING
