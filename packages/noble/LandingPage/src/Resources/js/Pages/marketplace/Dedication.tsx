import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DedicationProps {
    settings?: any;
    title?: string;
    description?: string;
    subSections?: Array<{
        title: string;
        description: string;
        keyPoints: string[];
        screenshot: string;
    }>;
}

export default function MarketplaceDedication({
    settings,
    title: propTitle,
    description: propDescription,
    subSections: propSubSections,
}: DedicationProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.dedication || {};

    const title = propTitle || sectionData.title || 'Dedicated to Excellence';
    const description =
        propDescription ||
        sectionData.description ||
        'Our premium packages are crafted with meticulous attention to detail, ensuring seamless integration and powerful functionality.';

    const subSections =
        propSubSections?.length > 0
            ? propSubSections
            : sectionData.subSections?.length > 0
              ? sectionData.subSections
              : [];

    return (
        <section className="border-b border-neutral-800 bg-black py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-24 space-y-4 text-center">
                    <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">{title}</h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">
                        {description}
                    </p>
                </div>

                <div className="space-y-32">
                    {subSections?.map((section: any, index: number) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={index} className="flex flex-col items-center gap-20 lg:flex-row">
                                <div className={`lg:w-1/2 ${!isEven ? 'lg:order-2' : ''}`}>
                                    <h3 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl">
                                        {section.title}
                                    </h3>
                                    <p className="mb-8 text-xl leading-relaxed text-neutral-400">
                                        {section.description}
                                    </p>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {section.keyPoints?.map((point: string, pointIndex: number) => (
                                            <div key={pointIndex} className="flex items-center font-medium text-white">
                                                <div className="me-3 h-2 w-2 rounded-full bg-neutral-500"></div>
                                                {point}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`lg:w-1/2 ${!isEven ? 'lg:order-1' : ''}`}>
                                    <div className="group relative aspect-video overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                        <div className="flex h-full select-none items-center justify-center p-12 text-center text-4xl font-black uppercase tracking-widest text-neutral-700">
                                            {section.title} Preview
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
