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
    const allPassed = Object.values(permissions).every((perm) => perm.check);

    return (
        <>
            <Head title={t('Installation - Permissions')} />
            <div className="flex min-h-screen flex-col justify-center bg-muted/50 py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
                        <h2 className="mb-6 text-2xl font-bold text-foreground">{t('File Permissions')}</h2>

                        <div className="space-y-4">
                            {Object.entries(permissions).map(([key, perm]) => (
                                <div key={key} className="flex items-center justify-between rounded border p-3">
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
                            <div className="mt-6 rounded-md border border-border bg-muted p-4">
                                <h3 className="mb-2 font-semibold text-foreground">{t('Fix Permissions')}</h3>
                                <p className="mb-2 text-sm text-foreground">
                                    {t('Run the following commands to fix permissions')}:
                                </p>
                                <code className="block rounded bg-muted p-2 text-xs">
                                    chmod -R 755 storage/
                                    <br />
                                    chmod -R 755 bootstrap/cache/
                                </code>
                            </div>
                        )}

                        <div className="mt-8 flex justify-between">
                            <Link
                                href={route('installer.requirements')}
                                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50"
                            >
                                {t('Back')}
                            </Link>
                            {allPassed ? (
                                <Link
                                    href={route('installer.environment')}
                                    className="rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm hover:bg-accent"
                                >
                                    {t('Next')}
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="cursor-not-allowed rounded-md border border-transparent bg-muted-foreground px-4 py-2 text-sm font-medium text-background shadow-sm"
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
