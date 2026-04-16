import { ShieldCheck } from 'lucide-react';

export interface SettingMenuItem {
    order: number;
    title: string;
    href: string;
    icon: any;
    permission: string;
    component: string;
}

export const getGoogleCaptchaCompanySettings = (t: (key: string) => string): SettingMenuItem[] => [
    {
        order: 950,
        title: t('Captcha Settings'),
        href: '#google-captcha-settings',
        icon: ShieldCheck,
        permission: 'manage-google-captcha-settings',
        component: 'google-captcha-settings',
    },
];
