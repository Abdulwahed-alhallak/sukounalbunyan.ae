import { NavItem } from '@/types';
import { Briefcase, FileSignature, PackageCheck, LayoutDashboard } from 'lucide-react';

export const getCompanyMenu = (t: (key: string) => string): NavItem[] => {
    return [
        {
            title: t('Rental Dashboard'),
            icon: LayoutDashboard,
            href: route('rental.dashboard'),
            moduleName: 'rental',
        },
        {
            title: t('Rental Contracts'),
            icon: FileSignature,
            href: route('rental.index'),
            moduleName: 'rental',
        },
        {
            title: t('Register Return'),
            icon: PackageCheck,
            href: route('rental-returns.create'),
            moduleName: 'rental',
        },
    ];
};
