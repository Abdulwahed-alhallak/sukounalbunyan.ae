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
    BarChart3,
    Bell,
    Zap,
} from 'lucide-react';
import { NavItem } from '@/types';

export const getCompanyMenu = (t: (key: string) => string): NavItem[] => [
    // ─── DASHBOARD ───
    {
        title: t('Dashboard'),
        href: route('dashboard'),
        icon: LayoutGrid,
        permission: 'manage-dashboard',
        name: 'dashboard',
        order: 100,
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
                href: route('roles.index'),
                permission: 'manage-roles',
            },
            {
                title: t('Users'),
                href: route('users.index'),
                permission: 'manage-users',
            },
        ],
    },

    // ─── CRM & SALES ───
    {
        title: t('Proposal'),
        href: route('sales-proposals.index'),
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
                href: route('sales-invoices.index'),
                permission: 'manage-sales-invoices',
            },
            {
                title: t('Sales Invoice Returns'),
                href: route('sales-returns.index'),
                permission: 'manage-sales-return-invoices',
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
                href: route('purchase-invoices.index'),
                permission: 'manage-purchase-invoices',
            },
            {
                title: t('Purchase Returns'),
                href: route('purchase-returns.index'),
                permission: 'manage-purchase-return-invoices',
            },
            {
                title: t('Warehouses'),
                href: route('warehouses.index'),
                permission: 'manage-warehouses',
            },
            {
                title: t('Transfers'),
                href: route('transfers.index'),
                permission: 'manage-transfers',
            },
        ],
    },

    // ─── COLLABORATION ───
    {
        title: t('Messenger'),
        href: route('messenger.index'),
        icon: MessageCircle,
        permission: 'manage-messenger',
        name: 'messenger',
        order: 700,
    },
    {
        title: t('Helpdesk'),
        href: route('helpdesk-tickets.index'),
        icon: Headphones,
        permission: 'manage-helpdesk-tickets',
        name: 'helpdesk',
        order: 710,
    },

    // ─── REPORTS ───
    {
        title: t('Report Center'),
        href: route('reports.index'),
        icon: BarChart3,
        permission: 'manage-dashboard',
        name: 'report-center',
        order: 800,
    },
    {
        title: t('Workflow Automation'),
        href: route('workflows.index'),
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
                href: route('plans.index'),
                permission: 'manage-plans',
            },
            {
                title: t('Bank Transfer Requests'),
                href: route('bank-transfer.index'),
                permission: 'manage-bank-transfer-requests',
            },
            {
                title: t('Orders'),
                href: route('orders.index'),
                permission: 'manage-orders',
            },
        ],
    },
    {
        title: t('Audit Logs'),
        href: route('audit-logs.index'),
        icon: Shield,
        permission: 'manage-dashboard',
        name: 'audit-logs',
        order: 910,
    },
    {
        title: t('Media Library'),
        href: route('media-library'),
        icon: Image,
        permission: 'manage-media',
        name: 'media-library',
        order: 920,
    },
    {
        title: t('Settings'),
        href: route('settings.index'),
        icon: Settings,
        permission: 'manage-settings',
        name: 'settings',
        order: 930,
    },
];
