# Architecture Map

## Frontend Architecture
- **Framework**: React 18 with Inertia.js to bridge backend and frontend routing without API rewrites.
- **Styling**: TailwindCSS, Radix UI primitives.
- **Entry Points**: `resources/js/app.tsx`.
- **Modular SPAs**: Modules reside in `packages/noble/*/src/Resources/js/app.tsx`.

## Backend Architecture
- **Framework**: Laravel 12.0
- **Structure**: MVC with Service Layer (implicit based on ecosystem rules).
- **Packages**: Custom plugins loaded via composer autoload PSR-4 namespaces (`Noble\LandingPage\`, `Noble\Hrm\`, etc.).

## Third Party Integrations & Modules
- Mailchimp, Microsoft Graph, PayPal, Stripe, Pusher, Twilio, Zatca, etc.
- Spatie Media Library and Spatie Permissions for RBAC.
