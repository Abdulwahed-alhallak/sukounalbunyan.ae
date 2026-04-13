import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { getAdminSetting, getCompanySetting, isPackageActive, getPackageFavicon } from '@/utils/helpers';

export const paymentMethodBtn = (data?: any) => {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;

    const paypalEnabled = getAdminSetting('paypal_enabled');

    if (paypalEnabled === 'on') {
        return [
            {
                id: 'paypal-payment',
                dataUrl: route('payment.paypal.store'),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <div className="flex w-full items-center space-x-3 rounded-lg border border-border p-3 dark:border-border">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex cursor-pointer items-center space-x-2">
                            <div>
                                <div className="font-medium text-foreground dark:text-foreground">{t('PayPal')}</div>
                            </div>
                            <img src={getPackageFavicon('Paypal')} alt="PayPal" className="h-10 w-10" />
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

    const paypalEnabled = getCompanySetting('paypal_enabled');
    if (paypalEnabled === 'on') {
        return [
            {
                id: 'paypal-booking-payment',
                dataUrl: route('booking.payment.paypal.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <div className="flex w-full items-center space-x-3 rounded-lg border border-border p-3 dark:border-border">
                        <Label htmlFor="paypal-booking" className="flex cursor-pointer items-center space-x-2">
                            <img src={getPackageFavicon('Paypal')} alt="PayPal" className="h-10 w-10" />
                            <div>
                                <div className="font-medium text-foreground dark:text-foreground">{t('PayPal')}</div>
                            </div>
                        </Label>
                        <RadioGroupItem value="paypal" id="paypal-booking" />
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

    const paypalEnabled = getCompanySetting('paypal_enabled');
    if (paypalEnabled === 'on') {
        return [
            {
                id: 'paypal-beauty-spa-payment',
                dataUrl: route('beauty-spa.payment.paypal.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <Label
                        htmlFor="paypal-beauty-payment"
                        className="block cursor-pointer rounded-lg border border-border p-4 transition-all duration-200 hover:border-[#df9896]"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-full border bg-card">
                                    <img
                                        src={getPackageFavicon('Paypal')}
                                        alt="PayPal Logo"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h5 className="text-base font-medium text-foreground">{t('PayPal')}</h5>
                                </div>
                            </div>
                            <RadioGroupItem value="paypal" id="paypal-beauty-payment" />
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

    const paypalEnabled = getCompanySetting('paypal_enabled');
    if (paypalEnabled === 'on') {
        return [
            {
                id: 'paypal-lms-payment',
                dataUrl: route('lms.payment.paypal.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <div className="flex w-full cursor-pointer items-center space-x-3 rounded-lg border-2 border-border p-3 transition-colors hover:border-border">
                        <RadioGroupItem value="paypal" id="paypal-lms" />
                        <Label htmlFor="paypal-lms" className="flex flex-1 cursor-pointer items-center space-x-3">
                            <img src={getPackageFavicon('Paypal')} alt="PayPal" className="h-8 w-8" />
                            <div>
                                <div className="font-medium text-foreground">{t('PayPal')}</div>
                                <div className="text-sm text-muted-foreground">{t('Pay securely with PayPal')}</div>
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

    const paypalEnabled = getCompanySetting('paypal_enabled');
    if (paypalEnabled === 'on') {
        return [
            {
                id: 'paypal-parking-payment',
                dataUrl: route('parking.payment.paypal.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <div className="flex cursor-pointer items-center space-x-3 rounded-lg border-2 border-border p-3 transition-colors hover:border-foreground">
                        <RadioGroupItem value="paypal" id="paypal-parking" />
                        <Label htmlFor="paypal-parking" className="flex flex-1 cursor-pointer items-center space-x-3">
                            <img src={getPackageFavicon('Paypal')} alt="PayPal" className="h-8 w-8" />
                            <div>
                                <div className="font-medium text-foreground">{t('PayPal')}</div>
                            </div>
                        </Label>
                    </div>
                ),
            },
        ];
    }
    return [];
};

export const laundryPayment = (data?: any) => {
    const { t } = useTranslation();
    const { userSlug } = usePage().props as any;

    const paypalEnabled = getCompanySetting('paypal_enabled');
    if (paypalEnabled === 'on') {
        return [
            {
                id: 'paypal-laundry-payment',
                dataUrl: route('laundry.payment.paypal.store', { userSlug: userSlug }),
                component: (
                    <Label
                        htmlFor="paypal-laundry-payment"
                        className="block cursor-pointer rounded-lg border border-border p-4 transition-all duration-200 hover:border-foreground"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-full border bg-card">
                                    <img
                                        src={getPackageFavicon('Paypal')}
                                        alt="PayPal Logo"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h5 className="text-base font-medium text-foreground">{t('PayPal')}</h5>
                                </div>
                            </div>
                            <RadioGroupItem value="paypal" id="paypal-laundry-payment" />
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

    const paypalEnabled = getCompanySetting('paypal_enabled');
    if (paypalEnabled === 'on') {
        return [
            {
                id: 'paypal-events-payment',
                dataUrl: route('events-management.payment.paypal.store', { userSlug: userSlug }),
                onFormSubmit: data?.onFormSubmit,
                component: (
                    <label className="cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            className="hidden"
                            onChange={() => data?.onMethodChange?.('paypal')}
                        />
                        <div
                            className={`flex items-center rounded-lg border-2 p-4 transition-all hover:border-border ${data?.selectedMethod === 'paypal' ? 'border-destructive bg-muted/50' : 'border-border'}`}
                        >
                            <div
                                className={`me-3 h-4 w-4 flex-shrink-0 rounded-full border-2 ${data?.selectedMethod === 'paypal' ? 'bg-muted/500 border-destructive' : 'border-border'}`}
                            >
                                {data?.selectedMethod === 'paypal' && (
                                    <div className="m-auto mt-0.5 h-2 w-2 rounded-full bg-card"></div>
                                )}
                            </div>
                            <img src={getPackageFavicon('Paypal')} alt="PayPal" className="me-3 h-8 w-8" />
                            <span className="font-semibold">{t('PayPal')}</span>
                        </div>
                    </label>
                ),
            },
        ];
    } else {
        return [];
    }
};
