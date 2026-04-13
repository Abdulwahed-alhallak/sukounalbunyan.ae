import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Welcome() {
    const { t } = useTranslation();
    return (
        <>
            <Head title={t('Installation - Welcome')} />
            <div className="flex min-h-screen flex-col justify-center bg-muted/50 py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <h2 className="mb-6 text-3xl font-extrabold text-foreground">
                                {t('Welcome to Installation')}
                            </h2>
                            <p className="mb-8 text-muted-foreground">
                                {t('This installer will guide you through the setup process for your application.')}
                            </p>
                            <div className="space-y-4">
                                <div className="text-left">
                                    <h3 className="mb-2 font-semibold text-foreground">{t('Installation Steps')}:</h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• {t('Check server requirements')}</li>
                                        <li>• {t('Verify file permissions')}</li>
                                        <li>• {t('Configure environment')}</li>
                                        <li>• {t('Setup database')}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link
                                    href={route('installer.requirements')}
                                    className="flex w-full justify-center rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    {t('Start Installation')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
