export default function Modules({ settings }: ModulesProps) {
    const sectionData = settings?.config_sections?.sections?.modules || {};
    
    const title = sectionData.title || 'Core Modules';
    const subtitle = sectionData.subtitle || 'Noble Architecture is built with a modular architecture, allowing you to activate only what you need.';
    
    const defaultModules = [
        { label: 'Sales & Accounting', description: 'Comprehensive financial management system with automated invoicing and real-time reporting.' },
        { label: 'CRM System', description: 'Manage customer relationships, track leads, and optimize your sales funnel with ease.' },
        { label: 'Human Resources', description: 'Complete employee management solution including payroll, attendance, and performance tracking.' }
    ];
    
    const modules = sectionData.modules?.length > 0 ? sectionData.modules : defaultModules;

    return (
        <section className="bg-black py-32 border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-white">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {modules.map((module: any, index: number) => (
                        <div 
                            key={index} 
                            className="group p-8 rounded-2xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900/50 hover:border-neutral-700 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                                <span className="text-sm font-bold">{index + 1}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                {module.label}
                            </h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                {module.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
