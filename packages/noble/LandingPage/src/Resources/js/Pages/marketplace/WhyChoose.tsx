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

export default function MarketplaceWhyChoose({ settings, title: propTitle, subtitle: propSubtitle, benefits: propBenefits }: WhyChooseProps) {
    const sectionData = settings?.config_sections?.sections?.why_choose || {};
    
    const title = propTitle || sectionData.title || 'Engineered for Performance';
    const subtitle = propSubtitle || sectionData.subtitle || 'Every module in our marketplace is built with the highest standards of security, speed, and scalability.';
    
    const defaultBenefits = [
        { title: 'Industrial Grade Security', description: 'Multi-tenant isolation and enterprise-level encryption at every layer.', icon: 'Shield' },
        { title: 'Sub-millisecond Latency', description: 'Optimized internal routing ensures your business modules run at the speed of thought.', icon: 'Zap' },
        { title: 'Global Infrastructure', description: 'Deploy your modules across our worldwide network with a single click.', icon: 'Headphones' }
    ];
    
    const benefits = propBenefits?.length > 0 ? propBenefits : sectionData.benefits?.length > 0 ? sectionData.benefits : defaultBenefits;

    const getIcon = (iconName: string) => {
        const icons = { Shield, Zap, Headphones };
        return icons[iconName as keyof typeof icons] || Shield;
    };

    return (
        <section className="bg-black py-24 md:py-32 border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    <div className="lg:w-1/3">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-8">
                            {title}
                        </h2>
                        <p className="text-xl text-neutral-400 leading-relaxed mb-8">
                            {subtitle}
                        </p>
                        <div className="space-y-4">
                            {['Enterprise Ready', 'Zero Configuration', 'Full API Access'].map((item) => (
                                <div key={item} className="flex items-center text-white font-bold">
                                    <Check className="w-5 h-5 mr-3 text-neutral-500" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefits?.map((benefit: any, index: number) => {
                            const IconComponent = getIcon(benefit.icon);
                            return (
                                <div key={index} className="p-8 rounded-3xl border border-neutral-800 bg-neutral-900/20 hover:border-neutral-700 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                                        <IconComponent className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{benefit.title}</h3>
                                    <p className="text-neutral-400 leading-relaxed">{benefit.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}