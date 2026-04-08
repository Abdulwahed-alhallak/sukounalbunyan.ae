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
    const allPassed = requirements.php.check && 
        Object.values(requirements.extensions).every(ext => ext.check);

    return (
        <>
            <Head title={t('Installation - Requirements')} />
            <div className="min-h-screen bg-muted/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <h2 className="text-2xl font-bold text-foreground mb-6">{t('Server Requirements')}</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded">
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
                                <div key={key} className="flex items-center justify-between p-3 border rounded">
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
                                className="py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted/50"
                            >
                                {t('Back')}
                            </Link>
                            {allPassed ? (
                                <Link
                                    href={route('installer.permissions')}
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-accent"
                                >
                                    {t('Next')}
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-muted-foreground cursor-not-allowed"
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