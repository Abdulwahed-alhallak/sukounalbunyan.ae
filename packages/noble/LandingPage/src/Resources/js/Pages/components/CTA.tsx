import { ArrowRight } from 'lucide-react';

interface CTAProps {
    settings?: any;
}

export default function CTA({ settings }: CTAProps) {
    const sectionData = settings?.config_sections?.sections?.cta || {};

    const title = sectionData.title || 'Ready to Transform Your Business?';
    const subtitle =
        sectionData.subtitle ||
        'Join thousands of businesses already usingNobleArchitecture to streamline their operations.';
    const primaryButtonText = sectionData.primary_button || 'Start Free Trial';
    const primaryLink = sectionData.primary_button_link || route('register');
    const secondaryButtonText = sectionData.secondary_button || 'Contact Sales';
    const secondaryLink = sectionData.secondary_button_link || route('login');

    return (
        <section className="flex items-center justify-center border-b border-neutral-800 bg-black py-32">
            <div className="mx-auto w-full max-w-4xl px-6">
                <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/50 p-12 text-center backdrop-blur-sm md:p-20">
                    {/* Minimalist glow effect */}
                    <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-[80px]"></div>

                    <h2 className="relative z-10 mb-6 text-4xl font-extrabold tracking-tighter text-white md:text-5xl">
                        {title}
                    </h2>

                    <p className="relative z-10 mx-auto mb-10 max-w-2xl text-lg leading-relaxed tracking-tight text-neutral-400 md:text-xl">
                        {subtitle}
                    </p>

                    <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            href={primaryLink}
                            className="flex w-full items-center justify-center rounded-md bg-white px-8 py-3.5 text-lg font-medium text-black transition-colors hover:bg-neutral-200 sm:w-auto"
                        >
                            {primaryButtonText}
                        </a>
                        <a
                            href={secondaryLink}
                            className="flex w-full items-center justify-center rounded-md border border-neutral-700 bg-transparent px-8 py-3.5 text-lg font-medium text-white transition-colors hover:border-neutral-600 hover:bg-neutral-800 sm:w-auto"
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
