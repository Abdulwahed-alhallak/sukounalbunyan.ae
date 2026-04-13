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
import { Plus, Edit as EditIcon, Trash2, Eye, Tag as TagIcon, Download, FileImage, ShieldAlert } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditAward from './Edit';
import View from './View';
import { StatusUpdate } from './StatusUpdate';

import NoRecordsFound from '@/components/no-records-found';
import { Award, AwardsIndexProps, AwardFilters, AwardModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { awards = [], auth, employees = [], awardTypes } = usePage<AwardsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<AwardFilters>({
        name: urlParams.get('name') || '',
        employee_id: urlParams.get('employee_id') || '',
        award_type_id: urlParams.get('award_type_id') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<AwardModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<Award | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.awards.destroy',
        defaultMessage: t('Are you sure you want to delete this award?'),
    });

    const handleFilter = () => {
        router.get(
            route('hrm.awards.index'),
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
            route('hrm.awards.index'),
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
            award_type_id: '',
        });
        router.get(route('hrm.awards.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: Award | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'employee.name',
            header: t('Employee'),
            sortable: false,
            render: (value: any, row: any) => row.employee?.name || '-',
        },
        {
            key: 'awardType.name',
            header: t('Award Type'),
            sortable: false,
            render: (value: any, row: any) => row.awardType?.name || '-',
        },
        {
            key: 'award_date',
            header: t('Award Date'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'certificate',
            header: t('Certificate'),
            sortable: false,
            render: (value: string) =>
                value ? (
                    <a href={getImagePath(value)} target="_blank" className="text-foreground hover:text-foreground">
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
            render: (value: any, row: any) => {
                const statusMap: Record<string, { label: string; color: string }> = {
                    pending: { label: t('Pending'), color: 'bg-warning/20 text-warning' },
                    approved: { label: t('Approved'), color: 'bg-success/20 text-success' },
                    rejected: { label: t('Rejected'), color: 'bg-destructive/20 text-destructive' },
                };
                const statusInfo = statusMap[row.status] || { label: row.status, color: 'bg-muted' };

                const managerStatusMap: Record<string, { label: string; color: string }> = {
                    pending: { label: t('Mgr Pending'), color: 'bg-warning/20 text-warning' },
                    approved: { label: t('Mgr Approved'), color: 'bg-success/20 text-success' },
                    rejected: { label: t('Mgr Rejected'), color: 'bg-destructive/20 text-destructive' },
                };
                // Assuming isMultiTierEnabled can be checked here, or just render it if it's available
                const isMultiTier = auth.user?.company_settings?.enable_multi_tier_approval === 'on' || true;

                return (
                    <div className="flex flex-col gap-1">
                        <span className={`w-fit rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                        {isMultiTier && row.manager_status && (
                            <span
                                className={`w-fit rounded-full px-2 py-1 text-[10px] font-medium ${managerStatusMap[row.manager_status]?.color || 'bg-muted'}`}
                            >
                                {managerStatusMap[row.manager_status]?.label}
                            </span>
                        )}
                    </div>
                );
            },
        },
        ...(auth.user?.permissions?.some((p: string) => ['view-awards', 'edit-awards', 'delete-awards'].includes(p))
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, award: Award) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('edit-awards') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('status' as any, award)}
                                                  className="h-8 w-8 p-0 text-foreground hover:text-success"
                                              >
                                                  <ShieldAlert className="h-4 w-4" />
                                              </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>{t('Update Status')}</p>
                                          </TooltipContent>
                                      </Tooltip>
                                  )}
                                  {auth.user?.permissions?.includes('view-awards') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(award)}
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
                                  {auth.user?.permissions?.includes('edit-awards') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', award)}
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
                                  {auth.user?.permissions?.includes('delete-awards') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(award.id)}
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
            breadcrumbs={[{ label: t('Hrm'), url: route('hrm.index') }, { label: t('Awards') }]}
            pageTitle={t('Manage Awards')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-awards') && (
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
            <Head title={t('Awards')} />

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
                                placeholder={t('Search Awards...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="hrm.awards.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector routeName="hrm.awards.index" filters={{ ...filters, view: viewMode }} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
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
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Award Type')}
                                </label>
                                <Select
                                    value={filters.award_type_id || 'all'}
                                    onValueChange={(value) =>
                                        setFilters({ ...filters, award_type_id: value === 'all' ? '' : value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('All Award Types')} />
                                    </SelectTrigger>
                                    <SelectContent searchable={true}>
                                        <SelectItem value="all">{t('All Award Types')}</SelectItem>
                                        {awardTypes?.map((type: any) => (
                                            <SelectItem key={type.id} value={type.id.toString()}>
                                                {type.name}
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

                {/* Table Content */}
                <CardContent className="p-0">
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={awards?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={TagIcon}
                                            title={t('No Awards found')}
                                            description={t('Get started by creating your first Award.')}
                                            hasFilters={
                                                !!(filters.name || filters.employee_id || filters.award_type_id)
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-awards"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Award')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {awards?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {awards?.data?.map((award) => (
                                        <Card
                                            key={award.id}
                                            className="relative flex h-full min-w-0 flex-col overflow-hidden p-0 transition-all duration-200 hover:shadow-lg"
                                        >
                                            {/* Header */}
                                            <div className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-transparent p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                                                        <TagIcon className="h-6 w-6 text-foreground" />
                                                    </div>
                                                    <h3 className="truncate text-lg font-semibold">
                                                        {award.employee?.name || 'Unknown Employee'}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="min-h-0 flex-1 p-4">
                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Award Type')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {award.awardType?.name || '-'}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Award Date')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {award.award_date ? formatDate(award.award_date) : '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                        {t('Certificate')}
                                                    </p>
                                                    {award.certificate ? (
                                                        <a
                                                            href={getImagePath(award.certificate)}
                                                            target="_blank"
                                                            className="flex items-center gap-1 text-xs text-foreground hover:text-foreground"
                                                        >
                                                            <FileImage className="h-3 w-3" />
                                                            {t('View Certificate')}
                                                        </a>
                                                    ) : (
                                                        <p className="text-xs font-medium">-</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions Footer */}
                                            <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 justify-end gap-2 border-t p-3">
                                                <TooltipProvider>
                                                    {auth.user?.permissions?.includes('view-awards') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setViewingItem(award)}
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
                                                    {auth.user?.permissions?.includes('edit-awards') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openModal('status' as any, award)}
                                                                    className="h-9 w-9 p-0 text-foreground hover:text-success"
                                                                >
                                                                    <ShieldAlert className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{t('Update Status')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    {auth.user?.permissions?.includes('edit-awards') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openModal('edit', award)}
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
                                                    {auth.user?.permissions?.includes('delete-awards') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openDeleteDialog(award.id)}
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
                                    title={t('No Awards found')}
                                    description={t('Get started by creating your first Award.')}
                                    hasFilters={!!(filters.name || filters.employee_id || filters.award_type_id)}
                                    onClearFilters={clearFilters}
                                    createPermission="create-awards"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Award')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={awards || { data: [], links: [], meta: {} }}
                        routeName="hrm.awards.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen && modalState.mode !== 'status'} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditAward award={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            {modalState.mode === 'status' && modalState.data && (
                <StatusUpdate
                    open={modalState.isOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    award={modalState.data as any}
                    auth={auth}
                    globalSettings={auth.user?.company_settings}
                    isManager={false}
                />
            )}

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View award={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Award')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
