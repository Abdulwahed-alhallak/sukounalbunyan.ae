import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeroProps {
    settings?: any;
}

export default function Hero({ settings }: HeroProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.hero || {};
    
    const title = sectionData.title || 'Transform Your Business withNobleArchitecture';
    const subtitle = sectionData.subtitle || 'The complete all-in-one business management solution that combines ERP, Accounting, CRM, POS, HRM, and Project Management into a single powerful platform.';
    const primaryButtonText = sectionData.primary_button_text || 'Start Free Trial';
    const primaryButtonLink = sectionData.primary_button_link || route('register');
    const secondaryButtonText = sectionData.secondary_button_text || 'Request Demo';
    const secondaryButtonLink = sectionData.secondary_button_link || route('login');

    return (
        <section className="relative overflow-hidden bg-black text-white py-32 md:py-48 flex items-center justify-center">
            {/* Background Vercel glow effect */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 blur-[120px] rounded-full bg-gradient-to-r from-neutral-800 to-neutral-600 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
                
                {/* Tech Badge */}
                <div className="mb-8 inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-1.5 text-sm font-medium text-neutral-300 backdrop-blur-md">
                    <span className="flex h-2 w-2 rounded-full bg-white mr-2 animate-pulse"></span>
                    MeetNobleArchitecture System
                </div>

                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
                    {title}
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed tracking-tight mb-12">
                    {subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                    <button 
                        className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-white text-black font-medium text-lg flex items-center justify-center hover:bg-neutral-200 transition-colors"
                        onClick={() => window.location.href = primaryButtonLink}
                    >
                        {primaryButtonText}
                    </button>
                    <button 
                        className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-transparent border border-neutral-800 text-white font-medium text-lg hover:bg-neutral-900 hover:border-neutral-700 transition-all flex items-center justify-center tracking-tight"
                        onClick={() => window.location.href = secondaryButtonLink}
                    >
                        {secondaryButtonText}
                        <ArrowRight className="ml-2 h-5 w-5 opacity-70" />
                    </button>
                </div>

            </div>
            
            {/* Minimalist Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </section>
    );
}

