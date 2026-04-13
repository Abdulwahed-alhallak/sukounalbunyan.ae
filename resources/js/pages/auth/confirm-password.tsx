import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ConfirmPassword() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <AuthLayout
            title={t('Confirm your password')}
            description={t('This is a secure area of the application. Please confirm your password before continuing.')}
        >
            <Head title={t('Confirm password')} />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground dark:text-foreground">
                        {t('Password')}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder={t('Password')}
                        autoComplete="current-password"
                        autoFocus
                        className="w-full rounded-md border border-border px-3 py-2 text-sm placeholder-gray-400 transition-colors focus:outline-none dark:border-border dark:bg-muted dark:text-foreground"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center">
                    <Button
                        type="submit"
                        className="w-full transform rounded-md bg-foreground py-2.5 text-sm font-medium tracking-wide text-background shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                        disabled={processing}
                        data-test="confirm-password-button"
                    >
                        {processing ? 'Loading...' : t('CONFIRM PASSWORD')}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
