import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function Database() {
    const { t } = useTranslation();
    const { post, processing, errors } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('installer.database.store'), {
            onError: (errors) => {
                console.log('Database setup errors:', errors);
            },
        });
    };

    return (
        <>
            <Head title={t('Installation - Database Setup')} />
            <div className="flex min-h-screen flex-col justify-center bg-muted/50 py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
                        <h2 className="mb-6 text-2xl font-bold text-foreground">{t('Database Setup')}</h2>

                        <div className="mb-6">
                            <p className="mb-4 text-muted-foreground">
                                {t('This step will create the database tables and seed initial data.')}
                            </p>
                            <div className="rounded-md border border-border bg-muted p-4">
                                <h3 className="mb-2 font-semibold text-foreground">{t('What will happen')}:</h3>
                                <ul className="space-y-1 text-sm text-foreground">
                                    <li>• {t('Run database migrations')}</li>
                                    <li>• {t('Seed initial data')}</li>
                                    <li>• {t('Create default roles and permissions')}</li>
                                    <li>• {t('Setup system settings')}</li>
                                </ul>
                            </div>
                        </div>

                        {(errors as any).database && (
                            <div className="mb-4 rounded-md border border-border bg-muted p-4">
                                <p className="text-destructive">{(errors as any).database}</p>
                            </div>
                        )}

                        <form onSubmit={submit}>
                            {processing && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50">
                                    <div className="rounded-lg bg-card p-6 text-center shadow-lg">
                                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-foreground"></div>
                                        <p>{t('Setting up database...')}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <Link
                                    href={route('installer.environment')}
                                    className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50"
                                >
                                    {t('Back')}
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm hover:bg-accent disabled:opacity-50"
                                >
                                    {processing ? t('Setting up Database...') : t('Setup Database')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
