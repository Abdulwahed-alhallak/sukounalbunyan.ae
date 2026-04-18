import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title={t('Forgot password')} description={t('Enter your email to receive a password reset link')}>
            <Head title={t('Forgot password')} />

            {status && <div className="mb-4 text-center text-sm font-medium text-foreground">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground dark:text-foreground">
                            {t('Email address')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="email"
                            autoFocus
                            required
                            placeholder="email@noble.dion.sy"
                            className="w-full rounded-md border border-border px-3 py-2 text-sm placeholder-gray-400 transition-colors focus:outline-none dark:border-border dark:bg-muted dark:text-foreground"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="mt-6 flex items-center justify-start">
                        <Button
                            type="submit"
                            className="w-full transform rounded-md bg-foreground py-2.5 text-sm font-medium tracking-wide text-background shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                            disabled={processing}
                            data-test="email-password-reset-link-button"
                        >
                            {processing ? t('Loading...') : t('EMAIL PASSWORD RESET LINK')}
                        </Button>
                    </div>
                </form>

                <div className="mt-5 text-center">
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                        <span>{t('Or, return to')}</span>{' '}
                        <Link href={route('login')} className="font-medium text-foreground hover:underline">
                            {t('log in')}
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
