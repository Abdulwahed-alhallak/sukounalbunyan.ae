import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit as EditIcon, Trash2, Target, Eye, Flag, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import Create from './Create';
import EditGoal from './Edit';
import ViewGoal from './View';
import NoRecordsFound from '@/components/no-records-found';
import { Goal, GoalsIndexProps, GoalFilters, GoalModalState } from './types';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { goals, categories = [], auth } = usePage<GoalsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<GoalFilters>({
        goal_name: urlParams.get('goal_name') || '',
        goal_type: urlParams.get('goal_type') || '',
        status: urlParams.get('status') || '',
        priority: urlParams.get('priority') || '',
        category_id: urlParams.get('category_id') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');

    const [modalState, setModalState] = useState<GoalModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<Goal | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'goal.goals.destroy',
        defaultMessage: t('Are you sure you want to delete this goal?'),
    });

    const handleFilter = () => {
        router.get(
            route('goal.goals.index'),
            { ...filters, per_page: perPage, sort: sortField, direction: sortDirection, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route('goal.goals.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            goal_name: '',
            goal_type: '',
            status: '',
            priority: '',
            category_id: '',
        });
        router.get(route('goal.goals.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: Goal | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const getStatusBadge = (status: string) => {
        const statusColors = {
            draft: 'bg-muted text-foreground',
            active: 'bg-muted text-foreground',
            completed: 'bg-muted text-foreground',
        };
        return statusColors[status as keyof typeof statusColors] || 'bg-muted text-foreground';
    };

    const getPriorityBadge = (priority: string) => {
        const priorityColors = {
            low: 'bg-muted text-foreground',
            medium: 'bg-muted text-foreground',
            high: 'bg-muted text-foreground',
            critical: 'bg-muted text-destructive',
        };
        return priorityColors[priority as keyof typeof priorityColors] || 'bg-muted text-foreground';
    };

    const tableColumns = [
        {
            key: 'goal_name',
            header: t('Goal Name'),
            sortable: true,
        },
        {
            key: 'category',
            header: t('Category'),
            sortable: false,
            render: (_: any, goal: Goal) => goal.category?.category_name || '-',
        },
        {
            key: 'goal_type',
            header: t('Type'),
            sortable: false,
            render: (value: string) => t(value.replace('_', ' ')),
        },
        {
            key: 'target_amount',
            header: t('Target Amount'),
            sortable: false,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'current_amount',
            header: t('Current Amount'),
            sortable: false,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'progress',
            header: t('Progress'),
            sortable: false,
            render: (_: any, goal: Goal) => {
                const progress =
                    goal.target_amount > 0
                        ? Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100)
                        : 0;
                return (
                    <div className="flex min-w-24 items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-muted">
                            <div
                                className="h-2 rounded-full bg-foreground transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="min-w-8 text-xs font-medium text-muted-foreground">{progress}%</span>
                    </div>
                );
            },
        },
        {
            key: 'target_date',
            header: t('Target Date'),
            sortable: false,
            render: (value: string) => formatDate(value),
        },
        {
            key: 'priority',
            header: t('Priority'),
            sortable: false,
            render: (value: string) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value === 'critical'
                            ? 'bg-muted text-destructive'
                            : value === 'high'
                              ? 'bg-muted text-foreground'
                              : value === 'medium'
                                ? 'bg-muted text-foreground'
                                : 'bg-muted text-foreground'
                    }`}
                >
                    {t(value.charAt(0).toUpperCase() + value.slice(1))}
                </span>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: string) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value === 'completed'
                            ? 'bg-muted text-foreground'
                            : value === 'active'
                              ? 'bg-muted text-foreground'
                              : 'bg-muted text-foreground'
                    }`}
                >
                    {t(value.charAt(0).toUpperCase() + value.slice(1))}
                </span>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) => ['view-goals', 'edit-goals', 'delete-goals'].includes(p))
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, goal: Goal) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {goal.status === 'draft' && auth.user?.permissions?.includes('active-goals') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => router.post(route('goal.goals.active', goal.id))}
                                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                              >
                                                  <CheckCircle className="h-4 w-4" />
                                              </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>{t('Once the status becomes Active, it cannot be edited')}</p>
                                          </TooltipContent>
                                      </Tooltip>
                                  )}
                                  {auth.user?.permissions?.includes('view-goals') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(goal)}
                                                  className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                              >
                                                  <Eye className="h-4 w-4" />
                                              </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>{t('View')}</p>
                                          </TooltipContent>
                                      </Tooltip>
                                  )}
                                  {goal.status === 'draft' && auth.user?.permissions?.includes('edit-goals') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', goal)}
                                                  className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                              >
                                                  <EditIcon className="h-4 w-4" />
                                              </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>{t('Edit')}</p>
                                          </TooltipContent>
                                      </Tooltip>
                                  )}
                                  {auth.user?.permissions?.includes('delete-goals') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(goal.id)}
                                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                              >
                                                  <Trash2 className="h-4 w-4" />
                                              </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>{t('Delete')}</p>
                                          </TooltipContent>
                                      </Tooltip>
                                  )}
                              </TooltipProvider>
                          </div>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Goal') }, { label: t('Goals') }]}
            pageTitle={t('Manage Goals')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-goals') && (
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button size="sm" onClick={() => openModal('add')}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('Create')}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
            }
        >
            <Head title={t('Goals')} />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.goal_name}
                                onChange={(value) => setFilters({ ...filters, goal_name: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search Goals...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="goal.goals.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector routeName="goal.goals.index" filters={{ ...filters, view: viewMode }} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.goal_type,
                                        filters.status,
                                        filters.priority,
                                        filters.category_id,
                                    ].filter((f) => f !== '' && f !== null && f !== undefined).length;
                                    return (
                                        activeFilters > 0 && (
                                            <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                                                {activeFilters}
                                            </span>
                                        )
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </CardContent>

                {showFilters && (
                    <CardContent className="bg-muted/50/30 border-b p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Goal Type')}
                                </label>
                                <Select
                                    value={filters.goal_type}
                                    onValueChange={(value) => setFilters({ ...filters, goal_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="savings">{t('Savings')}</SelectItem>
                                        <SelectItem value="debt_reduction">{t('Debt Reduction')}</SelectItem>
                                        <SelectItem value="expense_reduction">{t('Expense Reduction')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Status')}</label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">{t('Draft')}</SelectItem>
                                        <SelectItem value="active">{t('Active')}</SelectItem>
                                        <SelectItem value="completed">{t('Completed')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Priority')}
                                </label>
                                <Select
                                    value={filters.priority}
                                    onValueChange={(value) => setFilters({ ...filters, priority: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Priority')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">{t('Low')}</SelectItem>
                                        <SelectItem value="medium">{t('Medium')}</SelectItem>
                                        <SelectItem value="high">{t('High')}</SelectItem>
                                        <SelectItem value="critical">{t('Critical')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Category')}
                                </label>
                                <Select
                                    value={filters.category_id}
                                    onValueChange={(value) => setFilters({ ...filters, category_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Category')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={handleFilter} size="sm">
                                    {t('Apply')}
                                </Button>
                                <Button variant="outline" onClick={clearFilters} size="sm">
                                    {t('Clear')}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                )}

                <CardContent className="p-0">
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[1200px]">
                                <DataTable
                                    data={goals?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={Target}
                                            title={t('No Goals found')}
                                            description={t('Get started by creating your first Goal.')}
                                            hasFilters={
                                                !!(
                                                    filters.goal_name ||
                                                    filters.goal_type ||
                                                    filters.status ||
                                                    filters.priority ||
                                                    filters.category_id
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-goals"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Goal')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-4">
                            {goals?.data && goals.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {goals.data?.map((goal) => (
                                        <Card
                                            key={goal.id}
                                            className="border border-border transition-shadow hover:shadow-md"
                                        >
                                            <div className="p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <h3 className="truncate text-base font-semibold text-foreground">
                                                        {goal.goal_name}
                                                    </h3>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-sm ${
                                                            goal.status === 'completed'
                                                                ? 'bg-muted text-foreground'
                                                                : goal.status === 'active'
                                                                  ? 'bg-muted text-foreground'
                                                                  : 'bg-muted text-foreground'
                                                        }`}
                                                    >
                                                        {t(goal.status.charAt(0).toUpperCase() + goal.status.slice(1))}
                                                    </span>
                                                </div>

                                                <div className="mb-4 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Type')}
                                                            </p>
                                                            <p className="text-xs text-foreground">
                                                                {t(goal.goal_type.replace('_', ' '))}
                                                            </p>
                                                        </div>
                                                        <div className="text-end">
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Category')}
                                                            </p>
                                                            <p className="truncate text-xs text-foreground">
                                                                {goal.category?.category_name || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Priority')}
                                                            </p>
                                                            <span
                                                                className={`rounded-full px-2 py-1 text-xs ${
                                                                    goal.priority === 'critical'
                                                                        ? 'bg-muted text-destructive'
                                                                        : goal.priority === 'high'
                                                                          ? 'bg-muted text-foreground'
                                                                          : goal.priority === 'medium'
                                                                            ? 'bg-muted text-foreground'
                                                                            : 'bg-muted text-foreground'
                                                                }`}
                                                            >
                                                                {t(
                                                                    goal.priority.charAt(0).toUpperCase() +
                                                                        goal.priority.slice(1)
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="text-end">
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Target Date')}
                                                            </p>
                                                            <p className="text-xs text-foreground">
                                                                {formatDate(goal.target_date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="rounded-lg bg-muted/50 p-3">
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {t('Target')}
                                                            </span>
                                                            <span className="text-lg font-bold text-foreground">
                                                                {formatCurrency(goal.target_amount)}
                                                            </span>
                                                        </div>
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <span className="text-sm text-muted-foreground">
                                                                {t('Current')}
                                                            </span>
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {formatCurrency(goal.current_amount)}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-muted-foreground">
                                                                    {t('Progress')}
                                                                </span>
                                                                <span className="text-xs font-medium text-foreground">
                                                                    {goal.target_amount > 0
                                                                        ? Math.min(
                                                                              Math.round(
                                                                                  (goal.current_amount /
                                                                                      goal.target_amount) *
                                                                                      100
                                                                              ),
                                                                              100
                                                                          )
                                                                        : 0}
                                                                    %
                                                                </span>
                                                            </div>
                                                            <div className="h-2 rounded-full bg-muted">
                                                                <div
                                                                    className="h-2 rounded-full bg-foreground transition-all duration-300"
                                                                    style={{
                                                                        width: `${goal.target_amount > 0 ? Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100) : 0}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end border-t pt-3">
                                                    <div className="flex gap-1">
                                                        <TooltipProvider>
                                                            {goal.status === 'draft' &&
                                                                auth.user?.permissions?.includes('active-goals') && (
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    router.post(
                                                                                        route(
                                                                                            'goal.goals.active',
                                                                                            goal.id
                                                                                        )
                                                                                    )
                                                                                }
                                                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                                            >
                                                                                <CheckCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>
                                                                                {t(
                                                                                    'Once the status becomes Active, it cannot be edited'
                                                                                )}
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                            {auth.user?.permissions?.includes('view-goals') && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => setViewingItem(goal)}
                                                                            className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('View')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                            {goal.status === 'draft' &&
                                                                auth.user?.permissions?.includes('edit-goals') && (
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => openModal('edit', goal)}
                                                                                className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                            >
                                                                                <EditIcon className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{t('Edit')}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                            {auth.user?.permissions?.includes('delete-goals') && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => openDeleteDialog(goal.id)}
                                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('Delete')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <NoRecordsFound
                                    icon={Target}
                                    title={t('No Goals found')}
                                    description={t('Get started by creating your first Goal.')}
                                    hasFilters={
                                        !!(
                                            filters.goal_name ||
                                            filters.goal_type ||
                                            filters.status ||
                                            filters.priority ||
                                            filters.category_id
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-goals"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Goal')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={goals || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }}
                        routeName="goal.goals.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditGoal goal={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <ViewGoal goal={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Goal')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
