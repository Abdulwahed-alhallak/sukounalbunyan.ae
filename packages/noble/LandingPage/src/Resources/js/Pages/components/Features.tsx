import { Building2, Calculator, Users, CreditCard, UserCheck, FolderOpen } from 'lucide-react';

interface FeaturesProps {
    settings?: any;
}

export default function Features({ settings }: FeaturesProps) {
    const sectionData = settings?.config_sections?.sections?.features || {};
    
    const title = sectionData.title || 'Powerful Features';
    const subtitle = sectionData.subtitle || 'Everything your business needs in one integrated platform';
    
    const defaultFeatures = [
        { title: 'ERP Management', description: 'Complete enterprise resource planning with real-time analytics and data synchronization.', icon: 'Building2' },
        { title: 'Accounting', description: 'Advanced financial management including automated invoicing, expense tracking, and reporting.', icon: 'Calculator' },
        { title: 'CRM System', description: 'Customer relationship management tailored for growth, seamless onboarding and lead tracking.', icon: 'Users' }
    ];
    
    const features = sectionData.features?.length > 0 ? sectionData.features : defaultFeatures;

    const getIcon = (iconName: string) => {
        const icons = { Building2, Calculator, Users, CreditCard, UserCheck, FolderOpen };
        const IconComponent = icons[iconName as keyof typeof icons] || Building2;
        return <IconComponent className="h-6 w-6 text-neutral-300" />;
    };

    return (
        <section className="bg-black text-white py-32 border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-20 text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features?.map((feature: any, index: number) => (
                        <div 
                            key={index} 
                            className="group relative flex flex-col justify-between p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-300 overflow-hidden"
                        >
                            {/* Subtle hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <div>
                                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-neutral-800/80 border border-neutral-700/50">
                                    {getIcon(feature.icon)}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-400 text-base leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}