import { TrendingUp, Target, Users, MessageSquare, Award, BarChart3 } from 'lucide-react';

export const performanceCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Performance'),
        icon: TrendingUp,
        permission: 'manage-performance',
        parent: '',
        order: 451,
        children: [
            {
                title: t('Performance Indicators'),
                href: '/performance/indicators',
                permission: 'manage-performance-indicators',
            },
            {
                title: t('Employee Goals'),
                href: '/performance/employee-goals',
                permission: 'manage-employee-goals',
            },
            {
                title: t('Review Cycles'),
                href: '/performance/review-cycles',
                permission: 'manage-review-cycles',
            },
            {
                title: t('Employee Reviews'),
                href: '/performance/employee-reviews',
                permission: 'manage-employee-reviews',
            },
            {
                title: t('System Setup'),
                href: '/performance/indicator-categories',
                permission: 'manage-performance-system-setup',
            },
        ],
    },
];
