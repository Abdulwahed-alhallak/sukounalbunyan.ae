import { NavItem } from '@/types';
import { Briefcase, FileSignature, PackageCheck, LayoutDashboard, FolderOpen, FileText } from 'lucide-react';

export const getCompanyMenu = (t: (key: string) => string): NavItem[] => {
    return [
        {
            title: t('Rental Dashboard'),
            icon: LayoutDashboard,
            href: route('rental.dashboard'),
            moduleName: 'rental',
        },
        {
            title: t('Rental Projects'),
            icon: FolderOpen,
            href: route('rental-projects.index'),
            moduleName: 'rental',
        },
        {
            title: t('Rental Contracts'),
            icon: FileSignature,
            href: route('rental.index'),
            moduleName: 'contracts-unified',
        },
        {
            title: t('Register Return'),
            icon: PackageCheck,
            href: route('rental-returns.create'),
            moduleName: 'rental',
        },
    ];
};
