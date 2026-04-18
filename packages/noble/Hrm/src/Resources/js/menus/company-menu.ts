import {
    Package,
    Building,
    Building2,
    Users,
    FileText,
    Tag,
    UserX,
    AlertOctagon,
    MessageSquareWarning,
    ArrowRightLeft,
    Calendar,
    FileCheck,
    Megaphone,
    Clock,
    Calculator,
    UserCheck,
    UserCog,
} from 'lucide-react';

export const hrmCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Hrm Dashboard'),
        href: '/hrm',
        permission: 'manage-hrm-dashboard',
        parent: 'dashboard',
        order: 30,
    },
    {
        title: t('Hrm'),
        icon: UserCog,
        permission: 'manage-hrm',
        order: 450,
        children: [
            {
                title: t('Employees'),
                href: '/hrm/employees',
                permission: 'manage-employees',
            },
            {
                title: t('Document Expiries'),
                href: '/hrm/employees/expiries',
                permission: 'manage-employees',
            },
            {
                title: t('Onboarding'),
                href: '/hrm/onboarding',
                permission: 'manage-hrm',
            },
            {
                title: t('Org Chart'),
                href: '/hrm/org-chart',
                permission: 'manage-employees',
            },
            {
                title: t('Assets'),
                href: '/hrm/assets',
                permission: 'manage-hrm',
            },
            {
                title: t('Contracts'),
                href: '/hrm/employee-contracts',
                permission: 'manage-employees',
            },
            {
                title: t('Payslip'),
                permission: 'manage-payrolls',
                children: [
                    {
                        title: t('Set Salary'),
                        href: '/hrm/set-salary',
                        permission: 'manage-set-salary',
                    },
                    {
                        title: t('Payroll'),
                        href: '/hrm/payrolls',
                        permission: 'manage-payrolls',
                    },
                    {
                        title: t('Vacation Settlement'),
                        href: '/hrm/vacation-settlement',
                        permission: 'manage-hrm',
                    },
                    {
                        title: t('Final Settlement'),
                        href: '/hrm/final-settlement',
                        permission: 'manage-hrm',
                    },
                ],
            },
            {
                title: t('Attendance'),
                permission: 'manage-attendances',
                children: [
                    {
                        title: t('Tracker'),
                        href: '/hrm/attendances/tracker',
                        permission: 'manage-attendances',
                    },
                    {
                        title: t('Scheduler'),
                        href: '/hrm/shifts/scheduler',
                        permission: 'manage-shifts',
                    },
                    {
                        title: t('Shifts'),
                        href: '/hrm/shifts',
                        permission: 'manage-shifts',
                    },
                    {
                        title: t('Attendances'),
                        href: '/hrm/attendances',
                        permission: 'manage-attendances',
                    },
                    {
                        title: t('Biometric Logs'),
                        href: '/hrm/biometric-logs',
                        permission: 'manage-attendances',
                    },
                ],
            },
            {
                title: t('Leave Management'),
                permission: 'manage-leave-applications',
                children: [
                    {
                        title: t('Leave Types'),
                        href: '/hrm/leave-types',
                        permission: 'manage-leave-types',
                    },
                    {
                        title: t('Leave Timeline'),
                        href: '/hrm/leave-applications/timeline',
                        permission: 'manage-leave-applications',
                    },
                    {
                        title: t('Leave Applications'),
                        href: '/hrm/leave-applications',
                        permission: 'manage-leave-applications',
                    },
                    {
                        title: t('Leave Balance'),
                        href: '/hrm/leave-balance',
                        permission: 'manage-leave-balance',
                    },
                ],
            },
            {
                title: t('Holidays'),
                href: '/hrm/holidays',
                permission: 'manage-holidays',
            },
            {
                title: t('Awards'),
                href: '/hrm/awards',
                permission: 'manage-awards',
            },
            {
                title: t('Promotions'),
                href: '/hrm/promotions',
                permission: 'manage-promotions',
            },
            {
                title: t('Resignations'),
                href: '/hrm/resignations',
                permission: 'manage-resignations',
            },
            {
                title: t('Terminations'),
                href: '/hrm/terminations',
                permission: 'manage-terminations',
            },
            {
                title: t('Warnings'),
                href: '/hrm/warnings',
                permission: 'manage-warnings',
            },
            {
                title: t('Violations'),
                href: '/hrm/violations',
                permission: 'manage-employees',
            },
            {
                title: t('Complaints'),
                href: '/hrm/complaints',
                permission: 'manage-complaints',
            },
            {
                title: t('Transfers'),
                href: '/hrm/employee-transfers',
                permission: 'manage-employee-transfers',
            },
            {
                title: t('Documents'),
                href: '/hrm/documents',
                permission: 'manage-hrm-documents',
            },
            {
                title: t('Acknowledgments'),
                href: '/hrm/acknowledgments',
                permission: 'manage-acknowledgments',
            },
            {
                title: t('Announcements'),
                href: '/hrm/announcements',
                permission: 'manage-announcements',
            },
            {
                title: t('Events'),
                href: '/hrm/events',
                permission: 'manage-events',
            },
            {
                title: t('System Setup'),
                href: '/hrm/branches',
                permission: 'manage-hrm',
            },
        ],
    },
];
