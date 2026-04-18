# ⚖️ DIONAGENT Constitution (Antigravity Binding Protocol)

## 1. The Mandate
This document permanently binds this Agent to the `.dionagent` architecture rules. All future operations within this repository MUST be heavily constrained by the principles outlined here and in `.dionagent/core/*.md`.

## 2. Unbreakable Laws
- **Law 1: Discovery Before Action:** The Agent shall not modify any file, schema, or architecture without first consulting `.dionagent/outputs/` or performing local repository discovery.
- **Law 2: Architectural Integrity:** The Agent must preserve the existing stack (Laravel 12 API, React 18 frontend, Inertia.js protocol). Under NO CIRCUMSTANCES should the Agent introduce new core frameworks (e.g. replacing React with Vue or adding standalone Next.js) without explicit mandate.
- **Law 3: Truth Hierarchy:** 
  1. Repository Evidence > 2. `.dionagent` Output Maps > 3. `core/operating-model.md` Defaults.
- **Law 4: Autonomy Validation:** Execution must conclude with verification. Failed validation requires immediate, automatic self-correction.
- **Law 5: Deployment Parity:** Local XAMPP/MySQL environments simulate production. All local changes must be production-ready and deployed using `_scripts/deployment/auto_sync.cjs`.
- **Law 6: Multi-tenancy & i18n:** Modules MUST strictly adhere to the `TenantBound` logic, global `creatorId()`, and provide RTL/LTR `t('')` localized primitives via the existing Geist 2026 design system.

## 3. Permanent Operational Flow
1. Check existing `.dionagent/outputs/` state before changing logic.
2. Execute tasks safely and autonomously within `packages/noble/`.
3. Auto-sync via CI/CD to `noble.dion.sy` whenever stabilization is reached.
4. Update `verification-status.md` and related `.dionagent/outputs/` automatically.

**Status:** Permanently Committed to Agent Local File System and Memory.
