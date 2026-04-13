import { useState } from 'react';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { Maximize2, X } from 'lucide-react';

interface ScreenshotsProps {
    settings?: any;
    title?: string;
    subtitle?: string;
    screenshots?: string[];
}

export default function MarketplaceScreenshots({ settings, title: propTitle, subtitle: propSubtitle, screenshots: propScreenshots }: ScreenshotsProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.screenshots || {};
    
    const title = propTitle || sectionData.title || 'Platform Vitals';
    const subtitle = propSubtitle || sectionData.subtitle || 'A visual overview of theNobleArchitecture experience across multiple business vectors.';
    
    const defaultImages = [
        'packages/noble/LandingPage/src/Resources/assets/img/gallery1.jpeg',
        'packages/noble/LandingPage/src/Resources/assets/img/gallery2.jpeg',
        'packages/noble/LandingPage/src/Resources/assets/img/gallery3.jpeg'
    ];
    
    const images = propScreenshots?.filter((img: string) => img) || sectionData.images?.filter((img: string) => img) || defaultImages;
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    return (
        <section className="bg-black py-24 md:py-32 border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {images?.map((image: string, index: number) => (
                        <div 
                            key={index}
                            className="group relative aspect-video rounded-3xl border border-neutral-800 bg-neutral-900/40 overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(index)}
                        >
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-800 font-black text-2xl uppercase tracking-widest p-8 text-center select-none group-hover:text-neutral-700 transition-colors">
                                {t('Preview')} {index + 1}
                            </div>
                            
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Maximize2 className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simple Lightbox */}
                {selectedImage !== null && (
                    <div 
                        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-10 right-10 text-white hover:text-neutral-400 transition-colors">
                            <X className="w-10 h-10" />
                        </button>
                        
                        <div className="max-w-6xl w-full aspect-video rounded-3xl border border-neutral-800 bg-neutral-900 flex items-center justify-center text-64 font-black text-neutral-800 uppercase tracking-[0.2em]">
                             {t('Detailed Preview')} {selectedImage + 1}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}


