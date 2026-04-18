import { Layers } from 'lucide-react';

export const productserviceCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Product & Service'),
        icon: Layers,
        permission: 'manage-product-service-item',
        parent: 'settings',
        order: 100,
        children: [
            {
                title: t('Items'),
                href: '/product-service/items',
                permission: 'manage-product-service-item',
            },
            {
                title: t('System Setup'),
                href: '/product-service/item-categories',
                permission: 'manage-product-service-item',
            },
        ],
    },
];
