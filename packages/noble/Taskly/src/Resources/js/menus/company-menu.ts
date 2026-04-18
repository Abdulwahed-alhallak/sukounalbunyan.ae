import { FolderKanban } from 'lucide-react';

export const projectCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Project Dashboard'),
        href: '/project/dashboard',
        permission: 'manage-project-dashboard',
        parent: 'dashboard',
        order: 20,
    },
    {
        title: t('Project'),
        icon: FolderKanban,
        permission: 'manage-project',
        order: 300,
        name: 'project',
        children: [
            {
                title: t('Projects'),
                href: '/project',
                permission: 'manage-project',
                order: 5,
            },
            {
                title: t('Projects Report'),
                href: '/project/report',
                permission: 'manage-project-report',
                order: 10,
            },
            {
                title: t('System Setup'),
                href: '/project/task-stages/index',
                permission: 'manage-task-stages',
                order: 20,
            },
        ],
    },
];
