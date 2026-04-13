import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronRight } from 'lucide-react';
import { NavItem } from '@/types';
import { cn } from '@/lib/utils';

import { useTranslation } from 'react-i18next';

export function NavMain({ items = [], searchQuery = '' }: { items: NavItem[]; searchQuery?: string }) {
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
                    children: filteredChildren.length > 0 ? filteredChildren : item.children,
                });
            }
            return acc;
        }, [] as NavItem[]);
    };

    const filteredItems = filterItems(items, searchQuery);

    // Helper function to check if any child is active (recursive for nested children)
    const isChildActive = (children: NavItem[]): boolean => {
        return children.some((child) => {
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
                            <div
                                key={`label-wrapper-${index}`}
                                className="mb-2 mt-6 flex select-none items-center px-4 group-data-[collapsible=icon]:hidden"
                            >
                                <SidebarGroupLabel
                                    key={`label-${index}`}
                                    className="h-auto bg-transparent p-0 text-[10px] font-black tracking-[0.15em] uppercase text-muted-foreground/40"
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
                            <SidebarMenuItem key={`item-${item.title}-${index}`} className="mb-0.5 px-2">
                                <Collapsible
                                    asChild
                                    defaultOpen={shouldBeActive}
                                    className="group/collapsible group-data-[collapsible=icon]:hidden"
                                >
                                    <div>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={t(item.title)}
                                                isActive={shouldBeActive}
                                                className={cn(
                                                    'group relative h-9 rounded-md px-2.5 transition-all duration-150 ease-in-out',
                                                    shouldBeActive
                                                        ? 'bg-primary/5 font-bold text-primary ring-1 ring-primary/10'
                                                        : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                                                )}
                                            >
                                                {item.icon && <item.icon className="h-4 w-4" strokeWidth={1.5} />}
                                                <span className="ms-2.5 flex-1 text-[13px] tracking-tight">{t(item.title)}</span>
                                                <ChevronRight
                                                    className={cn(
                                                        'ms-auto h-3.5 w-3.5 text-muted-foreground/30 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90',
                                                        'rtl:rotate-180 rtl:group-data-[state=open]/collapsible:-rotate-90'
                                                    )}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                            <SidebarMenuSub className="ms-4 mt-1 border-s border-border/40 ps-0 rtl:ms-0 rtl:me-4 rtl:border-s-0 rtl:border-e rtl:pe-0">
                                                {item.children.map((subItem, subIndex) => {
                                                    const subItemActive = !!(
                                                        subItem.href &&
                                                        page.url === new URL(subItem.href, window.location.origin).pathname
                                                    );
                                                    
                                                    return (
                                                        <SidebarMenuSubItem key={`sub-${subItem.title}-${subIndex}`}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={subItemActive}
                                                                className={cn(
                                                                    'group/sub-btn h-8 rounded-md px-3 border-s border-transparent transition-all duration-150',
                                                                    subItemActive
                                                                        ? 'bg-primary/5 font-bold text-primary border-primary/20'
                                                                        : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                                                                )}
                                                            >
                                                                <Link href={subItem.href || '#'}>
                                                                    <span className="text-[12px] tracking-tight whitespace-nowrap">
                                                                        {t(subItem.title)}
                                                                    </span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
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
                                                className={shouldBeActive ? 'bg-primary/5 text-primary' : ''}
                                            >
                                                {item.icon && <item.icon strokeWidth={1.5} />}
                                                <span>{t(item.title)}</span>
                                            </SidebarMenuButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="right" align="start" className="w-52 p-1 border-border/40 backdrop-blur-xl bg-background/95">
                                            {item.children.map((subItem, subIndex) => (
                                                <DropdownMenuItem
                                                    key={`dropitem-${subItem.title}-${subIndex}`}
                                                    asChild
                                                    className="cursor-pointer rounded-md p-2"
                                                >
                                                    <Link href={subItem.href || '#'} className="flex items-center gap-2">
                                                        {subItem.icon && (
                                                            <subItem.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                                        )}
                                                        <span className="text-label-13">{t(subItem.title)}</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <SidebarMenuItem key={`item-link-${item.title}-${index}`} className="mb-px px-2">
                            <SidebarMenuButton
                                asChild
                                isActive={shouldBeActive}
                                tooltip={t(item.title)}
                                className={cn(
                                    'h-8 rounded-md transition-all duration-150 ease-out',
                                    shouldBeActive
                                        ? 'bg-primary/5 font-semibold text-primary'
                                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                                )}
                            >
                                <Link href={item.href!}>
                                    {item.icon && <item.icon className="h-4 w-4" strokeWidth={1.5} />}
                                    <span className="text-label-13">{t(item.title)}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
