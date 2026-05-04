# Sukoun Albunyan - Enterprise SaaS Ecosystem

Sukoun Albunyan is a high-performance, modular SaaS platform designed for comprehensive corporate management. Built on a Zero-Trust Multi-Tenancy architecture, it integrates 28+ enterprise modules into a unified, high-end ecosystem.

## 🚀 Technology Stack
- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 + Inertia.js + Vite
- **Styling**: Vanilla CSS + Vercel Geist 2026 Design System
- **Database**: MySQL (Optimized for Large Datasets)
- **Deployment**: Automated CI/CD via SSH/SFTP

## 📁 System Architecture & Organization
The repository has been deeply organized into a clean, "Gold Master" structure:

### ⚙️ Core Layers
- `app/Services/`: Modular service gateway.
- `app/Traits/`: Domain-specific logic traits (Financial, HRM, CRM, etc.) for high maintainability.
- `packages/noble/`: The heart of the platform, containing 28+ Enterprise Modules.
- `_scripts/`: Centralized automation scripts (Deployment, Backups, Sync).
- `_archive/`: Secure location for redundant or legacy artifacts.

### 🛡️ Security & Hygiene
- **Zero-Trust Multi-Tenancy**: All data access is scoped via `creatorId()`.
- **Clean Public-Surface**: Static assets and public entries are strictly managed.
- **Optimized Framework**: Automated log management and cache optimization scripts included.

## 🛠️ Operational Commands
### Module Synchronization
To synchronize and enable all enterprise modules in the local environment:
```bash
php _scripts/deployment/sync_noble_modules.php
```

### Production Deployment
To build assets, commit changes, and sync with the production server (`noble.dion.sy`):
```bash
node _scripts/deployment/auto_sync.cjs
```

## 📜 Documentation Reference
Integrated project intelligence can be found in `.dionagent/outputs/`:
- `detected-architecture-map.md`: Complete service-layer mapping.
- `detected-project-profile.md`: Evolution and maintenance history.

---
**© 2026 Sukoun Albunyan. All Rights Reserved.**
