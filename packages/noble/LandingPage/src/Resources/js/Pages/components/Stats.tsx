interface StatsProps {
    settings?: any;
}

export default function Stats({ settings }: StatsProps) {
    const sectionData = settings?.config_sections?.sections?.stats || {};
    
    const defaultStats = [
        { label: 'Businesses Trust Us', value: '20,000+' },
        { label: 'Uptime Guarantee', value: '99.99%' },
        { label: 'Customer Support', value: '24/7' },
        { label: 'Countries Worldwide', value: '70+' }
    ];
    
    const stats = sectionData.stats?.length > 0 ? sectionData.stats : defaultStats;

    return (
        <section className="bg-black text-white py-24 mb-1 border-t border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-0 divide-x-0 md:divide-x divide-neutral-800">
                    {stats?.map((stat: any, index: number) => (
                        <div key={index} className="flex flex-col items-center justify-center text-center px-6">
                            <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-white">
                                {stat.value}
                            </div>
                            <div className="text-sm md:text-base font-medium text-neutral-400 uppercase tracking-widest">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}