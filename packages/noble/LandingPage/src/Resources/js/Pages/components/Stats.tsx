interface StatsProps {
    [key: string]: any;
    settings?: any;
}

export default function Stats({ settings }: StatsProps) {
    const sectionData = settings?.config_sections?.sections?.stats || {};

    const defaultStats = [
        { label: 'Businesses Trust Us', value: '20,000+' },
        { label: 'Uptime Guarantee', value: '99.99%' },
        { label: 'Customer Support', value: '24/7' },
        { label: 'Countries Worldwide', value: '70+' },
    ];

    const stats = sectionData.stats?.length > 0 ? sectionData.stats : defaultStats;

    return (
        <section className="mb-1 border-b border-t border-neutral-800 bg-black py-24 text-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-12 divide-x-0 divide-neutral-800 md:grid-cols-4 md:gap-x-0 md:divide-x">
                    {stats?.map((stat: any, index: number) => (
                        <div key={index} className="flex flex-col items-center justify-center px-6 text-center">
                            <div className="mb-4 text-4xl font-black tracking-tighter text-white md:text-5xl lg:text-6xl">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium uppercase tracking-widest text-neutral-400 md:text-base">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
