@php
    $lang = $page['props']['auth']['lang'] ?? substr(app()->getLocale(), 0, 2);
    $dir = in_array(substr($lang, 0, 2), ['ar', 'he', 'fa', 'ur']) ? 'rtl' : 'ltr';
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $lang) }}" dir="{{ $dir }}" class="{{ ($page['props']['adminAllSetting']['themeMode'] ?? $page['props']['companyAllSetting']['themeMode'] ?? 'light') === 'dark' ? 'dark' : 'light' }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Noble Architecture') }}</title>

        <!-- Fonts: Geist (Vercel) + IBM Plex Sans Arabic (Arabic) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/style.min.css">
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
        </script>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased {{ ($page['props']['adminAllSetting']['themeMode'] ?? $page['props']['companyAllSetting']['themeMode'] ?? 'light') === 'dark' ? 'dark' : 'light' }}" style="font-family: 'Geist Sans', 'IBM Plex Sans Arabic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div class="grain-overlay"></div>
        @inertia
    </body>
</html>

