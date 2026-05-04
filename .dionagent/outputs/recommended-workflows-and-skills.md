# Recommended Workflows and Skills

Execution guide for the Sukoun Albunyan roadmap.

## Wave 0 (Foundation)
- **Workflow:** `architecture-stabilization`
- **Skills:** `project-intelligence`, `deployment-delivery`
- **Why:** Focus is on fixing the CI/CD pipeline and structural blockers. Avoid loading frontend skills until asset bundling is stable.

## Wave 1 (Core Pillars)
- **Workflow:** `module-refactor` / `existing-project-intake`
- **Skills:** `laravel-executor`, `project-intelligence`
- **Why:** Requires deep understanding of DB schemas and Eloquent relationship mapping in `Hrm` and `Account`.

## Wave 2 (Operations)
- **Workflow:** `feature-delivery`
- **Skills:** `react-vite-frontend`, `laravel-executor`
- **Why:** High-UI impact phase. Requires building complex React components for Gantt charts (`Taskly`) and Barcode scanners (`Pos`).

## Wave 3 (Secondary Suites)
- **Workflow:** `feature-delivery`
- **Skills:** `laravel-executor`, `third-party-api-integration`
- **Why:** Focus on specialized modules like Zatca (XML/Tax APIs) and AIAssistant.

## Wave 4 (Hardening)
- **Workflow:** `i18n-hardening` / `release-handover`
- **Skills:** `i18n-specialist`, `verification-audit`
- **Why:** Broad sweep of the entire codebase for language compliance and production readiness.

## What NOT to Load Yet
- Do not load `new-project-bootstrap` (Project is already mature).
- Do not load `stack-migration` (Preserving Laravel/React monolith is mandatory).
