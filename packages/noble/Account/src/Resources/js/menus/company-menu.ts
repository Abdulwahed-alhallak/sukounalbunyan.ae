import { Calculator, Building2, CreditCard, FileText, Landmark, BarChart3 } from 'lucide-react';

export const accountCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Account Dashboard'),
        href: '/account',
        permission: 'manage-account-dashboard',
        parent: 'dashboard',
        order: 20,
    },
    {
        title: t('Accounting'),
        icon: Calculator,
        permission: 'manage-account',
        order: 400,
        children: [
            {
                title: t('Customers'),
                href: '/account/customers',
                permission: 'manage-customers',
            },
            {
                title: t('Vendors'),
                href: '/account/vendors',
                permission: 'manage-vendors',
            },
            {
                title: t('Banking'),
                permission: 'manage-bank-accounts',
                children: [
                    {
                        title: t('Bank Accounts'),
                        href: '/account/bank-accounts',
                        permission: 'manage-bank-accounts',
                    },
                    {
                        title: t('Bank Transactions'),
                        href: '/account/bank-transactions',
                        permission: 'manage-bank-transactions',
                    },
                    {
                        title: t('Bank Transfers'),
                        href: '/account/bank-transfers',
                        permission: 'manage-bank-transfers',
                    },
                ],
            },
            {
                title: t('Chart Of Accounts'),
                href: '/account/chart-of-accounts',
                permission: 'manage-chart-of-accounts',
            },
            {
                title: t('Vendor Payments'),
                href: '/account/vendor-payments',
                permission: 'manage-vendor-payments',
            },
            {
                title: t('Customer Payments'),
                href: '/account/customer-payments',
                permission: 'manage-customer-payments',
            },
            {
                title: t('Revenue'),
                href: '/account/revenues',
                permission: 'manage-revenues',
            },
            {
                title: t('Expense'),
                href: '/account/expenses',
                permission: 'manage-expenses',
            },
            {
                title: t('Debit Notes'),
                href: '/account/debit-notes',
                permission: 'manage-debit-notes',
            },
            {
                title: t('Credit Notes'),
                href: '/account/credit-notes',
                permission: 'manage-credit-notes',
            },
            {
                title: t('Reports'),
                href: '/account/reports',
                permission: 'manage-account-reports',
            },
            {
                title: t('System Setup'),
                href: '/account/account-types',
                permission: 'manage-account-types',
            },
        ],
    },
];
