import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Props {
    credentials: {
        admin: { email: string; password: string };
        company: { email: string; password: string };
    };
}

export default function Final({ credentials }: Props) {
    const { t } = useTranslation();
    return (
        <>
            <Head title={t('Installation Complete')} />
            <div className="flex min-h-screen flex-col justify-center bg-muted/50 py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <svg
                                    className="h-6 w-6 text-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <h2 className="mb-4 text-2xl font-bold text-foreground">{t('Installation Complete!')}</h2>
                            <p className="mb-8 text-muted-foreground">
                                {t('Your application has been successfully installed and configured.')}
                            </p>
                            <div className="space-y-4 text-left">
                                <div className="rounded-md border border-border bg-muted p-4">
                                    <h3 className="mb-3 font-semibold text-foreground">
                                        {t('Default Login Credentials')}:
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <strong className="text-foreground">{t('Admin Account')}:</strong>
                                            <br />
                                            <span className="text-foreground">
                                                {t('Email')}: {credentials.admin.email}
                                            </span>
                                            <br />
                                            <span className="text-foreground">
                                                {t('Password')}: {credentials.admin.password}
                                            </span>
                                        </div>
                                        <div>
                                            <strong className="text-foreground">{t('Company Account')}:</strong>
                                            <br />
                                            <span className="text-foreground">
                                                {t('Email')}: {credentials.company.email}
                                            </span>
                                            <br />
                                            <span className="text-foreground">
                                                {t('Password')}: {credentials.company.password}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md border border-border bg-muted p-4">
                                    <h3 className="mb-2 font-semibold text-foreground">
                                        {t('Important Security Note')}:
                                    </h3>
                                    <p className="text-sm text-foreground">
                                        {t(
                                            'Please change the default passwords after login and delete the installer files from your server.'
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link
                                    href={route('dashboard')}
                                    className="flex w-full justify-center rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    {t('Go to Dashboard')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
