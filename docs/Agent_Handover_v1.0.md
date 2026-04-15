# Noble Architecture - Agent Handover (v1.0 Baseline)

> [!IMPORTANT]
> **AUTONOMOUS EXECUTION MANDATE**: The user has strictly authorized FULL AUTONOMOUS EXECUTION. The agent must prioritize direct action, automatic synchronization, and immediate problem-solving. Do not wait for confirmation for standard updates, bug fixes, or synchronization tasks.

## 1. Environment & Architecture
- **Production URL**: https://noble.dion.sy
- **Local URL**: http://localhost:8080 (Laravel Serve)
- **Repo Branch**: `master` (Note: `master`, not `main`).
- **Tech Stack**: Laravel 12, React 18, Inertia.js 2, Vite 5, Vercel Geist 2026 UI.
- **Modules**: 31+ premium modules located in `packages/noble/*`.

## 2. Mandatory Workflow: Auto-Sync
**NEVER** deploy manually via SFTP or just `git pull`. 
The designated deployment method is the integrated CI/CD script:
```bash
node _scripts/deployment/auto_sync.cjs "Your commit message"
```
This script handles:
1. Local Vite build (`npm run build`).
2. Git commit & push.
3. Remote SSH reset (`git reset --hard`).
4. SFTP upload of gitignored `public/build/assets`.
5. Remote artisan optimizations.

## 3. Database Snapshot (v1.0)
- **Users**: 135 total.
    - 1 SuperAdmin (`superadmin@noble.dion.sy`)
    - 1 Company (`admin@noble.dion.sy`)
    - 133 Staff (Imported from HRM CSV with full Arabic names).
- **Credentials**: Default password is `Noble@2026`.
- **References**: 
    - Full user list: `docs/Archive/user_credentials_report.txt`
    - DB Dump: `docs/Archive/nobel_db_backup_v1.0.sql`

## 4. Coding Standards (Persistence)
- **Styling**: Always use Logical Properties (`margin-inline-start` instead of `margin-left`) for RTL parity.
- **Localization**: Use `t('key')` for all strings. Arabic is the primary production language.
- **Design**: Strictly adhere to Vercel Geist 2026 (Semantic tokens, sleek dark mode, rich aesthetics).
- **Paths**: On Hostinger, the document root is `public_html/`. The Laravel `index.php` is at `public/index.php`. The root `.htaccess` handles proxying.

## 5. Maintenance
- **Caches**: Use `php artisan optimize` on remote.
- **Migrations**: Always run `php artisan migrate --force` after schema changes via the `auto_sync` script.
- **PWA**: Manifest is at `public/manifest.json`.
