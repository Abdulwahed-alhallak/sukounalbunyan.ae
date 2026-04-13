import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { post, processing, errors } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout
            title={t('Verify email')}
            description={t('Please verify your email address by clicking on the link we just emailed to you.')}
        >
            <Head title={t('Email verification')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-foreground">
                    {t('A new verification link has been sent to the email address you provided during registration.')}
                </div>
            )}

            {(errors as any).email && (
                <div className="mb-4 text-center text-sm font-medium text-destructive">{(errors as any).email}</div>
            )}

            <div className="space-y-6 text-center">
                <form onSubmit={submit} className="space-y-6">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full transform rounded-md bg-foreground py-2.5 text-sm font-medium tracking-wide text-background shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                    >
                        {processing ? 'Loading...' : t('RESEND VERIFICATION EMAIL')}
                    </Button>
                </form>

                <Link
                    href={route('logout')}
                    method="post"
                    as={'button'}
                    className="text-sm font-medium text-foreground hover:underline"
                >
                    {t('Log out')}
                </Link>
            </div>
        </AuthLayout>
    );
}
