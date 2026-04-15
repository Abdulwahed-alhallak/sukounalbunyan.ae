import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MarketplaceHeroProps {
    [key: string]: any;
    settings?: any;
    title?: string;
    subtitle?: string;
    primaryButton?: string;
    secondaryButton?: string;
}

export default function MarketplaceHero({
    settings,
    title: propTitle,
    subtitle: propSubtitle,
    primaryButton,
    secondaryButton,
}: MarketplaceHeroProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.hero || {};

    const title = propTitle || sectionData.title || 'Noble Architecture Marketplace';
    const subtitle =
        propSubtitle ||
        sectionData.subtitle ||
        'Extend your business capabilities with premium industrial-grade modules. Built for speed and multi-tenant scaling.';
    const primaryButtonText = primaryButton || sectionData.primary_button_text || 'Browse Bundles';
    const primaryButtonLink = sectionData.primary_button_link || '#packages';
    const secondaryButtonText = secondaryButton || sectionData.secondary_button_text || 'See All Modules';
    const secondaryButtonLink = sectionData.secondary_button_link || '#categories';

    return (
        <section className="relative overflow-hidden border-b border-neutral-800 bg-black pb-20 pt-32 md:pb-40 md:pt-48">
            {/* Subtle glow background */}
            <div className="pointer-events-none absolute start-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-white/5 blur-[120px]"></div>

            <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
                {/* Badge */}
                <div className="mb-10 inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5">
                    <span className="me-3 h-2 w-2 rounded-full bg-white"></span>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
                        Premium Addons Available
                    </span>
                </div>

                <h1 className="mb-10 text-6xl font-black leading-[0.85] tracking-tighter text-white md:text-9xl">
                    {title}
                </h1>

                <p className="mx-auto mb-14 max-w-3xl text-xl font-medium leading-relaxed text-neutral-400 md:text-2xl">
                    {subtitle}
                </p>

                <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <button
                        onClick={() => (window.location.href = primaryButtonLink)}
                        className="group flex w-full items-center justify-center rounded-full bg-white px-12 py-5 text-lg font-black text-black transition-all hover:bg-neutral-200 sm:w-auto"
                    >
                        {primaryButtonText}
                        <ArrowRight className="ms-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                        onClick={() => (window.location.href = secondaryButtonLink)}
                        className="w-full rounded-full border border-neutral-800 bg-transparent px-12 py-5 text-lg font-black text-white transition-all hover:bg-neutral-900 sm:w-auto"
                    >
                        {secondaryButtonText}
                    </button>
                </div>
            </div>
        </section>
    );
}
