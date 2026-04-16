import { Send } from 'lucide-react';

export const telegramCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Telegram Integration'),
        icon: Send,
        permission: 'manage-telegram-integration',
        order: 911,
        children: [
            {
                title: t('Telegram Settings'),
                href: route('telegram.settings.index'),
                permission: 'manage-telegram-settings',
            },
        ],
    },
];
