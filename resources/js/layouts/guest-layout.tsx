import { ApplicationLogo } from '@/components/application-logo';
import { Link, usePage, Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import CookieConsent from '@/components/cookie-consent';
import { BrandProvider, useBrand } from '@/contexts/brand-context';
import { useTheme } from 'next-themes';
import { useFavicon } from '@/hooks/use-favicon';
import { useFlashMessages } from '@/hooks/useFlashMessages';

function GuestContent({ children }: PropsWithChildren) {
    const { companyAllSetting, adminAllSetting } = usePage().props as any;
    const { settings, getPreviewUrl } = useBrand();
    const { resolvedTheme } = useTheme();
    useFavicon();
    useFlashMessages();

    return (
        <>
            <Head>
                {companyAllSetting?.metaKeywords && <meta name="keywords" content={companyAllSetting.metaKeywords} />}
                {companyAllSetting?.metaDescription && (
                    <meta name="description" content={companyAllSetting.metaDescription} />
                )}
                {companyAllSetting?.metaImage && <meta property="og:image" content={companyAllSetting.metaImage} />}
            </Head>
            <div className="vercel-dots flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0">
                {/* Logo */}
                <div className="mb-6">
                    <Link href="/">
                        {(() => {
                            const isDark =
                                settings.themeMode === 'dark' ||
                                (settings.themeMode === 'system' && resolvedTheme === 'dark') ||
                                (typeof document !== 'undefined' &&
                                    document.documentElement.classList.contains('dark'));
                            const currentLogo = isDark ? settings.logo_light : settings.logo_dark;
                            const displayUrl = currentLogo ? getPreviewUrl(currentLogo) : '';

                            return displayUrl ? (
                                <img
                                    src={displayUrl}
                                    alt="Logo"
                                    className="h-10 w-auto max-w-[160px] transition-all duration-150"
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-sm bg-foreground" />
                                    <span className="text-lg font-semibold tracking-tight text-foreground">
                                        Sukoun Albunyan
                                    </span>
                                </div>
                            );
                        })()}
                    </Link>
                </div>

                {/* Auth Card */}
                <div className="vercel-card w-full px-6 py-8 sm:max-w-xl">{children}</div>

                {/* Footer */}
                <p className="mt-8 text-[13px] text-muted-foreground">
                    © {new Date().getFullYear()} Sukoun Albunyan
                </p>

                <CookieConsent settings={adminAllSetting || {}} />
            </div>
        </>
    );
}

export default function Guest(props: PropsWithChildren) {
    return (
        <BrandProvider>
            <GuestContent {...props} />
        </BrandProvider>
    );
}
