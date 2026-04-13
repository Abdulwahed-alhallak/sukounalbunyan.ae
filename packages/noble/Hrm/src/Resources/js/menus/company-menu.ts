import {  Package, Building, Building2, Users, FileText, Tag, UserX, AlertOctagon, MessageSquareWarning, ArrowRightLeft, Calendar, FileCheck, Megaphone, Clock , Calculator, UserCheck, UserCog } from 'lucide-react';



export const hrmCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Hrm Dashboard'),
        href: route('hrm.index'),
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
                href: route('hrm.employees.index'),
                permission: 'manage-employees',
            },
            {
                title: t('Document Expiries'),
                href: route('hrm.employees.expiries'),
                permission: 'manage-employees',
            },
            {
                title: t('Onboarding'),
                href: route('hrm.onboarding.index'),
                permission: 'manage-hrm',
            },
            {
                title: t('Org Chart'),
                href: route('hrm.org-chart'),
                permission: 'manage-employees',
            },
            {
                title: t('Assets'),
                href: route('hrm.assets.index'),
                permission: 'manage-hrm',
            },
            {
                title: t('Contracts'),
                href: route('hrm.employee-contracts.index'),
                permission: 'manage-employees',
            },
            {
                title: t('Payslip'),
                permission: 'manage-payrolls',
                children: [
                    {
                        title: t('Set Salary'),
                        href: route('hrm.set-salary.index'),
                        permission: 'manage-set-salary',
                    },
                    {
                        title: t('Payroll'),
                        href: route('hrm.payrolls.index'),
                        permission: 'manage-payrolls',
                    },
                    {
                        title: t('Vacation Settlement'),
                        href: route('hrm.vacation-settlement.index'),
                        permission: 'manage-hrm',
                    },
                    {
                        title: t('Final Settlement'),
                        href: route('hrm.final-settlement.index'),
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
                        href: route('hrm.attendances.tracker'),
                        permission: 'manage-attendances',
                    },
                    {
                        title: t('Scheduler'),
                        href: route('hrm.shifts.scheduler'),
                        permission: 'manage-shifts',
                    },
                    {
                        title: t('Shifts'),
                        href: route('hrm.shifts.index'),
                        permission: 'manage-shifts',
                    },
                    {
                        title: t('Attendances'),
                        href: route('hrm.attendances.index'),
                        permission: 'manage-attendances',
                    },
                    {
                        title: t('Biometric Logs'),
                        href: route('hrm.biometric-logs.index'),
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
                        href: route('hrm.leave-types.index'),
                        permission: 'manage-leave-types',
                    },
                    {
                        title: t('Leave Timeline'),
                        href: route('hrm.leave-applications.timeline'),
                        permission: 'manage-leave-applications',
                    },
                    {
                        title: t('Leave Applications'),
                        href: route('hrm.leave-applications.index'),
                        permission: 'manage-leave-applications',
                    },
                    {
                        title: t('Leave Balance'),
                        href: route('hrm.leave-balance.index'),
                        permission: 'manage-leave-balance',
                    },
                ],
            },
            {
                title: t('Holidays'),
                href: route('hrm.holidays.index'),
                permission: 'manage-holidays',
            },
            {
                title: t('Awards'),
                href: route('hrm.awards.index'),
                permission: 'manage-awards',
            },
            {
                title: t('Promotions'),
                href: route('hrm.promotions.index'),
                permission: 'manage-promotions',
            },
            {
                title: t('Resignations'),
                href: route('hrm.resignations.index'),
                permission: 'manage-resignations',
            },
            {
                title: t('Terminations'),
                href: route('hrm.terminations.index'),
                permission: 'manage-terminations',
            },
            {
                title: t('Warnings'),
                href: route('hrm.warnings.index'),
                permission: 'manage-warnings',
            },
            {
                title: t('Violations'),
                href: route('hrm.violations.index'),
                permission: 'manage-employees',
            },
            {
                title: t('Complaints'),
                href: route('hrm.complaints.index'),
                permission: 'manage-complaints',
            },
            {
                title: t('Transfers'),
                href: route('hrm.employee-transfers.index'),
                permission: 'manage-employee-transfers',
            },
            {
                title: t('Documents'),
                href: route('hrm.documents.index'),
                permission: 'manage-hrm-documents',
            },
            {
                title: t('Acknowledgments'),
                href: route('hrm.acknowledgments.index'),
                permission: 'manage-acknowledgments',
            },
            {
                title: t('Announcements'),
                href: route('hrm.announcements.index'),
                permission: 'manage-announcements',
            },
            {
                title: t('Events'),
                href: route('hrm.events.index'),
                permission: 'manage-events',
            },
            {
                title: t('System Setup'),
                href: route('hrm.branches.index'),
                permission: 'manage-hrm',
            },

        ],
    },
];