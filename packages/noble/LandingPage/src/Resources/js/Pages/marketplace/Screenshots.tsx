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

export default function MarketplaceScreenshots({
    settings,
    title: propTitle,
    subtitle: propSubtitle,
    screenshots: propScreenshots,
}: ScreenshotsProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.screenshots || {};

    const title = propTitle || sectionData.title || 'Platform Vitals';
    const subtitle =
        propSubtitle ||
        sectionData.subtitle ||
        'A visual overview of theNobleArchitecture experience across multiple business vectors.';

    const defaultImages = [
        'packages/noble/LandingPage/src/Resources/assets/img/gallery1.jpeg',
        'packages/noble/LandingPage/src/Resources/assets/img/gallery2.jpeg',
        'packages/noble/LandingPage/src/Resources/assets/img/gallery3.jpeg',
    ];

    const images =
        propScreenshots?.filter((img: string) => img) ||
        sectionData.images?.filter((img: string) => img) ||
        defaultImages;
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    return (
        <section className="border-b border-neutral-800 bg-black py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-24 space-y-4 text-center">
                    <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">{title}</h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {images?.map((image: string, index: number) => (
                        <div
                            key={index}
                            className="group relative aspect-video cursor-pointer overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40"
                            onClick={() => setSelectedImage(index)}
                        >
                            <div className="absolute inset-0 flex select-none items-center justify-center p-8 text-center text-2xl font-black uppercase tracking-widest text-neutral-800 transition-colors group-hover:text-neutral-700">
                                {t('Preview')} {index + 1}
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center bg-white/0 opacity-0 transition-colors group-hover:bg-white/5 group-hover:opacity-100">
                                <Maximize2 className="h-10 w-10 text-white" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simple Lightbox */}
                {selectedImage !== null && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 duration-300 animate-in fade-in"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute end-10 top-10 text-white transition-colors hover:text-neutral-400">
                            <X className="h-10 w-10" />
                        </button>

                        <div className="text-64 flex aspect-video w-full max-w-6xl items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900 font-black uppercase tracking-[0.2em] text-neutral-800">
                            {t('Detailed Preview')} {selectedImage + 1}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
