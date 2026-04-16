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
                href: route('landing-page.index'),
                permission: 'manage-landing-page-settings',
            },
        ],
    },
];
