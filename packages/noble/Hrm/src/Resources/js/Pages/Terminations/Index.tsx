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
import { Plus, Edit as EditIcon, Trash2, Eye, UserX as UserXIcon, Download, FileImage, Play } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditTermination from './Edit';
import TerminationStatusModal from './TerminationStatusModal';
import TerminationView from './View';

import NoRecordsFound from '@/components/no-records-found';
import { Termination, TerminationsIndexProps, TerminationFilters, TerminationModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { terminations = [], auth, users = [], terminationtypes } = usePage<TerminationsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<TerminationFilters>({
        name: urlParams.get('name') || '',
        employee_id: urlParams.get('employee_id') || 'all',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<TerminationModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [statusModalState, setStatusModalState] = useState<{
        isOpen: boolean;
        termination: Termination | null;
    }>({
        isOpen: false,
        termination: null,
    });
    const [viewingItem, setViewingItem] = useState<Termination | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.terminations.destroy',
        defaultMessage: t('Are you sure you want to delete this termination?'),
    });

    const handleFilter = () => {
        router.get(
            route('hrm.terminations.index'),
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
            route('hrm.terminations.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            employee_id: 'all',
        });
        router.get(route('hrm.terminations.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: Termination | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const openStatusModal = (termination: Termination) => {
        setStatusModalState({ isOpen: true, termination });
    };

    const closeStatusModal = () => {
        setStatusModalState({ isOpen: false, termination: null });
    };

    const tableColumns = [
        {
            key: 'employee.name',
            header: t('Employee Name'),
            sortable: false,
            render: (value: any, row: any) => row.employee?.name || '-',
        },
        {
            key: 'terminationType.termination_type',
            header: t('Termination Type'),
            sortable: false,
            render: (value: any, row: any) => row.termination_type?.termination_type || '-',
        },
        {
            key: 'notice_date',
            header: t('Notice Date'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'termination_date',
            header: t('Termination Date'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'document',
            header: t('Document'),
            sortable: false,
            render: (_: any, termination: Termination) =>
                termination.document ? (
                    <a
                        href={getImagePath(termination.document)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-foreground hover:text-foreground"
                    >
                        <FileImage className="h-4 w-4" />
                    </a>
                ) : (
                    '-'
                ),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: string) => {
                const statusColors = {
                    pending: 'bg-muted text-foreground',
                    approved: 'bg-muted text-foreground',
                    rejected: 'bg-muted text-destructive',
                };
                return (
                    <span
                        className={`rounded-full px-2 py-1 text-sm ${statusColors[value as keyof typeof statusColors] || statusColors.pending}`}
                    >
                        {t(value?.charAt(0).toUpperCase() + value?.slice(1) || 'Pending')}
                    </span>
                );
            },
        },
        {
            key: 'approved_by.name',
            header: t('Approved By'),
            sortable: false,
            render: (value: any, row: any) => row.approved_by?.name || '-',
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['manage-termination-status', 'view-terminations', 'edit-terminations', 'delete-terminations'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, termination: Termination) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('manage-termination-status') &&
                                      termination.status === 'pending' && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openStatusModal(termination)}
                                                      className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                  >
                                                      <Play className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('Status')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                  {auth.user?.permissions?.includes('view-terminations') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(termination)}
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
                                  {auth.user?.permissions?.includes('edit-terminations') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', termination)}
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
                                  {auth.user?.permissions?.includes('delete-terminations') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(termination.id)}
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
            breadcrumbs={[{ label: t('Hrm'), url: route('hrm.index') }, { label: t('Terminations') }]}
            pageTitle={t('Manage Terminations')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-terminations') && (
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
            <Head title={t('Terminations')} />

            {/* Main Content Card */}
            <Card className="shadow-sm">
                {/* Search & Controls Header */}
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.name}
                                onChange={(value) => setFilters({ ...filters, name: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search by Employee Name...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="hrm.terminations.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="hrm.terminations.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.employee_id !== 'all' ? filters.employee_id : '',
                                    ].filter((f) => f !== '' && f !== null && f !== undefined).length;
                                    return (
                                        activeFilters > 0 && (
                                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
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
                        {auth.user?.permissions?.includes('manage-employees') && (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        {t('Employee')}
                                    </label>
                                    <Select
                                        value={filters.employee_id}
                                        onValueChange={(value) => setFilters({ ...filters, employee_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('All Employees')} />
                                        </SelectTrigger>
                                        <SelectContent searchable={true}>
                                            <SelectItem value="all">{t('All Employees')}</SelectItem>
                                            {users?.map((employee: any) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.name}
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
                        )}
                    </CardContent>
                )}

                {/* Table Content */}
                <CardContent className="p-0">
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={(terminations as any)?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={UserXIcon}
                                            title={t('No Terminations found')}
                                            description={t('Get started by creating your first Termination.')}
                                            hasFilters={
                                                !!(
                                                    filters.name ||
                                                    (filters.employee_id !== 'all' && filters.employee_id)
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-terminations"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Termination')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {(terminations as any)?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {(terminations as any)?.data?.map((termination: Termination) => (
                                        <Card
                                            key={termination.id}
                                            className="relative flex h-full min-w-0 flex-col overflow-hidden p-0 transition-all duration-200 hover:shadow-lg"
                                        >
                                            {/* Header */}
                                            <div className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-transparent p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                                                        <UserXIcon className="h-6 w-6 text-foreground" />
                                                    </div>
                                                    <h3 className="truncate text-lg font-semibold">
                                                        {termination.employee?.name || 'Unknown Employee'}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="min-h-0 flex-1 p-4">
                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Notice Date')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {termination.notice_date
                                                                ? formatDate(termination.notice_date)
                                                                : '-'}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Termination Date')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {termination.termination_date
                                                                ? formatDate(termination.termination_date)
                                                                : '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Termination Type')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {termination.termination_type?.termination_type || '-'}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Status')}
                                                        </p>
                                                        <span
                                                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                                termination.status === 'pending'
                                                                    ? 'bg-muted text-foreground'
                                                                    : termination.status === 'approved'
                                                                      ? 'bg-muted text-foreground'
                                                                      : termination.status === 'rejected'
                                                                        ? 'bg-muted text-destructive'
                                                                        : 'bg-muted text-foreground'
                                                            }`}
                                                        >
                                                            {t(
                                                                termination.status?.charAt(0).toUpperCase() +
                                                                    termination.status?.slice(1) || 'Pending'
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Document')}
                                                        </p>
                                                        {termination.document ? (
                                                            <a
                                                                href={getImagePath(termination.document)}
                                                                target="_blank"
                                                                className="flex items-center gap-1 text-xs text-foreground hover:text-foreground"
                                                            >
                                                                <FileImage className="h-3 w-3" />
                                                                {t('View Document')}
                                                            </a>
                                                        ) : (
                                                            <p className="text-xs font-medium">-</p>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Approved By')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {termination.approved_by?.name || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions Footer */}
                                            <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 justify-end gap-2 border-t p-3">
                                                <TooltipProvider>
                                                    {auth.user?.permissions?.includes('view-terminations') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setViewingItem(termination)}
                                                                    className="h-9 w-9 p-0 text-foreground hover:text-foreground"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{t('View')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    {auth.user?.permissions?.includes('manage-termination-status') &&
                                                        termination.status === 'pending' && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openStatusModal(termination)}
                                                                        className="h-9 w-9 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <Play className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Status')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    {auth.user?.permissions?.includes('edit-terminations') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openModal('edit', termination)}
                                                                    className="h-9 w-9 p-0 text-foreground hover:text-foreground"
                                                                >
                                                                    <EditIcon className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{t('Edit')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    {auth.user?.permissions?.includes('delete-terminations') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openDeleteDialog(termination.id)}
                                                                    className="h-9 w-9 p-0 text-destructive hover:text-destructive"
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
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <NoRecordsFound
                                    icon={UserXIcon}
                                    title={t('No Terminations found')}
                                    description={t('Get started by creating your first Termination.')}
                                    hasFilters={
                                        !!(filters.name || (filters.employee_id !== 'all' && filters.employee_id))
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-terminations"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Termination')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={(terminations as any) || { data: [], links: [], meta: {} }}
                        routeName="hrm.terminations.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditTermination termination={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Termination')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />

            <Dialog open={statusModalState.isOpen} onOpenChange={closeStatusModal}>
                {statusModalState.termination && (
                    <TerminationStatusModal termination={statusModalState.termination} onSuccess={closeStatusModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <TerminationView termination={viewingItem} />}
            </Dialog>
        </AuthenticatedLayout>
    );
}
