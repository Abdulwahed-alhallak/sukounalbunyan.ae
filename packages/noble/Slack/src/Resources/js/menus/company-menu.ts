import { Slack } from 'lucide-react';

export const slackCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Slack Integration'),
        icon: Slack,
        permission: 'manage-slack-integration',
        order: 910,
        children: [
            {
                title: t('Slack Settings'),
                href: route('slack.settings.index'),
                permission: 'manage-slack-settings',
            },
        ],
    },
];
