import { Wallet } from 'lucide-react';

export const paypalCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Paypal Payments'),
        icon: Wallet,
        permission: 'manage-paypal-integration',
        order: 931,
        children: [
            {
                title: t('Paypal Settings'),
                href: route('paypal.settings.update'),
                permission: 'manage-paypal-settings',
            },
        ],
    },
];
