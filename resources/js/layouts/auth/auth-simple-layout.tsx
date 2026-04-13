import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useBrand } from '@/contexts/brand-context';
import { useFavicon } from '@/hooks/use-favicon';
import { getImagePath } from '@/utils/helpers';
import { useTheme } from 'next-themes';
import { ApplicationLogo } from '@/components/application-logo';
import CookieConsent from '@/components/cookie-consent';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/theme-toggle';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { settings } = useBrand();
    const { adminAllSetting } = usePage().props as any;
    useFavicon();
    const { resolvedTheme } = useTheme();
    const { t } = useTranslation();

    const isDark =
        settings.themeMode === 'dark' ||
        (settings.themeMode === 'system' && resolvedTheme === 'dark') ||
        (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
    const logoSrc = isDark ? settings.logo_light || settings.logo_dark : settings.logo_dark || settings.logo_light;
    const alwaysLightLogoSrc = settings.logo_light || settings.logo_dark;

    return (
        <div
            className={`flex min-h-screen bg-background font-sans text-foreground ${settings.layoutDirection === 'rtl' ? 'rtl' : ''}`}
            dir={settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr'}
        >
            {/* Left Side — Vercel-Style Dark Branding Panel */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0a0a0a] lg:flex lg:w-1/2">
                {/* Premium Background Pattern */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div className="vercel-dots absolute inset-0 opacity-[0.25] dark:opacity-[0.4]" />
                    <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                </div>

                {/* Left Content */}
                <div
                    className="relative z-20 flex h-full w-full flex-col items-start justify-between p-12 text-start lg:px-16 lg:py-14"
                    dir="auto"
                >
                    <div className="flex w-full items-center justify-between">
                        <Link href={route('dashboard')} className="relative z-50 inline-block">
                            <div className="flex items-center gap-2">
                                <ApplicationLogo className="h-8 w-auto text-primary-foreground" />
                                <span className="font-semibold tracking-tight text-background">Noble Architecture</span>
                            </div>
                        </Link>
                    </div>

                    <div className="my-auto w-full max-w-xl">
                        <h2 className="mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-background lg:text-[44px]">
                            {t('The ultimate workspace for your business.')}
                        </h2>

                        <p className="mb-12 max-w-lg text-[16px] font-normal leading-relaxed text-neutral-400">
                            {t('Manage projects, accounting, HR, CRM, and more in one unified ecosystem.')}
                        </p>

                        {/* Feature List — Premium Geist Style */}
                        <div className="space-y-6">
                            <div className="group flex items-center gap-4 duration-700 animate-in fade-in slide-in-from-left-4 [animation-fill-mode:backwards]">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/20">
                                    <svg
                                        className="h-5 w-5 text-neutral-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-semibold tracking-tight text-white">
                                        {t('Unified modular architecture')}
                                    </h4>
                                    <p className="text-[13px] font-medium leading-relaxed text-neutral-500">
                                        {t('Seamless integration across all modules')}
                                    </p>
                                </div>
                            </div>
                            <div className="group flex items-center gap-4 duration-700 animate-in fade-in slide-in-from-left-4 [animation-delay:100ms] [animation-fill-mode:backwards]">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/20">
                                    <svg
                                        className="h-5 w-5 text-neutral-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-semibold tracking-tight text-white">
                                        {t('Real-time comprehensive reporting')}
                                    </h4>
                                    <p className="text-[13px] font-medium leading-relaxed text-neutral-500">
                                        {t('Advanced analytics & insights')}
                                    </p>
                                </div>
                            </div>
                            <div className="group flex items-center gap-4 duration-700 animate-in fade-in slide-in-from-left-4 [animation-delay:200ms] [animation-fill-mode:backwards]">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/20">
                                    <svg
                                        className="h-5 w-5 text-neutral-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-semibold tracking-tight text-white">
                                        {t('Multi-company & multi-currency')}
                                    </h4>
                                    <p className="text-[13px] font-medium leading-relaxed text-neutral-500">
                                        {t('Global reach with localized precision')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full items-center gap-3 pb-2 text-[13px] font-medium text-neutral-600">
                        <p>
                            {t('Copyright')} © {new Date().getFullYear()} Noble Architecture SaaS
                        </p>
                        <span className="opacity-30">·</span>
                        <a href="#" className="transition-colors hover:text-neutral-400">
                            {t('Privacy')}
                        </a>
                        <span className="opacity-30">·</span>
                        <a href="#" className="transition-colors hover:text-neutral-400">
                            {t('Terms')}
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Side — Form Container */}
            <div
                className="relative z-10 flex min-h-screen w-full flex-col justify-center border-s border-border bg-background text-start lg:w-1/2"
                dir="auto"
            >
                {/* Top Controls */}
                <div className="absolute left-0 right-0 top-0 z-20 flex w-full items-center justify-between p-6">
                    <div className="lg:hidden">
                        <Link href={route('dashboard')}>
                            <div className="flex items-center gap-2">
                                <ApplicationLogo className="h-7 w-auto text-primary" />
                                <span className="font-semibold tracking-tight text-foreground">Noble Architecture</span>
                            </div>
                        </Link>
                    </div>
                    <div className="ms-auto flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </div>
                </div>

                {/* Form Card Area */}
                <div className="relative z-20 mx-auto w-full max-w-[420px] px-6 py-12 sm:px-10 lg:py-0">
                    <div className="mb-8 mt-8 text-start lg:mt-0">
                        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                        <p className="text-[14px] font-normal leading-relaxed text-muted-foreground">{description}</p>
                    </div>

                    <div className="bg-transparent text-start">{children}</div>

                    {/* Mobile Footer */}
                    <div className="mt-10 text-center text-[13px] font-medium text-muted-foreground lg:hidden">
                        <p>
                            {t('Copyright')} © {new Date().getFullYear()} Noble Architecture SaaS
                        </p>
                        <div className="mt-2 flex justify-center gap-3">
                            <a href="#" className="transition-colors hover:text-foreground">
                                {t('Privacy')}
                            </a>
                            <span>·</span>
                            <a href="#" className="transition-colors hover:text-foreground">
                                {t('Terms')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <CookieConsent settings={adminAllSetting || {}} />
        </div>
    );
}
