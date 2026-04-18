import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Palette,
    Save,
    Upload,
    FileText,
    Settings as SettingsIcon,
    Layout,
    Moon,
    SidebarIcon,
    Check,
    Paintbrush,
    Fingerprint,
    ImagePlus,
    MonitorSmartphone
} from 'lucide-react';
import MediaPicker from '@/components/MediaPicker';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { getImagePath } from '@/utils/helpers';
import { ThemePreview } from './theme-preview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandSettings {
    logo_dark: string;
    logo_light: string;
    favicon: string;
    titleText: string;
    footerText: string;
    sidebarVariant?: string;
    sidebarStyle?: string;
    layoutDirection: string;
    themeMode: string;
    themeColor?: string;
    customColor?: string;
    fontFamily?: string;
    [key: string]: any;
}

interface BrandSettingsProps {
    userSettings?: Record<string, string>;
    auth?: any;
}

const TABS = [
    { id: 'logos', label: 'Identity & Logos', icon: Fingerprint },
    { id: 'text', label: 'Typography & Text', icon: FileText },
    { id: 'theme', label: 'Theme & Layout', icon: Paintbrush },
] as const;

export default function BrandSettings({ userSettings, auth }: BrandSettingsProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const canEdit =
        auth?.user?.permissions?.includes('edit-brand-settings') || auth?.user?.roles?.includes('superadmin');
    const [activeSection, setActiveSection] = useState<'logos' | 'text' | 'theme'>('logos');
    
    const [settings, setSettings] = useState<BrandSettings>({
        logo_dark: userSettings?.logo_dark || '',
        logo_light: userSettings?.logo_light || '',
        favicon: userSettings?.favicon || '',
        titleText: userSettings?.titleText || 'Noble Architecture',
        footerText:
            userSettings?.footerText || `© ${new Date().getFullYear()} Noble Architecture. All rights reserved.`,
        layoutDirection: userSettings?.layoutDirection || 'ltr',
        themeMode: userSettings?.themeMode || 'light',
        fontFamily: userSettings?.fontFamily || 'Geist Sans',
        themeColor: userSettings?.themeColor || '#000000',
    });

    useEffect(() => {
        if (userSettings) {
            setSettings({
                logo_dark: userSettings?.logo_dark || '',
                logo_light: userSettings?.logo_light || '',
                favicon: userSettings?.favicon || '',
                titleText: userSettings?.titleText || 'Noble Architecture',
                footerText:
                    userSettings?.footerText ||
                    `© ${new Date().getFullYear()} Noble Architecture. All rights reserved.`,
                layoutDirection: userSettings?.layoutDirection || 'ltr',
                themeMode: userSettings?.themeMode || 'light',
                fontFamily: userSettings?.fontFamily || 'Geist Sans',
                themeColor: userSettings?.themeColor || '#000000',
            });
        }
    }, [userSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleMediaSelect = (name: string, url: string | string[]) => {
        const urlString = Array.isArray(url) ? url[0] || '' : url;
        setSettings((prev) => ({ ...prev, [name]: urlString }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const saveSettings = () => {
        setIsLoading(true);

        router.post(
            route('settings.brand.update'),
            {
                settings: settings,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsLoading(false);
                    router.reload({ only: ['globalSettings'] });
                },
                onError: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <Card variant="premium" className="overflow-visible border-border/40 bg-background/50 backdrop-blur-3xl shadow-sm transition-all duration-500 hover:shadow-lg dark:bg-black/20">
                <div className="absolute inset-x-0 -top-px h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-40" />
                
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 px-8 py-6 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary ring-1 ring-primary/20">
                                <Palette className="h-5 w-5" />
                            </div>
                            {t('Brand Identity')}
                        </CardTitle>
                        <CardDescription className="text-[14px]">
                            {t("Customize your enterprise ecosystem's visual hierarchy, typography, and brand core.")}
                        </CardDescription>
                    </div>
                    {canEdit && (
                        <div className="pt-2 sm:pt-0">
                            <Button 
                                onClick={saveSettings} 
                                disabled={isLoading} 
                                size="default"
                                className="shadow-lg active:scale-95 transition-all"
                            >
                                <Save className="me-2 h-4 w-4" />
                                <span className="font-bold tracking-tight">{isLoading ? t('Saving...') : t('Save Brand')}</span>
                            </Button>
                        </div>
                    )}
                </CardHeader>
                
                <div className="glass-separator opacity-40" />

                <CardContent className="p-8 pb-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                        <div className="lg:col-span-8 flex flex-col space-y-8">
                            
                            {/* Premium Tab Navigation */}
                            <div className="relative inline-flex h-12 items-center justify-start rounded-full bg-muted/40 p-1 text-muted-foreground ring-1 ring-border/50 backdrop-blur-sm self-start">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeSection === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveSection(tab.id as any)}
                                            className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 z-10 ${
                                                isActive ? 'text-foreground' : 'hover:text-foreground/80'
                                            }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-tab"
                                                    className="absolute inset-0 rounded-full bg-background shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            <span className="relative z-20 flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                {t(tab.label)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="min-h-[400px]">
                                <AnimatePresence mode="wait">
                                    {/* Logos Section */}
                                    {activeSection === 'logos' && (
                                        <motion.div 
                                            key="logos"
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                                {/* Light Logo */}
                                                <div className="space-y-4 group">
                                                    <Label htmlFor="logo_dark" className="text-[13px] uppercase tracking-wider text-muted-foreground font-semibold">{t('Logo (Light Mode)')}</Label>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="relative flex h-40 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black p-6 shadow-inner overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md">
                                                            {settings.logo_dark ? (
                                                                <img
                                                                    src={getImagePath(settings.logo_dark)}
                                                                    alt={t('Light Logo')}
                                                                    className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex flex-col items-center gap-3 text-muted-foreground/60">
                                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted shadow-sm">
                                                                        <ImagePlus className="h-6 w-6 opacity-50" />
                                                                    </div>
                                                                    <span className="text-xs font-medium">{t('No logo selected')}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <MediaPicker
                                                            id="logo_dark"
                                                            value={settings.logo_dark}
                                                            onChange={(url) => handleMediaSelect('logo_dark', url)}
                                                            placeholder={t('Upload Light Logo')}
                                                            showPreview={false}
                                                            disabled={!canEdit}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Dark Logo */}
                                                <div className="space-y-4 group">
                                                    <Label htmlFor="logo_light" className="text-[13px] uppercase tracking-wider text-muted-foreground font-semibold">{t('Logo (Dark Mode)')}</Label>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="relative flex h-40 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-gray-900 to-black dark:from-zinc-800 dark:to-zinc-950 p-6 shadow-inner overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md">
                                                            {settings.logo_light ? (
                                                                <img
                                                                    src={getImagePath(settings.logo_light)}
                                                                    alt={t('Dark Logo')}
                                                                    className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex flex-col items-center gap-3 text-gray-500">
                                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 shadow-sm">
                                                                        <ImagePlus className="h-6 w-6 opacity-30" />
                                                                    </div>
                                                                    <span className="text-xs font-medium">{t('No logo selected')}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <MediaPicker
                                                            id="logo_light"
                                                            value={settings.logo_light}
                                                            onChange={(url) => handleMediaSelect('logo_light', url)}
                                                            placeholder={t('Upload Dark Logo')}
                                                            showPreview={false}
                                                            disabled={!canEdit}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Favicon */}
                                                <div className="space-y-4 group col-span-1 md:col-span-2 md:w-1/2">
                                                    <Label htmlFor="favicon" className="text-[13px] uppercase tracking-wider text-muted-foreground font-semibold">{t('System Favicon')}</Label>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md">
                                                            {settings.favicon ? (
                                                                <img
                                                                    src={getImagePath(settings.favicon)}
                                                                    alt={t('Favicon')}
                                                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                                                />
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center opacity-50">
                                                                    <Layout className="h-8 w-8 mb-1" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <MediaPicker
                                                            id="favicon"
                                                            value={settings.favicon}
                                                            onChange={(url) => handleMediaSelect('favicon', url)}
                                                            placeholder={t('Select favicon')}
                                                            showPreview={false}
                                                            disabled={!canEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Text Section */}
                                    {activeSection === 'text' && (
                                        <motion.div 
                                            key="text"
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}
                                            className="space-y-8 max-w-2xl"
                                        >
                                            <div className="space-y-2.5">
                                                <Label htmlFor="titleText" className="text-sm font-semibold">{t('Platform Title')}</Label>
                                                <Input
                                                    id="titleText"
                                                    name="titleText"
                                                    value={settings.titleText}
                                                    onChange={handleInputChange}
                                                    placeholder="Noble Architecture"
                                                    disabled={!canEdit}
                                                    className="h-11 bg-background/50 focus-visible:ring-primary/50"
                                                />
                                                <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 mt-1.5">
                                                    <MonitorSmartphone className="h-3.5 w-3.5" />
                                                    {t('This title appears in browser tabs and authentication screens.')}
                                                </p>
                                            </div>

                                            <div className="space-y-2.5">
                                                <Label htmlFor="footerText" className="text-sm font-semibold">{t('Copyright Footer')}</Label>
                                                <Input
                                                    id="footerText"
                                                    name="footerText"
                                                    value={settings.footerText}
                                                    onChange={handleInputChange}
                                                    placeholder={t(`© ${new Date().getFullYear()} Noble Architecture. All rights reserved.`)}
                                                    disabled={!canEdit}
                                                    className="h-11 bg-background/50 focus-visible:ring-primary/50"
                                                />
                                                <p className="text-[13px] text-muted-foreground mt-1.5">
                                                    {t('Displayed at the bottom of standard pages and reports.')}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Theme Section */}
                                    {activeSection === 'theme' && (
                                        <motion.div 
                                            key="theme"
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}
                                            className={`grid grid-cols-1 md:grid-cols-2 gap-10 ${!canEdit ? 'pointer-events-none opacity-60' : ''}`}
                                        >
                                            {/* Layout Section */}
                                            <div className="space-y-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="rounded-md bg-secondary/80 p-1.5 text-foreground shadow-sm">
                                                        <Layout className="h-4 w-4" />
                                                    </div>
                                                    <h3 className="text-md font-semibold tracking-tight">{t('Layout Direction')}</h3>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <Button
                                                        type="button"
                                                        variant={settings.layoutDirection === 'ltr' ? 'default' : 'outline'}
                                                        className={`h-12 justify-center font-medium transition-all ${settings.layoutDirection === 'ltr' ? 'shadow-md shadow-primary/20' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                                        onClick={() => handleSelectChange('layoutDirection', 'ltr')}
                                                    >
                                                        {t('Left-to-Right')}
                                                        {settings.layoutDirection === 'ltr' && <Check className="ms-2 h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={settings.layoutDirection === 'rtl' ? 'default' : 'outline'}
                                                        className={`h-12 justify-center font-medium transition-all ${settings.layoutDirection === 'rtl' ? 'shadow-md shadow-primary/20' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                                        onClick={() => handleSelectChange('layoutDirection', 'rtl')}
                                                    >
                                                        {t('Right-to-Left')}
                                                        {settings.layoutDirection === 'rtl' && <Check className="ms-2 h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Mode Section */}
                                            <div className="space-y-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="rounded-md bg-secondary/80 p-1.5 text-foreground shadow-sm">
                                                        <Moon className="h-4 w-4" />
                                                    </div>
                                                    <h3 className="text-md font-semibold tracking-tight">{t('System Appearance')}</h3>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    {['light', 'dark', 'system'].map((mode) => (
                                                        <Button
                                                            key={mode}
                                                            type="button"
                                                            variant={settings.themeMode === mode ? 'default' : 'outline'}
                                                            className={`h-12 justify-center capitalize font-medium transition-all ${settings.themeMode === mode ? 'shadow-md shadow-primary/20' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                                            onClick={() => handleSelectChange('themeMode', mode)}
                                                        >
                                                        {t(mode)}
                                                            {settings.themeMode === mode && <Check className="ms-1.5 h-3.5 w-3.5" />}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Typography Section */}
                                            <div className="space-y-5 col-span-1 md:col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="rounded-md bg-secondary/80 p-1.5 text-foreground shadow-sm">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <h3 className="text-md font-semibold tracking-tight">{t('Typography Engine')}</h3>
                                                </div>

                                                <div className="flex flex-col gap-2 max-w-sm">
                                                    <Select
                                                        value={settings.fontFamily || 'Geist Sans'}
                                                        onValueChange={(value) => handleSelectChange('fontFamily', value)}
                                                    >
                                                        <SelectTrigger id="fontFamily" className="w-full h-12 bg-background/50 font-medium">
                                                            <SelectValue placeholder={t('Select font family')} />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[300px]">
                                                            <SelectItem value="Geist Sans" style={{ fontFamily: 'Geist Sans' }}>Geist Sans (UI Default)</SelectItem>
                                                            <SelectItem value="'Inter', sans-serif" style={{ fontFamily: 'Inter' }}>Inter (Clean & Modern)</SelectItem>
                                                            <SelectItem value="'Outfit', sans-serif" style={{ fontFamily: 'Outfit' }}>Outfit (Geometric)</SelectItem>
                                                            <SelectItem value="'Plus Jakarta Sans', sans-serif" style={{ fontFamily: 'Plus Jakarta Sans' }}>Plus Jakarta Sans (Premium)</SelectItem>
                                                            <SelectItem value="'Poppins', sans-serif" style={{ fontFamily: 'Poppins' }}>Poppins (Playful)</SelectItem>
                                                            <SelectItem value="'Roboto', sans-serif" style={{ fontFamily: 'Roboto' }}>Roboto (Corporate)</SelectItem>
                                                            <SelectItem value="'Tajawal', sans-serif" style={{ fontFamily: 'Tajawal' }}>Tajawal (Arabic Focus)</SelectItem>
                                                            <SelectItem value="'Cairo', sans-serif" style={{ fontFamily: 'Cairo' }}>Cairo (Classic Arabic)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <p className="text-[13px] text-muted-foreground leading-relaxed mt-2">
                                                        {t('Typography instantly propagates via CSS variables to all SaaS components and localized matrices without requiring a system restart.')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Primary Color Section */}
                                            <div className="space-y-5 col-span-1 md:col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="rounded-md bg-secondary/80 p-1.5 text-foreground shadow-sm">
                                                        <Palette className="h-4 w-4" />
                                                    </div>
                                                    <h3 className="text-md font-semibold tracking-tight">{t('Primary Accent Color')}</h3>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="relative group">
                                                        <div 
                                                            className="h-14 w-14 rounded-full border-4 border-background shadow-lg ring-1 ring-border cursor-pointer transition-transform hover:scale-110 active:scale-95 overflow-hidden"
                                                            style={{ backgroundColor: settings.themeColor }}
                                                            onClick={() => document.getElementById('themeColorPicker')?.click()}
                                                        />
                                                        <input 
                                                            id="themeColorPicker"
                                                            type="color" 
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                            value={settings.themeColor}
                                                            onChange={(e) => handleSelectChange('themeColor', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <Input 
                                                            value={settings.themeColor}
                                                            onChange={(e) => handleSelectChange('themeColor', e.target.value)}
                                                            className="h-10 w-32 font-mono text-sm uppercase"
                                                        />
                                                        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">{t('HEX Code')}</span>
                                                    </div>
                                                    <div className="hidden sm:block ps-6 max-w-xs">
                                                        <p className="text-[13px] text-muted-foreground leading-tight">
                                                            {t('This color will be used for buttons, active states, and highlights throughout the ecosystem.')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Visual Live Preview Column */}
                        <div className="lg:col-span-4 border-s border-border/40 ps-0 lg:ps-8 mt-8 lg:mt-0">
                            <div className="sticky top-24 space-y-6">
                                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-5 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                                    <div className="absolute bottom-0 start-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
                                    
                                    <div className="mb-5 flex items-center gap-2 relative z-10">
                                        <div className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </div>
                                        <h3 className="font-semibold text-sm tracking-widest uppercase text-muted-foreground">{t('Live Preview')}</h3>
                                    </div>

                                    <div className="relative z-10 rounded-lg overflow-hidden border border-border/40 shadow-sm">
                                        <ThemePreview
                                            logoDark={settings.logo_dark}
                                            logoLight={settings.logo_light}
                                            themeColor={settings.themeColor}
                                            customColor={settings.customColor}
                                            sidebarVariant={settings.sidebarVariant}
                                            sidebarStyle={settings.sidebarStyle}
                                            layoutDirection={settings.layoutDirection}
                                            themeMode={settings.themeMode}
                                        />
                                    </div>

                                    <div className="mt-6 border-t border-border/50 pt-5 relative z-10 space-y-3">
                                        <div className="flex flex-col gap-1 text-sm bg-muted/40 p-3 rounded-md">
                                            <span className="text-xs font-semibold uppercase text-muted-foreground">{t('Title')}</span>
                                            <span className="font-medium truncate" style={{ fontFamily: settings.fontFamily }}>{settings.titleText || '—'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-sm bg-muted/40 p-3 rounded-md">
                                            <span className="text-xs font-semibold uppercase text-muted-foreground">{t('Footer')}</span>
                                            <span className="font-medium truncate text-muted-foreground text-[12px]" style={{ fontFamily: settings.fontFamily }}>{settings.footerText || '—'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
