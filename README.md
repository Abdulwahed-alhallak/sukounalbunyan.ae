# 🌐 Noble Architecture ERP Ecosystem (v5.0.0 Platinum Master)

> **Master Repository** - The fully integrated enterprise resource planning system for Noble Architecture.

Welcome to the central repository of Noble Architecture's SaaS Platform. This robust, **100% Fully Localized (Arabic & English)** application fuses Sales, Execution, Administration, and Finance into a single mathematically bound engine.

---

## 🎯 Architecture & Elite Modules

The system is built on **Laravel 12.x (Inertia.js)** and **React 18 (Vite+TypeScript)**, utilizing the **Vercel Geist 2026 Engine** design system. The platform is designed around 5 core pillars:

1. **CRM & Leads Management:** Tracks potential deals and converts them to legally binding contracts.
2. **Taskly (Project Management):** Translates Sales contracts directly into executable Projects with dynamic charting and milestone tracking.
3. **HRM (Human Resources):** Manages all employee data, including base salaries, leaves, and roles.
4. **Intelligent Geolocation Tracker:** A multi-shift tracker utilizing Haversine formulas to verify employee GPS coordinates mathematically against Project geofence boundaries.
5. **Account & Finance (Master Ledger):** Features "Smart Auto-Accounting" where labor costs and procurement costs automatically hit the Project's Profit & Loss ledgers.

---

## 🛠️ The "Smarter Ecosystem" (Localization Update)

This platform has been modernized in **April 2026** to ensure **Zero Disconnected Data Points** and follows **RTL-first Logical Properties** for seamless multi-language support.

- **Global Case-Sensitive Translation:** 100% Coverage of over 1,200 translation keys across all 31+ enterprise modules.
- **RTL-Logical Alignment:** All UI components use `start/end` properties instead of `left/right`, ensuring perfect layout mirroring without CSS duplication.
- **Data Lifecycle Supplementation:** Active generation algorithm simulating 30+ days of operational data (Attendance, Payroll, Leaves) for visual analytics testing.
- **Unified Component System:** Standardized Shadcn-inspired components with high-fidelity Vercel aesthetics and perfect `manifest.json` PWA connectivity.

---

## 🚀 Getting Started (Installation)

### Prerequisites

- PHP 8.2+ (Recommended: 8.3)
- Composer 2.x
- Node.js 20+ & NPM
- MySQL 8.0+

### Setup Commands

1. **Clone & Install Dependencies**
```bash
composer install
npm install
```

2. **Environment & Keys**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Database Preparation**
```bash
php artisan migrate --seed
```

4. **Booting the Application**
```bash
# Terminal 1 - Backend
php artisan serve

# Terminal 2 - Frontend
npm run dev
```

---

## 🚀 Deployment Pipeline (Production)

The platform is fully synchronized with Noble's live production server via a highly secure, one-click deployment pipeline.

### Deployment Scripts Catalog (`_scripts/`)

| Script | Purpose |
| :--- | :--- |
| `.\_scripts\fixes\accounting_polish.php` | Standardizes breadcrumbs and localizes chart labels. |
| `.\_scripts\fixes\crm_taskly_polish.php` | Fixes white screen issues and localizes Taskly metrics. |
| `.\_scripts\sync\simulate_hrm_lifecycle.cjs` | **[Core Base]** Engages SSH to generate ~3000 biometric log entries safely representing 1 month of operations for 133 Platinum users. |

_Engineered with precision for Noble Architecture 2026 — Total Operational Sovereignty (Platinum Master)._
