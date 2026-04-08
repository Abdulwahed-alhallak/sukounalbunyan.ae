import { FileCheck } from 'lucide-react';



export const quotationCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Quotation'),
        icon: FileCheck,
        permission: 'manage-quotations',
        href: route('quotations.index'),
        order: 260,
    },
];