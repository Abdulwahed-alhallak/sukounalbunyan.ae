import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputError } from '@/components/ui/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

export default function Environment({ timezones }: { timezones: string[] }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        app_name: 'Sukoun Albunyan',
        app_url: window.location.origin,
        app_timezone: 'UTC',
        db_connection: 'mysql',
        db_host: '127.0.0.1',
        db_port: '3306',
        db_database: '',
        db_username: '',
        db_password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('installer.environment.store'), {
            forceFormData: true,
            onSuccess: () => {
                console.log('Environment saved successfully');
                window.location.href = route('installer.database');
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
        });
    };

    return (
        <>
            <Head title={t('Installation - Environment')} />
            <div className="flex min-h-screen flex-col justify-center bg-muted/50 py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('Environment Configuration')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {processing && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50">
                                        <div className="rounded-lg bg-card p-6 text-center shadow-lg">
                                            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-foreground"></div>
                                            <p>{t('Configuring environment...')}</p>
                                        </div>
                                    </div>
                                )}

                                {Object.keys(errors).length > 0 && (
                                    <div className="mb-4 rounded-md border border-border bg-muted p-4">
                                        <h3 className="mb-2 font-semibold text-destructive">Validation Errors:</h3>
                                        {Object.entries(errors).map(([key, message]) => (
                                            <div key={key} className="mb-1 text-sm text-destructive">
                                                <strong>{key}:</strong> {Array.isArray(message) ? message[0] : message}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="app_name">{t('Application Name')}</Label>
                                    <Input
                                        id="app_name"
                                        type="text"
                                        value={data.app_name}
                                        onChange={(e) => setData('app_name', e.target.value)}
                                        className="h-11"
                                        required
                                    />
                                    <InputError message={errors.app_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="app_url">{t('Application URL')}</Label>
                                    <Input
                                        id="app_url"
                                        type="url"
                                        value={data.app_url}
                                        onChange={(e) => setData('app_url', e.target.value)}
                                        className="h-11"
                                        required
                                    />
                                    <InputError message={errors.app_url} />
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('Timezone')}</Label>
                                    <Select
                                        value={data.app_timezone}
                                        onValueChange={(value) => setData('app_timezone', value)}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent searchable>
                                            {timezones.map((tz) => (
                                                <SelectItem key={tz} value={tz}>
                                                    {tz}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.app_timezone} />
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('Database Connection')}</Label>
                                    <Select
                                        value={data.db_connection}
                                        onValueChange={(value) => setData('db_connection', value)}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mysql">MySQL</SelectItem>
                                            <SelectItem value="pgsql">PostgreSQL</SelectItem>
                                            <SelectItem value="sqlite">SQLite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {data.db_connection !== 'sqlite' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="db_host">{t('Database Host')}</Label>
                                                <Input
                                                    id="db_host"
                                                    type="text"
                                                    value={data.db_host}
                                                    onChange={(e) => setData('db_host', e.target.value)}
                                                    className="h-11"
                                                    required
                                                />
                                                <InputError message={errors.db_host} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="db_port">{t('Database Port')}</Label>
                                                <Input
                                                    id="db_port"
                                                    type="number"
                                                    value={data.db_port}
                                                    onChange={(e) => setData('db_port', e.target.value)}
                                                    className="h-11"
                                                    required
                                                />
                                                <InputError message={errors.db_port} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="db_username">{t('Database Username')}</Label>
                                            <Input
                                                id="db_username"
                                                type="text"
                                                value={data.db_username}
                                                onChange={(e) => setData('db_username', e.target.value)}
                                                className="h-11"
                                                required
                                            />
                                            <InputError message={errors.db_username} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="db_password">{t('Database Password')}</Label>
                                            <Input
                                                id="db_password"
                                                type="password"
                                                value={data.db_password}
                                                onChange={(e) => setData('db_password', e.target.value)}
                                                className="h-11"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="db_database">{t('Database Name')}</Label>
                                    <Input
                                        id="db_database"
                                        type="text"
                                        value={data.db_database}
                                        onChange={(e) => setData('db_database', e.target.value)}
                                        className="h-11"
                                        required
                                    />
                                    <InputError message={errors.db_database} />
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="outline" asChild>
                                        <Link href={route('installer.permissions')}>{t('Back')}</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm hover:bg-accent disabled:opacity-50"
                                        disabled={processing}
                                        onClick={(e) => {
                                            console.log('Button clicked, processing:', processing);
                                        }}
                                    >
                                        {processing ? t('Saving...') : t('Next')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
