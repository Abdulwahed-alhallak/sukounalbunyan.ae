# Workflow Step: Discover Project

## Mission
Detect the project before modifying it.

## Required outputs
1. Project type
2. Primary languages
3. Frameworks and runtimes
4. Package, build, and test toolchain
5. Architecture style
6. Deployment shape
7. Data layer
8. Entry points
9. Risk areas
10. Recommended execution mode

## Minimum scan surface
Inspect at minimum:
- `composer.json`
- `artisan`
- `package.json`
- `vite.config.*`
- `next.config.*`
- `resources/`
- `routes/`
- `app/`
- `bootstrap/`
- `config/`
- `database/`
- `.env.example`
- `README*`
- Docker files
- GitHub workflow files
- deployment docs
