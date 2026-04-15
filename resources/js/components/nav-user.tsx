'use client';

import { BadgeCheck, ChevronsUpDown, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { getImagePath } from '@/utils/helpers';
import React from 'react';
import { PageProps } from '@/types';

export function NavUser({ user, inHeader = false }: { user: User; inHeader?: boolean }) {
    const { isMobile } = useSidebar();
    const { setTheme } = useTheme();
    const { i18n, t } = useTranslation();
    const { auth } = usePage<PageProps>().props;


    if (inHeader) {
        return (
            <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                    <LanguageSwitcher />
                </div>

                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <button className="group relative flex items-center justify-center rounded-full p-0.5 ring-1 ring-border transition-all duration-300 hover:ring-foreground/30 active:scale-95">
                            <Avatar className="h-8 w-8 rounded-full border-2 border-background shadow-sm">
                                {(user as any).avatar && (
                                    <AvatarImage src={getImagePath((user as any).avatar)} alt={user.name} />
                                )}
                                <AvatarFallback className="rounded-full bg-muted text-[10px] font-bold">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5 shadow-2xl animate-in zoom-in-95 duration-200">
                        <DropdownMenuLabel className="px-3 py-2.5">
                            <div className="flex flex-col space-y-0.5">
                                <p className="text-[13px] font-bold tracking-tight text-foreground">{t(user.name)}</p>
                                <p className="truncate text-[11px] font-medium text-muted-foreground/70">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="mx-1" />
                        <DropdownMenuGroup className="p-1">
                            {auth.user?.permissions?.includes('manage-profile') && (
                                <DropdownMenuItem asChild className="rounded-md px-3 py-2 text-[12px] font-medium transition-colors focus:bg-accent cursor-pointer">
                                    <Link href={route('profile.edit')} className="flex w-full items-center">
                                        <BadgeCheck className="me-2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                        {t('Security Protocol')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="mx-1" />
                        <div className="grid grid-cols-3 gap-1 p-1">
                            <button onClick={() => setTheme('light')} className="flex flex-col items-center gap-1.5 rounded-md py-2.5 transition-colors hover:bg-accent group">
                                <Sun className="h-3.5 w-3.5 text-muted-foreground group-hover:text-amber-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('Day')}</span>
                            </button>
                            <button onClick={() => setTheme('dark')} className="flex flex-col items-center gap-1.5 rounded-md py-2.5 transition-colors hover:bg-accent group">
                                <Moon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-indigo-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('Night')}</span>
                            </button>
                            <button onClick={() => setTheme('system')} className="flex flex-col items-center gap-1.5 rounded-md py-2.5 transition-colors hover:bg-accent group">
                                <Monitor className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('Auto')}</span>
                            </button>
                        </div>
                        <DropdownMenuSeparator className="mx-1" />
                        <DropdownMenuItem asChild className="rounded-md px-3 py-2 text-[12px] font-bold text-destructive focus:bg-destructive/5 focus:text-destructive cursor-pointer">
                            <Link className="flex w-full items-center" href={route('logout')} method={'post'} as={'button'}>
                                <LogOut className="me-2 h-4 w-4" strokeWidth={1.5} />
                                {t('Terminate Session')}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-md">
                                {(user as any).avatar && (
                                    <AvatarImage src={getImagePath((user as any).avatar)} alt={user.name} />
                                )}
                                <AvatarFallback className="rounded-md">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-semibold">{t(user.name)}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ms-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                                <Avatar className="h-8 w-8 rounded-md">
                                    {(user as any).avatar && (
                                        <AvatarImage src={getImagePath((user as any).avatar)} alt={user.name} />
                                    )}
                                    <AvatarFallback className="rounded-md">
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-start text-sm leading-tight">
                                    <span className="truncate font-semibold">{t(user.name)}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {auth.user?.permissions?.includes('manage-profile') && (
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')}>
                                        <BadgeCheck className="me-2 h-4 w-4" strokeWidth={1.5} />
                                        {t('Edit Profile')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                                <Sun className="me-2 h-4 w-4" />
                                {t('Light')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                                <Moon className="me-2 h-4 w-4" />
                                {t('Dark')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('system')}>
                                <Monitor className="me-2 h-4 w-4" />
                                {t('System')}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">
                                {t('Language')}
                            </DropdownMenuLabel>
                            <div className="px-2 pb-2">
                                <LanguageSwitcher />
                            </div>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link className="w-full" href={route('logout')} method={'post'} as={'button'}>
                                <LogOut className="me-2 h-4 w-4" strokeWidth={1.5} />
                                {t('Log out')}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
