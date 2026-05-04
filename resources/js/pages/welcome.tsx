import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Welcome({
    auth,
    phpVersion,
}: PageProps<{ phpVersion: string }>) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-muted/50 text-black/50 dark:bg-foreground dark:text-foreground/50">
                <img
                    id="background"
                    className="absolute -start-20 top-0 max-w-[877px]"
                    src="https://sukon.dion.sy/assets/img/welcome/background.svg"
                    alt="Sukoun Albunyan Welcome Background"
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-background">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <div className="text-2xl font-bold tracking-tight text-black dark:text-white flex items-center gap-2">
                                    <span className="text-[#FF2D20]">🏛️</span> SUKOUN ALBUNYAN
                                </div>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-foreground dark:hover:text-background/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-foreground dark:hover:text-background/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-foreground dark:hover:text-background/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                <div
                                    id="docs-card"
                                    className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-card p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] dark:bg-foreground dark:ring-border dark:hover:text-background/70 dark:hover:ring-border dark:focus-visible:ring-[#FF2D20] md:row-span-3 lg:p-10 lg:pb-10"
                                >
                                    <div
                                        id="screenshot-container"
                                        className="relative flex w-full flex-1 items-stretch"
                                    >
                                        <div className="aspect-video h-full w-full flex-1 rounded-[10px] bg-gradient-to-br from-[#FF2D20]/20 to-transparent flex items-center justify-center">
                                            <span className="text-4xl">📊</span>
                                        </div>
                                        <div className="absolute -bottom-16 -start-16 h-40 w-[calc(100%+8rem)] bg-gradient-to-b from-transparent via-white to-white dark:via-foreground dark:to-foreground"></div>
                                    </div>

                                    <div className="relative flex items-center gap-6 lg:items-end">
                                        <div id="docs-card-content" className="flex items-start gap-6 lg:flex-col">
                                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
                                                <span className="text-2xl">🏛️</span>
                                            </div>

                                            <div className="pt-3 sm:pt-5 lg:pt-0">
                                                <h2 className="text-xl font-semibold text-black dark:text-foreground">
                                                    Sukoun Albunyan Documentation
                                                </h2>

                                                <p className="mt-4 text-sm/relaxed">
                                                    Explore the comprehensive engineering documentation for the 31+
                                                    enterprise modules. Sukoun Albunyan is designed for scalable
                                                    corporate governance and real-time operational excellence.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 rounded-lg bg-card p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] dark:bg-foreground dark:ring-border dark:hover:text-background/70 dark:hover:ring-border dark:focus-visible:ring-[#FF2D20] lg:pb-10">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
                                        <span className="text-2xl">💼</span>
                                    </div>

                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-semibold text-black dark:text-foreground">
                                            Unified Enterprise Hub
                                        </h2>

                                        <p className="mt-4 text-sm/relaxed">
                                            Access Sukoun Learning and master the advanced workflows for HRM,
                                            Finance, and Project Management. Every module is integrated into
                                            a single, high-performance ecosystem.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 rounded-lg bg-card p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] dark:bg-foreground dark:ring-border dark:hover:text-background/70 dark:hover:ring-border dark:focus-visible:ring-[#FF2D20] lg:pb-10">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
                                        <span className="text-2xl">📈</span>
                                    </div>

                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-semibold text-black dark:text-foreground">
                                            Predictive Insights
                                        </h2>

                                        <p className="mt-4 text-sm/relaxed">
                                            Stay ahead with Sukoun Insights. Leverage our predictive analytics
                                            engine to forecast financial trends and operational capacity with
                                            state-of-the-art accuracy.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 rounded-lg bg-card p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] dark:bg-foreground dark:ring-border lg:pb-10">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
                                        <span className="text-2xl">🌍</span>
                                    </div>

                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-semibold text-black dark:text-foreground">
                                            Enterprise Ecosystem
                                        </h2>

                                        <p className="mt-4 text-sm/relaxed">
                                            Sukoun's robust suite of enterprise tools including HRM, Finance,
                                            POS, and CRM are built to empower your corporate vision on
                                            a global scale.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-foreground/70">
                            Sukoun Albunyan Gold Master 2026 (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
