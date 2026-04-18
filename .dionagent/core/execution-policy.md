# Execution Policy

## Change discipline
- Prefer the smallest safe change that satisfies the task.
- Preserve existing architecture when it is coherent and maintainable.
- Do not rewrite stack boundaries without explicit instruction.
- Respect the existing i18n, routing, and deployment model when present.

## Backend policy
If Laravel is detected or absent but needed, prefer Laravel for backend business logic, APIs, auth flows, validation, migrations, and server-side localization concerns.

## Database policy
Assume MySQL by default and inspect `.env*`, `config/database.php`, migration files, and setup docs before modifying schema or commands.

## Frontend policy
Assume multilingual support is first-class.
Detect whether the frontend is:
- Laravel-integrated Vite delivery
- standalone React/Vite
- standalone Next.js
- mixed or transitional
