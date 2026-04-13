import { Head, usePage } from '@inertiajs/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieConsent from "@/components/cookie-consent";

interface CustomPage {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_title: string;
    meta_description: string;
    is_active: boolean;
}

interface LandingPageSettings {
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
}

interface ShowProps {
    page: CustomPage;
    landingPageSettings?: LandingPageSettings;
}

export default function Show({ page, landingPageSettings }: ShowProps) {
    const { adminAllSetting, auth } = usePage().props as any;
    const updatedLandingPageSettings = { ...landingPageSettings, is_authenticated: (auth?.user?.id !== undefined && auth?.user?.id !== null) };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Head 
                title={page.meta_title || page.title}
                description={page.meta_description}
            />
            
            <Header key="header" settings={updatedLandingPageSettings} />
            
            <main className="py-24 md:py-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                            {page.title}
                        </h1>
                        <div className="h-1 w-20 bg-neutral-800 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="prose prose-invert prose-neutral max-w-none">
                        <div 
                            dangerouslySetInnerHTML={{ __html: page.content }}
                            className="text-neutral-300 leading-relaxed text-lg"
                        />
                    </div>
                </div>
            </main>
            
            <Footer key="footer" settings={updatedLandingPageSettings} />

            <CookieConsent settings={adminAllSetting || {}} />
        </div>
    );
}