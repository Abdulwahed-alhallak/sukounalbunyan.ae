import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
    Building, 
    Save, 
    MapPin, 
    Globe, 
    Phone, 
    Mail, 
    Fingerprint, 
    Receipt,
    ShieldCheck,
    CreditCard
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CompanySettings {
    company_name: string;
    company_address: string;
    company_city: string;
    company_state: string;
    company_country: string;
    company_zipcode: string;
    company_telephone: string;
    company_email_from_name: string;
    registration_number: string;
    company_email: string;
    vat_gst_number_switch: string;
    tax_type: string;
    vat_number: string;
    enable_attendance_deduction?: string;
    [key: string]: any;
}

interface CompanySettingsProps {
    userSettings?: Record<string, string>;
    auth?: any;
}

export default function CompanySettings({ userSettings, auth }: CompanySettingsProps) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [isLoading, setIsLoading] = useState(false);
    const canEdit =
        auth?.user?.permissions?.includes('edit-company-settings') || auth?.user?.roles?.includes('superadmin');

    const [settings, setSettings] = useState<CompanySettings>({
        company_name: userSettings?.company_name || '',
        company_address: userSettings?.company_address || '',
        company_city: userSettings?.company_city || '',
        company_state: userSettings?.company_state || '',
        company_country: userSettings?.company_country || '',
        company_zipcode: userSettings?.company_zipcode || '',
        company_telephone: userSettings?.company_telephone || '',
        company_email_from_name: userSettings?.company_email_from_name || '',
        registration_number: userSettings?.registration_number || '',
        company_email: userSettings?.company_email || '',
        vat_gst_number_switch: userSettings?.vat_gst_number_switch || 'off',
        tax_type: userSettings?.tax_type || 'VAT',
        vat_number: userSettings?.vat_number || '',
        enable_attendance_deduction: userSettings?.enable_attendance_deduction || 'off',
    });

    useEffect(() => {
        if (userSettings) {
            setSettings({
                company_name: userSettings?.company_name || '',
                company_address: userSettings?.company_address || '',
                company_city: userSettings?.company_city || '',
                company_state: userSettings?.company_state || '',
                company_country: userSettings?.company_country || '',
                company_zipcode: userSettings?.company_zipcode || '',
                company_telephone: userSettings?.company_telephone || '',
                company_email_from_name: userSettings?.company_email_from_name || '',
                registration_number: userSettings?.registration_number || '',
                company_email: userSettings?.company_email || '',
                vat_gst_number_switch: userSettings?.vat_gst_number_switch || 'off',
                tax_type: userSettings?.tax_type || 'VAT',
                vat_number: userSettings?.vat_number || '',
                enable_attendance_deduction: userSettings?.enable_attendance_deduction || 'off',
            });
        }
    }, [userSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setSettings((prev) => ({ ...prev, vat_gst_number_switch: checked ? 'on' : 'off' }));
    };

    const handleTaxTypeChange = (value: string) => {
        setSettings((prev) => ({ ...prev, tax_type: value }));
    };

    const saveSettings = () => {
        setIsLoading(true);
        router.post(route('settings.company.update'), { settings }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                router.reload({ only: ['globalSettings'] });
            },
            onError: () => setIsLoading(false)
        });
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <Card variant="premium" className="overflow-visible border-border/40 bg-background/50 backdrop-blur-3xl">
                <CardHeader className="flex flex-row items-center justify-between px-8 py-6 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary ring-1 ring-primary/20">
                                <Building className="h-5 w-5" />
                            </div>
                            {t('Corporate Entity')}
                        </CardTitle>
                        <CardDescription>
                            {t('Manage official organizational identifiers and regulatory compliance.')}
                        </CardDescription>
                    </div>
                    {canEdit && (
                        <Button onClick={saveSettings} disabled={isLoading} className="shadow-lg active:scale-95 transition-all">
                            <Save className="me-2 h-4 w-4" />
                            {isLoading ? t('Saving...') : t('Save Framework')}
                        </Button>
                    )}
                </CardHeader>

                <div className="glass-separator opacity-40" />

                <CardContent className="p-8 space-y-12">
                    {/* Section 1: Official Identity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs-bold text-muted-foreground/50">
                            <Fingerprint className="h-3.5 w-3.5" />
                            {t('IDENTIFICATION PROTOCOLS')}
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2.5">
                                <Label htmlFor="company_name" className="text-[13px] font-bold text-foreground/80">{t('Legal Entity Name')}</Label>
                                <Input
                                    id="company_name"
                                    name="company_name"
                                    value={settings.company_name}
                                    onChange={handleInputChange}
                                    placeholder={t('Global Architecture Ltd.')}
                                    disabled={!canEdit}
                                    className="vercel-input"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="registration_number" className="text-[13px] font-bold text-foreground/80">{t('Governmental ID')}</Label>
                                <Input
                                    id="registration_number"
                                    name="registration_number"
                                    value={settings.registration_number}
                                    onChange={handleInputChange}
                                    placeholder="REG-9428-X"
                                    disabled={!canEdit}
                                    className="vercel-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Logistics & HQ */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs-bold text-muted-foreground/50">
                            <MapPin className="h-3.5 w-3.5" />
                            {t('GEOGRAPHICAL COORDINATES')}
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2.5 md:col-span-2">
                                <Label htmlFor="company_address" className="text-[13px] font-bold text-foreground/80">{t('Headquarters Address')}</Label>
                                <Input
                                    id="company_address"
                                    name="company_address"
                                    value={settings.company_address}
                                    onChange={handleInputChange}
                                    disabled={!canEdit}
                                    className="vercel-input"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="company_city" className="text-[13px] font-bold text-foreground/80">{t('City')}</Label>
                                <Input
                                    id="company_city"
                                    name="company_city"
                                    value={settings.company_city}
                                    onChange={handleInputChange}
                                    disabled={!canEdit}
                                    className="vercel-input"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="company_country" className="text-[13px] font-bold text-foreground/80">{t('Sovereign State')}</Label>
                                <Input
                                    id="company_country"
                                    name="company_country"
                                    value={settings.company_country}
                                    onChange={handleInputChange}
                                    disabled={!canEdit}
                                    className="vercel-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Communication */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs-bold text-muted-foreground/50">
                            <Phone className="h-3.5 w-3.5" />
                            {t('NETWORK CHANNELS')}
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2.5">
                                <Label htmlFor="company_telephone" className="text-[13px] font-bold text-foreground/80">{t('Hotline')}</Label>
                                <Input
                                    id="company_telephone"
                                    name="company_telephone"
                                    value={settings.company_telephone}
                                    onChange={handleInputChange}
                                    disabled={!canEdit}
                                    className="vercel-input"
                                />
                            </div>
                            <div className="space-y-2.5 md:col-span-2">
                                <Label htmlFor="company_email" className="text-[13px] font-bold text-foreground/80">{t('Corporate Transmission (Email)')}</Label>
                                <div className="relative group">
                                    <Input
                                        id="company_email"
                                        name="company_email"
                                        type="email"
                                        value={settings.company_email}
                                        onChange={handleInputChange}
                                        disabled={!canEdit}
                                        className="vercel-input ps-10"
                                    />
                                    <Mail className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors", isRtl ? "end-3" : "start-3")} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Fiscal Compliance */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs-bold text-muted-foreground/50">
                            <Receipt className="h-3.5 w-3.5" />
                            {t('FISCAL & TAX ARCHITECTURE')}
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-muted/20 p-6 space-y-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3 min-w-[140px]">
                                    <Switch
                                        id="vat_gst_number_switch"
                                        checked={settings.vat_gst_number_switch === 'on'}
                                        onCheckedChange={handleSwitchChange}
                                        disabled={!canEdit}
                                    />
                                    <Label htmlFor="vat_gst_number_switch" className="text-[13px] font-bold">{t('Tax Registration')}</Label>
                                </div>

                                {settings.vat_gst_number_switch === 'on' && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                                        <RadioGroup
                                            value={settings.tax_type}
                                            onValueChange={handleTaxTypeChange}
                                            className="flex gap-6"
                                            disabled={!canEdit}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="VAT" id="vat" />
                                                <Label htmlFor="vat" className="text-[12px] font-bold cursor-pointer">{t('VAT')}</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="GST" id="gst" />
                                                <Label htmlFor="gst" className="text-[12px] font-bold cursor-pointer">{t('GST')}</Label>
                                            </div>
                                        </RadioGroup>
                                        <Input
                                            name="vat_number"
                                            value={settings.vat_number}
                                            onChange={handleInputChange}
                                            placeholder={t('TAX-ID-00000')}
                                            className="vercel-input flex-1"
                                            disabled={!canEdit}
                                        />
                                    </motion.div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border/40">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-success" />
                                            <Label className="text-[14px] font-bold">{t('Advanced Payroll Automation')}</Label>
                                        </div>
                                        <p className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed max-w-[480px]">
                                            {t('Synchronize biometric data with salary architecture. Automatically calculates deductions based on real-time attendance protocols.')}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.enable_attendance_deduction === 'on'}
                                        onCheckedChange={(checked) => setSettings(p => ({...p, enable_attendance_deduction: checked ? 'on' : 'off'}))}
                                        disabled={!canEdit}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
