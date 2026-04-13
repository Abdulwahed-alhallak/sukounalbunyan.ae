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
                        {/* ─── Vercel-Style Header ─── */}
                        <header className="sticky top-0 z-40 flex h-12 w-full shrink-0 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl transition-colors">
                            {/* Left: Sidebar trigger + Breadcrumb */}
                            <div
                                className={`flex items-center gap-3 ${currentDir === 'rtl' ? 'order-2 flex-row-reverse' : 'order-1'}`}
                            >
                                <SidebarTrigger
                                    className={cn(
                                        'h-8 w-8 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                                        currentDir === 'rtl' ? 'order-3' : 'order-1'
                                    )}
                                />

                                <Separator
                                    orientation="vertical"
                                    className="order-2 hidden h-4 w-px bg-border md:block"
                                />

                                <Breadcrumb
                                    className={`${currentDir === 'rtl' ? 'order-1' : 'order-3'} hidden lg:block`}
                                >
                                    <BreadcrumbList
                                        className={`flex gap-1.5 ${currentDir === 'rtl' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <BreadcrumbItem>
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    href={route('dashboard')}
                                                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                                                >
                                                    {t('Dashboard')}
                                                </Link>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {breadcrumbs?.map((crumb, index) => (
                                            <Fragment key={index}>
                                                <BreadcrumbSeparator
                                                    className={`text-muted-foreground/40 ${currentDir === 'rtl' ? 'rotate-180' : ''}`}
                                                />
                                                <BreadcrumbItem>
                                                    {crumb.url ? (
                                                        <BreadcrumbLink asChild>
                                                            <Link
                                                                href={crumb.url}
                                                                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                                                            >
                                                                {crumb.label}
                                                            </Link>
                                                        </BreadcrumbLink>
                                                    ) : (
                                                        <BreadcrumbPage className="text-[13px] font-medium text-foreground">
                                                            {crumb.label}
                                                        </BreadcrumbPage>
                                                    )}
                                                </BreadcrumbItem>
                                            </Fragment>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>

                            {/* Right: Actions */}
                            <div
                                className={`flex items-center gap-2 ${
                                    currentDir === 'rtl' ? 'order-1 flex-row-reverse' : 'order-2'
                                }`}
                            >
                                {/* Leave Impersonation Button */}
                                {auth.impersonating && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.post(route('users.leave-impersonation'))}
                                        className="h-7 border-border text-xs text-foreground transition-colors hover:bg-accent dark:border-border dark:text-foreground dark:hover:bg-accent"
                                    >
                                        <UserX className="me-1.5 h-3 w-3" />
                                        {t('End Session')}
                                    </Button>
                                )}

                                {/* Theme Toggle */}
                                <ThemeToggle />

                                {/* Notification Bell */}
                                <Link
                                    href={route('notifications.index')}
                                    className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <Bell className="h-4 w-4" strokeWidth={1.5} />
                                    {unreadNotifications > 0 && (
                                        <span
                                            className={cn(
                                                'absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium leading-none text-background ring-2 ring-background',
                                                settings.layoutDirection === 'rtl'
                                                    ? '-left-0.5 -top-0.5'
                                                    : '-right-0.5 -top-0.5'
                                            )}
                                        >
                                            {unreadNotifications > 99 ? '99+' : unreadNotifications}
                                        </span>
                                    )}
                                </Link>

                                <Separator orientation="vertical" className="mx-1 h-4 w-px bg-border" />

                                <NavUser user={auth.user} inHeader={true} />
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
