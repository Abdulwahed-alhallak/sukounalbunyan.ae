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
import { Plus, Edit as EditIcon, Trash2, TrendingUp, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import Create from './Create';
import Edit from './Edit';
import NoRecordsFound from '@/components/no-records-found';
import { GoalTracking, TrackingIndexProps, TrackingFilters, TrackingModalState } from './types';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { trackings, goals, auth } = usePage<TrackingIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<TrackingFilters>({
        goal_name: urlParams.get('goal_name') || '',
        goal_id: urlParams.get('goal_id') || '',
        on_track_status: urlParams.get('on_track_status') || '',
        date_range: (() => {
            const fromDate = urlParams.get('date_from');
            const toDate = urlParams.get('date_to');
            return fromDate && toDate ? `${fromDate} - ${toDate}` : '';
        })(),
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');

    const [modalState, setModalState] = useState<TrackingModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'goal.tracking.destroy',
        defaultMessage: t('Are you sure you want to delete this tracking?'),
    });

    const handleFilter = () => {
        const filterParams = { ...filters };

        if (filters.date_range) {
            const [fromDate, toDate] = filters.date_range.split(' - ');
            filterParams.date_from = fromDate;
            filterParams.date_to = toDate;
        }
        delete filterParams.date_range;

        router.get(
            route('goal.tracking.index'),
            { ...filterParams, per_page: perPage, sort: sortField, direction: sortDirection, view: viewMode },
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

        const filterParams = { ...filters };
        if (filters.date_range) {
            const [fromDate, toDate] = filters.date_range.split(' - ');
            filterParams.date_from = fromDate;
            filterParams.date_to = toDate;
        }
        delete filterParams.date_range;

        router.get(
            route('goal.tracking.index'),
            { ...filterParams, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            goal_name: '',
            goal_id: '',
            on_track_status: '',
            date_range: '',
        });
        router.get(route('goal.tracking.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: GoalTracking | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'goal',
            header: t('Goal'),
            sortable: false,
            render: (_: any, tracking: GoalTracking) => tracking.goal?.goal_name || '-',
        },
        {
            key: 'tracking_date',
            header: t('Date'),
            sortable: true,
            render: (value: string) => formatDate(value),
        },
        {
            key: 'contribution_amount',
            header: t('Contribution'),
            sortable: true,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'current_amount',
            header: t('Current Amount'),
            sortable: true,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'progress_percentage',
            header: t('Progress'),
            sortable: false,
            render: (value: number) => `${value}%`,
        },
        {
            key: 'days_remaining',
            header: t('Days Left'),
            sortable: true,
        },
        {
            key: 'on_track_status',
            header: t('Status'),
            sortable: false,
            render: (value: string) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value === 'ahead'
                            ? 'bg-muted text-foreground'
                            : value === 'on_track'
                              ? 'bg-muted text-foreground'
                              : value === 'behind'
                                ? 'bg-muted text-foreground'
                                : 'bg-muted text-destructive'
                    }`}
                >
                    {t(value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1))}
                </span>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-goal-tracking', 'edit-goal-tracking', 'delete-goal-tracking'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, tracking: GoalTracking) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('view-goal-tracking') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => router.visit(route('goal.tracking.show', tracking.id))}
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
                                  {auth.user?.permissions?.includes('edit-goal-tracking') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', tracking)}
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
                                  {auth.user?.permissions?.includes('delete-goal-tracking') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(tracking.id)}
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
            breadcrumbs={[{ label: t('Goal') }, { label: t('Tracking') }]}
            pageTitle={t('Manage Tracking')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-goal-tracking') && (
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
            <Head title={t('Tracking')} />

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
                                routeName="goal.tracking.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector routeName="goal.tracking.index" filters={{ ...filters, view: viewMode }} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.goal_name,
                                        filters.goal_id,
                                        filters.on_track_status,
                                        filters.date_range,
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Goal')}</label>
                                <Select
                                    value={filters.goal_id || 'all'}
                                    onValueChange={(value) =>
                                        setFilters({ ...filters, goal_id: value === 'all' ? '' : value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Goal')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('All Goals')}</SelectItem>
                                        {goals?.map((goal) => (
                                            <SelectItem key={goal.id} value={goal.id.toString()}>
                                                {goal.goal_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Status')}</label>
                                <Select
                                    value={filters.on_track_status || 'all'}
                                    onValueChange={(value) =>
                                        setFilters({ ...filters, on_track_status: value === 'all' ? '' : value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('All Status')}</SelectItem>
                                        <SelectItem value="ahead">{t('Ahead')}</SelectItem>
                                        <SelectItem value="on_track">{t('On Track')}</SelectItem>
                                        <SelectItem value="behind">{t('Behind')}</SelectItem>
                                        <SelectItem value="critical">{t('Critical')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Date Range')}
                                </label>
                                <DateRangePicker
                                    value={filters.date_range}
                                    onChange={(value) => setFilters({ ...filters, date_range: value })}
                                    placeholder={t('Select date range')}
                                />
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
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={trackings?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={TrendingUp}
                                            title={t('No Tracking found')}
                                            description={t('Get started by creating your first Tracking.')}
                                            hasFilters={
                                                !!(
                                                    filters.goal_name ||
                                                    filters.goal_id ||
                                                    filters.on_track_status ||
                                                    filters.date_range
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-goal-tracking"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Tracking')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-4">
                            {trackings?.data && trackings.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {trackings.data?.map((tracking) => (
                                        <Card
                                            key={tracking.id}
                                            className="border border-border transition-shadow hover:shadow-md"
                                        >
                                            <div className="p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <h3 className="truncate text-base font-semibold text-foreground">
                                                        {tracking.goal?.goal_name}
                                                    </h3>
                                                </div>

                                                <div className="mb-4 space-y-3">
                                                    <div>
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                            {t('Date')}
                                                        </p>
                                                        <p className="text-sm font-medium text-foreground">
                                                            {formatDate(tracking.tracking_date)}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-lg bg-muted/50 p-3">
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {t('Contribution')}
                                                            </span>
                                                            <span className="text-lg font-bold text-foreground">
                                                                {formatCurrency(tracking.contribution_amount)}
                                                            </span>
                                                        </div>
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <span className="text-sm text-muted-foreground">
                                                                {t('Current')}
                                                            </span>
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {formatCurrency(tracking.current_amount)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-muted-foreground">
                                                                {t('Progress')}
                                                            </span>
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {tracking.progress_percentage}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                            {t('Days Left')}
                                                        </p>
                                                        <p className="text-xs text-foreground">
                                                            {tracking.days_remaining}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between border-t pt-3">
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-sm ${
                                                            tracking.on_track_status === 'ahead'
                                                                ? 'bg-muted text-foreground'
                                                                : tracking.on_track_status === 'on_track'
                                                                  ? 'bg-muted text-foreground'
                                                                  : tracking.on_track_status === 'behind'
                                                                    ? 'bg-muted text-foreground'
                                                                    : 'bg-muted text-destructive'
                                                        }`}
                                                    >
                                                        {t(
                                                            tracking.on_track_status
                                                                .replace('_', ' ')
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                tracking.on_track_status.replace('_', ' ').slice(1)
                                                        )}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        <TooltipProvider>
                                                            {auth.user?.permissions?.includes('view-goal-tracking') && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                router.visit(
                                                                                    route(
                                                                                        'goal.tracking.show',
                                                                                        tracking.id
                                                                                    )
                                                                                )
                                                                            }
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
                                                            {auth.user?.permissions?.includes('edit-goal-tracking') && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => openModal('edit', tracking)}
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
                                                            {auth.user?.permissions?.includes(
                                                                'delete-goal-tracking'
                                                            ) && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                openDeleteDialog(tracking.id)
                                                                            }
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
                                    icon={TrendingUp}
                                    title={t('No Tracking found')}
                                    description={t('Get started by creating your first Tracking.')}
                                    hasFilters={
                                        !!(
                                            filters.goal_name ||
                                            filters.goal_id ||
                                            filters.on_track_status ||
                                            filters.date_range
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-goal-tracking"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Tracking')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={trackings || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }}
                        routeName="goal.tracking.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create goals={goals} onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <Edit tracking={modalState.data} goals={goals} onSuccess={closeModal} />
                )}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Tracking')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
