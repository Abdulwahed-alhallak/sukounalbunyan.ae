import { Globe } from 'lucide-react';

export interface SettingMenuItem {
    order: number;
    title: string;
    href: string;
    icon: any;
    permission: string;
    component: string;
}

export const getLandingPageCompanySettings = (t: (key: string) => string): SettingMenuItem[] => [
    {
        order: 940,
        title: t('CMS Settings'),
        href: '#landingpage-settings',
        icon: Globe,
        permission: 'manage-landing-page',
        component: 'landingpage-settings',
    },
];
