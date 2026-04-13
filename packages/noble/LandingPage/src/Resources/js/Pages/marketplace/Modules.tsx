import AddonCard from '../components/AddonCard';
import { router } from '@inertiajs/react';

interface ModulesProps {
    settings?: any;
    packages?: Array<{
        id: number;
        name: string;
        package_name: string;
        description: string;
        price: string;
        yearly_price?: string;
        image?: string;
        monthly_price?: number;
    }>;
    title?: string;
    subtitle?: string;
}

export default function MarketplaceModules({ settings, packages, title: propTitle, subtitle: propSubtitle }: ModulesProps) {
    const sectionData = settings?.config_sections?.sections?.modules || {};
    
    const title = propTitle || sectionData.title || 'Premium Packages';
    const subtitle = propSubtitle || sectionData.subtitle || 'Discover powerful extensions meticulously built for theNobleArchitecture ecosystem.';
    const colors = { primary: 'var(--color-primary)', secondary: 'var(--color-secondary)', accent: 'var(--color-accent)' };

    return (
        <section className="bg-black py-24 md:py-32" id="packages">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                    {packages?.map((addon) => (
                        <AddonCard
                            key={addon.id}
                            addon={addon as any}
                            colors={colors}
                            onViewDetails={() => {
                                router.visit(route('marketplace', { slug: addon.package_name || addon.slug }));
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

