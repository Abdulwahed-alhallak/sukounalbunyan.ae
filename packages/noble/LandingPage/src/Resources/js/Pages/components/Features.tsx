import { Building2, Calculator, Users, CreditCard, UserCheck, FolderOpen } from 'lucide-react';

interface FeaturesProps {
    [key: string]: any;
    settings?: any;
}

export default function Features({ settings }: FeaturesProps) {
    const sectionData = settings?.config_sections?.sections?.features || {};

    const title = sectionData.title || 'Powerful Features';
    const subtitle = sectionData.subtitle || 'Everything your business needs in one integrated platform';

    const defaultFeatures = [
        {
            title: 'ERP Management',
            description: 'Complete enterprise resource planning with real-time analytics and data synchronization.',
            icon: 'Building2',
        },
        {
            title: 'Accounting',
            description:
                'Advanced financial management including automated invoicing, expense tracking, and reporting.',
            icon: 'Calculator',
        },
        {
            title: 'CRM System',
            description: 'Customer relationship management tailored for growth, seamless onboarding and lead tracking.',
            icon: 'Users',
        },
    ];

    const features = sectionData.features?.length > 0 ? sectionData.features : defaultFeatures;

    const getIcon = (iconName: string) => {
        const icons = { Building2, Calculator, Users, CreditCard, UserCheck, FolderOpen };
        const IconComponent = icons[iconName as keyof typeof icons] || Building2;
        return <IconComponent className="h-6 w-6 text-neutral-300" />;
    };

    return (
        <section className="border-b border-neutral-800 bg-black py-32 text-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mb-20 text-center md:text-start">
                    <h2 className="mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-4xl font-extrabold tracking-tighter text-transparent md:text-5xl">
                        {title}
                    </h2>
                    <p className="max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {features?.map((feature: any, index: number) => (
                        <div
                            key={index}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-900"
                        >
                            {/* Subtle hover gradient */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                            <div>
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700/50 bg-neutral-800/80">
                                    {getIcon(feature.icon)}
                                </div>
                                <h3 className="mb-3 text-xl font-bold tracking-tight text-white">{feature.title}</h3>
                                <p className="text-base leading-relaxed text-neutral-400">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
