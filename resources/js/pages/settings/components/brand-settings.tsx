import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';
import MediaPicker from '@/components/MediaPicker';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { getImagePath } from '@/utils/helpers';
import { ThemePreview } from './theme-preview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

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

export default function BrandSettings({ userSettings, auth }: BrandSettingsProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const canEdit = auth?.user?.permissions?.includes('edit-brand-settings');
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
    });

    // Update settings when userSettings prop changes
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
                    // Reload settings to get updated values
                    router.reload({ only: ['globalSettings'] });
                },
                onError: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="order-1 rtl:order-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Palette className="h-5 w-5" />
                        {t('Brand Settings')}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t("Customize your application's branding and appearance")}
                    </p>
                </div>
                {canEdit && (
                    <Button className="order-2 rtl:order-1" onClick={saveSettings} disabled={isLoading} size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? t('Saving...') : t('Save Changes')}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex space-x-2">
                            <Button
                                variant={activeSection === 'logos' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveSection('logos')}
                                className="flex-1"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {t('Logos')}
                            </Button>
                            <Button
                                variant={activeSection === 'text' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveSection('text')}
                                className="flex-1"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                {t('Text')}
                            </Button>
                            <Button
                                variant={activeSection === 'theme' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveSection('theme')}
                                className="flex-1"
                            >
                                <SettingsIcon className="mr-2 h-4 w-4" />
                                {t('Theme')}
                            </Button>
                        </div>

                        {/* Logos Section */}
                        {activeSection === 'logos' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label>{t('Logo (Light Mode)')}</Label>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex h-32 items-center justify-center rounded-md border bg-muted/30 p-4">
                                                {settings.logo_dark ? (
                                                    <img
                                                        src={getImagePath(settings.logo_dark)}
                                                        alt={t('Light Logo')}
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                        <div className="flex h-12 w-24 items-center justify-center rounded border border-dashed bg-muted">
                                                            <span className="font-semibold text-muted-foreground">
                                                                {t('Logo')}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs">{t('No logo selected')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <MediaPicker
                                                value={settings.logo_dark}
                                                onChange={(url) => handleMediaSelect('logo_dark', url)}
                                                placeholder={t('Select light mode logo...')}
                                                showPreview={false}
                                                disabled={!canEdit}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>{t('Logo (Dark Mode)')}</Label>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex h-32 items-center justify-center rounded-md border bg-card p-4">
                                                {settings.logo_light ? (
                                                    <img
                                                        src={getImagePath(settings.logo_light)}
                                                        alt={t('Dark Logo')}
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                        <div className="flex h-12 w-24 items-center justify-center rounded border border-dashed bg-muted">
                                                            <span className="font-semibold text-muted-foreground">
                                                                {t('Logo')}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs">{t('No logo selected')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <MediaPicker
                                                value={settings.logo_light}
                                                onChange={(url) => handleMediaSelect('logo_light', url)}
                                                placeholder={t('Select dark mode logo...')}
                                                showPreview={false}
                                                disabled={!canEdit}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>{t('Favicon')}</Label>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex h-20 items-center justify-center rounded-md border bg-muted/30 p-4">
                                                {settings.favicon ? (
                                                    <img
                                                        src={getImagePath(settings.favicon)}
                                                        alt={t('Favicon')}
                                                        className="h-16 w-16 object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded border border-dashed bg-muted">
                                                            <span className="text-xs font-semibold text-muted-foreground">
                                                                {t('Icon')}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs">{t('No favicon selected')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <MediaPicker
                                                value={settings.favicon}
                                                onChange={(url) => handleMediaSelect('favicon', url)}
                                                placeholder={t('Select favicon...')}
                                                showPreview={false}
                                                disabled={!canEdit}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Text Section */}
                        {activeSection === 'text' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="titleText">{t('Title Text')}</Label>
                                        <Input
                                            id="titleText"
                                            name="titleText"
                                            value={settings.titleText}
                                            onChange={handleInputChange}
                                            placeholder="Noble Architecture"
                                            disabled={!canEdit}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {t('Application title displayed in the browser tab')}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="footerText">{t('Footer Text')}</Label>
                                        <Input
                                            id="footerText"
                                            name="footerText"
                                            value={settings.footerText}
                                            onChange={handleInputChange}
                                            placeholder={t(
                                                `© ${new Date().getFullYear()} Noble Architecture. All rights reserved.`
                                            )}
                                            disabled={!canEdit}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {t('Text displayed in the footer')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Theme Section */}
                        {activeSection === 'theme' && (
                            <div className="space-y-6">
                                <div
                                    className={`flex flex-col space-y-8 ${!canEdit ? 'pointer-events-none opacity-60' : ''}`}
                                >
                                    {/* Layout Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <Layout className="mr-2 h-5 w-5 text-muted-foreground" />
                                            <h3 className="text-base font-medium">{t('Layout')}</h3>
                                        </div>
                                        <Separator className="my-2" />

                                        <div className="space-y-2">
                                            <Label className="mb-2 block">{t('Layout Direction')}</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    type="button"
                                                    variant={settings.layoutDirection === 'ltr' ? 'default' : 'outline'}
                                                    className="h-10 justify-start"
                                                    onClick={() => handleSelectChange('layoutDirection', 'ltr')}
                                                >
                                                    {t('Left-to-Right')}
                                                    {settings.layoutDirection === 'ltr' && (
                                                        <Check className="ml-2 h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={settings.layoutDirection === 'rtl' ? 'default' : 'outline'}
                                                    className="h-10 justify-start"
                                                    onClick={() => handleSelectChange('layoutDirection', 'rtl')}
                                                >
                                                    {t('Right-to-Left')}
                                                    {settings.layoutDirection === 'rtl' && (
                                                        <Check className="ml-2 h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mode Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <Moon className="mr-2 h-5 w-5 text-muted-foreground" />
                                            <h3 className="text-base font-medium">{t('Theme Mode')}</h3>
                                        </div>
                                        <Separator className="my-2" />

                                        <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                <Button
                                                    type="button"
                                                    variant={settings.themeMode === 'light' ? 'default' : 'outline'}
                                                    className="h-10 justify-start"
                                                    onClick={() => handleSelectChange('themeMode', 'light')}
                                                >
                                                    {t('Light')}
                                                    {settings.themeMode === 'light' && (
                                                        <Check className="ml-2 h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={settings.themeMode === 'dark' ? 'default' : 'outline'}
                                                    className="h-10 justify-start"
                                                    onClick={() => handleSelectChange('themeMode', 'dark')}
                                                >
                                                    {t('Dark')}
                                                    {settings.themeMode === 'dark' && (
                                                        <Check className="ml-2 h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={settings.themeMode === 'system' ? 'default' : 'outline'}
                                                    className="h-10 justify-start"
                                                    onClick={() => handleSelectChange('themeMode', 'system')}
                                                >
                                                    {t('System')}
                                                    {settings.themeMode === 'system' && (
                                                        <Check className="ml-2 h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Typography Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                                            <h3 className="text-base font-medium">{t('Typography')}</h3>
                                        </div>
                                        <Separator className="my-2" />

                                        <div className="space-y-2">
                                            <Label className="mb-2 block">{t('Application Font')}</Label>
                                            <Select
                                                value={settings.fontFamily || 'Geist Sans'}
                                                onValueChange={(value) => handleSelectChange('fontFamily', value)}
                                            >
                                                <SelectTrigger className="w-[300px]">
                                                    <SelectValue placeholder={t('Select font family')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Geist Sans">Geist Sans (UI Default)</SelectItem>
                                                    <SelectItem value="'Inter', sans-serif">Inter (Modern & Clean)</SelectItem>
                                                    <SelectItem value="'Outfit', sans-serif">Outfit (Geometric)</SelectItem>
                                                    <SelectItem value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Premium)</SelectItem>
                                                    <SelectItem value="'Poppins', sans-serif">Poppins (Playful & Round)</SelectItem>
                                                    <SelectItem value="'Roboto', sans-serif">Roboto (Corporate)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {t('The selected font family will instantly apply across all ecosystem dashboards globally')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 space-y-6">
                            <div className="rounded-md border p-4">
                                <div className="mb-4 flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    <h3 className="font-medium">{t('Live Preview')}</h3>
                                </div>

                                {/* Comprehensive Theme Preview */}
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

                                {/* Text Preview */}
                                <div className="mt-4 border-t pt-4">
                                    <div className="mb-2 text-xs text-muted-foreground">
                                        {t('Title:')}{' '}
                                        <span className="font-medium text-foreground">{settings.titleText}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {t('Footer:')}{' '}
                                        <span className="font-medium text-foreground">{settings.footerText}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
