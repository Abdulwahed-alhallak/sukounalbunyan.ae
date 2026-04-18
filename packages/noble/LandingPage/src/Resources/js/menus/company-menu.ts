import { Layout } from 'lucide-react';

export const landingPageCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Site Layout & CMS'),
        icon: Layout,
        permission: 'manage-landing-page',
        order: 920,
        children: [
            {
                title: t('CMS Settings'),
                href: '/landing-page',
                permission: 'manage-landing-page-settings',
            },
        ],
    },
];
