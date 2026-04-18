import { Wallet } from 'lucide-react';

export const paypalCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Paypal Payments'),
        icon: Wallet,
        permission: 'manage-paypal-settings',
        order: 931,
        children: [
            {
                title: t('Paypal Settings'),
                href: '/settings#paypal-settings',
                permission: 'manage-paypal-settings',
            },
        ],
    },
];
