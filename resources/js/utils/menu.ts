import { NavItem, PageProps, CustomMenu } from '@/types';
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

const toSettingsAnchor = (packageName: string): string =>
    packageName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/_/g, '-')
        .toLowerCase();

// Get role-based core menu items
const getCoreMenuItems = (userRoles: string[], t: (key: string) => string): NavItem[] => {
    if (userRoles.includes('superadmin')) {
        return getSuperAdminMenu(t); // Usually has user management, settings
    }
    return getCompanyMenu(t);
};

// Flatten helper to extract pure links from deeply nested structures
const flattenNavItems = (items: NavItem[]): NavItem[] => {
    let result: NavItem[] = [];
    items.forEach((item) => {
        if (item.children && item.children.length > 0) {
            // If the parent itself is a valid link, keep it
            if (item.href) {
                const { children, ...rest } = item;
                result.push(rest);
            }
            // Recurse to pull all deep children up
            result.push(...flattenNavItems(item.children));
        } else {
            result.push(item);
        }
    });
    return result;
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
            module = allModules[saPath] as any;

            // Fallback to company menu if superadmin menu is missing
            if (!module) {
                const coPath = `../../../packages/noble/${packageName}/src/Resources/js/menus/company-menu.ts`;
                module = allModules[coPath] as any;
            }
        } else {
            const coPath = `../../../packages/noble/${packageName}/src/Resources/js/menus/company-menu.ts`;
            module = allModules[coPath] as any;
        }

        if (module) {
            try {
                Object.values(module).forEach((item: any) => {
                    try {
                        const result = typeof item === 'function' ? item(t) : item;
                        const items = Array.isArray(result) ? result : [result];

                        // Inject moduleName and handle potential route crashes
                        const processedItems = items.map((nItem: NavItem) => {
                            const injectModule = (node: NavItem): NavItem => {
                                // ─── GLOBAL SETTINGS REDIRECT ───
                                // Any setting link is automatically rerouted to the unified visual hub
                                let finalHref = node.href;
                                if (node.href && (node.href.includes('settings') || node.permission?.includes('settings'))) {
                                    finalHref = `/settings#${toSettingsAnchor(packageName)}-settings`;
                                }

                                return {
                                    ...node,
                                    href: finalHref,
                                    moduleName: packageName.toLowerCase(),
                                    children: node.children ? node.children.map(injectModule) : undefined,
                                };
                            };
                            return injectModule(nItem);
                        });

                        menuItems.push(...processedItems);
                    } catch (routeErr) {
                        console.error(`Route error in package "${packageName}":`, routeErr);
                    }
                });
            } catch (e) {
                console.warn(`Menu skipped for package "${packageName}":`, (e as Error).message);
            }
        }
    });

    return menuItems;
};

// Get custom menu items from database
const getCustomMenuItems = (userRoles: string[], t: (key: string) => string): NavItem[] => {
    const { auth } = usePage().props as PageProps;
    const customMenus = auth?.customMenus || [];

    return customMenus.map((menu: CustomMenu) => {
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
            moduleName: 'custom',
        };
    });
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

// ─── Unified Categories (Applies to all roles to ensure consistency) ───
const unifiedCategories = [
    { label: 'Dashboard', icon: LayoutGrid, isDirectLink: true, matches: ['dashboard'] },
    {
        label: 'Rental Management',
        icon: Briefcase,
        matches: ['rental'],
    },
    {
        label: 'Human Resources',
        icon: Users,
        matches: ['users', 'hrm', 'recruitment', 'performance', 'training', 'timesheet', 'user-management'],
    },
    {
        label: 'CRM & Sales',
        icon: Briefcase,
        matches: ['proposal', 'lead', 'quotation', 'sales', 'retainer'],
    },
    {
        label: 'Finance & Accounting',
        icon: DollarSign,
        matches: ['accounting', 'sales-invoice', 'purchase', 'account', 'doubleentry', 'budgetplanner', 'pos', 'stripe', 'paypal', 'bank-transfer'],
    },
    {
        label: 'Projects & Tasks',
        icon: FolderKanban,
        matches: ['taskly', 'goal', 'calendar', 'project'],
    },
    {
        label: 'Products & Services',
        icon: Package,
        matches: ['productservice', 'formbuilder', 'dairy'],
    },
    {
        label: 'Contracts',
        icon: FileSignature,
        matches: ['contract', 'contracts-unified'],
    },
    {
        label: 'Customer Support',
        icon: Headphones,
        matches: ['supportticket', 'helpdesk'],
    },
    {
        label: 'Communications',
        icon: MessagesSquare,
        matches: ['messenger', 'slack', 'telegram', 'twilio', 'zoommeeting', 'email-templates', 'notification-templates'],
    },
    {
        label: 'Automation & AI',
        icon: LayoutGrid,
        matches: ['aiassistant', 'webhook', 'workflows'],
    },
    {
        label: 'Reports & Logs',
        icon: FileBarChart,
        matches: ['report-center', 'audit-logs'],
    },
    {
        label: 'Settings & System',
        icon: Settings,
        matches: ['plan', 'subscription', 'media-library', 'settings', 'landingpage', 'googlecaptcha', 'add-ons'],
    },
];

// Helper: check if an item matches a category
const itemMatchesCategory = (item: NavItem, category: any): boolean => {
    // Check injected module name
    if (item.moduleName && category.matches?.includes(item.moduleName)) {
        return true;
    }
    // Check internal names
    if (item.name && category.matches?.includes(item.name.toLowerCase())) {
        return true;
    }
    return false;
};

// Main hook to get filtered menu items
export const useAllMenuItems = (): NavItem[] => {
    const pageProps = usePage().props as PageProps;
    const { t } = useTranslation();

    if (!pageProps || !pageProps.auth) {
        return [];
    }

    const { auth } = pageProps;
    const userPermissions = auth?.user?.permissions || [];
    const userRoles = auth?.user?.roles || [];
    const activatedPackages = auth?.user?.activatedPackages || [];

    const coreMenuItems = getCoreMenuItems(userRoles, t);
    const packageMenuItems = getPackageMenuItems(userRoles, activatedPackages, t);
    const customMenuItems = getCustomMenuItems(userRoles, t);

    // Merge everything into one raw unstructured list
    const allItems = [...coreMenuItems, ...packageMenuItems, ...customMenuItems];

    // Filter by permissions before organizing
    const permittedItems = filterByPermission(allItems, userPermissions);

    const finalStructuredMenu: NavItem[] = [];
    const placedItemKeys = new Set<string>();

    unifiedCategories.forEach((category) => {
        // Collect items matching this category
        const categoryItems = permittedItems.filter((item) => {
            if (item.isLabel) return false;
            return itemMatchesCategory(item, category);
        });

        if (categoryItems.length > 0) {
            // Dashboard or direct singular link
            if (category.isDirectLink) {
                const flatDashboards = flattenNavItems(categoryItems);
                flatDashboards.forEach(db => {
                    finalStructuredMenu.push(db);
                    placedItemKeys.add(db.moduleName || db.name || db.title);
                });
            } else {
                // Flatten all children so we ONLY have Menu -> Flat SubMenu (No 3rd Level)
                const groupChildren = flattenNavItems(categoryItems).map(child => ({
                    ...child,
                    parent: undefined, // ensure no active internal grouping messes it up
                }));

                if (groupChildren.length > 0) {
                    const categoryGroup: NavItem = {
                        title: t(category.label),
                        icon: category.icon,
                        children: groupChildren,
                    };
                    finalStructuredMenu.push(categoryGroup);
                }

                categoryItems.forEach(i => placedItemKeys.add(i.moduleName || i.name || i.title));
            }
        }
    });

    // Add any remaining un-matched items to "Others"
    const remainingItems = permittedItems.filter((item) => {
        if (item.isLabel) return false;
        const itemKey = item.moduleName || item.name || item.title;
        return !placedItemKeys.has(itemKey);
    });

    if (remainingItems.length > 0) {
        const flatOthers = flattenNavItems(remainingItems);
        if (flatOthers.length > 0) {
            finalStructuredMenu.push({
                title: t('Others'),
                icon: Package,
                children: flatOthers,
            });
        }
    }

    return finalStructuredMenu;
};
