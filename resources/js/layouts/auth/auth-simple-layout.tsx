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

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { settings, getPrimaryColor } = useBrand();
    const { adminAllSetting } = usePage().props as any;
    useFavicon();
    const { resolvedTheme } = useTheme();
    const { t } = useTranslation();
    
    const isDark = settings.themeMode === 'dark' || (settings.themeMode === 'system' && resolvedTheme === 'dark') || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
    const logoSrc = isDark ? (settings.logo_light || settings.logo_dark) : (settings.logo_dark || settings.logo_light);
    const alwaysLightLogoSrc = settings.logo_light || settings.logo_dark;
    
    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground" dir={settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr'}>

            {/* Left Side — Vercel-Style Dark Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden bg-[#0a0a0a]">
                
                {/* Premium Background Pattern */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 vercel-dots opacity-[0.25] dark:opacity-[0.4]" />
                    <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                </div>

                {/* Left Content */}
                <div className="relative z-20 p-12 lg:px-16 lg:py-14 flex flex-col h-full justify-between items-start text-start w-full" dir="auto">
                    <div className="flex items-center justify-between w-full">
                        <Link href={route('dashboard')} className="inline-block relative z-50">
                            <div className="flex items-center gap-2">
                                <ApplicationLogo className="h-8 w-auto text-primary-foreground" />
                                <span className="text-background font-semibold tracking-tight">Noble Architecture</span>
                            </div>
                        </Link>
                    </div>

                    <div className="max-w-xl my-auto w-full">
                        <h2 className="text-4xl lg:text-[44px] font-bold text-background mb-6 leading-[1.15] tracking-tight">
                            {t('The ultimate workspace for your business.')}
                        </h2>
                        
                        <p className="text-[16px] text-neutral-400 font-normal leading-relaxed max-w-lg mb-12">
                            {t('Manage projects, accounting, HR, CRM, and more in one unified ecosystem.')}
                        </p>

                        {/* Feature List — Premium Geist Style */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group animate-in fade-in slide-in-from-left-4 duration-700 [animation-fill-mode:backwards]">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                                    <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-semibold text-white tracking-tight">{t('Unified modular architecture')}</h4>
                                    <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">{t('Seamless integration across all modules')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group animate-in fade-in slide-in-from-left-4 duration-700 [animation-delay:100ms] [animation-fill-mode:backwards]">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                                    <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-semibold text-white tracking-tight">{t('Real-time comprehensive reporting')}</h4>
                                    <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">{t('Advanced analytics & insights')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group animate-in fade-in slide-in-from-left-4 duration-700 [animation-delay:200ms] [animation-fill-mode:backwards]">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                                    <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-semibold text-white tracking-tight">{t('Multi-company & multi-currency')}</h4>
                                    <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">{t('Global reach with localized precision')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[13px] text-neutral-600 font-medium pb-2 w-full">
                        <p>{t('Copyright')} © {new Date().getFullYear()} Noble Architecture SaaS</p>
                        <span className="opacity-30">·</span>
                        <a href="#" className="hover:text-neutral-400 transition-colors">{t('Privacy')}</a>
                        <span className="opacity-30">·</span>
                        <a href="#" className="hover:text-neutral-400 transition-colors">{t('Terms')}</a>
                    </div>
                </div>
            </div>

            {/* Right Side — Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col relative justify-center min-h-screen bg-background border-s border-border z-10 text-start" dir="auto">
                
                {/* Top Controls */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 w-full">
                    <div className="lg:hidden">
                        <Link href={route('dashboard')}>
                            <div className="flex items-center gap-2">
                                <ApplicationLogo className="h-7 w-auto text-primary" />
                                <span className="font-semibold text-foreground tracking-tight">Noble Architecture</span>
                            </div>
                        </Link>
                    </div>
                    <div className="ms-auto flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </div>
                </div>

                {/* Form Card Area */}
                <div className="w-full max-w-[420px] mx-auto px-6 sm:px-10 py-12 lg:py-0 relative z-20">
                    <div className="mb-8 mt-8 lg:mt-0 text-start">
                        <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                            {title}
                        </h1>
                        <p className="text-muted-foreground text-[14px] font-normal leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="bg-transparent text-start">
                        {children}
                    </div>

                    {/* Mobile Footer */}
                    <div className="lg:hidden mt-10 text-center text-[13px] text-muted-foreground font-medium">
                        <p>{t('Copyright')} © {new Date().getFullYear()} Noble Architecture SaaS</p>
                        <div className="mt-2 gap-3 flex justify-center">
                            <a href="#" className="hover:text-foreground transition-colors">{t('Privacy')}</a>
                            <span>·</span>
                            <a href="#" className="hover:text-foreground transition-colors">{t('Terms')}</a>
                        </div>
                    </div>
                </div>
            </div>

            <CookieConsent settings={adminAllSetting || {}} />
        </div>
    );
}
