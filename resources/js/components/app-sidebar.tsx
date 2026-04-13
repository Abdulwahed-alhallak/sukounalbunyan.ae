"use client"

import * as React from "react"
import {
  Search,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
} from "@/components/ui/sidebar"
import {Link, usePage} from "@inertiajs/react";
import {PageProps, BrandSettings} from "@/types";
import { useAllMenuItems } from "@/utils/menu";
import { useTranslation } from 'react-i18next';
import { useBrand } from "@/contexts/brand-context";
import { useTheme } from "next-themes";
import { ApplicationLogo } from "./application-logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pageProps = usePage<PageProps>().props;
    const { auth } = pageProps || { auth: { user: null } };
    const { t } = useTranslation();
    const brandData = useBrand();
    const menuItems = useAllMenuItems();
    
    // Safety first: provide defaults for everything
    const settings = brandData?.settings || {} as BrandSettings;
    const getCompleteSidebarProps = brandData?.getCompleteSidebarProps;
    const getPreviewUrl = brandData?.getPreviewUrl || ((s: string) => s);
    
    const [searchQuery, setSearchQuery] = React.useState("");
    
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

    return (
    <Sidebar
        variant={(settings?.sidebarVariant || 'inset') as any}
        side={settings?.layoutDirection === 'rtl' ? 'right' : 'left'}
        collapsible="icon"
        className={sidebarProps?.className || ""}
        style={sidebarProps?.style || {}}
        {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={route('dashboard')} className="flex items-center !py-3 h-auto justify-center">
                {/* Brand Logo - Uses SVG component for consistency */}
                <div className="group-data-[collapsible=icon]:hidden flex items-center px-2">
                    <ApplicationLogo className="h-8 w-auto premium-shimmer text-primary" />
                    <span className="ms-2 font-semibold tracking-tight text-sm text-foreground">
                        {settings?.titleText || 'Noble Architecture'}
                    </span>
                </div>

                {/* Icon for collapsed sidebar */}
                <div className="h-7 w-7 hidden group-data-[collapsible=icon]:block">
                    {displayFavicon ? (
                      <img
                        src={displayFavicon}
                        alt="Icon"
                        className="h-7 w-7 transition-all duration-150"
                      />
                    ) : (
                      <div className="h-7 w-7 bg-foreground text-background rounded-sm flex items-center justify-center text-xs font-semibold">
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
              placeholder={t('Search...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-8 pe-8 bg-transparent border-border h-8 text-[13px] rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
            />
            <div className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none font-mono border border-border rounded px-1">
              /
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
  )
}






