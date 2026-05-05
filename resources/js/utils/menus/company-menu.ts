import {
    LayoutGrid,
    Users,
    Warehouse,
    ArrowRightLeft,
    Package,
    Tag,
    Tags,
    Shield,
    Settings,
    Image,
    CreditCard,
    Headphones,
    ShoppingCart,
    Kanban,
    Calendar,
    MessageCircle,
    Replace,
    Receipt,
    RotateCcw,
    BarChart3,
    Bell,
    Zap,
    Briefcase,
    FileText,
    Building2,
    ClipboardList,
} from 'lucide-react';
import { NavItem } from '@/types';

export const getCompanyMenu = (t: (key: string) => string): NavItem[] => [
    // ─── DASHBOARD ───
    {
        title: t('Dashboard'),
        icon: LayoutGrid,
        permission: 'manage-dashboard',
        name: 'dashboard',
        order: 100,
        children: [
            {
                title: t('Overview'),
                href: '/dashboard',
                permission: 'manage-dashboard',
            },
        ],
    },

    // ─── HRM ───
    {
        title: t('User Management'),
        icon: Users,
        permission: 'manage-users',
        name: 'user-management',
        order: 200,
        children: [
            {
                title: t('Roles'),
                href: '/roles',
                permission: 'manage-roles',
            },
            {
                title: t('Users'),
                href: '/users',
                permission: 'manage-users',
            },
        ],
    },

    // ─── CRM & SALES ───
    {
        title: t('Proposal'),
        href: '/sales-proposals',
        icon: Replace,
        permission: 'manage-sales-proposals',
        name: 'proposal',
        order: 400,
    },

    // ─── FINANCE ───
    {
        title: t('Sales Invoice'),
        icon: Receipt,
        permission: 'manage-sales-invoices',
        name: 'sales-invoice',
        order: 500,
        children: [
            {
                title: t('Sales Invoice'),
                href: '/sales-invoices',
                permission: 'manage-sales-invoices',
            },
            {
                title: t('Sales Invoice Returns'),
                href: '/sales-returns',
                permission: 'manage-sales-return-invoices',
            },
            {
                title: t('Consolidated Billing'),
                href: '/consolidated-billing',
                permission: 'manage-sales-invoices',
            },
        ],
    },
    {
        title: t('Purchase'),
        icon: ShoppingCart,
        permission: 'manage-purchase-invoices',
        name: 'purchase',
        order: 510,
        children: [
            {
                title: t('Purchase Invoice'),
                href: '/purchase-invoices',
                permission: 'manage-purchase-invoices',
            },
            {
                title: t('Purchase Returns'),
                href: '/purchase-returns',
                permission: 'manage-purchase-return-invoices',
            },
            {
                title: t('Warehouses'),
                href: '/warehouses',
                permission: 'manage-warehouses',
            },
            {
                title: t('Transfers'),
                href: '/transfers',
                permission: 'manage-transfers',
            },
        ],
    },
    // ─── RENTAL & SALES MANAGEMENT (إدارة التأجير والمبيع) ───
    {
        title: t('Rental & Sales Management'),
        icon: Building2,
        permission: 'manage-rentals',
        name: 'rental',
        order: 600,
        children: [
            {
                title: t('Rental Contracts'),
                href: '/rental',
                permission: 'manage-rentals',
            },
            {
                title: t('Rental Reports'),
                href: '/reports/rental',
                permission: 'manage-rentals',
            },
            {
                title: t('Sales Proposals'),
                href: '/sales-proposals',
                permission: 'manage-sales-proposals',
            },
            {
                title: t('Sales Invoice'),
                href: '/sales-invoices',
                permission: 'manage-sales-invoices',
            },
            {
                title: t('Consolidated Billing'),
                href: '/consolidated-billing',
                permission: 'manage-sales-invoices',
            },
        ],
    },


    // ─── COLLABORATION ───
    {
        title: t('Messenger'),
        href: '/messenger',
        icon: MessageCircle,
        permission: 'manage-messenger',
        name: 'messenger',
        order: 700,
    },
    {
        title: t('Helpdesk'),
        href: '/helpdesk-tickets',
        icon: Headphones,
        permission: 'manage-helpdesk-tickets',
        name: 'helpdesk',
        order: 710,
    },

    // ─── REPORTS ───
    {
        title: t('Report Center'),
        href: '/reports',
        icon: BarChart3,
        permission: 'manage-dashboard',
        name: 'report-center',
        order: 800,
    },
    {
        title: t('Workflow Automation'),
        href: '/workflows',
        icon: Zap,
        permission: 'manage-dashboard',
        name: 'workflows',
        order: 810,
    },

    // ─── SETTINGS ───
    {
        title: t('Plan'),
        icon: CreditCard,
        permission: 'manage-plans',
        name: 'plan',
        order: 900,
        children: [
            {
                title: t('Setup Subscription Plan'),
                href: '/plans',
                permission: 'manage-plans',
            },
            {
                title: t('Bank Transfer Requests'),
                href: '/bank-transfer',
                permission: 'manage-bank-transfer-requests',
            },
            {
                title: t('Orders'),
                href: '/orders',
                permission: 'manage-orders',
            },
        ],
    },
    {
        title: t('Audit Logs'),
        href: '/audit-logs',
        icon: Shield,
        permission: 'manage-dashboard',
        name: 'audit-logs',
        order: 910,
    },
    {
        title: t('Media Library'),
        href: '/media-library',
        icon: Image,
        permission: 'manage-media',
        name: 'media-library',
        order: 920,
    },
    {
        title: t('Settings'),
        href: '/settings',
        icon: Settings,
        permission: 'manage-settings',
        name: 'settings',
        order: 930,
    },
];
