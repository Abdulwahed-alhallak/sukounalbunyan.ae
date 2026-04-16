import { Webhook } from 'lucide-react';

export const webhookCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Webhook Integration'),
        icon: Webhook,
        permission: 'manage-webhook-integration',
        order: 913,
        children: [
            {
                title: t('Webhook Settings'),
                href: route('webhook.settings.index'),
                permission: 'manage-webhook-settings',
            },
        ],
    },
];
