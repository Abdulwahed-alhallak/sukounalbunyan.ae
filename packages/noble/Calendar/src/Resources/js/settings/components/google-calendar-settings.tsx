import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface GoogleCalendarSettingsProps {
    userSettings?: Record<string, string>;
    auth?: any;
}

export default function GoogleCalendarSettings({ userSettings = {}, auth }: GoogleCalendarSettingsProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const canEdit = auth?.user?.permissions?.includes('edit-google-calendar-settings');

    const [googleCalendarSettings, setGoogleCalendarSettings] = useState({
        google_calendar_enable: userSettings?.google_calendar_enable === 'on',
        google_calendar_json_file: userSettings?.google_calendar_json_file || '',
        google_calendar_id: userSettings?.google_calendar_id || '',
    });

    const [jsonFile, setJsonFile] = useState<File | null>(null);
    useEffect(() => {
        setGoogleCalendarSettings({
            google_calendar_enable: userSettings?.google_calendar_enable === 'on',
            google_calendar_json_file: userSettings?.google_calendar_json_file || '',
            google_calendar_id: userSettings?.google_calendar_id || '',
        });
    }, [userSettings]);

    const handleSettingsChange = (field: string, value: string | boolean) => {
        setGoogleCalendarSettings((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/json') {
            setJsonFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setGoogleCalendarSettings((prev) => ({
                    ...prev,
                    google_calendar_json_file: content,
                }));
            };
            reader.readAsText(file);
        } else {
            toast.error(t('Please select a valid JSON file'));
        }
    };

    const saveGoogleCalendarSettings = () => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append(
            'settings[google_calendar_enable]',
            googleCalendarSettings.google_calendar_enable ? 'on' : 'off'
        );
        formData.append('settings[google_calendar_id]', googleCalendarSettings.google_calendar_id);

        if (!jsonFile) {
            formData.append('settings[google_calendar_json_file]', googleCalendarSettings.google_calendar_json_file);
        }

        if (jsonFile) {
            formData.append('json_file', jsonFile);
        }

        router.post(route('calendar.settings.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                setJsonFile(null);
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="order-1 rtl:order-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CalendarIcon className="h-5 w-5" />
                        {t('Google Calendar Settings')}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('Configure Google Calendar integration settings')}
                    </p>
                </div>
                {canEdit && (
                    <Button
                        className="order-2 rtl:order-1"
                        onClick={saveGoogleCalendarSettings}
                        disabled={isLoading}
                        size="sm"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? t('Saving...') : t('Save Changes')}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="google_calendar_enable" className="text-base font-medium">
                                {t('Enable Google Calendar Integration')}
                            </Label>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('Allow events to be synced with Google Calendar')}
                            </p>
                        </div>
                        <Switch
                            id="google_calendar_enable"
                            checked={googleCalendarSettings.google_calendar_enable}
                            onCheckedChange={(checked) => handleSettingsChange('google_calendar_enable', checked)}
                            disabled={!canEdit}
                        />
                    </div>

                    {googleCalendarSettings.google_calendar_enable && (
                        <>
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                <div className="space-y-4 lg:col-span-2">
                                    <div>
                                        <Label htmlFor="google_calendar_id">{t('Google Calendar ID')}</Label>
                                        <Input
                                            id="google_calendar_id"
                                            type="text"
                                            value={googleCalendarSettings.google_calendar_id}
                                            onChange={(e) => handleSettingsChange('google_calendar_id', e.target.value)}
                                            placeholder={t('your-calendar@gmail.com or calendar-id')}
                                            disabled={!canEdit}
                                        />
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {t('Find this in Google Calendar Settings → Calendar ID')}
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="google_calendar_json_file">
                                            {t('Google Calendar JSON File')}
                                        </Label>
                                        <div className="space-y-2">
                                            {!userSettings?.google_calendar_json_file ? (
                                                <>
                                                    <p className="mb-3 text-sm text-destructive dark:text-destructive">
                                                        {t(
                                                            'To start the synchronization process, please insert your Google OAuth 2.0 JSON below.'
                                                        )}
                                                    </p>
                                                    <Input
                                                        type="file"
                                                        accept=".json"
                                                        onChange={handleFileUpload}
                                                        disabled={!canEdit}
                                                    />
                                                    {jsonFile && (
                                                        <p className="text-sm text-foreground dark:text-muted-foreground">
                                                            {t('Selected')}: {jsonFile.name}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="rounded-lg border border-border bg-muted/50 p-3 dark:border-foreground dark:bg-foreground/20">
                                                    <p className="text-sm text-foreground dark:text-foreground/60">
                                                        {t('Google Calendar JSON configuration saved.')}
                                                    </p>
                                                </div>
                                            )}

                                            <Textarea
                                                id="google_calendar_json_file"
                                                value={googleCalendarSettings.google_calendar_json_file}
                                                onChange={(e) =>
                                                    handleSettingsChange('google_calendar_json_file', e.target.value)
                                                }
                                                placeholder={t(
                                                    'Enter Google Calendar service account JSON configuration or upload a file'
                                                )}
                                                disabled={!canEdit}
                                                rows={6}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-muted/50 p-4 dark:bg-foreground/20 lg:col-span-1">
                                    <h4 className="mb-3 font-medium text-foreground dark:text-foreground">
                                        {t('How to get Google Calendar JSON File')}
                                    </h4>
                                    <div className="space-y-2 text-sm text-foreground dark:text-muted-foreground">
                                        <div className="flex items-start gap-2">
                                            <span className="min-w-[20px] font-medium">1.</span>
                                            <span>
                                                {t('Go to')}{' '}
                                                <a
                                                    href="https://console.cloud.google.com/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline hover:no-underline"
                                                >
                                                    Google Cloud Console
                                                </a>
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="min-w-[20px] font-medium">2.</span>
                                            <span>{t('Create a new project or select existing one')}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="min-w-[20px] font-medium">3.</span>
                                            <span>{t('Enable Google Calendar API in APIs & Services')}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="min-w-[20px] font-medium">4.</span>
                                            <span>{t('Go to Credentials → Create Credentials → Service Account')}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="min-w-[20px] font-medium">5.</span>
                                            <span>{t('Create service account and download JSON key file')}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="min-w-[20px] font-medium">6.</span>
                                            <span>{t('Upload the JSON file above or paste its content')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
