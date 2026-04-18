import { Target, Tag } from 'lucide-react';

export const goalCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Goal'),
        icon: Target,
        permission: 'manage-goal',
        order: 415,
        children: [
            {
                title: t('Goals'),
                href: '/goal/goals',
                permission: 'manage-goals',
            },
            {
                title: t('Milestones'),
                href: '/goal/milestones',
                permission: 'manage-goal-milestones',
            },
            {
                title: t('Contributions'),
                href: '/goal/contributions',
                permission: 'manage-goal-contributions',
            },
            {
                title: t('Tracking'),
                href: '/goal/tracking',
                permission: 'manage-goal-tracking',
            },
            {
                title: t('Category'),
                href: '/goal/categories',
                permission: 'manage-categories',
            },
        ],
    },
];
