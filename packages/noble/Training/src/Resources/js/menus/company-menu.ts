import { GraduationCap } from 'lucide-react';

export const trainingCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Training'),
        icon: GraduationCap,
        permission: 'manage-training',
        order: 452,
        children: [
            {
                title: t('Training Types'),
                href: '/training/training-types',
                permission: 'manage-training-types',
            },
            {
                title: t('Trainers'),
                href: '/training/trainers',
                permission: 'manage-trainers',
            },
            {
                title: t('Training List'),
                href: '/training/trainings',
                permission: 'manage-trainings',
            },
        ],
    },
];
