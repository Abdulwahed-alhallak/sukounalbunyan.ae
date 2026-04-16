import { Bot } from 'lucide-react';

export const aiAssistantCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('AI Assistant'),
        icon: Bot,
        permission: 'manage-ai-assistant',
        order: 900,
        children: [
            {
                title: t('AI Settings'),
                href: route('ai-assistant.settings.index'),
                permission: 'manage-ai-assistant-settings',
            },
        ],
    },
];
