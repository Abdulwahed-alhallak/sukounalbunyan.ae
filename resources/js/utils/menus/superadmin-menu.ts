import { LayoutGrid, Users, Building2, Settings, Shield, Image, Package, CreditCard, FileText, Ticket, Mail, Bell, Headphones, ShieldCheck, BarChart3, Globe} from 'lucide-react';
import { NavItem } from '@/types';

export const getSuperAdminMenu = (t: (key: string) => string): NavItem[] => [
    // ─── DASHBOARD ───
    {
        title: t('Dashboard'),
        href: route('dashboard'),
        icon: LayoutGrid,
        permission: 'manage-dashboard',
        name: 'dashboard',
        order: 100,
    },

    // ─── MANAGEMENT ───
    {
        title: t('Users'),
        href: route('users.index'),
        icon: Users,
        permission: 'manage-users',
        name: 'users',
        order: 200,
    },

    // ─── SUBSCRIPTION ───
    {
        title: t('Subscription'),
        icon: CreditCard,
        permission: 'manage-plans',
        name: 'subscription',
        order: 300,
        children: [
            {
                title: t('Plans'),
                href: route('plans.index'),
                permission: 'manage-plans',
            },
            {
                title: t('Coupons'),
                href: route('coupons.index'),
                permission: 'manage-coupons',
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
        ]
    },

    // ─── SUPPORT ───
    {
        title: t('Helpdesk'),
        icon: Headphones,
        permission: 'manage-helpdesk-tickets',
        name: 'helpdesk',
        order: 400,
        children: [
            {
                title: t('Tickets'),
                href: route('helpdesk-tickets.index'),
                permission: 'manage-any-helpdesk-tickets',
            },
            {
                title: t('Categories'),
                href: route('helpdesk-categories.index'),
                permission: 'manage-helpdesk-categories',
            }
        ]
    },

    // ─── COMMUNICATIONS ───
    {
        title: t('Email Templates'),
        href: route('email-templates.index'),
        icon: Mail,
        permission: 'manage-email-templates',
        name: 'email-templates',
        order: 500,
    },
    {
        title: t('Notification Templates'),
        href: route('notification-templates.index'),
        icon: Bell,
        permission: 'manage-notification-templates',
        name: 'notification-templates',
        order: 510,
    },

    // ─── REPORTS & AUDIT ───
    {
        title: t('Report Center'),
        href: route('reports.index'),
        icon: BarChart3,
        permission: 'manage-dashboard',
        name: 'report-center',
        order: 600,
    },
    {
        title: t('Audit Logs'),
        icon: ShieldCheck,
        name: 'audit-logs',
        order: 610,
        children: [
            {
                title: t('Data Audit'),
                href: route('audit-logs.index'),
            },
            {
                title: t('Security Audit'),
                href: route('audit-logs.security'),
            },
        ]
    },

    // ─── SYSTEM ───
    {
        title: t('Media Library'),
        href: route('media-library'),
        icon: Image,
        permission: 'manage-media',
        name: 'media-library',
        order: 700,
    },
    {
        title: t('Add-ons Manager'),
        href: route('add-ons.index'),
        icon: Package,
        permission: 'manage-add-on',
        name: 'add-ons',
        order: 710,
    },
    {
        title: t('Settings'),
        href: route('settings.index'),
        icon: Settings,
        permission: 'manage-settings',
        name: 'settings',
        order: 720,
    },
];
