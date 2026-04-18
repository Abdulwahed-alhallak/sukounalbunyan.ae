# Module Priority Matrix

Classification and prioritization of the 28 Noble Architecture Enterprise Suites and core services.

| Module | State | Priority | Next Action | Technical Risk | Reason |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hrm** | Partial | P0 | Complete Missing Implementation | High | Core pillar; needs biometric/attendance stabilization. |
| **Account** | Fragile | P0 | Fix Defects | High | Financial backbone; requires schema audit for large datasets. |
| **Taskly** | Inconsistent | P0 | Refactor before Feature | Medium | Missing `is_complete` and `end_date` in `project_tasks`. |
| **Pos** | Healthy | P1 | Add Tests | Medium | Stable but business critical; needs regression safety. |
| **Lead** | Healthy | P1 | Ready for Feature Delivery | Low | Standard CRM logic; ready for automation expansion. |
| **NobleFlow** | Inconsistent | P0 | Fix Defects | High | Critical automation engine; prone to loop regressions. |
| **Zatca** | Inconsistent | P1 | Restore i18n Discipline | Medium | Specialized tax logic; needs strict localized validation. |
| **DoubleEntry** | Blocked | HOLD | Defer | High | Depends on `Account` stabilization. |
| **AIAssistant** | Healthy | P2 | Ready for Feature Delivery | Low | Optional value-add; stable API integration. |
| **LandingPage** | Healthy | P3 | Audit-only | Low | Static/semi-dynamic; low change frequency. |
| **ProductService**| Healthy | P1 | Unify Duplicated Logic | Medium | Shares logic with Pos/Account; needs normalization. |
| **SupportTicket** | Overlapping | P2 | Split Responsibilities | Medium | Overlaps with core Helpdesk; needs boundary definition. |
| **Contract** | Healthy | P2 | Ready for Feature Delivery | Low | Standard document management. |
| **Recruitment** | Partial | P2 | Complete Missing Implementation | Medium | Sub-module of HRM; depends on Employee models. |
| **Performance** | Missing Parts | P2 | Complete Missing Implementation | Medium | KPI logic partially empty in services. |
| **Timesheet** | Inconsistent | P1 | Fix Defects | Medium | Time-logging logic needs validation against attendance. |
| **Payroll (Hrm)** | Fragile | P1 | Fix Defects | High | High sensitivity; zero-tolerance for calculation errors. |

## Scoring Legend
- **P0 (Must Stabilize First):** Architectural pillars or modules with known data-model gaps.
- **P1 (High-Value Next):** Healthy modules that drive primary business revenue.
- **P2 (Safe Follow-up):** Secondary modules or value-adds.
- **P3 (Optional/Deferred):** Utility modules.
- **HOLD:** Blocked by upstream architectural dependencies.
