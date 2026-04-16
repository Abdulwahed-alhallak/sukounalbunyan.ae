import { Phone } from 'lucide-react';

export const twilioCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Twilio Integration'),
        icon: Phone,
        permission: 'manage-twilio-integration',
        order: 912,
        children: [
            {
                title: t('Twilio Settings'),
                href: route('twilio.settings.index'),
                permission: 'manage-twilio-settings',
            },
        ],
    },
];
