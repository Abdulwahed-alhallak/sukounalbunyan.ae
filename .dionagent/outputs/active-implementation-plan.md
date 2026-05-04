# Finalizing Rental Billing & Dashboard Integration

This plan focuses on completing the user-facing integration of the Rental module, ensuring that business owners can track rental performance directly from the central dashboard and navigate the system efficiently.

## Proposed Changes

### Dashboard Integration

#### [MODIFY] [CompanyDashboard.tsx](file:///c:/Users/DION-SERVER/Desktop/sukon.dion.sy/resources/js/Pages/CompanyDashboard.tsx)
- Define `RentalKPIs` interface.
- Add `rental` to `Props`.
- Implement `Rental` KPI card section using `StatCard` components (Active Contracts, Accrued Rent, Balance Due, Damage Fees).
- Add a "Rental Efficiency" smart insight card.
- Update `Recent Activity` to handle `rental_contract` type with appropriate icon.
- Update `Alerts & Upcoming` to handle `rental_expiry` type.

### Navigation Reorganization

#### [MODIFY] [company-menu.ts](file:///c:/Users/DION-SERVER/Desktop/sukon.dion.sy/resources/js/utils/menus/company-menu.ts)
- Remove "Rental Management" from the "Dashboard" children group to prevent redundant/confusing placement.
- Move "Rental Management" to a more appropriate position in the sidebar order (e.g., after Finance).

### Branding & PDF Polish

#### [MODIFY] [return-pdf.blade.php](file:///c:/Users/DION-SERVER/Desktop/sukon.dion.sy/packages/noble/Rental/src/Resources/views/pdf/return-pdf.blade.php)
- Minor adjustments to ensure RTL support if needed.

## Verification Plan

### Automated Tests
- N/A (UI Changes)

### Manual Verification
1. Open the Dashboard as a Company user.
2. Verify that "Rental Overview" section appears when the Rental module is active.
3. Verify that recent rental contracts show up in "Recent Activity".
4. Verify that expiring contracts show up in "Alerts & Upcoming".
5. Check the sidebar navigation to ensure "Rental Management" is correctly categorized.
6. Generate a Return PDF and verify its layout.
