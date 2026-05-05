# Detected i18n Status

## Locale Architecture
- **Framework:** i18next (React) + Laravel Localization.
- **Storage:** Large JSON files in `resources/lang/` (e.g., `ar.json` 266KB).
- **Modular Translations:** Each suite in `packages/noble/*/src/Resources/lang` carries its own locale JSON.
- **Merging Strategy:** `TranslationController@getTranslations` fetches the core JSON and dynamically merges JSON from all `AddOn::is_enable(true)` packages.

## Multi-Language Support
- **Current Coverage:** Arabic (ar), English (en), and 13 other secondary languages.
- **Primary Locales:** Arabic (ar) - **DEFAULT**, English (en).
- **Initialization:** `i18n.js` and `app.tsx` are now hardcoded to fallback to `ar` and initialize RTL by default.

## RTL / LTR Handling
- **Logic:** `app.tsx` and `i18n.js` look for `'ar', 'he', 'fa', 'ur', 'ku'` codes.
- **CSS:** Dynamically adds `.rtl` class to `document.documentElement` and switches `dir="rtl"`.
- **Styles:** Separate `rtl.css` for layout overrides.

## Hardcoded Text Risks
- **Frontend:** Most strings are wrapped in `t('string')`.
- **Backend:** Blade templates and controllers use `__('string')`.
- **Risk Areas:** Dynamically generated messages in the `WorkflowEngine` or internal service logging might bypass i18n.

## Module Coverage
- **100%:** All 28 modules have `Resources/lang` directories.
- **Dependency:** Some newer package features might only have `en.json` or `ar.json` available.
