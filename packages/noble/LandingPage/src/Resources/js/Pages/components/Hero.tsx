import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeroProps {
    settings?: any;
}

export default function Hero({ settings }: HeroProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.hero || {};

    const title = sectionData.title || 'Transform Your Business withNobleArchitecture';
    const subtitle =
        sectionData.subtitle ||
        'The complete all-in-one business management solution that combines ERP, Accounting, CRM, POS, HRM, and Project Management into a single powerful platform.';
    const primaryButtonText = sectionData.primary_button_text || 'Start Free Trial';
    const primaryButtonLink = sectionData.primary_button_link || route('register');
    const secondaryButtonText = sectionData.secondary_button_text || 'Request Demo';
    const secondaryButtonLink = sectionData.secondary_button_link || route('login');

    return (
        <section className="relative flex items-center justify-center overflow-hidden bg-black py-32 text-white md:py-48">
            {/* Background Vercel glow effect */}
            <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-neutral-800 to-neutral-600 opacity-30 blur-[120px]"></div>

            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
                {/* Tech Badge */}
                <div className="mb-8 inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-1.5 text-sm font-medium text-neutral-300 backdrop-blur-md">
                    <span className="me-2 flex h-2 w-2 animate-pulse rounded-full bg-white"></span>
                    MeetNobleArchitecture System
                </div>

                <h1 className="mb-8 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-5xl font-extrabold tracking-tighter text-transparent sm:text-7xl lg:text-8xl">
                    {title}
                </h1>

                <p className="mb-12 max-w-3xl text-lg leading-relaxed tracking-tight text-neutral-400 sm:text-xl md:text-2xl">
                    {subtitle}
                </p>

                <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
                    <button
                        className="flex w-full items-center justify-center rounded-md bg-white px-8 py-3.5 text-lg font-medium text-black transition-colors hover:bg-neutral-200 sm:w-auto"
                        onClick={() => (window.location.href = primaryButtonLink)}
                    >
                        {primaryButtonText}
                    </button>
                    <button
                        className="flex w-full items-center justify-center rounded-md border border-neutral-800 bg-transparent px-8 py-3.5 text-lg font-medium tracking-tight text-white transition-all hover:border-neutral-700 hover:bg-neutral-900 sm:w-auto"
                        onClick={() => (window.location.href = secondaryButtonLink)}
                    >
                        {secondaryButtonText}
                        <ArrowRight className="ms-2 h-5 w-5 opacity-70" />
                    </button>
                </div>
            </div>

            {/* Minimalist Grid Pattern */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </section>
    );
}
