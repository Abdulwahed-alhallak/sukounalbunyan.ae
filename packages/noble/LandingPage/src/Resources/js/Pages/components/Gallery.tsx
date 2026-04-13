interface GalleryProps {
    settings?: any;
}

export default function Gallery({ settings }: GalleryProps) {
    const sectionData = settings?.config_sections?.sections?.gallery || {};

    const title = sectionData.title || 'Built for Scale';
    const subtitle =
        sectionData.subtitle ||
        'Noble Architecture architecture handles everything from small teams to enterprise deployments seamlessly.';

    return (
        <section className="border-b border-neutral-800 bg-black py-32 text-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mb-16 flex flex-col justify-between text-center md:flex-row md:items-end md:text-start">
                    <div className="max-w-2xl">
                        <h2 className="mb-4 text-4xl font-extrabold tracking-tighter text-white md:text-5xl">
                            {title}
                        </h2>
                        <p className="text-lg leading-relaxed text-neutral-400 md:text-xl">{subtitle}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-neutral-800 bg-neutral-800 md:grid-cols-2">
                    <div className="flex flex-col justify-center bg-black p-10">
                        <h3 className="mb-4 text-2xl font-bold tracking-tight">Zero configuration</h3>
                        <p className="leading-relaxed text-neutral-400">
                            We handle the complex setups so you don't have to. Pre-configured modules that work
                            instantly together.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center border-s border-neutral-800 bg-neutral-900 p-10">
                        <h3 className="mb-4 text-2xl font-bold tracking-tight">Edge-ready Performance</h3>
                        <p className="leading-relaxed text-neutral-400">
                            Global speed with edge caching and optimized queries ensuring your dashboard loads in
                            milliseconds.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center bg-neutral-900 p-10">
                        <h3 className="mb-4 text-2xl font-bold tracking-tight">Enterprise Security</h3>
                        <p className="leading-relaxed text-neutral-400">
                            Top-tier encryption, automated backups, and advanced role-based access control built
                            directly into the core.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center border-s border-neutral-800 bg-black p-10">
                        <h3 className="mb-4 text-2xl font-bold tracking-tight">Infinite Extensibility</h3>
                        <p className="leading-relaxed text-neutral-400">
                            Powerful built-in APIs and modular architecture make adding custom features and integrations
                            a breeze.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
