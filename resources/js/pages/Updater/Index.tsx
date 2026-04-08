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
            <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('System Updater')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="mb-4 p-4 bg-muted border border-border rounded-md">
                                    <p className="text-destructive">{error}</p>
                                </div>
                            )}

                            {completed && (
                                <div className="mb-4 p-4 bg-muted border border-border rounded-md">
                                    <p className="text-foreground">{t('System updated successfully!')}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{t('Redirecting to dashboard...')}</p>
                                </div>
                            )}

                            {!hasUpdates && !completed ? (
                                <div className="text-center py-8">
                                    <div className="text-foreground text-6xl mb-4">✓</div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {t('System is up to date')}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {t('No pending migrations found. Your system is running the latest version.')}
                                    </p>
                                </div>
                            ) : !completed ? (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-3">
                                            {t('Pending Updates')}
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            {t('The following database migrations are pending and need to be executed:')}
                                        </p>

                                        <div className="bg-muted border border-border rounded-md p-4">
                                            <h4 className="font-medium text-foreground mb-2">
                                                {t('Migrations to run')} ({pendingMigrations.length}):
                                            </h4>
                                            <div className="max-h-40 overflow-y-auto">
                                                {pendingMigrations.map((migration, index) => (
                                                    <div key={index} className="text-sm text-muted-foreground py-1">
                                                        • {migration}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-muted border border-border rounded-md p-4 mb-6">
                                        <h4 className="font-semibold text-foreground mb-2">
                                            {t('Important Notice')}:
                                        </h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
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
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
                                        className="py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-accent"
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