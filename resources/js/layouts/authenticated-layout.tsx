import { PropsWithChildren, ReactNode, Fragment } from 'react';
import { cn } from '@/lib/utils';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { NavUser } from '@/components/nav-user';
import { usePage, Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { BrandProvider, useBrand } from '@/contexts/brand-context';
import CookieConsent from '@/components/cookie-consent';
import { useFavicon } from '@/hooks/use-favicon';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { UserX, Bell } from 'lucide-react';
import { useFlashMessages } from '@/hooks/useFlashMessages';
import { QuickActions } from '@/components/quick-actions';
import { ThemeToggle } from '@/components/theme-toggle';

function AuthenticatedLayoutContent({
    header,
    children,
    breadcrumbs,
    pageTitle,
    pageActions,
}: PropsWithChildren<{
    header?: ReactNode;
    breadcrumbs?: Array<{ label: string; url?: string }>;
    pageTitle?: string;
    pageActions?: ReactNode;
    className?: string;
}>) {
    const { t, i18n } = useTranslation();
    const currentDir = i18n.dir();
    const { auth, companyAllSetting, adminAllSetting, unreadNotifications } = usePage<PageProps>().props as any;
    const { settings } = useBrand();
    useFavicon();
    useFlashMessages();

    return (
        <>
            <Head>
                {companyAllSetting?.metaKeywords && <meta name="keywords" content={companyAllSetting.metaKeywords} />}
                {companyAllSetting?.metaDescription && (
                    <meta name="description" content={companyAllSetting.metaDescription} />
                )}
                {companyAllSetting?.metaImage && <meta property="og:image" content={companyAllSetting.metaImage} />}
            </Head>
            <div
                className={currentDir === 'rtl' ? 'rtl' : 'ltr'}
                data-theme={settings.themeMode}
                dir={currentDir}
                style={{
                    direction: currentDir,
                    fontFamily: settings.fontFamily || undefined,
                }}
            >
                <SidebarProvider defaultOpen={true}>
                    <AppSidebar />

                    <SidebarInset
                        className="overflow-visible"
                        style={{ direction: currentDir }}
                        dir={currentDir}
                    >
                        {/* ─── Vercel-Style Premium Header ─── */}
                        <header className="sticky top-0 z-[var(--z-index-header)] flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md transition-all duration-300">
                            {/* Left Section: Contextual Awareness */}
                            <div className="flex items-center gap-4">
                                <SidebarTrigger
                                    className="h-9 w-9 rounded-lg text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground active:scale-95"
                                />

                                <Separator
                                    orientation="vertical"
                                    className="hidden h-5 w-px bg-border md:block opacity-60"
                                />

                                <Breadcrumb className="hidden lg:block">
                                    <BreadcrumbList className="flex items-center gap-2">
                                        <BreadcrumbItem>
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    href={route('dashboard')}
                                                    className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                                    {t('Noble Core')}
                                                </Link>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {breadcrumbs?.map((crumb, index) => (
                                            <Fragment key={index}>
                                                <BreadcrumbSeparator className="text-muted-foreground/30 rtl:rotate-180">
                                                    <span className="text-[10px] font-bold opacity-40">/</span>
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    {crumb.url ? (
                                                        <BreadcrumbLink asChild>
                                                            <Link
                                                                href={crumb.url}
                                                                className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                                                            >
                                                                 {crumb.label}
                                                            </Link>
                                                        </BreadcrumbLink>
                                                    ) : (
                                                        <BreadcrumbPage className="text-[13px] font-bold tracking-tight text-foreground">
                                                            {crumb.label}
                                                        </BreadcrumbPage>
                                                    )}
                                                </BreadcrumbItem>
                                            </Fragment>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>

                            {/* Right Section: System Control & Identity */}
                            <div className="flex items-center gap-4">
                                {/* Production Status Indicator */}
                                <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 md:flex">
                                    <div className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        {t('Live Production')}
                                    </span>
                                </div>

                                {/* Identity Stack */}
                                <div className="flex items-center gap-2">
                                    {/* Leave Impersonation */}
                                    {auth.impersonating && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.post(route('users.leave-impersonation'))}
                                            className="h-8 rounded-lg border-border text-xs font-bold transition-all hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
                                        >
                                            <UserX className="me-1.5 h-3.5 w-3.5" />
                                            {t('Exit Protocol')}
                                        </Button>
                                    )}

                                    <div className="flex items-center gap-1.5 rounded-xl bg-muted/40 p-1 ring-1 ring-border/50">
                                        <ThemeToggle />
                                    </div>

                                    <Link
                                        href={route('notifications.index')}
                                        className="relative group inline-flex h-9 w-9 items-center justify-center rounded-xl bg-background border border-border transition-all duration-200 hover:border-foreground/30 hover:shadow-sm"
                                    >
                                        <Bell className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" strokeWidth={1.5} />
                                        {unreadNotifications > 0 && (
                                            <span
                                                className="absolute -top-1 -end-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-foreground border border-background px-1 text-[10px] font-bold text-background shadow-lg"
                                            >
                                                {unreadNotifications > 99 ? '99+' : unreadNotifications}
                                            </span>
                                        )}
                                    </Link>

                                    <Separator orientation="vertical" className="mx-1 h-5 w-px bg-border/60 md:block hidden" />

                                    <div className="ps-1">
                                        <NavUser user={auth.user} inHeader={true} />
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* ─── Main Content ─── */}
                        <main className="relative h-full min-h-[calc(100vh-3rem)] overflow-hidden p-4 md:p-6">
                            {/* Vercel 2026 — Subtle dot pattern */}
                            <div className="vercel-dots absolute inset-0 -z-10" />

                            {pageTitle && (
                                <div
                                    className="mb-8 flex flex-col gap-3 md:flex-row md:items-center"
                                    dir={currentDir}
                                >
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                            {pageTitle}
                                        </h1>
                                    </div>
                                    <div className="flex flex-shrink-0 items-center gap-2">{pageActions}</div>
                                </div>
                            )}
                            <div className="animate-fade-in">{children}</div>
                        </main>
                    </SidebarInset>
                </SidebarProvider>
                <CookieConsent settings={adminAllSetting || {}} />
                <QuickActions />
            </div>
        </>
    );
}

export default function AuthenticatedLayout(
    props: PropsWithChildren<{
        header?: ReactNode;
        breadcrumbs?: Array<{ label: string; url?: string }>;
        pageTitle?: string;
        pageActions?: ReactNode;
        className?: string;
    }>
) {
    return (
        <BrandProvider>
            <AuthenticatedLayoutContent {...props} />
        </BrandProvider>
    );
}
