import { PropsWithChildren, ReactNode, Fragment } from "react";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavUser } from "@/components/nav-user";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { BrandProvider, useBrand } from "@/contexts/brand-context";
import CookieConsent from "@/components/cookie-consent";
import { useFavicon } from "@/hooks/use-favicon";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { UserX, Bell } from "lucide-react";
import { useFlashMessages } from "@/hooks/useFlashMessages";
import { QuickActions } from "@/components/quick-actions";
import { ThemeToggle } from "@/components/theme-toggle";

function AuthenticatedLayoutContent({
    header,
    children,
    breadcrumbs,
    pageTitle,
    pageActions
}: PropsWithChildren<{
    header?: ReactNode;
    breadcrumbs?: Array<{label: string, url?: string}>;
    pageTitle?: string;
    pageActions?: ReactNode;
    className?: string;
}>) {
    const { t } = useTranslation();
    const { auth, companyAllSetting, adminAllSetting, unreadNotifications } = usePage<PageProps>().props as any;
    const { settings } = useBrand();
    useFavicon();
    useFlashMessages();

    return (
        <>
        <Head>
            {companyAllSetting?.metaKeywords && (
                <meta name="keywords" content={companyAllSetting.metaKeywords} />
            )}
            {companyAllSetting?.metaDescription && (
                <meta name="description" content={companyAllSetting.metaDescription} />
            )}
            {companyAllSetting?.metaImage && (
                <meta property="og:image" content={companyAllSetting.metaImage} />
            )}
        </Head>
        <div
            className={settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr'}
            data-theme={settings.themeMode}
            dir={settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr'}
            style={{ 
                direction: settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr',
                fontFamily: settings.fontFamily || undefined
            }}
        >

        <SidebarProvider defaultOpen={true}>
            <AppSidebar />

            <SidebarInset className="overflow-visible"
                style={{ direction: settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr' }}
                dir={settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr'}
            >
                {/* ─── Vercel-Style Header ─── */}
                <header
                    className="sticky top-0 z-40 w-full flex h-12 shrink-0 items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-sm transition-colors"
                >
                    {/* Left: Sidebar trigger + Breadcrumb */}
                    <div className={`flex items-center gap-3 ${ settings.layoutDirection === "rtl" ? "order-2 flex-row-reverse" : "order-1" }`} >
                        <SidebarTrigger className={`h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ${ settings.layoutDirection === "rtl" ? "order-3" : "order-1" }`} />

                        <Separator orientation="vertical" className="h-4 w-px bg-border hidden md:block order-2" />

                        <Breadcrumb className={`${ settings.layoutDirection === "rtl" ? "order-1" : "order-3" } hidden lg:block`} >
                            <BreadcrumbList className={`flex gap-1.5 ${ settings.layoutDirection === "rtl" ? "justify-end" : "justify-start" }`} >
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={route("dashboard")} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                                            {t('Dashboard')}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {breadcrumbs?.map((crumb, index) => (
                                    <Fragment key={index}>
                                        <BreadcrumbSeparator className={`text-muted-foreground/40 ${settings.layoutDirection === 'rtl' ? 'rotate-180' : ''}`} />
                                        <BreadcrumbItem>
                                            {crumb.url ? (
                                                <BreadcrumbLink asChild>
                                                    <Link href={crumb.url} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                                                        {crumb.label}
                                                    </Link>
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage className="text-[13px] text-foreground font-medium">
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
                            settings.layoutDirection === "rtl" ? "order-1 flex-row-reverse" : "order-2"
                        }`}
                    >
                        {/* Leave Impersonation Button */}
                        {auth.impersonating && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.post(route('users.leave-impersonation'))}
                                className="h-7 text-xs text-foreground border-border hover:bg-accent dark:text-foreground dark:border-border dark:hover:bg-accent transition-colors"
                            >
                                <UserX className="h-3 w-3 mr-1.5" />
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
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium leading-none text-background ring-2 ring-background">
                                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                                </span>
                            )}
                        </Link>

                        <Separator orientation="vertical" className="mx-1 h-4 w-px bg-border" />

                        <NavUser user={auth.user} inHeader={true} />
                    </div>
                </header>

                {/* ─── Main Content ─── */}
                <main className="relative p-4 md:p-6 h-full min-h-[calc(100vh-3rem)] overflow-hidden">
                    {/* Premium Background Dots */}
                    <div className="absolute inset-0 vercel-dots opacity-[0.05] dark:opacity-[0.1] -z-10" />

                    {pageTitle && (
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8" dir={settings.layoutDirection}>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {pageTitle}
                                </h1>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2">{pageActions}</div>
                        </div>
                    )}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
        <CookieConsent settings={adminAllSetting || {}} />
        <QuickActions />
        </div>
        </>
    );
}

export default function AuthenticatedLayout(props: PropsWithChildren<{
    header?: ReactNode;
    breadcrumbs?: Array<{label: string, url?: string}>;
    pageTitle?: string;
    pageActions?: ReactNode;
    className?: string;
}>) {
    return (
        <BrandProvider>
            <AuthenticatedLayoutContent {...props} />
        </BrandProvider>
    );
}
