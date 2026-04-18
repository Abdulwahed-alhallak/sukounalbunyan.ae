import { BookOpen } from 'lucide-react';

export const doubleentryCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Double Entry'),
        icon: BookOpen,
        permission: 'manage-double-entry',
        order: 425,
        children: [
            {
                title: t('Ledger Summary'),
                href: '/double-entry/ledger-summary',
                permission: 'manage-ledger-summary',
                order: 10,
            },
            {
                title: t('Trial Balance'),
                href: '/double-entry/trial-balance',
                permission: 'manage-trial-balance',
                order: 20,
            },
            {
                title: t('Balance Sheets'),
                href: '/double-entry/balance-sheets',
                permission: 'manage-balance-sheets',
                order: 30,
            },
            {
                title: t('Profit & Loss'),
                href: '/double-entry/profit-loss',
                permission: 'manage-profit-loss',
                order: 40,
            },
            {
                title: t('Reports'),
                href: '/double-entry/reports',
                permission: 'manage-double-entry-reports',
                order: 50,
            },
        ],
    },
];
