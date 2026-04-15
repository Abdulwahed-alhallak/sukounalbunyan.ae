import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Requirement {
    name: string;
    check: boolean;
    current?: string;
}

interface Requirements {
    php: Requirement;
    extensions: Record<string, Requirement>;
}

interface Props {
    requirements: Requirements;
}

export default function Requirements({ requirements }: Props) {
    const { t } = useTranslation();
    const allPassed = requirements.php.check && Object.values(requirements.extensions).every((ext) => ext.check);

    return (
        <>
            <Head title={t('Installation - Requirements')} />
            <div className="flex min-h-screen flex-col justify-center bg-muted/50 py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
                        <h2 className="mb-6 text-2xl font-bold text-foreground">{t('Server Requirements')}</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded border p-3">
                                <span>{requirements.php.name}</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-muted-foreground">{requirements.php.current}</span>
                                    {requirements.php.check ? (
                                        <span className="text-foreground">✓</span>
                                    ) : (
                                        <span className="text-destructive">✗</span>
                                    )}
                                </div>
                            </div>

                            {Object.entries(requirements.extensions).map(([key, ext]) => (
                                <div key={key} className="flex items-center justify-between rounded border p-3">
                                    <span>{ext.name}</span>
                                    {ext.check ? (
                                        <span className="text-foreground">✓</span>
                                    ) : (
                                        <span className="text-destructive">✗</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-between">
                            <Link
                                href={route('installer.welcome')}
                                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50"
                            >
                                {t('Back')}
                            </Link>
                            {allPassed ? (
                                <Link
                                    href={route('installer.permissions')}
                                    className="rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm hover:bg-accent"
                                >
                                    {t('Next')}
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="cursor-not-allowed rounded-md border border-transparent bg-muted-foreground px-4 py-2 text-sm font-medium text-background shadow-sm"
                                >
                                    {t('Fix Requirements First')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
