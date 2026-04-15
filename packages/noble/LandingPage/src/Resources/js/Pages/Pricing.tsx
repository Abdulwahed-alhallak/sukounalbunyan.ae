import { Head, router, usePage } from '@inertiajs/react';
import Header from './components/Header';
import Footer from './components/Footer';
import { getAdminSetting, getImagePath, formatAdminCurrency } from '@/utils/helpers';
import { useState } from 'react';
import CookieConsent from '@/components/cookie-consent';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';

interface Plan {
    id: number;
    name: string;
    description?: string;
    package_price_monthly: number;
    package_price_yearly: number;
    number_of_users: number;
    storage_limit: number;
    modules: string[];
    free_plan: boolean;
    trial: boolean;
    trial_days: number;
    orders_count?: number;
}

interface Module {
    module: string;
    alias: string;
    image?: string;
    monthly_price?: number;
    yearly_price?: number;
}

interface PricingProps {
    [key: string]: any;
    plans?: Plan[];
    activeModules?: Module[];
    settings?: any;
    filters?: {
        search?: string;
        category?: string;
        price?: string;
        price_type?: string;
        sort?: string;
    };
}

export default function Pricing(props: PricingProps) {
    const { t } = useTranslation();
    const favicon = getAdminSetting('favicon');
    const faviconUrl = favicon ? getImagePath(favicon) : null;
    const { adminAllSetting, auth } = usePage().props as any;
    const plans = props.plans || [];
    const activeModules = props.activeModules || [];
    const settings = { ...props.settings, is_authenticated: auth?.user?.id !== undefined && auth?.user?.id !== null };
    const pricingSettings = settings?.config_sections?.sections?.pricing || {};

    const [priceType, setPriceType] = useState(pricingSettings.default_price_type || 'monthly');

    // Find the plan with the highest order count for "Most Popular" badge
    const mostPopularPlanId =
        plans.length > 0
            ? plans.reduce((prev, current) => ((current.orders_count || 0) > (prev.orders_count || 0) ? current : prev))
                  .id
            : null;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Head title="Pricing">{faviconUrl && <link rel="icon" type="image/x-icon" href={faviconUrl} />}</Head>

            <Header settings={settings} />

            <main className="py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Header Section */}
                    <div className="mb-24 text-center">
                        <h1 className="mb-8 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-5xl font-extrabold tracking-tighter text-transparent md:text-7xl">
                            {pricingSettings.title || t('Pricing Plans')}
                        </h1>
                        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-400 md:text-2xl">
                            {pricingSettings.subtitle || t('Scalable solutions for teams of all sizes.')}
                        </p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="mb-16 flex justify-center">
                        <div className="flex items-center rounded-full border border-neutral-800 bg-neutral-900 p-1">
                            <button
                                onClick={() => setPriceType('monthly')}
                                className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                                    priceType === 'monthly'
                                        ? 'bg-white text-black'
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                {t('Monthly')}
                            </button>
                            <button
                                onClick={() => setPriceType('yearly')}
                                className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                                    priceType === 'yearly' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                {t('Yearly')}
                            </button>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col rounded-3xl border p-8 ${
                                    plan.id === mostPopularPlanId
                                        ? 'border-white bg-neutral-900/50'
                                        : 'border-neutral-800 bg-neutral-900/20'
                                } transition-all duration-300 hover:border-neutral-600`}
                            >
                                {plan.id === mostPopularPlanId && (
                                    <div className="absolute -top-4 start-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-black uppercase tracking-widest text-black">
                                        {t('Most Popular')}
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="mb-2 text-2xl font-bold tracking-tight">{plan.name}</h3>
                                    <p className="text-sm text-neutral-400">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-black tracking-tighter">
                                            {plan.free_plan
                                                ? t('Free')
                                                : priceType === 'monthly'
                                                  ? formatAdminCurrency(plan.package_price_monthly)
                                                  : formatAdminCurrency(plan.package_price_yearly)}
                                        </span>
                                        {!plan.free_plan && (
                                            <span className="ms-2 text-lg font-medium text-neutral-500">
                                                /{priceType === 'monthly' ? 'mo' : 'yr'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        router.visit(
                                            settings?.is_authenticated ? route('dashboard') : route('register')
                                        )
                                    }
                                    className={`mb-8 w-full rounded-xl py-4 font-bold transition-all ${
                                        plan.id === mostPopularPlanId
                                            ? 'bg-white text-black hover:bg-neutral-200'
                                            : 'bg-neutral-800 text-white hover:bg-neutral-700'
                                    }`}
                                >
                                    {settings?.is_authenticated ? t('Go to Dashboard') : t('Get Started')}
                                </button>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center text-sm text-neutral-300">
                                        <Check className="me-3 h-4 w-4 text-white" />
                                        {plan.number_of_users === -1
                                            ? t('Unlimited Users')
                                            : `${plan.number_of_users} ${t('Users')}`}
                                    </div>
                                    <div className="flex items-center text-sm text-neutral-300">
                                        <Check className="me-3 h-4 w-4 text-white" />
                                        {Math.round(plan.storage_limit / (1024 * 1024))}GB {t('Storage')}
                                    </div>
                                    {plan.trial && (
                                        <div className="flex items-center text-sm text-neutral-300">
                                            <Check className="me-3 h-4 w-4 text-white" />
                                            {plan.trial_days} {t('Days Free Trial')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Comparison */}
                    <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/10">
                        <table className="w-full border-collapse text-start">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="px-8 py-8 text-xs font-bold uppercase tracking-widest text-neutral-500">
                                        {t('Feature Comparison')}
                                    </th>
                                    {plans.map((plan) => (
                                        <th
                                            key={plan.id}
                                            className="px-8 py-8 text-center text-xl font-bold tracking-tight"
                                        >
                                            {plan.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {activeModules.map((module) => (
                                    <tr
                                        key={module.module}
                                        className="border-b border-neutral-800/50 transition-colors hover:bg-neutral-900/30"
                                    >
                                        <td className="px-8 py-6 font-medium text-neutral-300">{module.alias}</td>
                                        {plans.map((plan) => (
                                            <td key={plan.id} className="px-8 py-6 text-center">
                                                {plan.modules?.includes(module.module) ? (
                                                    <Check className="mx-auto h-5 w-5 text-white" />
                                                ) : (
                                                    <X className="mx-auto h-5 w-5 text-neutral-700" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <Footer settings={settings} />
            <CookieConsent settings={adminAllSetting || {}} />
        </div>
    );
}
