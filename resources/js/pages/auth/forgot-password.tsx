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
        <AuthLayout
            title={t('Forgot password')}
            description={t('Enter your email to receive a password reset link')}
        >
            <Head title={t('Forgot password')} />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-foreground">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground dark:text-foreground">{t('Email address')}</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="email"
                            autoFocus
                            required
                            placeholder="email@example.com"
                            className="w-full px-3 py-2 border border-border dark:border-border rounded-md text-sm focus:outline-none transition-colors placeholder-gray-400 dark:bg-muted dark:text-foreground"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="mt-6 flex items-center justify-start">
                        <Button
                            type="submit"
                            className="w-full bg-foreground text-background py-2.5 text-sm font-medium tracking-wide transition-all duration-200 rounded-md shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                            disabled={processing}
                            data-test="email-password-reset-link-button"
                        >
                            {processing ? 'Loading...' : t('EMAIL PASSWORD RESET LINK')}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-5">
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                        <span>{t('Or, return to')}</span>{' '}
                        <Link href={route('login')} className="text-foreground font-medium hover:underline">{t('log in')}</Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
