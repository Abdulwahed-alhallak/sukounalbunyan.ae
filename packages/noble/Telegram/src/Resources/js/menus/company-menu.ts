import { Send } from 'lucide-react';

export const telegramCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Telegram Integration'),
        icon: Send,
        permission: 'manage-telegram-settings',
        order: 911,
        children: [
            {
                title: t('Telegram Settings'),
                href: '/settings#telegram-settings',
                permission: 'manage-telegram-settings',
            },
        ],
    },
];
