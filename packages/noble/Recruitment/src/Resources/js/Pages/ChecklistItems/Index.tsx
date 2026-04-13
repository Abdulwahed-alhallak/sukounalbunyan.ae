import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit as EditIcon, Trash2, Eye, CheckCircle as CheckCircleIcon, Download, FileImage } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditChecklistItem from './Edit';
import View from './View';
import NoRecordsFound from '@/components/no-records-found';
import { ChecklistItem, ChecklistItemsIndexProps, ChecklistItemFilters, ChecklistItemModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { checklistitems, auth, onboardingchecklists } = usePage<ChecklistItemsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<ChecklistItemFilters>({
        task_name: urlParams.get('task_name') || '',
        description: urlParams.get('description') || '',
        assigned_to_role: urlParams.get('assigned_to_role') || '',
        checklist_id: urlParams.get('checklist_id') || 'all',
        category: urlParams.get('category') || '',
        is_required: urlParams.get('is_required') || '',
        status: urlParams.get('status') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<ChecklistItemModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<ChecklistItem | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'recruitment.checklist-items.destroy',
        defaultMessage: t('Are you sure you want to delete this checklist item?'),
    });

    const handleFilter = () => {
        router.get(
            route('recruitment.checklist-items.index'),
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
            route('recruitment.checklist-items.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            task_name: '',
            description: '',
            assigned_to_role: '',
            checklist_id: 'all',
            category: '',
            is_required: '',
            status: '',
        });
        router.get(route('recruitment.checklist-items.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: ChecklistItem | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'checklist.name',
            header: t('Checklist'),
            sortable: true,
            render: (value: any, row: any) => row.checklist?.name || '-',
        },
        {
            key: 'task_name',
            header: t('Task'),
            sortable: true,
            render: (value: string, row: ChecklistItem) => (
                <div className="flex flex-col gap-1">
                    <span>{value}</span>
                    {row.is_required && <span className="text-xs font-medium text-destructive">{t('Required')}</span>}
                </div>
            ),
        },
        {
            key: 'is_required',
            header: t('Is Required'),
            sortable: false,
            render: (value: boolean) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value ? 'bg-muted text-destructive' : 'bg-muted text-foreground'
                    }`}
                >
                    {value ? t('Yes') : t('No')}
                </span>
            ),
        },
        {
            key: 'category',
            header: t('Category'),
            sortable: false,
            render: (value: string) => {
                if (!value) return '-';
                const getCategoryBadge = (category: string) => {
                    const styles = {
                        Other: 'bg-muted text-foreground',
                        Documentation: 'bg-muted text-foreground',
                        HR: 'bg-muted text-foreground',
                        'IT Setup': 'bg-muted text-foreground',
                        Training: 'bg-muted text-foreground',
                        Facilities: 'bg-muted text-foreground',
                    };
                    return styles[category] || 'bg-muted text-foreground';
                };
                return <span className={`rounded-full px-2 py-1 text-sm ${getCategoryBadge(value)}`}>{value}</span>;
            },
        },
        {
            key: 'assigned_to_role',
            header: t('Assigned To Role'),
            sortable: true,
        },
        {
            key: 'due_day',
            header: t('Due Day'),
            sortable: false,
            render: (value: number) =>
                value ? (
                    <span className="rounded-full bg-muted px-2 py-1 text-sm text-foreground">
                        {t('Day')} {value}
                    </span>
                ) : (
                    '-'
                ),
        },

        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: boolean) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                    }`}
                >
                    {value ? t('Active') : t('Inactive')}
                </span>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-checklist-items', 'edit-checklist-items', 'delete-checklist-items'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, checklistitem: ChecklistItem) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('view-checklist-items') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(checklistitem)}
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
                                  {auth.user?.permissions?.includes('edit-checklist-items') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', checklistitem)}
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
                                  {auth.user?.permissions?.includes('delete-checklist-items') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(checklistitem.id)}
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
            breadcrumbs={[
                { label: t('Recruitment'), url: route('recruitment.index') },
                { label: t('Checklist Items') },
            ]}
            pageTitle={t('Manage Checklist Items')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-checklist-items') && (
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
            <Head title={t('Checklist Items')} />

            {/* Main Content Card */}
            <Card className="shadow-sm">
                {/* Search & Controls Header */}
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.task_name}
                                onChange={(value) => setFilters({ ...filters, task_name: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search Checklist Items...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="recruitment.checklist-items.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="recruitment.checklist-items.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.checklist_id !== 'all' ? filters.checklist_id : '',
                                        filters.category,
                                        filters.is_required,
                                        filters.status,
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

                {/* Advanced Filters */}
                {showFilters && (
                    <CardContent className="bg-muted/50/30 border-b p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Checklist')}
                                </label>
                                <Select
                                    value={filters.checklist_id}
                                    onValueChange={(value) => setFilters({ ...filters, checklist_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('All Checklists')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('All Checklists')}</SelectItem>
                                        {onboardingchecklists?.map((checklist: any) => (
                                            <SelectItem key={checklist.id} value={checklist.id.toString()}>
                                                {checklist.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Category')}
                                </label>
                                <Select
                                    value={filters.category}
                                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Category')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Documentation">{t('Documentation')}</SelectItem>
                                        <SelectItem value="IT Setup">{t('IT Setup')}</SelectItem>
                                        <SelectItem value="Training">{t('Training')}</SelectItem>
                                        <SelectItem value="HR">{t('HR')}</SelectItem>
                                        <SelectItem value="Facilities">{t('Facilities')}</SelectItem>
                                        <SelectItem value="Other">{t('Other')}</SelectItem>
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
                                        <SelectItem value="1">{t('Active')}</SelectItem>
                                        <SelectItem value="0">{t('Inactive')}</SelectItem>
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

                {/* Table Content */}
                <CardContent className="p-0">
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={checklistitems?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={CheckCircleIcon}
                                            title={t('No Checklist Items found')}
                                            description={t('Get started by creating your first Checklist Item.')}
                                            hasFilters={
                                                !!(
                                                    filters.task_name ||
                                                    filters.description ||
                                                    filters.assigned_to_role ||
                                                    (filters.checklist_id !== 'all' && filters.checklist_id) ||
                                                    filters.category ||
                                                    filters.is_required ||
                                                    filters.status
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-checklist-items"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Checklist Item')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {checklistitems?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {checklistitems?.data?.map((checklistitem) => {
                                        const getCategoryBadge = (category: string) => {
                                            const styles = {
                                                Other: 'bg-muted text-foreground',
                                                Documentation: 'bg-muted text-foreground',
                                                HR: 'bg-muted text-foreground',
                                                'IT Setup': 'bg-muted text-foreground',
                                                Training: 'bg-muted text-foreground',
                                                Facilities: 'bg-muted text-foreground',
                                            };
                                            return styles[category] || 'bg-muted text-foreground';
                                        };

                                        return (
                                            <Card
                                                key={checklistitem.id}
                                                className="flex h-full flex-col transition-shadow duration-200 hover:shadow-md"
                                            >
                                                <div className="bg-muted/50/50 flex items-center gap-3 border-b p-3">
                                                    <div className="flex-shrink-0 rounded-lg bg-foreground/10 p-2">
                                                        <CheckCircleIcon className="h-5 w-5 text-foreground" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-sm font-semibold leading-tight">
                                                            {checklistitem.task_name}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            {checklistitem.checklist?.name || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-3 p-3">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Category')}
                                                            </p>
                                                            {checklistitem.category ? (
                                                                <span
                                                                    className={`rounded-full px-2 py-1 text-xs ${getCategoryBadge(checklistitem.category)}`}
                                                                >
                                                                    {checklistitem.category}
                                                                </span>
                                                            ) : (
                                                                <p className="font-medium">-</p>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Due Day')}
                                                            </p>
                                                            {checklistitem.due_day ? (
                                                                <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">
                                                                    {t('Day')} {checklistitem.due_day}
                                                                </span>
                                                            ) : (
                                                                <p className="font-medium">-</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Assigned To Role')}
                                                            </p>
                                                            <p className="font-medium">
                                                                {checklistitem.assigned_to_role || '-'}
                                                            </p>
                                                        </div>
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Required')}
                                                            </p>
                                                            <span
                                                                className={`rounded-full px-2 py-1 text-xs ${
                                                                    checklistitem.is_required
                                                                        ? 'bg-muted text-destructive'
                                                                        : 'bg-muted text-foreground'
                                                                }`}
                                                            >
                                                                {checklistitem.is_required
                                                                    ? t('Required')
                                                                    : t('Not Required')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 items-center justify-between border-t p-3">
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs ${
                                                            checklistitem.status
                                                                ? 'bg-muted text-foreground'
                                                                : 'bg-muted text-destructive'
                                                        }`}
                                                    >
                                                        {checklistitem.status ? t('Active') : t('Inactive')}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <TooltipProvider>
                                                            {auth.user?.permissions?.includes(
                                                                'view-checklist-items'
                                                            ) && (
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                setViewingItem(checklistitem)
                                                                            }
                                                                            className="h-9 w-9 p-0 text-foreground hover:bg-muted/50 hover:text-foreground"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('View')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                            {auth.user?.permissions?.includes(
                                                                'edit-checklist-items'
                                                            ) && (
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                openModal('edit', checklistitem)
                                                                            }
                                                                            className="h-9 w-9 p-0 text-foreground hover:bg-muted/50 hover:text-foreground"
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
                                                                'delete-checklist-items'
                                                            ) && (
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                openDeleteDialog(checklistitem)
                                                                            }
                                                                            className="h-9 w-9 p-0 text-destructive hover:bg-muted/50 hover:text-destructive"
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
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <NoRecordsFound
                                    icon={CheckCircleIcon}
                                    title={t('No Checklist Items found')}
                                    description={t('Get started by creating your first Checklist Item.')}
                                    hasFilters={
                                        !!(
                                            filters.task_name ||
                                            filters.description ||
                                            filters.assigned_to_role ||
                                            (filters.checklist_id !== 'all' && filters.checklist_id) ||
                                            filters.category ||
                                            filters.is_required ||
                                            filters.status
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-checklist-items"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Checklist Item')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={checklistitems || { data: [], links: [], meta: {} }}
                        routeName="recruitment.checklist-items.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditChecklistItem checklistitem={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View checklistitem={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Checklist Item')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
