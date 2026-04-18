import { Headphones } from 'lucide-react';

export const supportticketCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Support Dashboard'),
        href: '/dashboard/support-ticket',
        permission: 'manage-support-tickets',
        parent: 'dashboard',
        order: 140,
    },
    {
        title: t('Support Ticket'),
        icon: Headphones,
        permission: 'manage-support-tickets',
        order: 700,
        children: [
            {
                title: t('Tickets'),
                href: '/support-tickets',
                permission: 'manage-support-tickets',
            },
            {
                title: t('Knowledge Base'),
                href: '/support-ticket-knowledge',
                permission: 'manage-knowledge-base',
            },
            {
                title: t('FAQ'),
                href: '/support-ticket-faq',
                permission: 'manage-faq',
            },
            {
                title: t('Contact'),
                href: '/support-ticket-contact',
                permission: 'manage-contact',
            },
            {
                title: t('System Setup'),
                href: '/support-ticket/ticket-categories',
                permission: 'manage-ticket-categories',
            },
        ],
    },
];
