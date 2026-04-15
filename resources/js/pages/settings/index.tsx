import { useState, Suspense, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allSettingsItems } from '@/utils/settings';
import { getSettingsComponent } from '@/utils/settings-components';

export default function Settings() {
    const { t } = useTranslation();
    const { auth, globalSettings = {}, emailProviders = {}, cacheSize = '0.00' } = usePage().props as any;
    const [activeSection, setActiveSection] = useState('brand-settings');

    const sidebarNavItems = allSettingsItems();

    const handleNavClick = (href: string) => {
        const id = href.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = sidebarNavItems.map((item) => item.href.replace('#', ''));

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sidebarNavItems]);

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Settings') }]} pageTitle={t('Settings')}>
            <Head title={t('Settings')} />

            <div className="flex flex-col gap-8 md:flex-row">
                {/* ─── Vercel-Style Settings Navigation ─── */}
                <div className="flex-shrink-0 md:w-72">
                    <div className="sticky top-16">
                        <div className="mb-4 ps-1">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                {t('Configuration Domain')}
                            </h2>
                        </div>
                        <div className="flex flex-col space-y-0.5">
                            {sidebarNavItems.map((item) => {
                                const isActive = activeSection === item.href.replace('#', '');
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => handleNavClick(item.href)}
                                        className={cn(
                                            'group flex items-center justify-between rounded-md px-3 py-2 transition-all duration-200',
                                            isActive
                                                ? 'bg-primary/5 font-bold text-primary ring-1 ring-primary/10'
                                                : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground/60 transition-colors group-hover:text-foreground')} />
                                            <span className="text-[13px] tracking-tight">{item.title}</span>
                                        </div>
                                        {isActive && (
                                            <div className="h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ─── Settings Content Container ─── */}
                <div className="flex-1 max-w-4xl">
                     <div className="pe-4 space-y-12">
                         {sidebarNavItems.map((item) => {
                             const sectionId = item.href.replace('#', '');
                             const canManage = auth.user?.permissions?.includes(item.permission);

                             if (!canManage) return null;

                             const Component = getSettingsComponent(item.component);
                             if (!Component) return null;

                             return (
                                 <section 
                                    key={sectionId} 
                                    id={sectionId} 
                                    className="relative scroll-mt-24 transition-opacity duration-300 animate-in fade-in"
                                 >
                                     <div className="mb-6">
                                         <h3 className="text-lg font-bold tracking-tight text-foreground">{item.title}</h3>
                                         <div className="glass-separator mt-2 opacity-30" />
                                     </div>
                                     <Suspense fallback={<div className="vercel-skeleton h-60 w-full" />}>
                                         <Component
                                             {...({
                                                 userSettings: globalSettings,
                                                 auth: auth,
                                                 emailProviders: emailProviders,
                                                 cacheSize: cacheSize,
                                             } as any)}
                                         />
                                     </Suspense>
                                 </section>
                             );
                         })}
                     </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
