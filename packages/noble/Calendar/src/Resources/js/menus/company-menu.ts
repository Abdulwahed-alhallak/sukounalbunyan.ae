import { Calendar } from 'lucide-react';

export const calendarCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Calendar'),
        icon: Calendar,
        href: route('calendar.view.index'),
        permission: 'manage-calendar',
        order: 925,
    },
];
