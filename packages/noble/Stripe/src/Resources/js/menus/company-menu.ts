import { CreditCard } from 'lucide-react';

export const stripeCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Stripe Payments'),
        icon: CreditCard,
        permission: 'manage-stripe-integration',
        order: 930,
        children: [
            {
                title: t('Stripe Settings'),
                href: route('stripe.settings.update'),
                permission: 'manage-stripe-settings',
            },
        ],
    },
];
