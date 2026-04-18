import { Bot } from 'lucide-react';

export const aiAssistantCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('AI Assistant'),
        icon: Bot,
        permission: 'manage-ai-assistant-settings',
        order: 900,
        children: [
            {
                title: t('AI Settings'),
                href: '/settings#aiassistant-settings',
                permission: 'manage-ai-assistant-settings',
            },
        ],
    },
];
