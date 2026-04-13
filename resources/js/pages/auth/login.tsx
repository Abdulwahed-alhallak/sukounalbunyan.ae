import { FormEventHandler, useEffect } from 'react';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/ui/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Crown, Building2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useFormFields } from '@/hooks/useFormFields';
import { usePageButtons } from '@/hooks/usePageButtons';

export default function Login({
    status,
    canResetPassword,
    enableRegistration,
    isDemo = false,
}: {
    status?: string;
    canResetPassword: boolean;
    enableRegistration?: boolean;
    isDemo?: boolean;
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        recaptcha_token: null,
    });

    const formFields = useFormFields('getReCaptchFields', data, setData, errors, 'create', t);
    const loginButtons = usePageButtons('getLoginButtons', { t, isLoading: processing });

    useEffect(() => {
        if (isDemo) {
            setData((prevData) => ({
                ...prevData,
                email: 'admin@noblearchitecture.net',
                password: '1234',
            }));
        }
    }, [isDemo]);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const handleQuickLogin = (email: string, password: string) => {
        setData((prevData) => ({
            ...prevData,
            email: email,
            password: password,
        }));

        // Use router directly to ensure we post with the updated values immediately
        // while also showing the values in the input fields for a brief moment.
        router.post(route('login'), {
            email,
            password,
            remember: data.remember,
            recaptcha_token: data.recaptcha_token || '',
        });
    };

    return (
        <AuthLayout
            title={t('Noble Architecture Enterprise Platform')}
            description={t('Enter your securely governed credentials to access the digital architecture')}
        >
            <Head title={t('Log in')} />

            {status && <div className="mb-4 text-center text-sm font-medium text-foreground">{status}</div>}

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-4">
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
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder={t('email@example.com')}
                            className="mt-1 w-full"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-foreground dark:text-foreground"
                            >
                                {t('Password')}
                            </Label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-foreground hover:underline"
                                    tabIndex={5}
                                >
                                    {t('Forgot password?')}
                                </Link>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder={t('Password')}
                            className="mt-1 w-full"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="mb-5 mt-4 flex items-center gap-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                            tabIndex={3}
                            className="h-[14px] w-[14px] rounded border-border transition-colors data-[state=checked]:bg-foreground data-[state=checked]:text-background dark:border-white/20"
                        />
                        <Label
                            htmlFor="remember"
                            className="cursor-pointer text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {t('Remember me')}
                        </Label>
                    </div>

                    {formFields.map((field) => (
                        <div key={field.id}>{field.component}</div>
                    ))}

                    <Button
                        type="submit"
                        className="mt-4 w-full rounded-lg bg-foreground py-6 text-sm font-bold tracking-tight text-background shadow-sm transition-all duration-300 hover:translate-y-[-1px] hover:shadow-xl active:translate-y-[1px]"
                        tabIndex={4}
                        disabled={processing}
                        data-test="login-button"
                    >
                        {processing ? <div className="vercel-shimmer h-4 w-20 rounded" /> : t('SIGN IN')}
                    </Button>

                    {loginButtons.length > 0 && (
                        <>
                            {/* Divider */}
                            <div className="my-5">
                                <div className="flex items-center">
                                    <div className="h-px flex-1 bg-muted dark:bg-muted"></div>
                                    <div className="mx-4 h-2 w-2 rotate-45 bg-foreground"></div>
                                    <div className="h-px flex-1 bg-muted dark:bg-muted"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t dark:border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground dark:bg-card dark:text-muted-foreground">
                                            {t('Or continue with')}
                                        </span>
                                    </div>
                                </div>
                                {loginButtons.map((button) => (
                                    <div key={button.id}>{button.component}</div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {enableRegistration && (
                    <div className="mt-5 text-center">
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                            {t("Don't have an account?")}{' '}
                            <Link
                                href={route('register')}
                                tabIndex={6}
                                className="font-medium text-foreground hover:underline"
                            >
                                {t('Create one')}
                            </Link>
                        </p>
                    </div>
                )}

                {true && (
                    <div className="mt-5">
                        <div className="flex items-center">
                            <div className="h-px flex-1 bg-muted dark:bg-muted"></div>
                            <div className="mx-4 h-2 w-2 rotate-45 bg-foreground"></div>
                            <div className="h-px flex-1 bg-muted dark:bg-muted"></div>
                        </div>
                    </div>
                )}

                {true && (
                    <div>
                        <h3 className="mb-4 text-center text-sm font-medium tracking-wider text-foreground dark:text-muted-foreground/60">
                            {t('Quick Access Panel')}
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Button
                                type="button"
                                onClick={() => handleQuickLogin('superadmin@noblearchitecture.net', '1234')}
                                disabled={processing}
                                className="group relative h-auto overflow-hidden rounded-xl border border-border bg-background px-4 py-3 text-[13px] font-bold text-foreground shadow-sm transition-all duration-300 hover:border-foreground/30 hover:shadow-md disabled:opacity-50 sm:col-span-2"
                            >
                                <div className="absolute inset-0 bg-foreground/5 opacity-0 transition-opacity group-hover:opacity-100" />
                                <span className="relative flex items-center justify-center gap-2">
                                    <Crown className="h-4 w-4 text-amber-500" />
                                    {t('Login as System Root (Super Admin)')}
                                </span>
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleQuickLogin('admin@noblearchitecture.net', '1234')}
                                disabled={processing}
                                className="group relative h-auto overflow-hidden rounded-xl border border-border bg-background px-4 py-3 text-[13px] font-bold text-foreground shadow-sm transition-all duration-300 hover:border-foreground/30 hover:shadow-md disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-foreground/5 opacity-0 transition-opacity group-hover:opacity-100" />
                                <span className="relative flex items-center justify-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    {t('Login as Noble Commander')}
                                </span>
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleQuickLogin('samad34557788@noblearchitecture.net', '1234')}
                                disabled={processing}
                                className="group relative h-auto overflow-hidden rounded-xl border border-border bg-background px-4 py-3 text-[13px] font-bold text-foreground shadow-sm transition-all duration-300 hover:border-foreground/30 hover:shadow-md disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-foreground/5 opacity-0 transition-opacity group-hover:opacity-100" />
                                <span className="relative flex items-center justify-center gap-2">
                                    <Building2 className="h-4 w-4 opacity-50" />
                                    {t('Login as Noble Employee')}
                                </span>
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </AuthLayout>
    );
}
