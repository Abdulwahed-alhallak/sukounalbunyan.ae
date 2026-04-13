import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MarketplaceHeroProps {
    settings?: any;
    title?: string;
    subtitle?: string;
    primaryButton?: string;
    secondaryButton?: string;
}

export default function MarketplaceHero({ settings, title: propTitle, subtitle: propSubtitle, primaryButton, secondaryButton }: MarketplaceHeroProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.hero || {};
    
    const title = propTitle || sectionData.title || 'Noble Architecture Marketplace';
    const subtitle = propSubtitle || sectionData.subtitle || 'Extend your business capabilities with premium industrial-grade modules. Built for speed and multi-tenant scaling.';
    const primaryButtonText = primaryButton || sectionData.primary_button_text || 'Browse Bundles';
    const primaryButtonLink = sectionData.primary_button_link || '#packages';
    const secondaryButtonText = secondaryButton || sectionData.secondary_button_text || 'See All Modules';
    const secondaryButtonLink = sectionData.secondary_button_link || '#categories';

    return (
        <section className="relative bg-black pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden border-b border-neutral-800">
            {/* Subtle glow background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 mb-10">
                    <span className="w-2 h-2 rounded-full bg-white mr-3"></span>
                    <span className="text-xs font-black tracking-[0.2em] uppercase text-neutral-400">Premium Addons Available</span>
                </div>

                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 text-white leading-[0.85]">
                    {title}
                </h1>
                
                <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-14 font-medium">
                    {subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button 
                        onClick={() => window.location.href = primaryButtonLink}
                        className="bg-white text-black px-12 py-5 rounded-full text-lg font-black hover:bg-neutral-200 transition-all w-full sm:w-auto flex items-center justify-center group"
                    >
                        {primaryButtonText}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                        onClick={() => window.location.href = secondaryButtonLink}
                        className="bg-transparent text-white border border-neutral-800 px-12 py-5 rounded-full text-lg font-black hover:bg-neutral-900 transition-all w-full sm:w-auto"
                    >
                        {secondaryButtonText}
                    </button>
                </div>
            </div>
        </section>
    );
}
