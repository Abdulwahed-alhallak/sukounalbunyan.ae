import React from 'react';
import { useTranslation } from 'react-i18next';

interface LandingPreviewProps {
    [key: string]: any;
    settings?: any;
}

export function LandingPreview({ settings }: LandingPreviewProps) {
    const { t } = useTranslation();
    const getSectionData = (key: string) => {
        return settings?.config_sections?.sections?.[key] || {};
    };

    const isSectionVisible = (key: string) => {
        return settings?.config_sections?.section_visibility?.[key] !== false;
    };

    const colors = settings?.config_sections?.colors || {
        primary: '#10b77f',
        secondary: '#059669',
        accent: '#f59e0b',
    };

    const sectionOrder = settings?.config_sections?.section_order || [
        'header',
        'hero',
        'stats',
        'features',
        'modules',
        'benefits',
        'gallery',
        'cta',
        'footer',
    ];

    const renderMiniSection = (sectionKey: string) => {
        if (!isSectionVisible(sectionKey)) return null;

        const sectionData = getSectionData(sectionKey);

        switch (sectionKey) {
            case 'header':
                return (
                    <div key={sectionKey} className="flex items-center justify-between border-b bg-card p-3 shadow-sm">
                        <div className="text-sm font-bold" style={{ color: colors.primary }}>
                            {sectionData.company_name || settings?.company_name || 'Sukoun Albunyan'}
                        </div>
                        <div
                            className="rounded-full px-3 py-1 text-xs text-background shadow-sm transition-colors"
                            style={{ backgroundColor: colors.primary }}
                        >
                            {sectionData.cta_text || t('Get Started')}
                        </div>
                    </div>
                );

            case 'hero':
                return (
                    <div
                        key={sectionKey}
                        className="relative overflow-hidden p-4 text-center text-background"
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
                        }}
                    >
                        <div className="absolute inset-0 bg-foreground/10"></div>
                        <div className="relative z-10">
                            <div className="mb-2 text-sm font-bold leading-tight">
                                {sectionData.title || t('Transform Your Business')}
                            </div>
                            <div className="mb-3 text-xs leading-relaxed opacity-90">
                                {sectionData.subtitle?.substring(0, 60) || t('Complete business solution')}...
                            </div>
                            <div className="flex justify-center gap-2">
                                <div
                                    className="rounded-full bg-card px-3 py-1.5 text-xs font-medium shadow-lg transition-shadow hover:shadow-xl"
                                    style={{ color: colors.primary }}
                                >
                                    {sectionData.primary_button_text || t('Start Trial')}
                                </div>
                                <div className="rounded-full border border-white/50 px-3 py-1.5 text-xs backdrop-blur-sm transition-colors hover:bg-card/10">
                                    {sectionData.secondary_button_text || t('Login')}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'stats':
                return (
                    <div
                        key={sectionKey}
                        className="p-4 text-background"
                        style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}
                    >
                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="rounded-lg bg-card/10 p-2 backdrop-blur-sm">
                                <div className="text-sm font-bold">{sectionData.businesses || '10K+'}</div>
                                <div className="text-xs opacity-90">{t('Businesses')}</div>
                            </div>
                            <div className="rounded-lg bg-card/10 p-2 backdrop-blur-sm">
                                <div className="text-sm font-bold">{sectionData.uptime || '99.9%'}</div>
                                <div className="text-xs opacity-90">{t('Uptime')}</div>
                            </div>
                            <div className="rounded-lg bg-card/10 p-2 backdrop-blur-sm">
                                <div className="text-sm font-bold">{sectionData.support || '24/7'}</div>
                                <div className="text-xs opacity-90">{t('Support')}</div>
                            </div>
                            <div className="rounded-lg bg-card/10 p-2 backdrop-blur-sm">
                                <div className="text-sm font-bold">{sectionData.countries || '50+'}</div>
                                <div className="text-xs opacity-90">{t('Countries')}</div>
                            </div>
                        </div>
                    </div>
                );

            case 'features':
                return (
                    <div key={sectionKey} className="bg-muted/50 p-4">
                        <div className="mb-3 text-center text-sm font-bold text-foreground">
                            {sectionData.title || t('Powerful Features')}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {(sectionData.features || [{}, {}, {}, {}]).slice(0, 4)?.map((feature: any, i: number) => (
                                <div
                                    key={i}
                                    className="rounded-lg border bg-card p-2 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div
                                        className="mx-auto mb-1 h-4 w-4 rounded-lg"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        }}
                                    ></div>
                                    <div className="text-center text-xs font-medium text-foreground">
                                        {feature.title?.substring(0, 10) || `Feature ${i + 1}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'modules':
                return (
                    <div key={sectionKey} className="bg-card p-2">
                        <div className="mb-1 text-center text-xs font-bold">
                            {sectionData.title || t('Business Solutions')}
                        </div>
                        <div className="flex justify-center gap-1">
                            {['ERP', 'CRM', 'HRM', 'POS']?.map((module, i) => (
                                <div key={i} className="rounded bg-muted px-1 py-0.5 text-xs">
                                    {module}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'benefits':
                return (
                    <div key={sectionKey} className="bg-muted/50 p-2">
                        <div className="mb-1 text-center text-xs font-bold">
                            {sectionData.title || 'Why Choose Us?'}
                        </div>
                        <div className="space-y-1">
                            {Array.from({ length: 3 })?.map((_, i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <div className="bg-muted/500 h-1 w-1 rounded-full"></div>
                                    <div className="text-xs text-muted-foreground">
                                        {t('Benefit')} {i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'gallery':
                return (
                    <div key={sectionKey} className="bg-card p-2">
                        <div className="mb-1 text-center text-xs font-bold">{sectionData.title || 'Gallery'}</div>
                        <div className="grid grid-cols-3 gap-1">
                            {Array.from({ length: 3 })?.map((_, i) => (
                                <div key={i} className="aspect-square rounded bg-muted"></div>
                            ))}
                        </div>
                    </div>
                );

            case 'cta':
                return (
                    <div
                        key={sectionKey}
                        className="p-2 text-center text-background"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <div className="mb-1 text-xs font-bold">{sectionData.title || t('Ready to Transform?')}</div>
                        <div className="flex justify-center gap-1">
                            <div className="rounded bg-card px-2 py-1 text-xs" style={{ color: colors.primary }}>
                                {sectionData.primary_button || t('Start Trial')}
                            </div>
                            <div className="rounded border border-white px-2 py-1 text-xs">
                                {sectionData.secondary_button || t('Contact')}
                            </div>
                        </div>
                    </div>
                );

            case 'footer':
                return (
                    <div key={sectionKey} className="bg-gradient-to-r from-foreground to-card p-4 text-background">
                        <div className="grid grid-cols-1 gap-3 text-xs">
                            <div className="border-b border-border pb-2 text-center">
                                <div className="text-sm font-bold" style={{ color: colors.accent }}>
                                    {settings?.company_name || t('Sukoun Albunyan')}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    {sectionData.description?.substring(0, 30) || t('Business solution')}...
                                </div>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>{t('Product')}</span>
                                <span>{t('Company')}</span>
                                <span>{t('Support')}</span>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border bg-card shadow-lg">
            <div
                className="border-b px-3 py-2"
                style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}
            >
                <div className="flex items-center gap-2 text-sm font-semibold text-background">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-card"></div>
                    {t('Live Preview')}
                </div>
            </div>
            <div className="relative">
                <div className="absolute end-2 top-2 z-10">
                    <div className="rounded-full bg-foreground/20 px-2 py-1 backdrop-blur-sm">
                        <div className="text-xs font-medium text-background">{t('Mobile View')}</div>
                    </div>
                </div>
                <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-[500px] overflow-y-auto">
                    <div className="space-y-0">{sectionOrder?.map((sectionKey) => renderMiniSection(sectionKey))}</div>
                </div>
            </div>
            <div className="border-t bg-muted/50 px-3 py-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        {sectionOrder.filter((key) => isSectionVisible(key)).length} {t('sections active')}
                    </span>
                    <div className="flex gap-1">
                        <div className="bg-muted/500 h-1 w-1 rounded-full"></div>
                        <span>{t('Live')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
