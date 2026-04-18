import { CreditCard } from 'lucide-react';

export const stripeCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Stripe Payments'),
        icon: CreditCard,
        permission: 'manage-stripe-settings',
        order: 930,
        children: [
            {
                title: t('Stripe Settings'),
                href: '/settings#stripe-settings',
                permission: 'manage-stripe-settings',
            },
        ],
    },
];
