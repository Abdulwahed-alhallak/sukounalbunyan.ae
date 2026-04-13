import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { getAdminSetting, getCompanySetting, isPackageActive, getPackageFavicon } from '@/utils/helpers';

export const paymentMethodBtn = (data?: any) => {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;

    const stripeEnabled = getAdminSetting('stripe_enabled');

    if (stripeEnabled === 'on') {
        return [
            {
                id: 'stripe-payment',
                dataUrl: route('payment.stripe.store'),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <div className="flex w-full items-center space-x-3 rounded-lg border border-border p-3 dark:border-border">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="flex cursor-pointer items-center space-x-2">
                            <div>
                                <div className="font-medium text-foreground dark:text-foreground">{t('Stripe')}</div>
                            </div>
                            <img src={getPackageFavicon('Stripe')} alt="Stripe" className="h-10 w-10" />
                        </Label>
                    </div>
                ),
            },
        ];
    } else {
        return [];
    }
};

export const bookingPayment = (data?: any) => {
    const { t } = useTranslation();
    const { auth, userSlug } = usePage().props as any;

    const stripeEnabled = getCompanySetting('stripe_enabled');
    if (stripeEnabled === 'on') {
        return [
            {
                id: 'stripe-booking-payment',
                dataUrl: route('booking.payment.stripe.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <div className="flex w-full items-center space-x-3 rounded-lg border border-border p-3 dark:border-border">
                        <Label htmlFor="stripe-booking" className="flex cursor-pointer items-center space-x-2">
                            <img src={getPackageFavicon('Stripe')} alt="Stripe" className="h-10 w-10" />
                            <div>
                                <div className="font-medium text-foreground dark:text-foreground">{t('Stripe')}</div>
                            </div>
                        </Label>
                        <RadioGroupItem value="stripe" id="stripe-booking" />
                    </div>
                ),
            },
        ];
    } else {
        return [];
    }
};

export const beautySpaPayment = (data?: any) => {
    const { t } = useTranslation();
    const { auth, userSlug } = usePage().props as any;

    const stripeEnabled = getCompanySetting('stripe_enabled');
    if (stripeEnabled === 'on') {
        return [
            {
                id: 'stripe-beauty-spa-payment',
                dataUrl: route('beauty-spa.payment.stripe.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <Label
                        htmlFor="stripe-beauty-payment"
                        className="block cursor-pointer rounded-lg border border-border p-4 transition-all duration-200 hover:border-[#df9896]"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-full border bg-card">
                                    <img
                                        src={getPackageFavicon('Stripe')}
                                        alt="Stripe Logo"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h5 className="text-base font-medium text-foreground">{t('Stripe')}</h5>
                                </div>
                            </div>
                            <RadioGroupItem value="stripe" id="stripe-beauty-payment" />
                        </div>
                    </Label>
                ),
            },
        ];
    } else {
        return [];
    }
};

export const lmsPayment = (data?: any) => {
    const { t } = useTranslation();
    const { auth, userSlug } = usePage().props as any;

    const stripeEnabled = getCompanySetting('stripe_enabled');
    if (stripeEnabled === 'on') {
        return [
            {
                id: 'stripe-lms-payment',
                dataUrl: route('lms.payment.stripe.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <div className="flex w-full cursor-pointer items-center space-x-3 rounded-lg border-2 border-border p-3 transition-colors hover:border-border">
                        <RadioGroupItem value="stripe" id="stripe-lms" />
                        <Label htmlFor="stripe-lms" className="flex flex-1 cursor-pointer items-center space-x-3">
                            <img src={getPackageFavicon('Stripe')} alt="Stripe" className="h-8 w-8" />
                            <div>
                                <div className="font-medium text-foreground">{t('Credit/Debit Card')}</div>
                                <div className="text-sm text-muted-foreground">{t('Pay securely with Stripe')}</div>
                            </div>
                        </Label>
                    </div>
                ),
            },
        ];
    } else {
        return [];
    }
};

export const parkingPayment = (data?: any) => {
    const { t } = useTranslation();
    const { auth, userSlug } = usePage().props as any;

    const stripeEnabled = getCompanySetting('stripe_enabled');
    if (stripeEnabled === 'on') {
        return [
            {
                id: 'stripe-parking-payment',
                dataUrl: route('parking.payment.stripe.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <div className="flex cursor-pointer items-center space-x-3 rounded-lg border-2 border-border p-3 transition-colors hover:border-foreground">
                        <RadioGroupItem value="stripe" id="stripe-parking" />
                        <Label htmlFor="stripe-parking" className="flex flex-1 cursor-pointer items-center space-x-3">
                            <img src={getPackageFavicon('Stripe')} alt="Stripe" className="h-8 w-8" />
                            <div>
                                <div className="font-medium text-foreground">{t('Stripe')}</div>
                            </div>
                        </Label>
                    </div>
                ),
            },
        ];
    } else {
        return [];
    }
};

export const laundryPayment = (data?: any) => {
    const { t } = useTranslation();
    const { userSlug } = usePage().props as any;

    const stripeEnabled = getCompanySetting('stripe_enabled');
    if (stripeEnabled === 'on') {
        return [
            {
                id: 'stripe-laundry-payment',
                dataUrl: route('laundry.payment.stripe.store', { userSlug: userSlug }),
                component: (
                    <Label
                        htmlFor="stripe-laundry-payment"
                        className="block cursor-pointer rounded-lg border border-border p-4 transition-all duration-200 hover:border-foreground"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-full border bg-card">
                                    <img
                                        src={getPackageFavicon('Stripe')}
                                        alt="Stripe Logo"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h5 className="text-base font-medium text-foreground">Stripe</h5>
                                </div>
                            </div>
                            <RadioGroupItem value="stripe" id="stripe-laundry-payment" />
                        </div>
                    </Label>
                ),
            },
        ];
    }
    return [];
};

export const eventsPayment = (data?: any) => {
    const { t } = useTranslation();
    const { auth, userSlug } = usePage().props as any;

    const stripeEnabled = getCompanySetting('stripe_enabled');
    const isSelected = data?.selectedMethod === 'stripe';

    if (stripeEnabled === 'on') {
        return [
            {
                id: 'stripe-events-payment',
                dataUrl: route('events-management.payment.stripe.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <label className="cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="stripe"
                            className="hidden"
                            checked={isSelected}
                            onChange={() => data?.onMethodChange?.('stripe')}
                            required
                        />
                        <div
                            className={`flex items-center rounded-lg border-2 p-4 transition-all hover:border-border ${
                                isSelected ? 'border-destructive bg-muted/50' : 'border-border'
                            }`}
                        >
                            <div
                                className={`mr-3 h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                                    isSelected ? 'bg-muted/500 border-destructive' : 'border-border'
                                }`}
                            >
                                {isSelected && <div className="m-auto mt-0.5 h-2 w-2 rounded-full bg-card"></div>}
                            </div>
                            <img src={getPackageFavicon('Stripe')} alt="Stripe" className="mr-3 h-8 w-8" />
                            <span className="font-semibold">{t('Stripe')}</span>
                        </div>
                    </label>
                ),
            },
        ];
    } else {
        return [];
    }
};
