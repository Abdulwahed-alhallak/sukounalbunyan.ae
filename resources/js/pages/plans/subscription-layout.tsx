import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { usePageButtons } from '@/hooks/usePageButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    formatAdminCurrency,
    formatStorage,
    formatDate,
    getPackageFavicon,
    getPackageAlias,
    getSubscriptionDetails,
} from '@/utils/helpers';

interface Plan {
    id: number;
    name: string;
    description: string;
    number_of_users: number;
    status: boolean;
    free_plan: boolean;
    modules: string[];
    package_price_yearly: number;
    package_price_monthly: number;
    storage_limit: number;
    trial: boolean;
    trial_days: number;
}

interface Module {
    module: string;
    alias: string;
    image: string;
    monthly_price: number;
    yearly_price: number;
}

interface Props {
    plan: Plan;
    allModules: Module[];
    pricingPeriod: 'monthly' | 'yearly';
    onSubscribe: (planData: any) => void;
    bankTransferEnabled?: boolean;
    bankTransferInstructions?: string;
    userActiveModules?: string[];
    totalUsers?: number;
    planExpireDate?: string;
    trialExpireDate?: string;
}

function SubscriptionLayout({
    plan,
    allModules,
    pricingPeriod,
    onSubscribe,
    bankTransferEnabled = false,
    bankTransferInstructions = '',
    userActiveModules = [],
    totalUsers = 0,
    planExpireDate,
    trialExpireDate,
}: Props) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const [moduleSearch, setModuleSearch] = useState('');

    // Get subscription details using the helper function
    const subscriptionDetail = getSubscriptionDetails(auth?.user?.id);

    const [couponCode, setCouponCode] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(
        bankTransferEnabled ? 'bank_transfer' : null
    );
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState<{ amount: number; finalAmount: number } | null>(null);
    const [couponError, setCouponError] = useState<string>('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [fileError, setFileError] = useState<string>('');

    // Add payment method buttons hook
    const paymentButtons = usePageButtons(
        'paymentMethodBtn',
        {
            selectedMethod: selectedPaymentMethod,
            onMethodChange: setSelectedPaymentMethod,
        },
        true
    );

    const filteredModules = allModules.filter((module) => {
        const matchesSearch =
            module.alias.toLowerCase().includes(moduleSearch.toLowerCase()) ||
            module.module.toLowerCase().includes(moduleSearch.toLowerCase());

        return matchesSearch && plan.modules?.includes(module.module);
    });

    const applyCouponWithAmount = async (amount: number) => {
        if (!couponCode.trim()) return;

        setIsApplyingCoupon(true);
        setCouponError('');

        try {
            const response = await fetch(route('plans.apply-coupon'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    coupon_code: couponCode,
                    total_amount: amount,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setCouponDiscount({
                    amount: data.discount_amount,
                    finalAmount: amount - data.discount_amount,
                });
            } else {
                setCouponError(data.message);
                setCouponDiscount(null);
            }
        } catch (error) {
            setCouponError('Failed to apply coupon');
            setCouponDiscount(null);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleApplyCoupon = async () => {
        await applyCouponWithAmount(subtotal);
    };

    // Calculate subtotal without discount
    const subtotal = useMemo(() => {
        if (plan.free_plan) return 0;

        const basePrice =
            pricingPeriod === 'monthly'
                ? Number(plan?.package_price_monthly || 0)
                : Number(plan?.package_price_yearly || 0);

        return basePrice;
    }, [plan.free_plan, pricingPeriod, plan?.package_price_monthly, plan?.package_price_yearly]);

    // Final total after discount
    const dynamicTotal = useMemo(() => {
        const discountAmount = couponDiscount ? Number(couponDiscount.amount || 0) : 0;
        return Math.max(0, subtotal - discountAmount);
    }, [subtotal, couponDiscount]);

    const handleSubscribe = () => {
        if (selectedPaymentMethod === 'bank_transfer' && !receiptFile) {
            setFileError(t('Please upload payment receipt'));
            return;
        }

        setFileError('');

        if ((selectedPaymentMethod === 'bank_transfer' && receiptFile) || selectedPaymentMethod === 'cash_on_hand') {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('plan_id', plan.id.toString());
            formData.append('time_period', pricingPeriod === 'monthly' ? 'Month' : 'Year');
            formData.append('payment_method', selectedPaymentMethod);

            if (selectedPaymentMethod === 'bank_transfer' && receiptFile) {
                formData.append('payment_receipt', receiptFile);
            }
            formData.append('user_module_input', (plan.modules || []).join(','));

            if (couponCode) {
                formData.append('coupon_code', couponCode);
            }

            router.post(route('payment.bank-transfer.store'), formData, {
                forceFormData: true,
                onFinish: () => setIsSubmitting(false),
                onSuccess: () => {
                    router.visit(route('plans.index'), { replace: true });
                },
                onError: (errors) => {
                    console.error('Payment submission failed:', errors);
                },
            });
        } else if (
            selectedPaymentMethod &&
            paymentButtons.some((button) => button.id.includes(selectedPaymentMethod))
        ) {
            setIsSubmitting(true);

            const selectedButton = paymentButtons.find((button) => button.id.includes(selectedPaymentMethod));
            const dataUrl = (selectedButton as any)?.dataUrl;

            if (dataUrl) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = dataUrl;

                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                if (csrfToken) {
                    const csrfInput = document.createElement('input');
                    csrfInput.type = 'hidden';
                    csrfInput.name = '_token';
                    csrfInput.value = csrfToken;
                    form.appendChild(csrfInput);
                }

                const formData = {
                    plan_id: plan.id,
                    user_id: auth?.user?.id,
                    time_period: pricingPeriod === 'monthly' ? 'Month' : 'Year',
                    user_module_input: (plan.modules || []).join(','),
                    coupon_code: couponCode || '',
                };

                Object.entries(formData).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            }
            setIsSubmitting(false);
        } else {
            const subscriptionData = {
                planId: plan.id,
                totalPrice: dynamicTotal,
            };

            onSubscribe(subscriptionData);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Left Side - Plan Info */}
            <div className="space-y-6 lg:col-span-3">
                {/* Current Plan */}
                <div className="rounded-lg border border-border bg-card p-6 dark:border-border dark:bg-card">
                    <h3 className="mb-4 text-lg font-semibold text-foreground dark:text-foreground">
                        {t('Plan Details')}
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground dark:text-muted-foreground">{t('Users')}</span>
                            <span className="font-medium text-foreground dark:text-foreground">
                                {plan.number_of_users === -1
                                    ? t('Unlimited users')
                                    : `${plan.number_of_users} ${t('users')}`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground dark:text-muted-foreground">{t('Storage')}</span>
                            <span className="font-medium text-foreground dark:text-foreground">
                                {formatStorage(plan.storage_limit)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground dark:text-muted-foreground">
                                {t('Plan Expire Date')}
                            </span>
                            <span className="font-medium text-foreground dark:text-foreground">
                                {subscriptionDetail.status
                                    ? subscriptionDetail.plan_expire_date
                                        ? formatDate(subscriptionDetail.plan_expire_date)
                                        : '-'
                                    : planExpireDate
                                      ? formatDate(planExpireDate)
                                      : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Available Features */}
                <div className="rounded-lg border border-border bg-card p-6 dark:border-border dark:bg-card">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
                            {t('Available Features')}
                        </h3>
                        <SearchInput
                            value={moduleSearch}
                            onChange={setModuleSearch}
                            onSearch={() => {}}
                            placeholder={t('Search features...')}
                            className="w-48"
                        />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {filteredModules.map((module) => (
                                <div
                                    key={module.module}
                                    className="flex items-center gap-3 rounded border p-4 hover:bg-muted/50"
                                >
                                    <img
                                        src={getPackageFavicon(module.module)}
                                        alt=""
                                        className="h-8 w-8 rounded border"
                                    />
                                    <div className="flex-1">
                                        <span className="block truncate text-sm">{getPackageAlias(module.alias)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Subscription */}
            <div className="rounded-lg border border-border bg-card p-6 dark:border-border dark:bg-card lg:col-span-2">
                <h3 className="mb-6 text-lg font-semibold text-foreground dark:text-foreground">
                    {t('Subscribe to Plan')}
                </h3>

                <div className="space-y-6">
                    <div>
                        <Label htmlFor="coupon_code_regular">{t('Coupon Code')}</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="coupon_code_regular"
                                placeholder={t('Enter coupon code')}
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon || !couponCode.trim()}
                            >
                                {isApplyingCoupon ? t('Applying...') : t('Apply')}
                            </Button>
                        </div>
                        {couponError && <p className="text-sm text-destructive">{couponError}</p>}
                        {couponDiscount && (
                            <p className="text-sm text-foreground">{t('Coupon applied successfully!')}</p>
                        )}
                    </div>

                    {/* Price Summary */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between rounded-lg border border-border p-3 dark:border-border">
                            <div className="flex items-center space-x-2">
                                <svg className="h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm font-medium">{t('Users')}</span>
                            </div>
                            <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                                {plan.number_of_users === -1 ? t('Unlimited Users') : plan.number_of_users}
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border p-3 dark:border-border">
                            <div className="flex items-center space-x-2">
                                <svg className="h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm font-medium">{t('Storage')}</span>
                            </div>
                            <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                                {formatStorage(plan.storage_limit)}
                            </span>
                        </div>
                        {plan.trial && (
                            <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-3 dark:border-border dark:bg-muted">
                                <div className="flex items-center space-x-2">
                                    <svg className="h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium text-foreground dark:text-muted-foreground">
                                        {t('Free Trial')}
                                    </span>
                                </div>
                                <span className="text-sm text-foreground dark:text-foreground">
                                    {plan.trial_days} {t('days')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Payment Methods */}
                    {(bankTransferEnabled || paymentButtons.length > 0) && (
                        <div className="space-y-4">
                            <h4 className="font-medium text-foreground dark:text-foreground">{t('Payment Method')}</h4>
                            <RadioGroup
                                value={selectedPaymentMethod || ''}
                                onValueChange={(value) => {
                                    setSelectedPaymentMethod(value);
                                    const selectedButton = paymentButtons.find((button) => button.id.includes(value));
                                    if (selectedButton && 'route' in selectedButton) {
                                        router.visit(route(selectedButton.route as string));
                                    }
                                }}
                            >
                                {bankTransferEnabled && (
                                    <>
                                        <div className="flex w-full items-center space-x-3 rounded-lg border border-border p-3 dark:border-border">
                                            <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                            <Label htmlFor="bank_transfer" className="cursor-pointer">
                                                <div className="font-medium text-foreground dark:text-foreground">
                                                    {t('Bank Transfer')}
                                                </div>
                                                <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                                                    {t('Pay via bank transfer')}
                                                </div>
                                            </Label>
                                        </div>
                                        <div className="flex w-full items-center space-x-3 rounded-lg border border-border p-3 dark:border-border">
                                            <RadioGroupItem value="cash_on_hand" id="cash_on_hand" />
                                            <Label htmlFor="cash_on_hand" className="cursor-pointer">
                                                <div className="font-medium text-foreground dark:text-foreground">
                                                    {t('Cash on Hand (الدفع داخل شركة DION)')}
                                                </div>
                                                <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                                                    {t(
                                                        'ادفع نقداً أو من خلال زيارة مقر الشركة. يمكن لموظف دايون تفعيل الاشتراك مباشرة.'
                                                    )}
                                                </div>
                                            </Label>
                                        </div>
                                    </>
                                )}

                                {paymentButtons.map((button) => (
                                    <div key={button.id}>{button.component}</div>
                                ))}
                            </RadioGroup>

                            {selectedPaymentMethod === 'bank_transfer' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">{t('Bank Transfer Instructions')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {bankTransferInstructions && (
                                            <div className="rounded-lg border border-border bg-muted p-3 dark:border-border dark:bg-muted">
                                                <div
                                                    className="text-sm text-foreground dark:text-muted-foreground"
                                                    dangerouslySetInnerHTML={{
                                                        __html: bankTransferInstructions.replace(/\n/g, '<br/>'),
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="receipt">{t('Upload Payment Receipt')}</Label>
                                            <Input
                                                id="receipt"
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.pdf"
                                                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                                            />
                                            {receiptFile && (
                                                <p className="mt-2 text-sm text-foreground dark:text-foreground">
                                                    {t('Selected')}: {receiptFile.name}
                                                </p>
                                            )}
                                        </div>
                                        {fileError && <p className="text-sm text-destructive">{fileError}</p>}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Subscribe Button */}
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSubscribe}
                        disabled={!selectedPaymentMethod || isSubmitting}
                    >
                        {isSubmitting
                            ? t('Submitting...')
                            : `${t('Subscribe to Plan')} - ${formatAdminCurrency(dynamicTotal)}`}
                    </Button>

                    {paymentButtons.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground dark:text-muted-foreground">
                            {t('No payment methods available')}
                        </p>
                    )}

                    {(paymentButtons.length > 0 || bankTransferEnabled) && !selectedPaymentMethod && (
                        <p className="text-center text-sm text-muted-foreground dark:text-muted-foreground">
                            {t('Please select a payment method')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SubscriptionLayout;
