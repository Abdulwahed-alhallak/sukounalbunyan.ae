import ApplicationLogo from "@/components/application-logo";
import { Link, usePage, Head } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import CookieConsent from "@/components/cookie-consent";
import { BrandProvider, useBrand } from "@/contexts/brand-context";
import { useTheme } from "next-themes";
import { useFavicon } from "@/hooks/use-favicon";
import { useFlashMessages } from "@/hooks/useFlashMessages";

function GuestContent({ children }: PropsWithChildren) {
    const { companyAllSetting, adminAllSetting } = usePage().props as any;
    const { settings, getPreviewUrl } = useBrand();
    const { resolvedTheme } = useTheme();
    useFavicon();
    useFlashMessages();
    
    return (
        <>
        <Head>
            {companyAllSetting?.metaKeywords && (
                <meta name="keywords" content={companyAllSetting.metaKeywords} />
            )}
            {companyAllSetting?.metaDescription && (
                <meta name="description" content={companyAllSetting.metaDescription} />
            )}
            {companyAllSetting?.metaImage && (
                <meta property="og:image" content={companyAllSetting.metaImage} />
            )}
        </Head>
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background vercel-dots">
            {/* Logo */}
            <div className="mb-6">
                <Link href="/">
                    {(() => {
                        const isDark = settings.themeMode === 'dark' || (settings.themeMode === 'system' && resolvedTheme === 'dark') || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
                        const currentLogo = isDark ? settings.logo_light : settings.logo_dark;
                        const displayUrl = currentLogo ? getPreviewUrl(currentLogo) : '';

                        return displayUrl ? (
                            <img
                                src={displayUrl}
                                alt="Logo"
                                className="w-auto h-10 max-w-[160px] transition-all duration-150"
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-foreground rounded-sm" />
                                <span className="text-lg font-semibold text-foreground tracking-tight">DionONE</span>
                            </div>
                        );
                    })()}
                </Link>
            </div>

            {/* Auth Card */}
            <div className="w-full sm:max-w-md px-6 py-8 bg-card border border-border rounded-lg shadow-sm">
                {children}
            </div>

            {/* Footer */}
            <p className="mt-8 text-[13px] text-muted-foreground">
                © {new Date().getFullYear()} DionONE
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
