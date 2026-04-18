# Module Dependency Graph

Mapping of upstream and downstream dependencies across the Noble Ecosystem.

## Shared Infrastructure (Ubiquitous Dependencies)
- **User / Auth:** All packages depend on `App\Models\User` and `spatie/laravel-permission`.
- **Inertia/Ziggy:** All frontend modules depend on the shared Inertia bridge in `app.tsx`.
- **AddOn System:** All packages are toggled via the `AddOn` model.

## Functional Dependencies

### Financial Group
- `DoubleEntry` -> **Upstream:** `Account`
- `BudgetPlanner` -> **Upstream:** `Account`, `ProductService`
- `Quotation` -> **Upstream:** `ProductService`
- `Sales/Purchase Invoices` -> **Upstream:** `ProductService`, `User`

### Workforce Group
- `Payroll` -> **Upstream:** `Hrm`, `Timesheet`
- `Performance` -> **Upstream:** `Hrm`, `Goal`
- `Training` -> **Upstream:** `Hrm`

### Operations Group
- `Taskly` -> **Upstream:** `User`, `Messenger`
- `Pos` -> **Upstream:** `ProductService`, `Warehouse`

### Global Connectors
- `NobleFlow` -> **Target:** All Modules via Events.
- `ReportingService` -> **Source:** All Modules via Schema discovery.

## Risky Coupling
- **Circular Risk:** `Hrm` and `Timesheet` have bidirectional flow for attendance validation (needs strict Service-layer separation).
- **Schema Coupling:** `ReportingService` uses `Schema::hasTable` to auto-discover package tables. Removing a package without clearing the cache can crash reports.

## Parallelization Opportunities
- `AIAssistant` development can run parallel to `Hrm` stabilization.
- `LandingPage` and `SupportTicket` have zero critical upstream dependencies.
