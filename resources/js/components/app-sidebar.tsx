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
import {PageProps} from "@/types";
import { allMenuItems } from "@/utils/menu";
import { useTranslation } from 'react-i18next';
import { useBrand } from "@/contexts/brand-context";
import { useTheme } from "next-themes";



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const { settings, getCompleteSidebarProps } = useBrand();
    const [searchQuery, setSearchQuery] = React.useState("");
    const { resolvedTheme } = useTheme();

    const sidebarProps = getCompleteSidebarProps();

    return (
    <Sidebar
        variant={settings.sidebarVariant as any}
        side={settings.layoutDirection === 'rtl' ? 'right' : 'left'}
        collapsible="icon"
        className={sidebarProps.className}
        style={sidebarProps.style}
        {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={route('dashboard')} className="flex items-center !py-3 h-auto justify-center">
                {/* Logo for expanded sidebar */}
                <div className="group-data-[collapsible=icon]:hidden flex items-center px-2">
                  {(() => {
                    const isDark = settings.themeMode === 'dark' || (settings.themeMode === 'system' && resolvedTheme === 'dark') || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
                    const currentLogo = isDark ? settings.logo_light : settings.logo_dark;
                    const { getPreviewUrl } = useBrand();
                    const displayUrl = currentLogo ? getPreviewUrl(currentLogo) : '';

                    return displayUrl ? (
                      <img
                        src={displayUrl}
                        alt="Logo"
                        className="w-auto max-w-[110px] transition-all"
                      />
                    ) : (
                      <div className="h-10 flex items-center gap-2">
                        <div className="w-5 h-5 bg-foreground rounded-sm" />
                        <span className="font-semibold tracking-tight text-sm text-foreground">{settings.titleText || 'DionONE'}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Icon for collapsed sidebar */}
                <div className="h-7 w-7 hidden group-data-[collapsible=icon]:block">
                  {(() => {
                    const { getPreviewUrl } = useBrand();
                    const displayFavicon = settings.favicon ? getPreviewUrl(settings.favicon) : '';

                    return displayFavicon ? (
                      <img
                        src={displayFavicon}
                        alt="Icon"
                        className="h-7 w-7 transition-all duration-150"
                      />
                    ) : (
                      <div className="h-7 w-7 bg-foreground text-background rounded-sm flex items-center justify-center text-xs font-semibold">
                        {settings.titleText ? settings.titleText.charAt(0).toUpperCase() : (auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'D')}
                      </div>
                    );
                  })()}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* ─── Vercel-Style Search ─── */}
        <div className="px-3 pb-3 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <SidebarInput
              placeholder={t('Search...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 bg-transparent border-border h-8 text-[13px] rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none font-mono border border-border rounded px-1">
              /
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-1">
        <NavMain items={allMenuItems()} searchQuery={searchQuery} />
      </SidebarContent>
      <div className="mt-auto border-t border-sidebar-border px-2 py-3">
        <NavUser user={auth.user} />
      </div>
    </Sidebar>
  )
}
