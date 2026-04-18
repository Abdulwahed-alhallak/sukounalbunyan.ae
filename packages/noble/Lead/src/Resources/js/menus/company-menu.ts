import { Contact } from 'lucide-react';

export const leadCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('CRM Dashboard'),
        href: '/crm',
        permission: 'manage-crm-dashboard',
        parent: 'dashboard',
        order: 50,
    },
    {
        title: t('CRM'),
        icon: Contact,
        permission: 'manage-leads',
        order: 500,
        children: [
            {
                title: t('Leads'),
                href: '/crm/leads',
                permission: 'manage-leads',
            },
            {
                title: t('Deals'),
                href: '/crm/deals',
                permission: 'manage-deals',
            },
            {
                title: t('System Setup'),
                href: '/crm/pipelines',
                permission: 'manage-pipelines',
            },
            {
                title: t('Reports'),
                href: '/crm/reports',
                permission: 'view-reports',
                children: [
                    {
                        title: t('Lead Reports'),
                        href: '/crm/reports/leads',
                        permission: 'view-reports',
                    },
                    {
                        title: t('Deal Reports'),
                        href: '/crm/reports/deals',
                        permission: 'view-reports',
                    },
                ],
            },
        ],
    },
];
