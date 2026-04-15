import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Plus, Edit, Trash2, X, Package, MoreVertical, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/ui/search-input';
import { formatDate, formatAdminCurrency, formatStorage } from '@/utils/helpers';

interface Plan {
    id: number;
    name: string;
    description: string;
    number_of_users: number;
    status: boolean;
    free_plan: boolean;
    modules: string[];
    package_price_yearly: number;
    package_price_monthly: number;
    storage_limit: number;
    trial: boolean;
    trial_days: number;
    orders_count?: number;
    creator?: {
        name: string;
    };
}

interface Props {
    plans: Plan[];
    canCreate: boolean;
    activeModules: { module: string; alias: string; image: string; monthly_price: number; yearly_price: number }[];
    bankTransferEnabled: string;
    userTrialInfo?: {
        is_trial_done: number;
        trial_expire_date: string | null;
    };
}

export default function PlansIndex({ plans, canCreate, activeModules, bankTransferEnabled, userTrialInfo }: Props) {
    const { t } = useTranslation();
    const [subscriptionType, setSubscriptionType] = useState<'pre-package'>('pre-package');
    const { auth } = usePage().props as any;
    const isCompanyUser = !auth.user?.roles?.includes('superadmin');

    const [moduleSearch, setModuleSearch] = useState('');
    const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
    const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const handleDelete = (plan: Plan) => {
        setDeletingPlan(plan);
    };

    const confirmDelete = () => {
        if (deletingPlan) {
            router.delete(route('plans.destroy', deletingPlan.id));
            setDeletingPlan(null);
        }
    };

    // Use active modules from Features
    const allModules = activeModules.sort((a, b) => a.alias.localeCompare(b.alias));

    const activePlans = plans.filter((plan) => plan.status);

    // Find the plan with the highest order count for "Most Popular" badge
    const mostPopularPlanId =
        activePlans.length > 0
            ? activePlans.reduce((prev, current) =>
                  (current.orders_count || 0) > (prev.orders_count || 0) ? current : prev
              ).id
            : null;

    const hasModule = (plan: Plan, moduleObj: { module: string; alias: string; image: string }) => {
        return Array.isArray(plan.modules) ? plan.modules.includes(moduleObj.module) : false;
    };

    const handleStartTrial = (plan: Plan) => {
        router.post(
            route('plans.start-trial', plan.id),
            {},
            {
                preserveState: true,
                onSuccess: () => {
                    // Reload the page to update sidebar modules and user trial info
                    router.reload();
                },
            }
        );
    };

    const handleAssignFreePlan = (plan: Plan) => {
        router.post(
            route('plans.assign-free', plan.id),
            {
                duration: pricingPeriod === 'monthly' ? 'Month' : 'Year',
            },
            {
                preserveState: true,
            }
        );
    };

    const canStartTrial = (plan: Plan) => {
        return (
            isCompanyUser &&
            plan.trial &&
            plan.trial_days > 0 &&
            (auth.user?.is_trial_done === 0 || auth.user?.is_trial_done === '0')
        );
    };

    const isCurrentlySubscribed = (plan: Plan) => {
        if (!isCompanyUser || !auth.user?.active_plan) return false;
        return (
            auth.user.active_plan === plan.id &&
            auth.user.plan_expire_date &&
            new Date(auth.user.plan_expire_date) > new Date()
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Subscription Setting') }]}
            pageTitle={t('Subscription Setting')}
            pageActions={
                !isCompanyUser ? (
                    <TooltipProvider>
                        {canCreate && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link href={route('plans.create')}>
                                        <Button size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Create')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                ) : null
            }
        >
            <Head title={t('Plans')} />

            <div className="space-y-6">
                {/* Monthly/Yearly Toggle */}
                <div className="flex items-center justify-center space-x-6">
                    <div className="rounded-lg bg-muted p-1 dark:bg-card">
                        <div className="flex items-center">
                            <button
                                onClick={() => setPricingPeriod('monthly')}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                    pricingPeriod === 'monthly'
                                        ? 'bg-card text-foreground shadow-sm dark:bg-muted dark:text-foreground'
                                        : 'text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-background'
                                }`}
                            >
                                {t('Monthly')}
                            </button>
                            <button
                                onClick={() => setPricingPeriod('yearly')}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                    pricingPeriod === 'yearly'
                                        ? 'bg-card text-foreground shadow-sm dark:bg-muted dark:text-foreground'
                                        : 'text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-background'
                                }`}
                            >
                                {t('Yearly')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Plans Content */}
                {activePlans.length > 0 ? (
                    <div className="space-y-6 overflow-x-auto pt-6">
                        {/* Plans Header Cards */}
                        <div
                            className="grid gap-6"
                            style={{
                                gridTemplateColumns: `300px repeat(${activePlans.length}, 280px)`,
                                minWidth: `${300 + activePlans.length * 280 + (activePlans.length - 1) * 24}px`,
                            }}
                        >
                            {/* Features Header */}
                            <div className="sticky start-0 z-20 rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6 dark:border-border dark:from-card dark:to-foreground">
                                <div className="flex items-center justify-center space-x-3">
                                    <h3 className="text-xl font-bold text-foreground dark:text-foreground">
                                        {t('Features')}
                                    </h3>
                                </div>
                            </div>

                            {/* Plan Header Cards */}
                            {activePlans.map((plan, index) => (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-2xl border-2 p-6 ${
                                        plan.id === mostPopularPlanId && activePlans.length > 1
                                            ? 'border-foreground bg-card ring-2 ring-foreground/20 dark:bg-card'
                                            : 'border-border bg-card dark:border-border dark:bg-card'
                                    }`}
                                >
                                    {plan.id === mostPopularPlanId && activePlans.length > 1 && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                                            <Badge className="bg-foreground px-4 py-2 text-sm font-bold text-background shadow-lg">
                                                ★ {t('Most Popular')}
                                            </Badge>
                                        </div>
                                    )}

                                    {!isCompanyUser && (
                                        <div className="absolute end-4 top-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route('plans.edit', plan.id)}
                                                            className="flex items-center"
                                                        >
                                                            <Edit className="me-2 h-4 w-4" />
                                                            {t('Edit')}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(plan)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="me-2 h-4 w-4" />
                                                        {t('Delete')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}

                                    <div className="space-y-4 text-center">
                                        <div>
                                            <h3 className="mb-1 text-lg font-bold text-foreground dark:text-foreground">
                                                {plan.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground dark:text-muted-foreground/60">
                                                {plan.description}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            {plan.free_plan ? (
                                                <div>
                                                    <div className="mb-1 text-5xl font-black text-foreground">
                                                        {t('Free')}
                                                    </div>
                                                    <div className="font-semibold text-foreground">{t('Forever')}</div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="mb-2 flex items-baseline justify-center space-x-1">
                                                        <span className="text-5xl font-black text-foreground dark:text-foreground">
                                                            {formatAdminCurrency(
                                                                pricingPeriod === 'monthly'
                                                                    ? plan.package_price_monthly
                                                                    : plan.package_price_yearly
                                                            ).replace('.00', '')}
                                                        </span>
                                                        <span className="text-xl font-semibold text-muted-foreground dark:text-muted-foreground">
                                                            /{pricingPeriod === 'monthly' ? t('mo') : t('yr')}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-foreground"></div>
                                                <span className="text-sm font-medium text-foreground dark:text-muted-foreground/60">
                                                    {plan.number_of_users === -1
                                                        ? t('Unlimited users')
                                                        : `${plan.number_of_users} ${t('users')}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-foreground"></div>
                                                <span className="text-sm font-medium text-foreground dark:text-muted-foreground/60">
                                                    {formatStorage(plan.storage_limit)} {t('storage')}
                                                </span>
                                            </div>
                                            {plan.trial && (
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-foreground/40"></div>
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {plan.trial_days}d {t('trial')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Features Comparison Cards */}
                        <div className="space-y-4">
                            <div
                                className="grid gap-6"
                                style={{
                                    gridTemplateColumns: `300px repeat(${activePlans.length}, 280px)`,
                                    minWidth: `${300 + activePlans.length * 280 + (activePlans.length - 1) * 24}px`,
                                }}
                            >
                                {/* All Modules Card */}
                                <div className="sticky start-0 z-20 rounded-2xl border border-border bg-card p-6 dark:border-border dark:bg-card">
                                    <div className="space-y-3">
                                        <div className="mb-3 flex h-10 items-center justify-center border-b border-border py-2 dark:border-border">
                                            <span className="text-sm font-semibold text-foreground dark:text-foreground">
                                                {t('Features')}
                                            </span>
                                        </div>
                                        {allModules.map((module) => (
                                            <div
                                                key={module.module}
                                                className="flex h-6 items-center justify-center py-0.5"
                                            >
                                                <span className="text-center capitalize leading-none text-foreground dark:text-muted-foreground/60">
                                                    {module.alias}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Plan Feature Cards */}
                                {activePlans.map((plan) => {
                                    const enabledFeatures = allModules.filter((module) => hasModule(plan, module));
                                    const totalFeatures = allModules.length;

                                    return (
                                        <div
                                            key={plan.id}
                                            className="rounded-2xl border border-border bg-card p-6 dark:border-border dark:bg-card"
                                        >
                                            <div className="space-y-3">
                                                <div className="mb-3 flex h-10 items-center justify-center border-b border-border py-2 dark:border-border">
                                                    <span className="text-sm font-semibold text-foreground dark:text-foreground">
                                                        {enabledFeatures.length}/{totalFeatures} {t('Enabled')}
                                                    </span>
                                                </div>
                                                {allModules.map((module) => (
                                                    <div
                                                        key={module.module}
                                                        className="flex h-6 items-center justify-center py-0.5"
                                                    >
                                                        {hasModule(plan, module) ? (
                                                            <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground/5 dark:bg-foreground/10">
                                                                <Check className="h-3 w-3 text-foreground" />
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted dark:bg-muted">
                                                                <X className="h-3 w-3 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {isCompanyUser && (
                                                    <div className="space-y-2 border-t pt-4">
                                                        {isCurrentlySubscribed(plan) ? (
                                                            <div className="rounded-lg border border-border bg-muted p-2 text-center">
                                                                <p className="text-xs text-muted-foreground">
                                                                    {t('Expires on')}{' '}
                                                                    {formatDate(auth.user.plan_expire_date)}
                                                                </p>
                                                            </div>
                                                        ) : auth.user?.trial_expire_date &&
                                                          auth.user.active_plan === plan.id ? (
                                                            <div className="rounded-lg border border-border bg-muted p-2 text-center">
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    {t('Trial expires on')}{' '}
                                                                    {formatDate(auth.user.trial_expire_date)}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {plan.free_plan ? (
                                                                    <Button
                                                                        className="w-full"
                                                                        size="sm"
                                                                        onClick={() => handleAssignFreePlan(plan)}
                                                                    >
                                                                        {t('Subscribe to Plan')}
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        className="w-full"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            router.visit(
                                                                                route('plans.subscribe', plan.id)
                                                                            )
                                                                        }
                                                                    >
                                                                        {t('Subscribe to Plan')}
                                                                    </Button>
                                                                )}
                                                                {canStartTrial(plan) && (
                                                                    <Button
                                                                        className="w-full"
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleStartTrial(plan)}
                                                                    >
                                                                        <Clock className="me-2 h-4 w-4" />
                                                                        {t('Start Trial')} ({plan.trial_days}d)
                                                                    </Button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted dark:bg-card">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-foreground dark:text-foreground">
                            {t('No active plans found')}
                        </h3>
                        <p className="mb-4 text-muted-foreground dark:text-muted-foreground">
                            {t('Create your first plan to get started')}
                        </p>
                        {canCreate && (
                            <Link href={route('plans.create')}>
                                <Button>
                                    <Plus className="me-2 h-4 w-4" />
                                    {t('Create Plan')}
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingPlan} onOpenChange={() => setDeletingPlan(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('Delete Plan')}</DialogTitle>
                        <DialogDescription>
                            {t('Are you sure you want to delete')} "{deletingPlan?.name}"?{' '}
                            {t('This action cannot be undone.')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingPlan(null)}>
                            {t('Cancel')}
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            {t('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
