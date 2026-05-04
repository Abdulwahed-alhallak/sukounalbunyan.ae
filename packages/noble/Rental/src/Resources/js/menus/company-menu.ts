import { NavItem } from '@/types';
import { Briefcase } from 'lucide-react';

export const getCompanyMenu = (t: (key: string) => string): NavItem[] => {
    return [
        {
            title: t('Rental Management'),
            icon: Briefcase,
            href: route('rental.index'),
            moduleName: 'rental',
            // permission: 'manage rental', // Optional: add if you want to restrict access
        },
    ];
};
