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
            }
        });
    };

    return (
        <>
            <Head title={t('Installation - Database Setup')} />
            <div className="min-h-screen bg-muted/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <h2 className="text-2xl font-bold text-foreground mb-6">{t('Database Setup')}</h2>
                        
                        <div className="mb-6">
                            <p className="text-muted-foreground mb-4">
                                {t('This step will create the database tables and seed initial data.')}
                            </p>
                            <div className="bg-muted border border-border rounded-md p-4">
                                <h3 className="font-semibold text-foreground mb-2">{t('What will happen')}:</h3>
                                <ul className="text-sm text-foreground space-y-1">
                                    <li>• {t('Run database migrations')}</li>
                                    <li>• {t('Seed initial data')}</li>
                                    <li>• {t('Create default roles and permissions')}</li>
                                    <li>• {t('Setup system settings')}</li>
                                </ul>
                            </div>
                        </div>

                        {(errors as any).database && (
                            <div className="mb-4 p-4 bg-muted border border-border rounded-md">
                                <p className="text-destructive">{(errors as any).database}</p>
                            </div>
                        )}
                        
                        <form onSubmit={submit}>
                            {processing && (
                                <div className="fixed inset-0 bg-foreground bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-card p-6 rounded-lg shadow-lg text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
                                        <p>{t('Setting up database...')}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <Link
                                    href={route('installer.environment')}
                                    className="py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted/50"
                                >
                                    {t('Back')}
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-accent disabled:opacity-50"
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
