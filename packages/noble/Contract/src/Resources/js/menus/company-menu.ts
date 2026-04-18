import { FileSignature, Tag } from 'lucide-react';

export const contractCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Contract'),
        icon: FileSignature,
        permission: 'manage-contracts',
        order: 725,
        name: 'contract',
        children: [
            {
                title: t('Contracts'),
                href: '/contract',
                permission: 'manage-contracts',
                order: 10,
            },
            {
                title: t('Contract Types'),
                href: '/contract/contract-types',
                permission: 'manage-contract-types',
                order: 30,
            },
        ],
    },
];
