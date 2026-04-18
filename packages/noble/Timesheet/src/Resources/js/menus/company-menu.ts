import { Package, Clock } from 'lucide-react';

export const timesheetCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Timesheet'),
        icon: Clock,
        permission: 'manage-timesheet',
        order: 1450,
        href: '/timesheet',
    },
];
