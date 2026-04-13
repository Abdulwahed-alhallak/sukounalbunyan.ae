import { Shield, Zap, Headphones, Check } from 'lucide-react';

interface WhyChooseProps {
    settings?: any;
    title?: string;
    subtitle?: string;
    benefits?: Array<{
        title: string;
        description: string;
        icon: string;
        color: string;
    }>;
}

export default function MarketplaceWhyChoose({
    settings,
    title: propTitle,
    subtitle: propSubtitle,
    benefits: propBenefits,
}: WhyChooseProps) {
    const sectionData = settings?.config_sections?.sections?.why_choose || {};

    const title = propTitle || sectionData.title || 'Engineered for Performance';
    const subtitle =
        propSubtitle ||
        sectionData.subtitle ||
        'Every module in our marketplace is built with the highest standards of security, speed, and scalability.';

    const defaultBenefits = [
        {
            title: 'Industrial Grade Security',
            description: 'Multi-tenant isolation and enterprise-level encryption at every layer.',
            icon: 'Shield',
        },
        {
            title: 'Sub-millisecond Latency',
            description: 'Optimized internal routing ensures your business modules run at the speed of thought.',
            icon: 'Zap',
        },
        {
            title: 'Global Infrastructure',
            description: 'Deploy your modules across our worldwide network with a single click.',
            icon: 'Headphones',
        },
    ];

    const benefits =
        propBenefits?.length > 0
            ? propBenefits
            : sectionData.benefits?.length > 0
              ? sectionData.benefits
              : defaultBenefits;

    const getIcon = (iconName: string) => {
        const icons = { Shield, Zap, Headphones };
        return icons[iconName as keyof typeof icons] || Shield;
    };

    return (
        <section className="border-b border-neutral-800 bg-black py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col items-start gap-16 lg:flex-row">
                    <div className="lg:w-1/3">
                        <h2 className="mb-8 text-4xl font-black tracking-tighter text-white md:text-5xl">{title}</h2>
                        <p className="mb-8 text-xl leading-relaxed text-neutral-400">{subtitle}</p>
                        <div className="space-y-4">
                            {['Enterprise Ready', 'Zero Configuration', 'Full API Access'].map((item) => (
                                <div key={item} className="flex items-center font-bold text-white">
                                    <Check className="me-3 h-5 w-5 text-neutral-500" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3">
                        {benefits?.map((benefit: any, index: number) => {
                            const IconComponent = getIcon(benefit.icon);
                            return (
                                <div
                                    key={index}
                                    className="group rounded-3xl border border-neutral-800 bg-neutral-900/20 p-8 transition-all hover:border-neutral-700"
                                >
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 transition-colors group-hover:bg-white group-hover:text-black">
                                        <IconComponent className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">
                                        {benefit.title}
                                    </h3>
                                    <p className="leading-relaxed text-neutral-400">{benefit.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
