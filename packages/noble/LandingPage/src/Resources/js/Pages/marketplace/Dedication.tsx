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

export default function MarketplaceDedication({ settings, title: propTitle, description: propDescription, subSections: propSubSections }: DedicationProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.dedication || {};
    
    const title = propTitle || sectionData.title || 'Dedicated to Excellence';
    const description = propDescription || sectionData.description || 'Our premium packages are crafted with meticulous attention to detail, ensuring seamless integration and powerful functionality.';
    
    const subSections = propSubSections?.length > 0 ? propSubSections : sectionData.subSections?.length > 0 ? sectionData.subSections : [];

    return (
        <section className="bg-black py-24 md:py-32 border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="space-y-32">
                    {subSections?.map((section: any, index: number) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={index} className="flex flex-col lg:flex-row gap-20 items-center">
                                <div className={`lg:w-1/2 ${!isEven ? 'lg:order-2' : ''}`}>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                                        {section.title}
                                    </h3>
                                    <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
                                        {section.description}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {section.keyPoints?.map((point: string, pointIndex: number) => (
                                            <div key={pointIndex} className="flex items-center text-white font-medium">
                                                <div className="w-2 h-2 rounded-full bg-neutral-500 mr-3"></div>
                                                {point}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`lg:w-1/2 ${!isEven ? 'lg:order-1' : ''}`}>
                                    <div className="relative aspect-video rounded-3xl border border-neutral-800 bg-neutral-900/40 overflow-hidden group">
                                         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                         <div className="flex items-center justify-center h-full text-neutral-700 font-black text-4xl uppercase tracking-widest p-12 text-center select-none">
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