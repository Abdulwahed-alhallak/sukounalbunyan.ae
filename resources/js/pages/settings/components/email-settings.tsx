import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Save, Send, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

interface EmailSettings {
    provider: string;
    driver: string;
    host: string;
    port: string;
    username: string;
    password: string;
    encryption: string;
    fromAddress: string;
}

interface EmailSettingsProps {
    userSettings?: Record<string, string>;
    auth?: any;
    emailProviders?: Record<
        string,
        {
            name: string;
            driver: string;
            host: string;
            port: string;
            encryption: string;
        }
    >;
}

const getInitialSettings = (userSettings?: Record<string, string>): EmailSettings => ({
    provider: userSettings?.email_provider || 'smtp',
    driver: userSettings?.email_driver || 'smtp',
    host: userSettings?.email_host || 'smtp.sukon.dion.sy',
    port: userSettings?.email_port || '587',
    username: userSettings?.email_username || 'user@sukon.dion.sy',
    password: userSettings?.email_password || '',
    encryption: userSettings?.email_encryption || 'tls',
    fromAddress: userSettings?.email_fromAddress || 'noreply@sukon.dion.sy',
});

export default function EmailSettings({ userSettings, auth, emailProviders = {} }: EmailSettingsProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const canEdit = auth?.user?.permissions?.includes('edit-email-settings');

    const [settings, setSettings] = useState<EmailSettings>(() => getInitialSettings(userSettings));
    const [showPassword, setShowPassword] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        if (userSettings) {
            setSettings(getInitialSettings(userSettings));
        }
    }, [userSettings]);

    const handleChange = (name: string, value: string) => {
        if (name === 'provider' && emailProviders[value]) {
            const providerConfig = emailProviders[value];
            setSettings((prev) => ({
                ...prev,
                provider: value,
                driver: providerConfig.driver,
                host: providerConfig.host,
                port: providerConfig.port,
                encryption: providerConfig.encryption,
            }));
        } else {
            setSettings((prev) => ({ ...prev, [name]: value }));
        }
    };

    const saveSettings = () => {
        setIsLoading(true);

        const settingsToSave = { ...settings };

        router.post(
            route('settings.email.update'),
            {
                settings: settingsToSave,
            },
            {
                preserveScroll: true,
                onSuccess: () => {},
                onError: () => {},
                onFinish: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    const sendTestEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (!testEmail || !canEdit) return;

        setIsSending(true);
        setTestResult(null);

        router.post(
            route('settings.email.test'),
            { email: testEmail },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const successMessage = (page.props.flash as any)?.success;
                    const errorMessage = (page.props.flash as any)?.error;

                    if (successMessage) {
                        setTestResult({ success: true, message: successMessage });
                    } else if (errorMessage) {
                        setTestResult({ success: false, message: errorMessage });
                    }

                    setTimeout(() => setTestResult(null), 5000);
                },
                onError: (errors) => {
                    const errorMessage =
                        errors.error || Object.values(errors).join(', ') || t('Failed to send test email');
                    setTestResult({ success: false, message: errorMessage });

                    setTimeout(() => setTestResult(null), 5000);
                },
                onFinish: () => {
                    setIsSending(false);
                },
            }
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="order-1 rtl:order-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Mail className="h-5 w-5" />
                        {t('Email Settings')}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('Configure email server settings for system notifications and communications')}
                    </p>
                </div>
                {canEdit && (
                    <Button className="order-2 rtl:order-1" onClick={saveSettings} disabled={isLoading} size="sm">
                        <Save className="me-2 h-4 w-4" />
                        {isLoading ? t('Saving...') : t('Save Changes')}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Email Settings */}
                    <div className="lg:col-span-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveSettings();
                            }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="provider" className="font-medium">
                                        {t('Email Provider')}
                                    </Label>
                                    <Select
                                        value={settings.provider}
                                        onValueChange={(value) => {
                                            handleChange('provider', value);
                                            handleChange('driver', value);
                                        }}
                                        disabled={!canEdit}
                                        name="provider"
                                    >
                                        <SelectTrigger id="provider">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(emailProviders).map(([key, provider]) => (
                                                <SelectItem key={key} value={key}>
                                                    {provider.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="driver" className="font-medium">
                                        {t('Mail Driver')}
                                    </Label>
                                    <Input
                                        id="driver"
                                        name="driver"
                                        value={settings.driver}
                                        onChange={(e) => handleChange('driver', e.target.value)}
                                        disabled={!canEdit}
                                        placeholder="smtp"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="host" className="font-medium">
                                        {t('SMTP Host')}
                                    </Label>
                                    <Input
                                        id="host"
                                        name="host"
                                        value={settings.host}
                                        onChange={(e) => handleChange('host', e.target.value)}
                                        disabled={!canEdit}
                                        placeholder="smtp.sukon.dion.sy"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="port" className="font-medium">
                                        {t('SMTP Port')}
                                    </Label>
                                    <Input
                                        id="port"
                                        name="port"
                                        value={settings.port}
                                        onChange={(e) => handleChange('port', e.target.value)}
                                        disabled={!canEdit}
                                        placeholder="587"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="username" className="font-medium">
                                        {t('SMTP Username')}
                                    </Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={settings.username}
                                        onChange={(e) => handleChange('username', e.target.value)}
                                        disabled={!canEdit}
                                        placeholder="user@sukon.dion.sy"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="font-medium">
                                        {t('SMTP Password')}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={settings.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            disabled={!canEdit}
                                            placeholder="••••••••••••"
                                            className="pe-10"
                                        />
                                        {canEdit && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="encryption" className="font-medium">
                                        {t('Mail Encryption')}
                                    </Label>
                                    <Select
                                        value={settings.encryption}
                                        onValueChange={(value) => handleChange('encryption', value)}
                                        disabled={!canEdit}
                                        name="encryption"
                                    >
                                        <SelectTrigger id="encryption">
                                            <SelectValue placeholder="Select encryption" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tls">{t('TLS')}</SelectItem>
                                            <SelectItem value="ssl">{t('SSL')}</SelectItem>
                                            <SelectItem value="none">{t('None')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="fromAddress" className="font-medium">
                                        {t('From Address')}
                                    </Label>
                                    <Input
                                        id="fromAddress"
                                        name="fromAddress"
                                        value={settings.fromAddress}
                                        onChange={(e) => handleChange('fromAddress', e.target.value)}
                                        disabled={!canEdit}
                                        placeholder="noreply@sukon.dion.sy"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Test Email Section */}
                    <div className="lg:col-span-1">
                        <Card className="border-border/60 shadow-none bg-background-2">
                            <CardContent className="pt-6">
                                <form onSubmit={sendTestEmail} className="space-y-4">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Send className="h-4 w-4 text-foreground" />
                                        <h3 className="text-base font-medium">{t('Test Email Configuration')}</h3>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="testEmail" className="font-medium">
                                            {t('Send Test To')}
                                        </Label>
                                        <Input
                                            id="testEmail"
                                            name="testEmail"
                                            type="email"
                                            value={testEmail}
                                            onChange={(e) => setTestEmail(e.target.value)}
                                            placeholder="test@sukon.dion.sy"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {t('Enter an email address to send a test message')}
                                        </p>
                                    </div>

                                    {testResult && (
                                        <div
                                            className={`rounded-md p-3 text-sm ${
                                                testResult.success
                                                    ? 'border border-border bg-muted/50 text-foreground'
                                                    : 'border border-border bg-muted/50 text-destructive'
                                            }`}
                                        >
                                            {testResult.message}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSending || !testEmail || !canEdit}
                                    >
                                        {isSending ? (
                                            <>
                                                <span className="me-2 animate-spin">◌</span>
                                                {t('Sending...')}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="me-2 h-4 w-4" />
                                                {t('Send Test Email')}
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
