# Release Readiness Gaps

Identified gaps between current state and production "Gold Master" status.

## Runtime Issues
- **Asset Desync:** Vite assets intermittently fail to resolve on Hostinger after SSH-only pulls.
- **CSRF 419:** Custom silent token refresh in `app.tsx` needs more rigorous testing on long-lived sessions.

## Deployment Issues
- **Memory Pressure:** `npm run build` exceeds Hostinger shared resource limits for a project with 28 globbed suites.
- **Secret Hygiene:** Hardcoded SSH/DB passwords in `auto_sync.cjs` and `.github/workflows/deploy.yml` must be moved to Vault/Secrets.

## Environment Issues
- **Locale Drift:** Inconsistent `ar.json` vs `en.json` keys in recently added modules (AIAssistant, Zatca).
- **PHP Extension Gaps:** Some Hostinger PHP profiles might miss `intl` or `bcmath` required by `Hrm` calculations.

## Testing Gaps
- **Modular Regression:** No automated tests for inter-package dependencies (e.g., stopping `Account` doesn't gracefully disable its dependent charts).

## Security-Sensitive Gaps
- **Admin Reset Logic:** `auto_sync.cjs` resets admin passwords on every deploy; this is a safety feature for recovery but a potential security hole if misused.
- **Permissions:** Spatie permission check coverage is 100% on routes but inconsistent in internal `ReportingService` filtering logic.
