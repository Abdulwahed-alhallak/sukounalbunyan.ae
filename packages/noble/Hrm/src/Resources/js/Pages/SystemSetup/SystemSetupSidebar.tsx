import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
    Building,
    Building2,
    Users,
    FileText,
    Settings,
    AlertTriangle,
    ShieldAlert,
    AlertOctagon,
    Calendar,
    Tag,
    DollarSign,
    Minus,
    CreditCard,
    Clock,
    Shield,
} from 'lucide-react';

interface SidebarItem {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    route: string;
    permission: string;
}

interface SystemSetupSidebarProps {
    [key: string]: any;
    activeItem?: string;
    onSectionChange?: (section: string) => void;
}

export default function SystemSetupSidebar({ activeItem, onSectionChange }: SystemSetupSidebarProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const currentRoute = route().current();

    const sidebarItems: SidebarItem[] = [
        {
            key: 'branches',
            label: t('Branches'),
            icon: Building,
            route: 'hrm.branches.index',
            permission: 'manage-branches',
        },
        {
            key: 'departments',
            label: t('Departments'),
            icon: Building2,
            route: 'hrm.departments.index',
            permission: 'manage-departments',
        },
        {
            key: 'designations',
            label: t('Designations'),
            icon: Users,
            route: 'hrm.designations.index',
            permission: 'manage-designations',
        },
        {
            key: 'employee-document-types',
            label: t('Document Types'),
            icon: FileText,
            route: 'hrm.employee-document-types.index',
            permission: 'manage-employee-document-types',
        },
        {
            key: 'award-types',
            label: t('Award Types'),
            icon: Settings,
            route: 'hrm.award-types.index',
            permission: 'manage-award-types',
        },
        {
            key: 'termination-types',
            label: t('Termination Types'),
            icon: AlertTriangle,
            route: 'hrm.termination-types.index',
            permission: 'manage-termination-types',
        },
        {
            key: 'warning-types',
            label: t('Warning Types'),
            icon: ShieldAlert,
            route: 'hrm.warning-types.index',
            permission: 'manage-warning-types',
        },
        {
            key: 'violation-types',
            label: t('Violation Types'),
            icon: ShieldAlert,
            route: 'hrm.violation-types.index',
            permission: 'manage-hrm-setup',
        },
        {
            key: 'complaint-types',
            label: t('Complaint Types'),
            icon: AlertOctagon,
            route: 'hrm.complaint-types.index',
            permission: 'manage-complaint-types',
        },
        {
            key: 'holiday-types',
            label: t('Holiday Types'),
            icon: Calendar,
            route: 'hrm.holiday-types.index',
            permission: 'manage-holiday-types',
        },
        {
            key: 'document-categories',
            label: t('Document Categories'),
            icon: FileText,
            route: 'hrm.document-categories.index',
            permission: 'manage-document-categories',
        },
        {
            key: 'announcement-categories',
            label: t('Announcement Categories'),
            icon: Tag,
            route: 'hrm.announcement-categories.index',
            permission: 'manage-announcement-categories',
        },
        {
            key: 'event-types',
            label: t('Event Types'),
            icon: Calendar,
            route: 'hrm.event-types.index',
            permission: 'manage-event-types',
        },
        {
            key: 'allowance-types',
            label: t('Allowance Types'),
            icon: DollarSign,
            route: 'hrm.allowance-types.index',
            permission: 'manage-allowance-types',
        },
        {
            key: 'deduction-types',
            label: t('Deduction Types'),
            icon: Minus,
            route: 'hrm.deduction-types.index',
            permission: 'manage-deduction-types',
        },
        {
            key: 'loan-types',
            label: t('Loan Types'),
            icon: CreditCard,
            route: 'hrm.loan-types.index',
            permission: 'manage-loan-types',
        },
        {
            key: 'working-days',
            label: t('Working Days'),
            icon: Clock,
            route: 'hrm.working-days.index',
            permission: 'manage-working-days',
        },
        {
            key: 'ip-restricts',
            label: t('Ip Restricts'),
            icon: Shield,
            route: 'hrm.ip-restricts.index',
            permission: 'manage-ip-restricts',
        },
    ];

    const filteredItems = sidebarItems.filter((item) => auth.user?.permissions?.includes(item.permission));

    return (
        <div className="sticky top-4">
            <div className="hrm-panel overflow-hidden">
                <div className="hrm-toolbar px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">{t('HR Setup')}</p>
                    <p className="text-xs text-muted-foreground">
                        {t('Manage departments, documents, leave rules, and payroll settings.')}
                    </p>
                </div>

                <ScrollArea className="h-[calc(100vh-14rem)]">
                    <div className="space-y-1 p-3">
                        {filteredItems?.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeItem === item.key || currentRoute === item.route;

                            return (
                                <Button
                                    key={item.key}
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                                        isActive
                                            ? 'bg-foreground text-background shadow-sm hover:bg-foreground/90 hover:text-background'
                                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                    )}
                                    onClick={() => {
                                        router.get(route(item.route));
                                        onSectionChange?.(item.key);
                                    }}
                                >
                                    <Icon className="me-2 h-4 w-4" />
                                    {item.label}
                                </Button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
