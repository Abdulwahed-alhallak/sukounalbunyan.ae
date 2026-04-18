# Detected Project Profile

## 1. Project Type
Enterprise Modular SaaS Ecosystem (Noble Architecture).

## 2. Primary Languages
- PHP (Backend)
- TypeScript/JavaScript (Frontend)

## 3. Frameworks and Runtimes
- Laravel 12.0 (Backend Framework)
- React 18 (Frontend Library)
- Node.js (Build Runtime)
- PHP 8.2+ (Server Runtime)

## 4. Package, Build, and Test Toolchain
- **Package Managers**: Composer (PHP), NPM (Node)
- **Build Tool**: Vite 5.0
- **Testing**: Cypress (E2E), PHPUnit (Backend)
- **CSS Framework**: TailwindCSS 3.2.1

## 5. Architecture Style
Modular Monolith with Inertia.js bridging Laravel and React. Contains an add-on ecosystem (`packages/noble/*`).

## 6. Deployment Shape
Hostinger Production Environment (connected via `HOSTINGER_DB_*` and custom SSH script `auto_sync.cjs`).

## 7. Data Layer
MySQL (default DB connection in `.env.example`).

## 8. Entry Points
- Web Routes: `routes/web.php`
- SPA Entry: `resources/js/app.tsx` and dynamically loaded packages in Vite config.

## 9. Risk Areas
- Circular dependencies in Node modules (mitigated via manual Vite chunking).
- Complex module inter-dependencies (SaaS modules).
- Hostinger SSH connectivity for automated deployments.

## 10. Recommended Execution Mode
Brownfield mode (`existing-project-intake.md`).
