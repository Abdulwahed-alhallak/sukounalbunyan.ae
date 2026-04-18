import { ShieldCheck } from 'lucide-react';

export const googleCaptchaCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Security & Captcha'),
        icon: ShieldCheck,
        permission: 'manage-google-captcha-settings',
        order: 914,
        children: [
            {
                title: t('Captcha Settings'),
                href: '/settings#google-captcha-settings',
                permission: 'manage-google-captcha-settings',
            },
        ],
    },
];
