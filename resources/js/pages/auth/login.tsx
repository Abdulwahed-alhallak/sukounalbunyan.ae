import { FormEventHandler, useEffect } from 'react';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/ui/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Crown, Building2, Key, Calculator, Package } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useFormFields } from '@/hooks/useFormFields';
import { usePageButtons } from '@/hooks/usePageButtons';

const DEMO_COMPANY_EMAIL = 'admin@sukounalbunyan.ae';
const DEMO_PASSWORD = 'Nn@!23456';

export default function Login({
    status,
    canResetPassword,
    enableRegistration,
    isDemo = true,
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
                email: DEMO_COMPANY_EMAIL,
                password: DEMO_PASSWORD,
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
            title={t('Sukoun Albunyan Enterprise Platform')}
            description={t('Enter your securely governed credentials to access the digital architecture')}
        >
            <Head title={t('Log in')} />

            {status && <div className="mb-6 text-center text-sm font-medium text-success dark:text-success-foreground">{status}</div>}

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold tracking-tight text-foreground">
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
                            placeholder={t('email@sukoun.dion.sy')}
                            className="mt-1 w-full"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password"
                                className="text-sm font-semibold tracking-tight text-foreground"
                            >
                                {t('Password')}
                            </Label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground hover:underline"
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
                            className="cursor-pointer text-xs font-semibold text-muted-foreground/70 transition-colors hover:text-foreground"
                        >
                            {t('Remember me')}
                        </Label>
                    </div>

                    {formFields.map((field) => (
                        <div key={field.id}>{field.component}</div>
                    ))}

                    <Button
                        type="submit"
                        className="mt-6 w-full rounded-xl bg-foreground py-6 text-[15px] font-bold tracking-tight text-background shadow-md transition-all duration-300 hover:translate-y-[-1px] hover:shadow-xl active:translate-y-[1px]"
                        tabIndex={4}
                        disabled={processing}
                        data-test="login-button"
                    >
                        {processing ? <div className="vercel-shimmer h-4 w-20 rounded" /> : t('Sign In')}
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
                                     <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="bg-background px-3 text-muted-foreground/60">
                                            {t('Or secure entry with')}
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

                <div className="mt-5">
                    <div className="flex items-center">
                        <div className="h-px flex-1 bg-muted dark:bg-muted"></div>
                        <div className="mx-4 h-2 w-2 rotate-45 bg-foreground"></div>
                        <div className="h-px flex-1 bg-muted dark:bg-muted"></div>
                    </div>
                </div>

                <div className="mt-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px flex-1 bg-border/60"></div>
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap">
                                {t('Quick Access Protocol')}
                            </h3>
                            <div className="h-px flex-1 bg-border/60"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                             <Button
                                type="button"
                                onClick={() => handleQuickLogin(DEMO_COMPANY_EMAIL, DEMO_PASSWORD)}
                                disabled={processing}
                                className="group relative flex h-auto flex-col items-start gap-1 overflow-hidden rounded-xl border border-border bg-card/50 p-3 text-start transition-all hover:border-foreground/30 hover:bg-card hover:shadow-md disabled:opacity-50"
                            >
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/50 group-hover:bg-foreground/[0.07]">
                                        <Crown className="h-3.5 w-3.5 text-foreground" />
                                    </div>
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                                <div className="mt-2 min-w-0 text-start">
                                    <p className="text-[12px] font-bold text-foreground truncate">{t('Sukoun Commander')}</p>
                                    <p className="text-[9px] font-medium text-muted-foreground/70 truncate">{t('Full Governance')}</p>
                                </div>
                            </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
