import { Head, router, usePage } from '@inertiajs/react';
import Header from './components/Header';
import Footer from './components/Footer';
import { getAdminSetting, getImagePath, formatAdminCurrency } from '@/utils/helpers';
import { useState } from 'react';
import CookieConsent from "@/components/cookie-consent";
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
    const settings = { ...props.settings, is_authenticated: (auth?.user?.id !== undefined && auth?.user?.id !== null) };
    const pricingSettings = settings?.config_sections?.sections?.pricing || {};
    
    const [priceType, setPriceType] = useState(pricingSettings.default_price_type || 'monthly');

    // Find the plan with the highest order count for "Most Popular" badge
    const mostPopularPlanId = plans.length > 0 
        ? plans.reduce((prev, current) => 
            (current.orders_count || 0) > (prev.orders_count || 0) ? current : prev
          ).id
        : null;

    return (
        <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
            <Head title="Pricing" >
                {faviconUrl && <link rel="icon" type="image/x-icon" href={faviconUrl} />}
            </Head>
            
            <Header settings={settings} />
            
            <main className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header Section */}
                    <div className="text-center mb-24">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                            {pricingSettings.title || t('Pricing Plans')}
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                            {pricingSettings.subtitle || t('Scalable solutions for teams of all sizes.')}
                        </p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex justify-center mb-16">
                        <div className="p-1 bg-neutral-900 border border-neutral-800 rounded-full flex items-center">
                            <button
                                onClick={() => setPriceType('monthly')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                                    priceType === 'monthly' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                {t("Monthly")}
                            </button>
                            <button
                                onClick={() => setPriceType('yearly')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                                    priceType === 'yearly' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                {t("Yearly")}
                            </button>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                        {plans.map((plan) => (
                            <div 
                                key={plan.id}
                                className={`relative flex flex-col p-8 rounded-3xl border ${
                                    plan.id === mostPopularPlanId 
                                        ? 'border-white bg-neutral-900/50' 
                                        : 'border-neutral-800 bg-neutral-900/20'
                                } transition-all duration-300 hover:border-neutral-600`}
                            >
                                {plan.id === mostPopularPlanId && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                                        {t("Most Popular")}
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2 tracking-tight">{plan.name}</h3>
                                    <p className="text-neutral-400 text-sm">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-black tracking-tighter">
                                            {plan.free_plan ? t("Free") : (priceType === 'monthly' ? formatAdminCurrency(plan.package_price_monthly) : formatAdminCurrency(plan.package_price_yearly))}
                                        </span>
                                        {!plan.free_plan && (
                                            <span className="text-neutral-500 text-lg ml-2 font-medium">
                                                /{priceType === 'monthly' ? 'mo' : 'yr'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => router.visit(settings?.is_authenticated ? route('dashboard') : route('register'))}
                                    className={`w-full py-4 rounded-xl font-bold transition-all mb-8 ${
                                        plan.id === mostPopularPlanId 
                                            ? 'bg-white text-black hover:bg-neutral-200' 
                                            : 'bg-neutral-800 text-white hover:bg-neutral-700'
                                    }`}
                                >
                                    {settings?.is_authenticated ? t('Go to Dashboard') : t('Get Started')}
                                </button>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center text-sm text-neutral-300">
                                        <Check className="w-4 h-4 mr-3 text-white" />
                                        {plan.number_of_users === -1 ? t('Unlimited Users') : `${plan.number_of_users} ${t('Users')}`}
                                    </div>
                                    <div className="flex items-center text-sm text-neutral-300">
                                        <Check className="w-4 h-4 mr-3 text-white" />
                                        {Math.round(plan.storage_limit / (1024 * 1024))}GB {t("Storage")}
                                    </div>
                                    {plan.trial && (
                                        <div className="flex items-center text-sm text-neutral-300">
                                            <Check className="w-4 h-4 mr-3 text-white" />
                                            {plan.trial_days} {t("Days Free Trial")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Comparison */}
                    <div className="overflow-hidden border border-neutral-800 rounded-3xl bg-neutral-900/10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="py-8 px-8 text-neutral-500 font-bold uppercase tracking-widest text-xs">{t("Feature Comparison")}</th>
                                    {plans.map(plan => (
                                        <th key={plan.id} className="py-8 px-8 text-center font-bold tracking-tight text-xl">{plan.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {activeModules.map((module) => (
                                    <tr key={module.module} className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors">
                                        <td className="py-6 px-8 text-neutral-300 font-medium">{module.alias}</td>
                                        {plans.map(plan => (
                                            <td key={plan.id} className="py-6 px-8 text-center">
                                                {plan.modules?.includes(module.module) ? (
                                                    <Check className="w-5 h-5 mx-auto text-white" />
                                                ) : (
                                                    <X className="w-5 h-5 mx-auto text-neutral-700" />
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