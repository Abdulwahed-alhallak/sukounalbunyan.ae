# Project Intelligence Skill

## Objective
Discover and classify a repository before implementation.

## Outputs
- `.dionagent/outputs/detected-project-profile.md`
- `.dionagent/outputs/detected-architecture-map.md`
- `.dionagent/outputs/detected-runtime-model.md`
- `.dionagent/outputs/detected-deployment-shape.md`

## Detection policy
1. Scan for backend indicators such as `composer.json`, `artisan`, `routes/`, `app/`, `config/`, `database/`.
2. Scan for frontend indicators such as `package.json`, `src/`, `app/`, `pages/`, `vite.config.*`, `next.config.*`.
3. Scan for runtime indicators such as Node, PHP, static output, API-only delivery, Docker, or mixed deploy surfaces.
4. Scan for deployment indicators such as GitHub workflows, Hostinger deployment notes, Docker files, PM2 configs, build scripts, and environment templates.
5. Classify using multiple signals, not a single file.

## Defaults
When evidence is incomplete, use the platform defaults:
- Laravel backend
- MySQL on XAMPP locally
- multilingual React + Vite or Next.js frontend
- GitHub + GitHub Actions
- Hostinger production hosting
