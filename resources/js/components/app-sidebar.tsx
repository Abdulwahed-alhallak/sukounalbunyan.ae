'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarInput,
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useAllMenuItems } from '@/utils/menu';
import { useTranslation } from 'react-i18next';
import { useBrand, BrandSettings } from '@/contexts/brand-context';
import { useTheme } from 'next-themes';
import { ApplicationLogo } from './application-logo';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pageProps = usePage<PageProps>().props;
    const { auth } = pageProps || { auth: { user: null } };
    const { t } = useTranslation();
    const brandData = useBrand();
    const menuItems = useAllMenuItems();

    // Safety first: provide defaults for everything
    const settings = brandData?.settings || ({} as BrandSettings);
    const getCompleteSidebarProps = brandData?.getCompleteSidebarProps;
    const getPreviewUrl = brandData?.getPreviewUrl || ((s: string) => s);

    const [searchQuery, setSearchQuery] = React.useState('');

    // Safely access theme context to prevent crashes if Provider is missing
    let resolvedTheme = 'light';
    try {
        const themeContext = useTheme();
        resolvedTheme = themeContext?.resolvedTheme || 'light';
    } catch (e) {
        console.warn('Theme context not available in Sidebar');
    }

    // Safely get sidebar props with internal catch
    const sidebarProps = React.useMemo(() => {
        try {
            if (typeof getCompleteSidebarProps === 'function') {
                return getCompleteSidebarProps() || { style: {}, className: '' };
            }
        } catch (e) {
            console.warn('SidebarProps Error caught:', e);
        }
        return { style: {}, className: '' };
    }, [getCompleteSidebarProps]);

    const isDark = settings?.themeMode === 'dark' || (settings?.themeMode === 'system' && resolvedTheme === 'dark');
    const displayFavicon = settings?.favicon ? getPreviewUrl(settings.favicon) : '';

    const { i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    return (
        <Sidebar
            variant="inset"
            side="left"
            collapsible="icon"
            {...props}
        >
            <SidebarHeader className="border-b border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} className="flex h-auto items-center justify-center !py-3">
                                {/* Brand Logo - Uses SVG component for consistency */}
                                <div className="flex items-center px-2 group-data-[collapsible=icon]:hidden">
                                    <ApplicationLogo className="premium-shimmer h-8 w-auto text-primary transition-transform duration-300 group-hover/logo:scale-105" />
                                    <span className="ms-2 text-label-13 font-bold tracking-tight text-foreground transition-colors duration-200 group-hover/logo:text-primary">
                                         {settings?.titleText || 'Noble Architecture'}
                                     </span>
                                </div>

                                {/* Icon for collapsed sidebar */}
                                <div className="hidden h-7 w-7 group-data-[collapsible=icon]:block">
                                    {displayFavicon ? (
                                        <img
                                            src={displayFavicon}
                                            alt="Icon"
                                            className="h-7 w-7 transition-all duration-150"
                                        />
                                    ) : (
                                        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-geist-gray-10 text-xs font-semibold text-background">
                                             {settings?.titleText ? settings.titleText.charAt(0).toUpperCase() : 'N'}
                                         </div>
                                    )}
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* ─── Vercel-Style Search ─── */}
                <div className="px-3 pb-3 group-data-[collapsible=icon]:hidden">
                    <div className="relative">
                        <Search className="absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <SidebarInput
                            placeholder={t('Search modules...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                             className="h-8 rounded-md border-border/60 bg-muted/20 pe-2 ps-8 text-label-13 transition-all placeholder:text-muted-foreground/50 focus-visible:bg-muted/40 focus-visible:ring-1 focus-visible:ring-primary/20"
                         />
                        <div className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[9px] font-bold text-muted-foreground shadow-sm">
                            ⌘K
                        </div>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-1">
                <NavMain items={menuItems} searchQuery={searchQuery} />
            </SidebarContent>
            <div className="mt-auto border-t border-sidebar-border px-2 py-3">
                <NavUser user={auth?.user} />
            </div>
        </Sidebar>
    );
}
