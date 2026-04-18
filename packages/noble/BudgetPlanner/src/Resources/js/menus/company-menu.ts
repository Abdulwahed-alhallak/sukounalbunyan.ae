import { Package, DollarSign } from 'lucide-react';

export const budgetplannerCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Budget Planner'),
        icon: DollarSign,
        permission: 'manage-budget-planner',
        order: 420,
        children: [
            {
                title: t('Budget Periods'),
                href: '/budget-planner/budget-periods',
                permission: 'manage-budget-periods',
            },
            {
                title: t('Budget'),
                href: '/budget-planner/budgets',
                permission: 'manage-budgets',
            },
            {
                title: t('Budget Allocations'),
                href: '/budget-planner/budget-allocations',
                permission: 'manage-budget-allocations',
            },
            {
                title: t('Budget Monitoring'),
                href: '/budget-planner/budget-monitoring',
                permission: 'manage-budget-monitoring',
            },
        ],
    },
];
