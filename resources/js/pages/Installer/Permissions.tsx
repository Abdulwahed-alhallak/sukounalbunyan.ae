import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Permission {
    name: string;
    path: string;
    check: boolean;
}

interface Props {
    permissions: Record<string, Permission>;
}

export default function Permissions({ permissions }: Props) {
    const { t } = useTranslation();
    const allPassed = Object.values(permissions).every(perm => perm.check);

    return (
        <>
            <Head title={t('Installation - Permissions')} />
            <div className="min-h-screen bg-muted/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <h2 className="text-2xl font-bold text-foreground mb-6">{t('File Permissions')}</h2>
                        
                        <div className="space-y-4">
                            {Object.entries(permissions).map(([key, perm]) => (
                                <div key={key} className="flex items-center justify-between p-3 border rounded">
                                    <div>
                                        <div className="font-medium">{perm.name}</div>
                                        <div className="text-sm text-muted-foreground">{perm.path}</div>
                                    </div>
                                    {perm.check ? (
                                        <span className="text-foreground">✓ {t('Writable')}</span>
                                    ) : (
                                        <span className="text-destructive">✗ {t('Not Writable')}</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {!allPassed && (
                            <div className="mt-6 p-4 bg-muted border border-border rounded-md">
                                <h3 className="font-semibold text-foreground mb-2">{t('Fix Permissions')}</h3>
                                <p className="text-sm text-foreground mb-2">
                                    {t('Run the following commands to fix permissions')}:
                                </p>
                                <code className="block text-xs bg-muted p-2 rounded">
                                    chmod -R 755 storage/<br/>
                                    chmod -R 755 bootstrap/cache/
                                </code>
                            </div>
                        )}

                        <div className="mt-8 flex justify-between">
                            <Link
                                href={route('installer.requirements')}
                                className="py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted/50"
                            >
                                {t('Back')}
                            </Link>
                            {allPassed ? (
                                <Link
                                    href={route('installer.environment')}
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-accent"
                                >
                                    {t('Next')}
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-muted-foreground cursor-not-allowed"
                                >
                                    {t('Fix Permissions First')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}