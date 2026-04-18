import { Store } from 'lucide-react';

export const posCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('POS Dashboard'),
        href: '/pos',
        permission: 'manage-pos-dashboard',
        parent: 'dashboard',
        order: 40,
    },
    {
        title: t('POS'),
        icon: Store,
        permission: 'manage-pos',
        order: 475,
        children: [
            {
                title: t('Add POS'),
                href: '/pos/create',
                permission: 'create-pos',
            },
            {
                title: t('POS Orders'),
                href: '/pos/orders',
                permission: 'manage-pos-orders',
            },
            {
                title: t('Print Barcode'),
                href: '/pos/barcode',
                permission: 'manage-pos-barcodes',
            },
            {
                title: t('Reports'),
                permission: 'manage-pos-reports',
                children: [
                    {
                        title: t('Sales Report'),
                        href: '/pos/reports/sales',
                        permission: 'view-pos-reports',
                    },
                    {
                        title: t('Product Report'),
                        href: '/pos/reports/products',
                        permission: 'view-pos-reports',
                    },
                    {
                        title: t('Customer Report'),
                        href: '/pos/reports/customers',
                        permission: 'view-pos-reports',
                    },
                ],
            },
        ],
    },
];
