interface GalleryProps {
    settings?: any;
}

export default function Gallery({ settings }: GalleryProps) {
    const sectionData = settings?.config_sections?.sections?.gallery || {};
    
    const title = sectionData.title || 'Built for Scale';
    const subtitle = sectionData.subtitle || 'Noble Architecture architecture handles everything from small teams to enterprise deployments seamlessly.';

    return (
        <section className="bg-black text-white py-32 border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-white">
                            {title}
                        </h2>
                        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800 rounded-xl overflow-hidden border border-neutral-800">
                    <div className="bg-black p-10 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4 tracking-tight">Zero configuration</h3>
                        <p className="text-neutral-400 leading-relaxed">We handle the complex setups so you don't have to. Pre-configured modules that work instantly together.</p>
                    </div>
                    <div className="bg-neutral-900 border-l border-neutral-800 p-10 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4 tracking-tight">Edge-ready Performance</h3>
                        <p className="text-neutral-400 leading-relaxed">Global speed with edge caching and optimized queries ensuring your dashboard loads in milliseconds.</p>
                    </div>
                    <div className="bg-neutral-900 p-10 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4 tracking-tight">Enterprise Security</h3>
                        <p className="text-neutral-400 leading-relaxed">Top-tier encryption, automated backups, and advanced role-based access control built directly into the core.</p>
                    </div>
                    <div className="bg-black border-l border-neutral-800 p-10 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4 tracking-tight">Infinite Extensibility</h3>
                        <p className="text-neutral-400 leading-relaxed">Powerful built-in APIs and modular architecture make adding custom features and integrations a breeze.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
