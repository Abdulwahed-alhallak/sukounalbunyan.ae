# Deployment Shape

## Strategy
Automated via a specialized custom deploy script (`_scripts/deployment/auto_sync.cjs`).

## Target Environment
- **Provider**: Hostinger.
- **Connectivity**: SSH / SFTP.

## Process
1. Build local assets via Vite.
2. Commit and push to GitHub (acting as central VCS).
3. Connect strictly via SSH to Hostinger.
4. Execute `git reset --hard` to synchronize core codebase.
5. Upload dynamically built `public/build` assets over SFTP.
6. Trigger caching and optimization routines (`artisan optimize`, `migrate`).
