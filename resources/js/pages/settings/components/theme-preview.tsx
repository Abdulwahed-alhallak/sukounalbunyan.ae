import React from 'react';
import { useTranslation } from 'react-i18next';
import { getImagePath } from '@/utils/helpers';

interface ThemePreviewProps {
    logoDark?: string;
    logoLight?: string;
    themeColor?: string;
    customColor?: string;
    sidebarVariant?: string;
    sidebarStyle?: string;
    layoutDirection?: string;
    themeMode?: string;
}

export function ThemePreview({
    logoDark,
    logoLight,
    themeColor = 'green',
    customColor = '#10b77f',
    sidebarVariant = 'inset',
    sidebarStyle = 'plain',
    layoutDirection = 'ltr',
    themeMode = 'light',
}: ThemePreviewProps) {
    const { t } = useTranslation();

    const getDisplayUrl = (path: string): string => {
        if (!path) return path;
        return getImagePath(path);
    };

    const themeColors = {
        blue: '#3b82f6',
        green: '#10b77f',
        purple: '#8b5cf6',
        orange: '#f97316',
        red: '#ef4444',
    };

    const primaryColor =
        themeColor === 'custom' ? customColor : themeColors[themeColor as keyof typeof themeColors] || '#10b77f';

    const systemIsDark =
        typeof document !== 'undefined' &&
        (document.documentElement.classList.contains('dark') || document.body.classList.contains('dark'));
    const isDark = themeMode === 'dark' || (themeMode === 'system' && systemIsDark);
    const isRTL = layoutDirection === 'rtl';

    const getSidebarStyles = () => {
        let baseClasses = 'w-16 border-r flex flex-col py-3 px-2 gap-2';

        if (sidebarStyle === 'colored') {
            baseClasses += ' text-background';
        } else if (sidebarStyle === 'gradient') {
            baseClasses += ' text-background';
        }

        return baseClasses;
    };

    const getSidebarBackground = () => {
        if (sidebarStyle === 'colored') {
            return { backgroundColor: primaryColor };
        } else if (sidebarStyle === 'gradient') {
            return {
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}80 100%)`,
            };
        }
        return {};
    };

    const currentLogo = isDark ? logoLight : logoDark;

    return (
        <div
            className={`overflow-hidden rounded-lg border text-xs transition-all duration-300 ${
                isDark ? 'border-border bg-foreground text-background' : 'bg-background text-foreground'
            } ${isRTL ? 'rtl' : 'ltr'}`}
            style={
                {
                    '--primary-color': primaryColor,
                } as React.CSSProperties
            }
        >
            {/* Top Bar */}
            <div
                className={`flex items-center justify-between border-b px-3 py-2 ${
                    isDark ? 'border-border bg-card' : 'bg-muted'
                }`}
            >
                <div className="order-1 flex items-center gap-2 rtl:order-2">
                    <span className="font-medium">{t('Dashboard')}</span>
                </div>
                <div className="order-2 flex items-center gap-1 rtl:order-1">
                    <div className={`h-4 w-4 rounded ${isDark ? 'bg-muted' : 'bg-muted-foreground/20'}`}></div>
                    <div className={`h-4 w-4 rounded ${isDark ? 'bg-muted' : 'bg-muted-foreground/20'}`}></div>
                </div>
            </div>

            {/* Main Layout */}
            <div className={`flex h-48 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Sidebar */}
                <div
                    className={`order-1 rtl:order-2 ${getSidebarStyles()} ${
                        sidebarVariant === 'floating' ? 'm-2 rounded-lg shadow-sm' : ''
                    } ${sidebarVariant === 'minimal' ? 'w-12' : 'w-16'} ${
                        isDark && sidebarStyle === 'plain'
                            ? 'border-border bg-card'
                            : !isDark && sidebarStyle === 'plain'
                              ? 'bg-muted/50'
                              : ''
                    }`}
                    style={getSidebarBackground()}
                >
                    {/* Logo */}
                    <div className="mb-2 flex justify-center">
                        {currentLogo ? (
                            <img src={getDisplayUrl(currentLogo)} alt="Logo" className="h-4 w-8 object-contain" />
                        ) : (
                            <div className="h-2 w-8 rounded" style={{ backgroundColor: primaryColor }}></div>
                        )}
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                        <div
                            className="h-2 w-full rounded"
                            style={{
                                backgroundColor: sidebarStyle === 'plain' ? primaryColor : 'rgba(255,255,255,0.8)',
                            }}
                        ></div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 w-full rounded ${
                                    sidebarStyle === 'plain'
                                        ? isDark
                                            ? 'bg-muted'
                                            : 'bg-muted-foreground/30'
                                        : 'bg-card/30'
                                }`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="order-2 flex-1 space-y-2 p-3 rtl:order-1">
                    <div className={`h-2 w-3/4 rounded ${isDark ? 'bg-muted' : 'bg-muted'}`}></div>
                    <div className={`h-2 w-1/2 rounded ${isDark ? 'bg-muted' : 'bg-muted'}`}></div>
                    <div className={`h-2 w-2/3 rounded ${isDark ? 'bg-muted' : 'bg-muted'}`}></div>
                    <div className="mt-3 flex gap-2">
                        <div className="h-4 w-6 rounded" style={{ backgroundColor: `${primaryColor}33` }}></div>
                        <div className={`h-4 w-6 rounded ${isDark ? 'bg-muted' : 'bg-muted'}`}></div>
                        <div className={`h-4 w-6 rounded ${isDark ? 'bg-muted' : 'bg-muted'}`}></div>
                    </div>
                    <div className="mt-4 space-y-1">
                        <div className={`h-1.5 w-full rounded ${isDark ? 'bg-muted' : 'bg-muted'}`}></div>
                        <div className={`h-1.5 w-4/5 rounded ${isDark ? 'bg-muted' : 'bg-muted'}`}></div>
                        <div className={`h-1.5 w-3/5 rounded ${isDark ? 'bg-muted' : 'bg-muted'}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
