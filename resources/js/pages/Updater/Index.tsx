import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
    hasUpdates: boolean;
    pendingMigrations: string[];
}

export default function UpdaterIndex({ hasUpdates, pendingMigrations }: Props) {
    const { t } = useTranslation();
    const [updating, setUpdating] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState('');

    const runUpdate = async () => {
        setUpdating(true);
        setError('');

        try {
            const response = await axios.post(route('updater.update'));

            if (response.data.success) {
                setCompleted(true);
                setTimeout(() => {
                    window.location.href = route('dashboard');
                }, 2000);
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <>
            <Head title={t('System Updater')} />
            <div className="flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('System Updater')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="mb-4 rounded-md border border-border bg-muted p-4">
                                    <p className="text-destructive">{error}</p>
                                </div>
                            )}

                            {completed && (
                                <div className="mb-4 rounded-md border border-border bg-muted p-4">
                                    <p className="text-foreground">{t('System updated successfully!')}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {t('Redirecting to dashboard...')}
                                    </p>
                                </div>
                            )}

                            {!hasUpdates && !completed ? (
                                <div className="py-8 text-center">
                                    <div className="mb-4 text-6xl text-foreground">✓</div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                        {t('System is up to date')}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {t('No pending migrations found. Your system is running the latest version.')}
                                    </p>
                                </div>
                            ) : !completed ? (
                                <>
                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-foreground">
                                            {t('Pending Updates')}
                                        </h3>
                                        <p className="mb-4 text-muted-foreground">
                                            {t(
                                                'The following database migrations are pending and need to be executed:'
                                            )}
                                        </p>

                                        <div className="rounded-md border border-border bg-muted p-4">
                                            <h4 className="mb-2 font-medium text-foreground">
                                                {t('Migrations to run')} ({pendingMigrations.length}):
                                            </h4>
                                            <div className="max-h-40 overflow-y-auto">
                                                {pendingMigrations.map((migration, index) => (
                                                    <div key={index} className="py-1 text-sm text-muted-foreground">
                                                        • {migration}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6 rounded-md border border-border bg-muted p-4">
                                        <h4 className="mb-2 font-semibold text-foreground">{t('Important Notice')}:</h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• {t('Please backup your database before proceeding')}</li>
                                            <li>• {t('The update process may take a few minutes')}</li>
                                            <li>• {t('Do not close this page during the update')}</li>
                                        </ul>
                                    </div>
                                </>
                            ) : null}

                            <div className="flex justify-between">
                                {hasUpdates && !completed && (
                                    <Button
                                        onClick={runUpdate}
                                        disabled={updating}
                                        className="bg-foreground text-background hover:bg-foreground/90"
                                    >
                                        {updating ? (
                                            <>
                                                <div className="me-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                {t('Updating...')}
                                            </>
                                        ) : (
                                            t('Run Update')
                                        )}
                                    </Button>
                                )}

                                {completed && (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
                                    >
                                        {t('Continue to Dashboard')}
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
