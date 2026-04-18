import { Video } from 'lucide-react';

export const zoommeetingCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Zoom Meetings'),
        icon: Video,
        permission: 'manage-zoom-meetings',
        href: '/zoom-meetings',
        order: 950,
    },
];
