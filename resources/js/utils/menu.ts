import { NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { getSuperAdminMenu } from './menus/superadmin-menu';
import { getCompanyMenu } from './menus/company-menu';
import * as LucideIcons from 'lucide-react';
import {
    LayoutGrid,
    Users,
    CreditCard,
    Headphones,
    Mail,
    Bell,
    BarChart3,
    ShieldCheck,
    Image,
    Package,
    Settings,
    UserCog,
    Briefcase,
    DollarSign,
    FolderKanban,
    MessagesSquare,
    FileBarChart,
    Wrench,
} from 'lucide-react';

// Get role-based core menu items
const getCoreMenuItems = (userRoles: string[], t: (key: string) => string): NavItem[] => {
    if (userRoles.includes('superadmin')) {
        return getSuperAdminMenu(t);
    }
    return getCompanyMenu(t);
};

// Auto-load package menus based on activated packages
const getPackageMenuItems = (
    userRoles: string[],
    activatedPackages: string[],
    t: (key: string) => string
): NavItem[] => {
    const menuItems: NavItem[] = [];
    const isSuperAdmin = userRoles.includes('superadmin');

    const allModules = import.meta.glob('../../../packages/noble/*/src/Resources/js/menus/*.ts', { eager: true });

    if (!Array.isArray(activatedPackages)) {
        return menuItems;
    }

    activatedPackages.forEach((packageName) => {
        let module = null;

        if (isSuperAdmin) {
            // Try superadmin menu first
            const saPath = `../../../packages/noble/${packageName}/src/Resources/js/menus/superadmin-menu.ts`;
            module = allModules[saPath];

            // Fallback to company menu if superadmin menu is missing
            if (!module) {
                const coPath = `../../../packages/noble/${packageName}/src/Resources/js/menus/company-menu.ts`;
                module = allModules[coPath];
            }
        } else {
            const coPath = `../../../packages/noble/${packageName}/src/Resources/js/menus/company-menu.ts`;
            module = allModules[coPath];
        }

        if (module) {
            try {
                Object.values(module).forEach((item: any) => {
                    const result = typeof item === 'function' ? item(t) : item;
                    const items = Array.isArray(result) ? result : [result];
                    menuItems.push(...items);
                });
            } catch (e) {
                // Skip packages whose routes aren't registered (Ziggy route errors)
                console.warn(`Menu skipped for package "${packageName}":`, (e as Error).message);
            }
        }
    });

    return menuItems;
};

// Get custom menu items from database
const getCustomMenuItems = (userRoles: string[], t: (key: string) => string): NavItem[] => {
    const { auth } = usePage().props as any;
    const customMenus = auth?.customMenus || [];

    return customMenus.map((menu: any) => {
        let iconComponent = null;
        if (menu.icon && typeof menu.icon === 'string') {
            const IconComponent = (LucideIcons as any)[menu.icon];
            if (IconComponent) {
                iconComponent = IconComponent;
            }
        }

        return {
            ...menu,
            icon: iconComponent,
        };
    });
};

// Group menu items by parent
const groupMenusByParent = (menuItems: NavItem[], packageMenuItems: NavItem[]): NavItem[] => {
    const groupedItems = [...menuItems];

    packageMenuItems.forEach((packageItem) => {
        if (packageItem.parent) {
            const parentMenu = groupedItems.find((item) => item.name === packageItem.parent);

            if (parentMenu) {
                if (!parentMenu.children) {
                    parentMenu.children = [];
                }
                parentMenu.children.push({
                    ...packageItem,
                    parent: undefined,
                });

                if (parentMenu.children) {
                    parentMenu.children.sort((a, b) => (a.order || 999) - (b.order || 999));
                }
            } else {
                groupedItems.push(packageItem);
            }
        } else {
            groupedItems.push(packageItem);
        }
    });

    return groupedItems;
};

// Filter menu items based on permissions
const filterByPermission = (items: NavItem[], userPermissions: string[]): NavItem[] => {
    return items.filter((item) => {
        if (!item.permission) {
            if (item.children) {
                item.children = filterByPermission(item.children, userPermissions);
            }
            return true;
        }

        if (!userPermissions.includes(item.permission)) {
            return false;
        }

        if (item.children) {
            item.children = filterByPermission(item.children, userPermissions);
            return item.children.length > 0;
        }

        return true;
    });
};

// ─── Category Definitions ───
// Each category has: label, icon, matches (by name), titleMatches (by title)

const superAdminCategories = [
    { label: 'Dashboard', icon: LayoutGrid, isDirectLink: true, matches: ['dashboard'] },
    { label: 'Management', icon: Users, matches: ['users'] },
    { label: 'Subscription', icon: CreditCard, matches: ['subscription'] },
    { label: 'Support', icon: Headphones, matches: ['helpdesk'] },
    { label: 'Communications', icon: Mail, matches: ['email-templates', 'notification-templates'] },
    { label: 'Reports & Audit', icon: BarChart3, matches: ['report-center', 'audit-logs'] },
    { label: 'System', icon: Wrench, matches: ['media-library', 'add-ons', 'settings', 'landingpage', 'googlecaptcha'] },
];

const companyCategories = [
    { label: 'Dashboard', icon: LayoutGrid, isDirectLink: true, matches: ['dashboard'] },
    {
        label: 'Human Resources',
        icon: UserCog,
        matches: ['user-management', 'hrm', 'recruitment', 'performance', 'training', 'timesheet'],
        titleMatches: ['User Management', 'Hrm', 'Recruitment', 'Performance', 'Training', 'Timesheet'],
    },
    {
        label: 'CRM & Sales',
        icon: Briefcase,
        matches: ['proposal', 'lead', 'quotation', 'sales', 'retainer'],
        titleMatches: ['CRM', 'Proposal', 'Quotation', 'Lead', 'Sales', 'Retainer'],
    },
    {
        label: 'Finance & Accounting',
        icon: DollarSign,
        matches: ['sales-invoice', 'purchase', 'account', 'doubleentry', 'budgetplanner', 'pos', 'stripe', 'paypal', 'bank-transfer'],
        titleMatches: [
            'Accounting',
            'Sales Invoice',
            'Purchase',
            'Double Entry',
            'Budget Planner',
            'POS',
            'Stripe',
            'Paypal',
            'Bank Transfer Request',
            'Bank Transfer'
        ],
    },
    {
        label: 'Projects & Tasks',
        icon: FolderKanban,
        matches: ['taskly', 'goal', 'calendar'],
        titleMatches: ['Project', 'Goal', 'Calendar', 'Taskly'],
    },
    {
        label: 'Products & Services',
        icon: Package,
        matches: ['productservice', 'contract', 'formbuilder', 'dairy'],
        titleMatches: ['Product & Service', 'Contract', 'Form Builder', 'Dairy', 'Products', 'Services'],
    },
    {
        label: 'Customer Support',
        icon: Headphones,
        matches: ['supportticket', 'helpdesk'],
        titleMatches: ['Support Ticket', 'Helpdesk'],
    },
    {
        label: 'Communications',
        icon: MessagesSquare,
        matches: ['messenger', 'slack', 'telegram', 'twilio', 'zoommeeting'],
        titleMatches: ['Messenger', 'Slack', 'Telegram', 'Twilio', 'Zoom Meetings', 'Zoom Meeting'],
    },
    {
        label: 'Automation & AI',
        icon: LayoutGrid, // You can substitute an icon later, using LayoutGrid as fallback
        matches: ['aiassistant', 'webhook', 'workflows'],
        titleMatches: ['AI Assistant', 'Webhook', 'Workflow Automation'],
    },
    {
        label: 'Reports & Logs',
        icon: FileBarChart,
        matches: ['report-center', 'audit-logs'],
        titleMatches: ['Report Center', 'Audit Logs'],
    },
    {
        label: 'Settings',
        icon: Settings,
        matches: ['plan', 'media-library', 'settings', 'landingpage', 'googlecaptcha'],
        titleMatches: ['Plan', 'Media Library', 'Settings'],
    },
];

// Helper: check if an item matches a category
const itemMatchesCategory = (item: NavItem, category: any): boolean => {
    if (item.name && category.matches?.includes(item.name)) {
        return true;
    }
    if (category.titleMatches) {
        return category.titleMatches.some((match: string) => item.title?.toLowerCase() === match.toLowerCase());
    }
    return (
        category.matches?.some(
            (match: string) =>
                item.title?.toLowerCase() === match.toLowerCase() || item.name?.toLowerCase() === match.toLowerCase()
        ) || false
    );
};

// Main hook to get filtered menu items
export const useAllMenuItems = (): NavItem[] => {
    const pageProps = usePage().props as any;
    const auth = pageProps?.auth;
    const { t } = useTranslation();

    const userPermissions = auth?.user?.permissions || [];
    const userRoles = auth?.user?.roles || [];
    const activatedPackages = auth?.user?.activatedPackages || [];
    const isSuperAdmin = userRoles.includes('superadmin');

    const coreMenuItems = getCoreMenuItems(userRoles, t);
    const packageMenuItems = getPackageMenuItems(userRoles, activatedPackages, t);
    const customMenuItems = getCustomMenuItems(userRoles, t);

    const customParentMenus = customMenuItems.filter((menu) => !menu.parent);
    const customChildMenus = customMenuItems.filter((menu) => menu.parent);

    const coreWithCustomParents = [...coreMenuItems, ...customParentMenus];
    const allChildMenus = [...packageMenuItems, ...customChildMenus];
    const finalGroupedMenuItems = groupMenusByParent(coreWithCustomParents, allChildMenus);

    const filteredMenuItems = filterByPermission(finalGroupedMenuItems, userPermissions);

    const categoryDefinitions = isSuperAdmin ? superAdminCategories : companyCategories;

    // Build structured menu with collapsible category groups
    const finalStructuredMenu: NavItem[] = [];
    const placedItemNames = new Set<string>();

    categoryDefinitions.forEach((category) => {
        const categoryItems = filteredMenuItems.filter((item) => {
            if (item.isLabel) return false;
            return itemMatchesCategory(item, category);
        });

        if (categoryItems.length > 0) {
            // For single-item direct link categories (like Dashboard)
            if (category.isDirectLink && categoryItems.length === 1 && !categoryItems[0].children?.length) {
                finalStructuredMenu.push(categoryItems[0]);
                const itemKey = categoryItems[0].name || categoryItems[0].title;
                placedItemNames.add(itemKey);
            }
            // For Dashboard with sub-dashboards (children exist)
            else if (category.isDirectLink && categoryItems.length === 1 && categoryItems[0].children?.length) {
                finalStructuredMenu.push(categoryItems[0]);
                const itemKey = categoryItems[0].name || categoryItems[0].title;
                placedItemNames.add(itemKey);
            }
            // For collapsible category groups
            else {
                // Flatten: collect all items and their direct sub-items into one group
                const groupChildren: NavItem[] = [];
                categoryItems.forEach((item) => {
                    const itemKey = item.name || item.title;
                    if (!placedItemNames.has(itemKey)) {
                        groupChildren.push(item);
                        placedItemNames.add(itemKey);
                    }
                });

                if (groupChildren.length > 0) {
                    const categoryGroup: NavItem = {
                        title: t(category.label),
                        icon: category.icon,
                        children: groupChildren,
                    };
                    finalStructuredMenu.push(categoryGroup);
                }
            }
        }
    });

    // Add any remaining items to an "Others" section
    const remainingItems = filteredMenuItems.filter((item) => {
        if (item.isLabel) return false;
        const itemKey = item.name || item.title;
        return !placedItemNames.has(itemKey);
    });

    if (remainingItems.length > 0) {
        const othersGroup: NavItem = {
            title: t('Others'),
            icon: Package,
            children: remainingItems,
        };
        finalStructuredMenu.push(othersGroup);
    }

    return finalStructuredMenu;
};
