import { ShieldCheck } from 'lucide-react';

export const googleCaptchaCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Security & Captcha'),
        icon: ShieldCheck,
        permission: 'manage-google-captcha',
        order: 914,
        children: [
            {
                title: t('Captcha Settings'),
                href: route('google-captcha.settings.update'),
                permission: 'manage-google-captcha-settings',
            },
        ],
    },
];
