import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
    settings?: any;
}

export default function Header({ settings }: HeaderProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.header || {};

    // AlwaysNobleArchitecture
    const companyName = 'Noble Architecture';
    const isAuthenticated = settings?.is_authenticated;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigationItems = sectionData.navigation_items || [];
    const customPages = settings?.custom_pages || [];
    const customPageItems = customPages?.map((page: any) => ({
        text: page.title,
        href: `/page/${page.slug}`,
        target: '_self',
    }));

    const allNavigationItems = [...navigationItems, ...customPageItems];

    const getSafeRoute = (name: string, params?: any, fallback: string = '/') => {
        try {
            // @ts-ignore
            if (typeof route !== 'undefined' && route().has(name)) {
                return route(name, params);
            }
            // Fallback for legacy or changed names
            if (name === 'landing.page' && typeof route !== 'undefined' && route().has('landing_page.index')) {
                return route('landing_page.index', params);
            }
        } catch (e) {
            console.warn(`Route ${name} not found, falling back to ${fallback}`);
        }
        return fallback;
    };

    const renderNavItems = (isMobile = false) => {
        return allNavigationItems?.map((item) => {
            const href = item.href?.startsWith('/page/')
                ? getSafeRoute('custom-page.show', item.href.replace('/page/', ''))
                : item.href;
            const classes = isMobile
                ? 'block px-4 py-3 text-base font-medium text-neutral-400 hover:text-white rounded-lg transition-colors'
                : 'text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors';

            return item.target === '_blank' ? (
                <a key={item.text} href={href} target="_blank" rel="noopener noreferrer" className={classes}>
                    {item.text}
                </a>
            ) : (
                <Link key={item.text} href={href} className={classes}>
                    {item.text}
                </Link>
            );
        });
    };

    const renderCTAButtons = (isMobile = false) => {
        const enableRegistration = settings?.enable_registration !== false;
        const btnClasses = isMobile ? 'w-full text-center mt-2' : 'ml-4';

        if (isAuthenticated) {
            return (
                <button
                    onClick={() => router.visit(getSafeRoute('dashboard'))}
                    className={`rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 ${btnClasses}`}
                >
                    {t('Dashboard')}
                </button>
            );
        }

        return (
            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-4'}`}>
                <button
                    onClick={() => router.visit(getSafeRoute('login'))}
                    className={`text-sm font-medium text-neutral-300 transition-colors hover:text-white ${isMobile ? 'py-2' : ''}`}
                >
                    {t('Log In')}
                </button>
                {enableRegistration && (
                    <button
                        onClick={() => router.visit(getSafeRoute('register'))}
                        className={`rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 ${isMobile ? 'w-full text-center' : ''}`}
                    >
                        {t('Sign Up')}
                    </button>
                )}
            </div>
        );
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 text-white backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center">
                        <Link
                            href={getSafeRoute('landing.page')}
                            className="flex items-center space-x-2 text-xl font-bold tracking-tighter text-white"
                        >
                            <svg
                                viewBox="0 0 76 65"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-auto fill-current text-white"
                            >
                                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"></path>
                            </svg>
                            <span>{companyName}</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-2 md:flex">
                        {renderNavItems()}
                        {sectionData?.enable_pricing_link !== false && (
                            <Link
                                href={getSafeRoute('pricing.page')}
                                className="px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
                            >
                                {t('Pricing')}
                            </Link>
                        )}
                    </div>

                    <div className="hidden items-center md:flex">{renderCTAButtons()}</div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            className="p-2 text-neutral-400 hover:text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-neutral-800 bg-black md:hidden">
                    <div className="space-y-1 px-4 pb-4 pt-2">
                        {renderNavItems(true)}
                        {sectionData?.enable_pricing_link !== false && (
                            <Link
                                href={getSafeRoute('pricing.page')}
                                className="block rounded-lg px-4 py-3 text-base font-medium text-neutral-400 transition-colors hover:text-white"
                            >
                                {t('Pricing')}
                            </Link>
                        )}
                        <div className="mt-2 border-t border-neutral-800 pt-4">{renderCTAButtons(true)}</div>
                    </div>
                </div>
            )}
        </nav>
    );
}
