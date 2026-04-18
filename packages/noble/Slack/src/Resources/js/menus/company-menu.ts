import { Slack } from 'lucide-react';

export const slackCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Slack Integration'),
        icon: Slack,
        permission: 'manage-slack-settings',
        order: 910,
        children: [
            {
                title: t('Slack Settings'),
                href: '/settings#slack-settings',
                permission: 'manage-slack-settings',
            },
        ],
    },
];
