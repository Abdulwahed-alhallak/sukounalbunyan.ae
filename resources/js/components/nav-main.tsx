import { Link, usePage } from '@inertiajs/react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronRight } from 'lucide-react';
import { NavItem } from '@/types';
import { cn } from '@/lib/utils';

import { useTranslation } from 'react-i18next';

export function NavMain({ items = [], searchQuery = "" }: { items: NavItem[], searchQuery?: string }) {
    const page = usePage();
    const { t } = useTranslation();

    // Filter items based on search query
    const filterItems = (items: NavItem[], query: string): NavItem[] => {
        if (!query) return items;
        
        return items.reduce((acc, item) => {
            const matchesTitle = item.isLabel ? false : item.title.toLowerCase().includes(query.toLowerCase());
            const filteredChildren = item.children ? filterItems(item.children, query) : [];
            
            if (matchesTitle || filteredChildren.length > 0) {
                acc.push({
                    ...item,
                    children: filteredChildren.length > 0 ? filteredChildren : item.children
                });
            }
            return acc;
        }, [] as NavItem[]);
    };

    const filteredItems = filterItems(items, searchQuery);

    // Helper function to check if any child is active (recursive for nested children)
    const isChildActive = (children: NavItem[]): boolean => {
        return children.some(child => {
            if (child.href) {
                try {
                    const childPath = new URL(child.href, window.location.origin).pathname;
                    return page.url === childPath;
                } catch (e) {
                    return false;
                }
            }
            if (child.children) {
                return isChildActive(child.children);
            }
            return false;
        });
    };

    return (
        <SidebarGroup className="p-0">
            <SidebarMenu className="gap-0">
                {filteredItems.map((item, index) => {
                  if (item.isLabel) {
                      return (
                          <div key={`label-wrapper-${index}`} className="mt-5 mb-1 px-4 flex items-center group-data-[collapsible=icon]:hidden select-none">
                              <SidebarGroupLabel 
                                  key={`label-${index}`}
                                  className="h-auto p-0 text-muted-foreground text-[11px] font-medium tracking-wide bg-transparent"
                              >
                                  {t(item.title)}
                              </SidebarGroupLabel>
                          </div>
                      );
                  }

                  const itemPath = item.href ? new URL(item.href, window.location.origin).pathname : '';
                  const isActive = !!(itemPath && page.url === itemPath);
                  
                  // Check if any child is active for parent menus
                  const hasActiveChild = item.children ? isChildActive(item.children) : false;
                  const shouldBeActive = isActive || hasActiveChild;
                  if (item.children && item.children.length > 0) {
                        return (
                            <SidebarMenuItem key={item.title} className="px-2 mb-px">
                                <Collapsible asChild defaultOpen={shouldBeActive} className="group/collapsible group-data-[collapsible=icon]:hidden">
                                    <div>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton 
                                                tooltip={t(item.title)} 
                                                isActive={shouldBeActive}
                                                className={cn(
                                                    "transition-colors duration-150 group h-8 px-2.5 rounded-md relative",
                                                    shouldBeActive ? "font-medium text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                )}
                                            >
                                                {item.icon && <item.icon className="h-4 w-4" strokeWidth={1.5} />}
                                                <span className="flex-1 text-[13px] ml-2">{t(item.title)}</span>
                                                <ChevronRight className={cn("ml-auto h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground/50")} />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="transition-all duration-200 ease-in-out">
                                            <SidebarMenuSub className="border-l border-border/50 ml-[18px] pl-0">
                                                {item.children.map((subItem) => {
                                                    const subItemActive = !!(subItem.href && page.url === new URL(subItem.href, window.location.origin).pathname);
                                                    const hasActiveSubChild = subItem.children ? isChildActive(subItem.children) : false;
                                                    const subItemShouldBeActive = subItemActive || hasActiveSubChild;
                                                    
                                                    if (subItem.children && subItem.children.length > 0) {
                                                        return (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <Collapsible asChild defaultOpen={subItemShouldBeActive} className="group/subcollapsible">
                                                                    <div>
                                                                        <CollapsibleTrigger asChild>
                                                                            <SidebarMenuSubButton 
                                                                                isActive={subItemShouldBeActive}
                                                                                className={cn(
                                                                                    "transition-colors duration-150",
                                                                                    subItemShouldBeActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                                                                                )}
                                                                            >
                                                                                {subItem.icon && <subItem.icon className="h-3.5 w-3.5" strokeWidth={1.5} />}
                                                                                <span>{t(subItem.title)}</span>
                                                                                <ChevronRight className="ml-auto h-3 w-3 transition-transform group-data-[state=open]/subcollapsible:rotate-90 text-muted-foreground/50" />
                                                                            </SidebarMenuSubButton>
                                                                        </CollapsibleTrigger>
                                                                        <CollapsibleContent>
                                                                            <SidebarMenuSub className="border-l border-border/30 ml-3">
                                                                                {subItem.children.map((subSubItem) => (
                                                                                    <SidebarMenuSubItem key={subSubItem.title}>
                                                                                        <SidebarMenuSubButton
                                                                                            asChild
                                                                                            isActive={!!(subSubItem.href && page.url === new URL(subSubItem.href, window.location.origin).pathname)}
                                                                                            className={cn(
                                                                                                "text-[12px] transition-colors duration-150",
                                                                                                !!(subSubItem.href && page.url === new URL(subSubItem.href, window.location.origin).pathname) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                                                                                            )}
                                                                                        >
                                                                                            <Link href={subSubItem.href!}>
                                                                                                {subSubItem.icon && <subSubItem.icon className="h-3 w-3" strokeWidth={1.5} />}
                                                                                                <span>{t(subSubItem.title)}</span>
                                                                                            </Link>
                                                                                        </SidebarMenuSubButton>
                                                                                    </SidebarMenuSubItem>
                                                                                ))}
                                                                            </SidebarMenuSub>
                                                                        </CollapsibleContent>
                                                                    </div>
                                                                </Collapsible>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    }
                                                    
                                                    return (
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={subItemActive}
                                                                className={cn(
                                                                    "transition-colors duration-150 h-7 rounded-md px-2.5 group/sub-btn",
                                                                    subItemActive ? "text-foreground font-medium bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                                )}
                                                            >
                                                                <Link href={subItem.href!}>
                                                                    <span className="text-[12px]">{t(subItem.title)}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                                
                                {/* Collapsed sidebar - use dropdown */}
                                <div className="hidden group-data-[collapsible=icon]:block">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={t(item.title)}
                                                isActive={shouldBeActive}
                                                className={shouldBeActive ? "bg-muted text-foreground" : ""}
                                            >
                                                {item.icon && <item.icon strokeWidth={1.5} />}
                                                <span>{t(item.title)}</span>
                                            </SidebarMenuButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="right" align="start" className="w-52 p-1">
                                            {item.children.map((subItem) => {
                                                if (subItem.children && subItem.children.length > 0) {
                                                    return (
                                                        <DropdownMenu key={subItem.title}>
                                                            <DropdownMenuTrigger asChild>
                                                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer p-2 rounded-md">
                                                                    {subItem.icon && <subItem.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />}
                                                                    <span className="flex-1 text-[13px]">{t(subItem.title)}</span>
                                                                    <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                                                                </DropdownMenuItem>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent side="right" align="start" className="w-48 p-1">
                                                                {subItem.children.map((subSubItem) => (
                                                                    <DropdownMenuItem key={subSubItem.title} asChild className="p-2 cursor-pointer rounded-md">
                                                                        <Link href={subSubItem.href!} className="flex items-center gap-2">
                                                                            {subSubItem.icon && <subSubItem.icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />}
                                                                            <span className="text-[12px]">{t(subSubItem.title)}</span>
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    );
                                                }
                                                
                                                return (
                                                    <DropdownMenuItem key={subItem.title} asChild className="p-2 cursor-pointer rounded-md">
                                                        <Link href={subItem.href!} className="flex items-center gap-2">
                                                            {subItem.icon && <subItem.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />}
                                                            <span className="text-[13px]">{t(subItem.title)}</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title} className="px-2 mb-px">
                            <SidebarMenuButton
                                asChild
                                isActive={shouldBeActive}
                                tooltip={t(item.title)}
                                className={cn(
                                    "transition-colors duration-150 h-8 rounded-md",
                                    shouldBeActive ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Link href={item.href!}>
                                    {item.icon && <item.icon className="h-4 w-4" strokeWidth={1.5} />}
                                    <span className="text-[13px]">{t(item.title)}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}