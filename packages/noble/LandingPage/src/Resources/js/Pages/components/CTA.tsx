import { ArrowRight } from 'lucide-react';

interface CTAProps {
    settings?: any;
}

export default function CTA({ settings }: CTAProps) {
    const sectionData = settings?.config_sections?.sections?.cta || {};
    
    const title = sectionData.title || 'Ready to Transform Your Business?';
    const subtitle = sectionData.subtitle || 'Join thousands of businesses already usingNobleArchitecture to streamline their operations.';
    const primaryButtonText = sectionData.primary_button || 'Start Free Trial';
    const primaryLink = sectionData.primary_button_link || route('register');
    const secondaryButtonText = sectionData.secondary_button || 'Contact Sales';
    const secondaryLink = sectionData.secondary_button_link || route('login');

    return (
        <section className="bg-black py-32 border-b border-neutral-800 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 w-full">
                <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-12 md:p-20 text-center relative overflow-hidden backdrop-blur-sm">
                    {/* Minimalist glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-6 relative z-10">
                        {title}
                    </h2>
                    
                    <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed relative z-10 tracking-tight">
                        {subtitle}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <a 
                            href={primaryLink}
                            className="bg-white text-black px-8 py-3.5 rounded-md font-medium text-lg flex items-center justify-center w-full sm:w-auto hover:bg-neutral-200 transition-colors"
                        >
                            {primaryButtonText}
                        </a>
                        <a 
                            href={secondaryLink}
                            className="bg-transparent text-white border border-neutral-700 px-8 py-3.5 rounded-md font-medium text-lg flex items-center justify-center w-full sm:w-auto hover:bg-neutral-800 hover:border-neutral-600 transition-colors"
                        >
                            {secondaryButtonText}
                            <ArrowRight className="ml-2 h-5 w-5 opacity-70" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

