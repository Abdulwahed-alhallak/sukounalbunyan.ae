import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Settings as SettingsIcon, 
    Save, 
    Languages, 
    Calendar, 
    Clock, 
    ShieldCheck, 
    UserPlus, 
    ExternalLink,
    Activity,
    Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import languagesData from '@/../lang/language.json';

const getCountryFlag = (countryCode: string): string => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

interface SystemSettings {
    defaultLanguage: string;
    dateFormat: string;
    timeFormat: string;
    calendarStartDay: string;
    enableRegistration: string;
    enableEmailVerification: string;
    landingPageEnabled: string;
    termsConditionsUrl: string;
}

interface SystemSettingsProps {
    userSettings?: Record<string, string>;
    auth?: any;
}

export default function SystemSettings({ userSettings, auth }: SystemSettingsProps) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [isLoading, setIsLoading] = useState(false);
    const canEdit =
        auth?.user?.permissions?.includes('edit-system-settings') || auth?.user?.roles?.includes('superadmin');
    const isSuperAdmin = auth?.user?.type === 'superadmin';

    const [settings, setSettings] = useState<SystemSettings>({
        defaultLanguage: userSettings?.defaultLanguage || 'en',
        dateFormat: userSettings?.dateFormat || 'Y-m-d',
        timeFormat: userSettings?.timeFormat || 'H:i',
        calendarStartDay: userSettings?.calendarStartDay || '0',
        enableRegistration:
            userSettings?.enableRegistration === 'on' || userSettings?.enableRegistration === '1' ? 'on' : 'off',
        enableEmailVerification:
            userSettings?.enableEmailVerification === 'on' || userSettings?.enableEmailVerification === '1'
                ? 'on'
                : 'off',
        landingPageEnabled:
            userSettings?.landingPageEnabled === 'on' || userSettings?.landingPageEnabled === '1' ? 'on' : 'off',
        termsConditionsUrl: userSettings?.termsConditionsUrl || '',
    });

    useEffect(() => {
        if (userSettings) {
            setSettings({
                defaultLanguage: userSettings?.defaultLanguage || 'en',
                dateFormat: userSettings?.dateFormat || 'Y-m-d',
                timeFormat: userSettings?.timeFormat || 'H:i',
                calendarStartDay: userSettings?.calendarStartDay || '0',
                enableRegistration:
                    userSettings?.enableRegistration === 'on' || userSettings?.enableRegistration === '1'
                        ? 'on'
                        : 'off',
                enableEmailVerification:
                    userSettings?.enableEmailVerification === 'on' || userSettings?.enableEmailVerification === '1'
                        ? 'on'
                        : 'off',
                landingPageEnabled:
                    userSettings?.landingPageEnabled === 'on' || userSettings?.landingPageEnabled === '1'
                        ? 'on'
                        : 'off',
                termsConditionsUrl: userSettings?.termsConditionsUrl || '',
            });
        }
    }, [userSettings]);

    const handleSelectChange = (name: string, value: string) => {
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name: string, value: boolean) => {
        setSettings((prev) => ({ ...prev, [name]: value ? 'on' : 'off' }));
    };

    const handleInputChange = (name: string, value: string) => {
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const saveSettings = () => {
        setIsLoading(true);

        router.post(
            route('settings.system.update'),
            {
                settings: settings as any,
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

    const languages = languagesData
        .filter((lang) => lang.enabled !== false)
        .map((lang) => ({
            ...lang,
            flag: getCountryFlag(lang.countryCode),
        }));

    const dateFormats = [
        { value: 'Y-m-d', label: 'YYYY-MM-DD (2024-01-15)' },
        { value: 'm-d-Y', label: 'MM-DD-YYYY (01-15-2024)' },
        { value: 'd-m-Y', label: 'DD-MM-YYYY (15-01-2024)' },
        { value: 'Y/m/d', label: 'YYYY/MM/DD (2024/01/15)' },
        { value: 'm/d/Y', label: 'MM/DD/YYYY (01/15/2024)' },
        { value: 'd/m/Y', label: 'DD/MM/YYYY (15/01/2024)' },
    ];

    const timeFormats = [
        { value: 'H:i', label: '24 Hour (13:30)' },
        { value: 'g:i A', label: '12 Hour (1:30 PM)' },
    ];

    const days = [
        { value: '0', label: 'Sunday' },
        { value: '1', label: 'Monday' },
        { value: '2', label: 'Tuesday' },
        { value: '3', label: 'Wednesday' },
        { value: '4', label: 'Thursday' },
        { value: '5', label: 'Friday' },
        { value: '6', label: 'Saturday' },
    ];

    const timezones = [
        { value: 'UTC', label: 'UTC' },
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Denver', label: 'Mountain Time (MT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        { value: 'Europe/London', label: 'London (GMT)' },
        { value: 'Europe/Paris', label: 'Paris (CET)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
        { value: 'Asia/Kolkata', label: 'India (IST)' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card variant="premium" className="overflow-visible border-border/40 bg-background/50 backdrop-blur-3xl">
                <CardHeader className="flex flex-row items-center justify-between px-8 py-6 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary ring-1 ring-primary/20">
                                <SettingsIcon className="h-5 w-5" />
                            </div>
                            {t('Global Protocols')}
                        </CardTitle>
                        <CardDescription>
                            {t('Configure core synchronization, regionalization, and security verification protocols.')}
                        </CardDescription>
                    </div>
                    {canEdit && (
                        <Button onClick={saveSettings} disabled={isLoading} className="shadow-lg active:scale-95 transition-all">
                            <Save className="me-2 h-4 w-4" />
                            {isLoading ? t('Saving...') : t('Save Protocols')}
                        </Button>
                    )}
                </CardHeader>

                <div className="glass-separator opacity-40" />

                <CardContent className="p-8 space-y-12">
                    {/* Section 1: Regionalization */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs-bold text-muted-foreground/50">
                            <Globe className="h-3.5 w-3.5" />
                            {t('REGIONAL SYNCHRONIZATION')}
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2.5">
                                <Label htmlFor="defaultLanguage" className="text-[13px] font-bold text-foreground/80">{t('Primary Language')}</Label>
                                <Select value={settings.defaultLanguage} onValueChange={(v) => handleSelectChange('defaultLanguage', v)} disabled={!canEdit}>
                                    <SelectTrigger id="defaultLanguage" className="vercel-input">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((l) => (
                                            <SelectItem key={l.code} value={l.code} className="ps-10">
                                                <span className="absolute start-3">{l.flag}</span>
                                                {l.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2.5">
                                    <Label className="text-[13px] font-bold text-foreground/80">{t('Date Architecture')}</Label>
                                    <Select value={settings.dateFormat} onValueChange={(v) => handleSelectChange('dateFormat', v)} disabled={!canEdit}>
                                        <SelectTrigger className="vercel-input">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Y-m-d">YYYY-MM-DD</SelectItem>
                                            <SelectItem value="d-m-Y">DD-MM-YYYY</SelectItem>
                                            <SelectItem value="m-d-Y">MM-DD-YYYY</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-[13px] font-bold text-foreground/80">{t('Temporal Flow')}</Label>
                                    <Select value={settings.timeFormat} onValueChange={(v) => handleSelectChange('timeFormat', v)} disabled={!canEdit}>
                                        <SelectTrigger className="vercel-input">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="H:i">24-Hour</SelectItem>
                                            <SelectItem value="g:i A">12-Hour</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Ecosystem Accessibility */}
                    {isSuperAdmin && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-xs-bold text-muted-foreground/50">
                                <Activity className="h-3.5 w-3.5" />
                                {t('ECOSYSTEM CONNECTIVITY')}
                            </div>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                <div className="rounded-xl border border-border/40 bg-muted/20 p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="rounded-md bg-blue-500/10 p-1.5 text-blue-500">
                                                <UserPlus className="h-4 w-4" />
                                            </div>
                                            <Label className="text-[13px] font-bold">{t('Onboarding')}</Label>
                                        </div>
                                        <Switch 
                                            checked={settings.enableRegistration === 'on'} 
                                            onCheckedChange={(v) => handleSwitchChange('enableRegistration', v)}
                                            disabled={!canEdit}
                                        />
                                    </div>
                                    <p className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed">
                                        {t('Allows external entities to initialize new autonomous user profiles.')}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border/40 bg-muted/20 p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="rounded-md bg-emerald-500/10 p-1.5 text-emerald-500">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>
                                            <Label className="text-[13px] font-bold">{t('Identity Verification')}</Label>
                                        </div>
                                        <Switch 
                                            checked={settings.enableEmailVerification === 'on'} 
                                            onCheckedChange={(v) => handleSwitchChange('enableEmailVerification', v)}
                                            disabled={!canEdit}
                                        />
                                    </div>
                                    <p className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed">
                                        {t('Enforces cryptographic email verification for all secondary identities.')}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border/40 bg-muted/20 p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                                                <Globe className="h-4 w-4" />
                                            </div>
                                            <Label className="text-[13px] font-bold">{t('Portal Access')}</Label>
                                        </div>
                                        <Switch 
                                            checked={settings.landingPageEnabled === 'on'} 
                                            onCheckedChange={(v) => handleSwitchChange('landingPageEnabled', v)}
                                            disabled={!canEdit}
                                        />
                                    </div>
                                    <p className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed">
                                        {t('Toggles the public-facing landing page protocol for the entire ecosystem.')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="termsConditionsUrl" className="text-[13px] font-bold text-foreground/80">{t('Legal Terms Protocol (URL)')}</Label>
                                <div className="relative group">
                                    <Input
                                        id="termsConditionsUrl"
                                        value={settings.termsConditionsUrl}
                                        onChange={(e) => handleInputChange('termsConditionsUrl', e.target.value)}
                                        placeholder="https://sukon.dion.sy/legal-terms"
                                        disabled={!canEdit}
                                        className="vercel-input ps-10"
                                    />
                                    <ExternalLink className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors", isRtl ? "right-3" : "left-3")} />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
