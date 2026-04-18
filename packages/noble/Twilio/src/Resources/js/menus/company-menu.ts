import { Phone } from 'lucide-react';

export const twilioCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Twilio Integration'),
        icon: Phone,
        permission: 'manage-twilio-settings',
        order: 912,
        children: [
            {
                title: t('Twilio Settings'),
                href: '/settings#twilio-settings',
                permission: 'manage-twilio-settings',
            },
        ],
    },
];
