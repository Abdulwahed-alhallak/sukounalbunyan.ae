@php
$lang = $page['props']['auth']['lang'] ?? substr(app()->getLocale(), 0, 2);
$dir = in_array(substr($lang, 0, 2), ['ar', 'he', 'fa', 'ur']) ? 'rtl' : 'ltr';
$isViteHot = file_exists(public_path('hot'));
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $lang) }}" dir="{{ $dir }}" class="{{ ($page['props']['adminAllSetting']['themeMode'] ?? $page['props']['companyAllSetting']['themeMode'] ?? 'light') === 'dark' ? 'dark' : 'light' }} {{ $dir === 'rtl' ? 'rtl' : '' }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="vite-hot" content="{{ $isViteHot ? 'true' : 'false' }}">

    <title inertia>{{ config('app.name', 'Sukoun Albunyan') }}</title>

    <!-- Progressive Web App (PWA) Tags -->
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <meta name="theme-color" content="#09090b">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Noble ERP">
    <link rel="apple-touch-icon" href="{{ asset('favicon.ico') }}">

    <!-- Fonts: Geist (Vercel) + IBM Plex Sans Arabic (Arabic) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
    <script src="{{ asset('js/jquery.min.js') }}"></script>

    <!-- Scripts -->
    @routes
    <script>
        // @ts-nocheck
        // @ts-ignore
        window.auth = JSON.parse(String.raw`{!! json_encode($page['props']['auth'] ?? null) !!}`);

        // Set theme immediately to prevent flash
        (function() {
            const themeMode = String.raw`{!! $page['props']['adminAllSetting']['themeMode'] ?? $page['props']['companyAllSetting']['themeMode'] ?? 'light' !!}`;
            const root = document.documentElement;
            if (themeMode === 'dark') {
                root.classList.add('dark');
                root.classList.remove('light');
            } else {
                root.classList.add('light');
                root.classList.remove('dark');
            }
        })();

        // Register Service Worker for PWA only when Vite HMR is not active.
        // When `public/hot` exists, Laravel will emit localhost Vite assets and the PWA
        // service worker must be disabled/unregistered to avoid intercepting HMR requests.
        window.__NOBLE_VITE_HOT__ = document.querySelector('meta[name="vite-hot"]')?.content === 'true';

        async function clearNoblePwaArtifacts() {
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(
                    registrations
                    .filter((registration) => registration.scope.startsWith(window.location.origin))
                    .map((registration) => registration.unregister())
                );
            }

            if ('caches' in window) {
                const cacheKeys = await caches.keys();
                await Promise.all(
                    cacheKeys
                    .filter((key) => key.startsWith('noble-pwa-cache-'))
                    .map((key) => caches.delete(key))
                );
            }
        }

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                if (window.__NOBLE_VITE_HOT__) {
                    clearNoblePwaArtifacts().catch(() => {});
                    console.log('PWA ServiceWorker disabled while Vite HMR is active.');
                    return;
                }

                // Forceful cleanup of any non-v18 workers to prevent boot loops and old syntax errors
                setTimeout(async function() {
                    try {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (let reg of registrations) {
                            const swUrl = reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL;
                            if (swUrl && !swUrl.endsWith('/sw-v18.js')) {
                                console.log('PWA: Purging legacy ServiceWorker:', swUrl);
                                await reg.unregister();
                            }
                        }

                        const registration = await navigator.serviceWorker.register('/sw-v18.js', {
                            updateViaCache: 'none',
                            scope: '/'
                        });
                        console.log('PWA ServiceWorker v18 registration successful with scope: ', registration.scope);
                    } catch (err) {
                        console.log('PWA ServiceWorker registration failed: ', err);
                    }
                }, 2000);
            });
        }
    </script>
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased {{ ($page['props']['adminAllSetting']['themeMode'] ?? $page['props']['companyAllSetting']['themeMode'] ?? 'light') === 'dark' ? 'dark' : 'light' }}" style="font-family: 'Inter', 'IBM Plex Sans Arabic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div class="grain-overlay"></div>
    @inertia
</body>

</html>