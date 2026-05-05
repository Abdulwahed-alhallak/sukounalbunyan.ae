import './bootstrap';
import '../css/app.css';
import '../css/rtl.css';
import './i18n';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { Suspense } from 'react';
import axios from 'axios';
import { SukounLoader } from '@/components/SukounLoader';

// Silent CSRF token refresh
const refreshToken = async () => {
    try {
        const url = new URL(window.location.href);
        url.searchParams.set('refresh_token', 'true');
        url.searchParams.set('t', Date.now().toString());

        const response = await fetch(url.toString(), { method: 'GET' });
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newToken = doc.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (newToken) {
            document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', newToken);
            axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
        }
    } catch (e) {}
};

router.on('before', (event) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
        refreshToken();
    }
});

router.on('error', async (event) => {
    const errors = event.detail.errors;
    if (errors && (errors[419] || errors['419'] || Object.values(errors).some((e) => String(e).includes('419')))) {
        await refreshToken();
    }
});

// Auto-switch RTL / LTR layout based on persistent language
router.on('navigate', (event) => {
    // Priority: 1. LocalStorage (User choice), 2. Server Prop (DB Preference), 3. Browser/Fallback
    const serverLang = (event.detail.page.props.auth as any)?.lang;
    const currentLang = localStorage.getItem('i18nextLng') || serverLang || 'ar';
    const isRtl = ['ar', 'he', 'fa', 'ur', 'ku'].includes(currentLang.split('-')[0]);

    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    // Add RTL class for specialized CSS selector hooks
    if (isRtl) {
        document.documentElement.classList.add('rtl');
    } else {
        document.documentElement.classList.remove('rtl');
    }
});

// Global fetch interceptor
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    const [url, options] = args;

    // Ensure fresh token before request
    if (options && options.method && options.method !== 'GET') {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!token) {
            await refreshToken();
        }
        // Update token in headers
        const newToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (newToken && options.headers) {
            (options.headers as any)['X-CSRF-TOKEN'] = newToken;
        }
    }

    const response = await originalFetch(...args);

    // Fallback: retry on 419 error
    if (response.status === 419) {
        await refreshToken();
        if (options && options.headers) {
            const newToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (newToken) {
                (options.headers as any)['X-CSRF-TOKEN'] = newToken;
            }
        }
        return originalFetch(...args);
    }
    return response;
};

createInertiaApp({
    title: (title) => {
        const initialPage = JSON.parse(document.getElementById('app')?.dataset.page || '{}');
        const pageProps = initialPage?.props ?? {};
        let customTitle;
        if (pageProps?.auth?.user?.type === 'superadmin') {
            customTitle = pageProps?.adminAllSetting?.titleText;
        } else if (pageProps?.auth?.user?.type) {
            customTitle = pageProps?.companyAllSetting?.titleText;
        } else {
            customTitle = pageProps?.adminAllSetting?.titleText;
        }
        const appName = customTitle || import.meta.env.VITE_APP_NAME || 'Sukoun Albunyan';
        return `${title} - ${appName}`;
    },
    resolve: (name) => {
        const allPages = {
            ...import.meta.glob('./pages/**/*.tsx'),
            ...import.meta.glob('../../packages/noble/*/src/Resources/js/Pages/**/*.tsx'),
        };

        // Try pages directory (lowercase p)
        const lowerPagePath = `./pages/${name}.tsx`;
        if (allPages[lowerPagePath]) {
            return allPages[lowerPagePath]();
        }

        // Try package pages
        const [packageName, ...pagePath] = name.split('/');
        const packagePagePath = `../../packages/noble/${packageName}/src/Resources/js/Pages/${pagePath.join('/')}.tsx`;
        if (allPages[packagePagePath]) {
            return allPages[packagePagePath]();
        }

        throw new Error(`Page not found: ${name}`);
    },
    setup({ el, App, props }) {
        // Make props globally available
        (window as any).page = props;
        const root = createRoot(el);

        root.render(
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
                <Suspense fallback={<SukounLoader />}>
                    <App {...props} />
                </Suspense>
                <Toaster position="top-center" richColors dir="auto" />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#0070F3',
    },
});
