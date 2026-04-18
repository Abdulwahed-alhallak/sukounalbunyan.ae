import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
    Plus,
    Edit as EditIcon,
    Trash2,
    Eye,
    Tag as TagIcon,
    Download,
    FileImage,
    Check,
    X,
    ShieldAlert,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditResignation from './Edit';
import { StatusUpdate } from './StatusUpdate';
import ResignationView from './View';

import NoRecordsFound from '@/components/no-records-found';
import { Resignation, ResignationsIndexProps, ResignationFilters, ResignationModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';
import { isMultiTierApprovalEnabled } from '../../utils/multi-tier-approval';

export default function Index() {
    const { t } = useTranslation();
    const { resignations, auth, employees = [] } = usePage<ResignationsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);
    const isMultiTierApproval = isMultiTierApprovalEnabled(auth.user?.company_settings);

    const [filters, setFilters] = useState<ResignationFilters>({
        name: urlParams.get('name') || '',
        employee_id: urlParams.get('employee_id') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<ResignationModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [statusModalState, setStatusModalState] = useState<{
        isOpen: boolean;
        resignation: Resignation | null;
        isManager?: boolean;
    }>({
        isOpen: false,
        resignation: null,
        isManager: false,
    });
    const [viewingItem, setViewingItem] = useState<Resignation | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.resignations.destroy',
        defaultMessage: t('Are you sure you want to delete this resignation?'),
    });

    const handleFilter = () => {
        router.get(
            route('hrm.resignations.index'),
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
            route('hrm.resignations.index'),
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
            employee_id: '',
        });
        router.get(route('hrm.resignations.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: Resignation | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const openStatusModal = (resignation: Resignation, isManager: boolean = false) => {
        setStatusModalState({ isOpen: true, resignation, isManager });
    };

    const closeStatusModal = () => {
        setStatusModalState({ isOpen: false, resignation: null });
    };

    const tableColumns = [
        {
            key: 'employee_id',
            header: t('Employee'),
            sortable: true,
            render: (_: any, resignation: Resignation) => resignation.employee?.name || '-',
        },
        {
            key: 'last_working_date',
            header: t('Last Working Date'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'reason',
            header: t('Reason'),
            sortable: false,
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: string, row: Resignation) => {
                const statusColors = {
                    pending: 'bg-warning/20 text-warning',
                    accepted: 'bg-success/20 text-success',
                    rejected: 'bg-destructive/20 text-destructive',
                };

                const managerStatusColors = {
                    pending: 'bg-warning/20 text-warning',
                    accepted: 'bg-success/20 text-success',
                    rejected: 'bg-destructive/20 text-destructive',
                };

                return (
                    <div className="flex flex-col gap-1">
                        <span
                            className={`w-fit rounded-full px-2 py-1 text-xs font-medium ${statusColors[value as keyof typeof statusColors] || 'bg-muted'}`}
                        >
                            {t(value?.charAt(0).toUpperCase() + value?.slice(1) || 'Unknown')}
                        </span>
                        {isMultiTierApproval && row.manager_status && (
                            <span
                                className={`w-fit rounded-full px-2 py-1 text-[10px] font-medium ${managerStatusColors[row.manager_status as keyof typeof managerStatusColors] || 'bg-muted'}`}
                            >
                                Mgr {t(row.manager_status.charAt(0).toUpperCase() + row.manager_status.slice(1))}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'document',
            header: t('Document'),
            sortable: false,
            render: (_: any, resignation: Resignation) =>
                resignation.document ? (
                    <a
                        href={getImagePath(resignation.document)}
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
            key: 'approved_by',
            header: t('Approved By'),
            sortable: false,
            render: (_: any, resignation: Resignation) => resignation.approved_by?.name || '-',
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['manage-resignation-status', 'view-resignations', 'edit-resignations', 'delete-resignations'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, resignation: Resignation) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('manage-resignation-status') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openStatusModal(resignation)}
                                                  className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                              >
                                                  <ShieldAlert className="h-4 w-4" />
                                              </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>{t('Update Status')}</p>
                                          </TooltipContent>
                                      </Tooltip>
                                  )}
                                  {auth.user?.permissions?.includes('view-resignations') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(resignation)}
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
                                  {auth.user?.permissions?.includes('edit-resignations') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', resignation)}
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
                                  {auth.user?.permissions?.includes('delete-resignations') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(resignation.id)}
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
            breadcrumbs={[{ label: t('Hrm') }, { label: t('Resignations') }]}
            pageTitle={t('Manage Resignations')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-resignations') && (
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
            <Head title={t('Resignations')} />

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
                                placeholder={t('Search Resignations...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="hrm.resignations.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="hrm.resignations.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
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
                                        value={filters.employee_id || 'all'}
                                        onValueChange={(value) =>
                                            setFilters({ ...filters, employee_id: value === 'all' ? '' : value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('All Employees')} />
                                        </SelectTrigger>
                                        <SelectContent searchable={true}>
                                            <SelectItem value="all">{t('All Employees')}</SelectItem>
                                            {employees?.map((employee: any) => (
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
                                    data={(resignations as any)?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={TagIcon}
                                            title={t('No Resignations found')}
                                            description={t('Get started by creating your first Resignation.')}
                                            hasFilters={!!filters.name}
                                            onClearFilters={clearFilters}
                                            createPermission="create-resignations"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Resignation')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {(resignations as any)?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {(resignations as any)?.data?.map((resignation: Resignation) => (
                                        <Card
                                            key={resignation.id}
                                            className="relative flex h-full min-w-0 flex-col overflow-hidden p-0 transition-all duration-200 hover:shadow-lg"
                                        >
                                            {/* Header */}
                                            <div className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-transparent p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                                                        <TagIcon className="h-6 w-6 text-foreground" />
                                                    </div>
                                                    <h3 className="truncate text-lg font-semibold">
                                                        {resignation.employee?.name || 'Unknown Employee'}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="min-h-0 flex-1 p-4">
                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Last Working Date')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {resignation.last_working_date
                                                                ? formatDate(resignation.last_working_date)
                                                                : '-'}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Status')}
                                                        </p>
                                                        <div className="flex flex-col gap-1">
                                                            <span
                                                                className={`inline-block w-fit rounded-full px-2 py-1 text-xs font-medium ${
                                                                    resignation.status === 'pending'
                                                                        ? 'bg-warning/20 text-warning'
                                                                        : resignation.status === 'accepted'
                                                                          ? 'bg-success/20 text-success'
                                                                          : resignation.status === 'rejected'
                                                                            ? 'bg-destructive/20 text-destructive'
                                                                            : 'bg-muted'
                                                                }`}
                                                            >
                                                                {t(
                                                                    resignation.status?.charAt(0).toUpperCase() +
                                                                        resignation.status?.slice(1) || 'Unknown'
                                                                )}
                                                            </span>
                                                            {isMultiTierApproval &&
                                                                resignation.manager_status && (
                                                                    <span
                                                                        className={`w-fit rounded-full px-2 py-1 text-[10px] font-medium ${
                                                                            resignation.manager_status === 'pending'
                                                                                ? 'bg-warning/20 text-warning'
                                                                                : resignation.manager_status ===
                                                                                    'accepted'
                                                                                  ? 'bg-success/20 text-success'
                                                                                  : resignation.manager_status ===
                                                                                      'rejected'
                                                                                    ? 'bg-destructive/20 text-destructive'
                                                                                    : 'bg-muted'
                                                                        }`}
                                                                    >
                                                                        Mgr{' '}
                                                                        {t(
                                                                            resignation.manager_status
                                                                                .charAt(0)
                                                                                .toUpperCase() +
                                                                                resignation.manager_status.slice(1)
                                                                        )}
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Document')}
                                                        </p>
                                                        {resignation.document ? (
                                                            <a
                                                                href={getImagePath(resignation.document)}
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
                                                            {resignation.approved_by?.name || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions Footer */}
                                            <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 justify-end gap-2 border-t p-3">
                                                <TooltipProvider>
                                                    {auth.user?.permissions?.includes('view-resignations') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setViewingItem(resignation)}
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
                                                    {auth.user?.permissions?.includes('manage-resignation-status') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openStatusModal(resignation)}
                                                                    className="h-9 w-9 p-0 text-foreground hover:text-foreground"
                                                                >
                                                                    <ShieldAlert className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{t('Update Status')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    {auth.user?.permissions?.includes('edit-resignations') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openModal('edit', resignation)}
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
                                                    {auth.user?.permissions?.includes('delete-resignations') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openDeleteDialog(resignation.id)}
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
                                    icon={TagIcon}
                                    title={t('No Resignations found')}
                                    description={t('Get started by creating your first Resignation.')}
                                    hasFilters={!!filters.name}
                                    onClearFilters={clearFilters}
                                    createPermission="create-resignations"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Resignation')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={(resignations as any) || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }}
                        routeName="hrm.resignations.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditResignation resignation={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Resignation')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />

            <StatusUpdate
                open={statusModalState.isOpen}
                onOpenChange={(open) => !open && closeStatusModal()}
                resignation={statusModalState.resignation as any}
                auth={auth}
                globalSettings={auth.user?.company_settings}
                isManager={statusModalState.isManager || false}
            />

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <ResignationView resignation={viewingItem} />}
            </Dialog>
        </AuthenticatedLayout>
    );
}
