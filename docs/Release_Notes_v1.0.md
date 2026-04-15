# Noble Architecture - Release Notes (v1.0 Baseline)

## Release Information
- **Version**: 1.0 (Production Synchronization)
- **Deployment Platform**: Hostinger (noble.dion.sy)
- **Frameworks**: Laravel 12 / PHP 8.2 / React 18 / Inertia / Vite 5
- **Database Status**: 135 total users / 133 Staff with full Arabic names.

## Features & Configuration
- Fully populated database with Noble Architecture employees, HR modules, Accountings, CRMs, etc.
- Multi-tenancy prepared structure with full RTL & Light/Dark Theme (Geist 2026 guidelines).
- Super Admin and Company accounts generated.

## Automated CI/CD Workflow
A fully automated push/sync pipeline exists to keep localhost development perfectly mapped to the server (`auto_sync.cjs`).
**Whenever you make modifications locally, you MUST use `node _scripts/deployment/auto_sync.cjs` to deploy.**

### The \`auto_sync.cjs\` pipeline executes:
1. `npm run build` locally
2. `git add .` & `git commit` & `git push`
3. Remote SSH connection -> `git pull`
4. Remote SFTP upload of gitignored `public/build/assets/*`
5. Remote Artisan: `optimize:clear` -> `migrate` -> `optimize`

## Database Backups
- `docs/Archive/nobel_db_backup_v1.0.sql` reflects this exact snapshot.
- To re-init the database, restore the SQL and copy `public/build` properly.

## User Credentials List
See `docs/Archive/user_credentials_report.txt` for all credentials.
- **SuperAdmin**: `superadmin@noble.dion.sy` / `Noble@2026`
- **Company Admin**: `admin@noble.dion.sy` / `Noble@2026`
