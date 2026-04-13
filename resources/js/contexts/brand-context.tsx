import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';

interface BrandSettings {
    logo_dark?: string;
    logo_light?: string;
    favicon?: string;
    titleText?: string;
    footerText?: string;
    layoutDirection?: string;
    themeMode?: string;
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
        titleText: globalSettings?.titleText || 'Noble Architecture',
        footerText:
            globalSettings?.footerText || `© ${new Date().getFullYear()} Noble Architecture. All rights reserved.`,
        layoutDirection: isLanguageRtl ? 'rtl' : 'ltr',
        themeMode: globalSettings?.themeMode || 'light',
    };

    const getPreviewUrl = (path: string) => {
        return getImagePath(path);
    };

    useEffect(() => {
        const root = document.documentElement;

        // Set global RTL direction
        const isRTL = settings.layoutDirection === 'rtl';

        root.dir = isRTL ? 'rtl' : 'ltr';
        root.style.direction = isRTL ? 'rtl' : 'ltr';
        document.body.dir = isRTL ? 'rtl' : 'ltr';
        document.body.style.direction = isRTL ? 'rtl' : 'ltr';

        // Add/remove RTL class from body
        if (isRTL) {
            document.body.classList.add('rtl');
            document.body.classList.remove('ltr');
        } else {
            document.body.classList.add('ltr');
            document.body.classList.remove('rtl');
        }

        // Set theme mode
        const themeMode = settings.themeMode;

        if (themeMode === 'light') {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        } else if (themeMode === 'dark') {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        } else {
            // system mode - let next-themes handle it
            document.body.classList.remove('light', 'dark');
        }

        // Set Font Family — always enforce Geist Sans as the base
        const fontStack = 'Geist Sans, IBM Plex Sans Arabic, system-ui, sans-serif';
        document.body.style.fontFamily = fontStack;
        document.documentElement.style.fontFamily = fontStack;
    }, [settings.layoutDirection, settings.themeMode]);

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
