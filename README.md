# 🌐 Noble Architecture ERP Ecosystem

> **Master Repository** - The fully integrated enterprise resource planning system for Noble Architecture.

Welcome to the central repository of Noble Architecture's SaaS Platform. This robust, fully localized (Arabic & English) application fuses Sales, Execution, Administration, and Finance into a single mathematically bound engine.

---

## 🎯 Architecture & Core Modules
The system is built on Laravel 11.x and React (Vite+TypeScript), utilizing a beautifully crafted Vercel design system for maximum UI/UX efficiency. The platform is designed around 5 core pillars:

1. **CRM & Leads Management:** Tracks potential deals and converts them to legally binding contracts.
2. **Taskly (Project Management):** Translates Sales contracts directly into executable Projects with dynamic charting and milestone tracking.
3. **HRM (Human Resources):** Manages all employee data, including base salaries, leaves, and roles.
4. **Intelligent Geolocation Tracker:** A multi-shift tracker utilizing Haversine formulas to verify employee GPS coordinates mathematically against Project geofence boundaries.
5. **Account & Finance:** The Master Ledger. Features "Smart Auto-Accounting" where labor costs (from Geofenced checkouts) and procurement costs (Purchase Invoices) automatically hit the Project's Profit & Loss ledgers.

---

## 🛠️ The "Smarter Ecosystem"
This platform has been heavily modified to ensure **zero disconnected data points**.
- **Automated Time-to-Cost Engine:** When an employee clocks out of a project physically, the Tracker converts their elapsed time directly into a valid `Expense` bound to the Project's budget ledger.
- **Traceability:** You can trace a $200 labor entry in the master bank ledger all the way back to the specific minute an employee crossed the geofence on the project site.

---

## 🚀 Getting Started (Installation)

### Prerequisites
- PHP 8.2+
- Composer 2.x
- Node.js 18+ & NPM
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
Ensure your MySQL instance is running and your `.env` contains the correct `nobel` database credentials.
```bash
php artisan migrate --seed
```
*Note: The platform contains advanced bridge migrations (`bridge_core_ecosystem_gaps`) that unify all standalone modules.*

4. **Booting the Application**
```bash
# Terminal 1 - Run Backend (or serve via Apache/Nginx)
php artisan serve

# Terminal 2 - Run Frontend HMR
npm run dev
```

---

## 📊 Integrations & Support
This platform includes native CSV parsing mechanisms (e.g., `php artisan noble:import-employees`) engineered to safely map complex legacy records into the relational graphs securely.

---

## 🚀 CI/CD Automated Deployment (Hostinger)
The platform is fully synchronized with Noble's live production server via a highly secure, one-click Git deployment pipeline. 

### Secure Hostinger Syncing
1. Local changes (both code and Database Migrations) can be automatically pushed to `noble.dion.sy`.
2. Ensure your passwords and tokens are safely vaulted inside `.env.hostinger`.
3. To Execute a Push & Remote Database Sync to Production, run:
```powershell
.\_scripts\deploy_to_hostinger.ps1
```

*Engineered with precision for Noble Architecture.*
