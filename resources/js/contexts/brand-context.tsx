import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';

export interface BrandSettings {
    logo_dark?: string;
    logo_light?: string;
    favicon?: string;
    fontFamily?: string;
    titleText?: string;
    footerText?: string;
    layoutDirection?: string;
    themeMode?: string;
    themeColor?: string;
}

interface BrandContextType {
    settings: BrandSettings;
    getPreviewUrl: (path: string) => string;
    getCompleteSidebarProps: () => { style: React.CSSProperties; className: string };
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
    const { adminAllSetting, companyAllSetting, auth } = usePage().props as any;
    const isSuperAdmin = auth?.user?.roles?.includes('superadmin');
    const { i18n } = useTranslation();

    let globalSettings: any = {};
    if (isSuperAdmin !== undefined) {
        globalSettings = isSuperAdmin ? adminAllSetting || {} : companyAllSetting || {};
    } else {
        globalSettings = adminAllSetting || {};
    }

    const lang = i18n?.language || auth?.lang || 'en';
    const isLanguageRtl = ['ar', 'he', 'fa', 'ur', 'ar-SA', 'ar-AE'].includes(lang.substring(0, 2));

    const settings: BrandSettings = {
        logo_dark: globalSettings?.logo_dark || '',
        logo_light: globalSettings?.logo_light || '',
        favicon: globalSettings?.favicon || '',
        fontFamily: globalSettings?.fontFamily || globalSettings?.font_family || '',
        titleText: globalSettings?.titleText || 'Noble Architecture',
        footerText:
            globalSettings?.footerText || `© ${new Date().getFullYear()} Noble Architecture. All rights reserved.`,
        layoutDirection: isLanguageRtl ? 'rtl' : 'ltr',
        themeMode: globalSettings?.themeMode || 'light',
        themeColor: globalSettings?.themeColor || globalSettings?.theme_color || '',
    };

    const getPreviewUrl = (path: string) => {
        return getImagePath(path);
    };

    useEffect(() => {
        const root = document.documentElement;

        // ─── RTL Direction ───
        const isRTL = settings.layoutDirection === 'rtl';
        root.dir = isRTL ? 'rtl' : 'ltr';
        root.style.direction = isRTL ? 'rtl' : 'ltr';
        document.body.dir = isRTL ? 'rtl' : 'ltr';
        document.body.style.direction = isRTL ? 'rtl' : 'ltr';

        if (isRTL) {
            document.body.classList.add('rtl');
            document.body.classList.remove('ltr');
        } else {
            document.body.classList.add('ltr');
            document.body.classList.remove('rtl');
        }

        // ─── Theme Mode (Vercel 2026 — class-based on <html>) ───
        const themeMode = settings.themeMode;

        if (themeMode === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else if (themeMode === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        } else {
            // System mode — check prefers-color-scheme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
                root.classList.remove('light');
                document.body.classList.add('dark');
                document.body.classList.remove('light');
            } else {
                root.classList.remove('dark');
                root.classList.add('light');
                document.body.classList.remove('dark');
                document.body.classList.add('light');
            }
        }

        // ─── Font Stack ───
        const fontStack = settings.fontFamily 
            ? `${settings.fontFamily}, 'IBM Plex Sans Arabic', system-ui, sans-serif`
            : "'Geist Sans', 'IBM Plex Sans Arabic', system-ui, sans-serif";
            
        document.body.style.fontFamily = fontStack;
        document.documentElement.style.fontFamily = fontStack;

        // ─── Theme Color (Primary Accent) ───
        if (settings.themeColor) {
            const hex = settings.themeColor;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            // Convert to HSL for Tailwind compatibility
            const r_norm = r / 255, g_norm = g / 255, b_norm = b / 255;
            const max = Math.max(r_norm, g_norm, b_norm), min = Math.min(r_norm, g_norm, b_norm);
            let h = 0, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r_norm: h = (g_norm - b_norm) / d + (g_norm < b_norm ? 6 : 0); break;
                    case g_norm: h = (b_norm - r_norm) / d + 2; break;
                    case b_norm: h = (r_norm - g_norm) / d + 4; break;
                }
                h /= 6;
            }

            const h_deg = Math.round(h * 360);
            const s_pct = Math.round(s * 100);
            const l_pct = Math.round(l * 100);

            // Inject into CSS variables
            root.style.setProperty('--primary', `${h_deg} ${s_pct}% ${l_pct}%`);
            root.style.setProperty('--primary-foreground', l > 0.6 ? '0 0% 0%' : '0 0% 100%');
            
            // Also update ring color for focus states
            root.style.setProperty('--ring', `${h_deg} ${s_pct}% ${l_pct}%`);
        }
    }, [settings.layoutDirection, settings.themeMode, settings.fontFamily, settings.themeColor]);

    const getCompleteSidebarProps = () => {
        return {
            style: {},
            className: '',
        };
    };

    return (
        <BrandContext.Provider
            value={{
                settings,
                getPreviewUrl,
                getCompleteSidebarProps,
            }}
        >
            {children}
        </BrandContext.Provider>
    );
}

export function useBrand() {
    const context = useContext(BrandContext);
    if (context === undefined) {
        throw new Error('useBrand must be used within a BrandProvider');
    }
    return context;
}
