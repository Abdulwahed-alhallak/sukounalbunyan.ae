export default function Modules({ settings }: ModulesProps) {
    const sectionData = settings?.config_sections?.sections?.modules || {};

    const title = sectionData.title || 'Core Modules';
    const subtitle =
        sectionData.subtitle ||
        'Noble Architecture is built with a modular architecture, allowing you to activate only what you need.';

    const defaultModules = [
        {
            label: 'Sales & Accounting',
            description: 'Comprehensive financial management system with automated invoicing and real-time reporting.',
        },
        {
            label: 'CRM System',
            description: 'Manage customer relationships, track leads, and optimize your sales funnel with ease.',
        },
        {
            label: 'Human Resources',
            description:
                'Complete employee management solution including payroll, attendance, and performance tracking.',
        },
    ];

    const modules = sectionData.modules?.length > 0 ? sectionData.modules : defaultModules;

    return (
        <section className="border-b border-neutral-800 bg-black py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mb-20 text-center">
                    <h2 className="mb-4 text-4xl font-extrabold tracking-tighter text-white md:text-5xl">{title}</h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {modules.map((module: any, index: number) => (
                        <div
                            key={index}
                            className="group rounded-2xl border border-neutral-800 bg-neutral-900/30 p-8 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/50"
                        >
                            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 transition-colors group-hover:bg-white group-hover:text-black">
                                <span className="text-sm font-bold">{index + 1}</span>
                            </div>
                            <h3 className="mb-3 text-xl font-bold tracking-tight text-white">{module.label}</h3>
                            <p className="text-sm leading-relaxed text-neutral-400">{module.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
