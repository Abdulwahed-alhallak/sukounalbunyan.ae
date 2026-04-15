import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from '@/components/cookie-consent';
import { useTranslation } from 'react-i18next';

interface MarketplaceNotFoundProps {
    [key: string]: any;
    landingPageSettings?: {
        company_name?: string;
        contact_email?: string;
        contact_phone?: string;
        contact_address?: string;
        config_sections?: {
            sections?: any;
            colors?: {
                primary: string;
                secondary: string;
                accent: string;
            };
        };
    };
}

export default function MarketplaceNotFound({ landingPageSettings }: MarketplaceNotFoundProps) {
    const { t } = useTranslation();
    const { adminAllSetting, auth } = usePage().props as any;
    const updatedLandingPageSettings = {
        ...landingPageSettings,
        is_authenticated: auth?.user?.id !== undefined && auth?.user?.id !== null,
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Head title="Package Not Found - Noble Architecture Marketplace" />

            <Header key="header" settings={updatedLandingPageSettings} />

            <section className="py-48 md:py-64">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <div className="mx-auto max-w-2xl space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-8xl font-black tracking-tighter text-neutral-800 md:text-9xl">404</h1>
                            <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">
                                {t('Package Not Found')}
                            </h2>
                        </div>

                        <p className="mx-auto max-w-lg text-xl leading-relaxed text-neutral-400">
                            {t(
                                "The package you're looking for doesn't exist or has been removed from our marketplace."
                            )}
                        </p>

                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center rounded-full bg-white px-12 py-4 text-lg font-black text-black transition-all hover:bg-neutral-200"
                        >
                            <ArrowLeft className="me-3 h-5 w-5" />
                            {t('Go Back')}
                        </button>
                    </div>
                </div>
            </section>

            <Footer key="footer" settings={updatedLandingPageSettings} />

            <CookieConsent settings={adminAllSetting || {}} />
        </div>
    );
}
