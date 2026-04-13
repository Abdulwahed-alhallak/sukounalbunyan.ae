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
import {
    Plus,
    Edit as EditIcon,
    Trash2,
    Eye,
    FileCheck as FileCheckIcon,
    Download,
    FileImage,
    Play,
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
import EditAcknowledgment from './Edit';
import View from './View';
import StatusModal from './StatusModal';
import NoRecordsFound from '@/components/no-records-found';
import { Acknowledgment, AcknowledgmentsIndexProps, AcknowledgmentFilters, AcknowledgmentModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath, downloadFile } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { acknowledgments, auth, users = [], hrmdocuments } = usePage<AcknowledgmentsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<AcknowledgmentFilters>({
        acknowledgment_note: urlParams.get('acknowledgment_note') || '',
        employee_id: urlParams.get('employee_id') || '',
        document_id: urlParams.get('document_id') || '',
        status: urlParams.get('status') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<AcknowledgmentModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<Acknowledgment | null>(null);
    const [statusModalItem, setStatusModalItem] = useState<Acknowledgment | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.acknowledgments.destroy',
        defaultMessage: t('Are you sure you want to delete this acknowledgment?'),
    });

    const handleFilter = () => {
        router.get(
            route('hrm.acknowledgments.index'),
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
            route('hrm.acknowledgments.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            acknowledgment_note: '',
            employee_id: '',
            document_id: '',
            status: '',
        });
        router.get(route('hrm.acknowledgments.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: Acknowledgment | null = null) => {
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
            key: 'document.title',
            header: t('Document'),
            sortable: false,
            render: (value: any, row: any) => row.document?.title || '-',
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: any) => {
                const statusColors = {
                    pending: 'bg-muted text-foreground',
                    acknowledged: 'bg-muted text-foreground',
                };
                const statusText = value === 'pending' ? 'Pending' : value === 'acknowledged' ? 'Acknowledged' : value;
                return (
                    <span
                        className={`rounded-full px-2 py-1 text-sm ${statusColors[value as keyof typeof statusColors] || 'bg-muted text-foreground'}`}
                    >
                        {t(statusText)}
                    </span>
                );
            },
        },
        {
            key: 'acknowledged_at',
            header: t('Acknowledged At'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'assignedBy.name',
            header: t('Assigned By'),
            sortable: false,
            render: (value: any, row: any) => row.assigned_by?.name || '-',
        },
        ...(auth.user?.permissions?.some((p: string) =>
            [
                'view-acknowledgments',
                'manage-acknowledgment-status',
                'download-acknowledgment',
                'edit-acknowledgments',
                'delete-acknowledgments',
            ].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, ackItem: Acknowledgment) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('manage-acknowledgment-status') &&
                                      ackItem.status !== 'acknowledged' && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => setStatusModalItem(ackItem)}
                                                      className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                  >
                                                      <Play className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('Action')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                  {/* {auth.user?.permissions?.includes('download-acknowledgment') && ackItem.status === 'acknowledged' && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = getImagePath(ackItem.document?.document);
                                        link.download = ackItem.document?.title || 'document';
                                        link.click();
                                    }} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Download')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )} */}

                                  {ackItem.document?.document && (
                                      <>
                                          {auth.user?.permissions?.includes('download-acknowledgment') &&
                                              ackItem.document?.document &&
                                              ackItem.status === 'acknowledged' && (
                                                  <Tooltip delayDuration={0}>
                                                      <TooltipTrigger asChild>
                                                          <Button
                                                              variant="ghost"
                                                              size="sm"
                                                              onClick={() => {
                                                                  try {
                                                                      const link = getImagePath(
                                                                          ackItem.document?.document
                                                                      );
                                                                      downloadFile(link);
                                                                  } catch (error) {
                                                                      console.error('Download failed:', error);
                                                                      // Fallback: open in new tab
                                                                      window.open(
                                                                          getImagePath(ackItem.document?.document),
                                                                          '_blank'
                                                                      );
                                                                  }
                                                              }}
                                                              className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                          >
                                                              <Download className="h-4 w-4" />
                                                          </Button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                          <p>{t('Download')}</p>
                                                      </TooltipContent>
                                                  </Tooltip>
                                              )}
                                      </>
                                  )}

                                  {auth.user?.permissions?.includes('view-acknowledgments') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(ackItem)}
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

                                  {auth.user?.permissions?.includes('edit-acknowledgments') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', ackItem)}
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
                                  {auth.user?.permissions?.includes('delete-acknowledgments') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(ackItem.id)}
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
            breadcrumbs={[{ label: t('Hrm'), url: route('hrm.index') }, { label: t('Acknowledgments') }]}
            pageTitle={t('Manage Acknowledgments')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-acknowledgments') && (
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
            <Head title={t('Acknowledgments')} />

            {/* Main Content Card */}
            <Card className="shadow-sm">
                {/* Search & Controls Header */}
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.acknowledgment_note}
                                onChange={(value) => setFilters({ ...filters, acknowledgment_note: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search by employee, document...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="hrm.acknowledgments.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="hrm.acknowledgments.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.employee_id,
                                        filters.document_id,
                                        filters.status,
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {auth.user?.permissions?.includes('manage-employees') && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        {t('Employee')}
                                    </label>
                                    <Select
                                        value={filters.employee_id}
                                        onValueChange={(value) => setFilters({ ...filters, employee_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('Filter by Employee')} />
                                        </SelectTrigger>
                                        <SelectContent searchable={true}>
                                            {users?.map((item: any) => (
                                                <SelectItem key={item.id} value={item.id.toString()}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Document')}
                                </label>
                                <Select
                                    value={filters.document_id}
                                    onValueChange={(value) => setFilters({ ...filters, document_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Document')} />
                                    </SelectTrigger>
                                    <SelectContent searchable={true}>
                                        {hrmdocuments?.map((item: any) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.title}
                                            </SelectItem>
                                        ))}
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
                                        <SelectItem value="pending">{t('Pending')}</SelectItem>
                                        <SelectItem value="acknowledged">{t('Acknowledged')}</SelectItem>
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
                                    data={acknowledgments?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={FileCheckIcon}
                                            title={t('No Acknowledgments found')}
                                            description={t('Get started by creating your first Acknowledgment.')}
                                            hasFilters={
                                                !!(
                                                    filters.acknowledgment_note ||
                                                    filters.employee_id ||
                                                    filters.document_id ||
                                                    filters.status
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-acknowledgments"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Acknowledgment')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {acknowledgments?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {acknowledgments?.data?.map((acknowledgment) => (
                                        <Card
                                            key={acknowledgment.id}
                                            className="relative flex h-full min-w-0 flex-col overflow-hidden p-0 transition-all duration-200 hover:shadow-lg"
                                        >
                                            {/* Header */}
                                            <div className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-transparent p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
                                                        <FileCheckIcon className="h-6 w-6 text-foreground" />
                                                    </div>
                                                    <h3 className="truncate text-lg font-semibold">
                                                        {acknowledgment.employee?.name || 'Unknown Employee'}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="min-h-0 flex-1 p-4">
                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Document')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {acknowledgment.document?.title || '-'}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Assigned By')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {acknowledgment.assigned_by?.name || '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Status')}
                                                        </p>
                                                        <span
                                                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                                acknowledgment.status === 'pending'
                                                                    ? 'bg-muted text-foreground'
                                                                    : acknowledgment.status === 'acknowledged'
                                                                      ? 'bg-muted text-foreground'
                                                                      : 'bg-muted text-foreground'
                                                            }`}
                                                        >
                                                            {t(
                                                                acknowledgment.status === 'pending'
                                                                    ? 'Pending'
                                                                    : acknowledgment.status === 'acknowledged'
                                                                      ? 'Acknowledged'
                                                                      : acknowledgment.status || '-'
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Acknowledged At')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {acknowledgment.acknowledged_at
                                                                ? formatDate(acknowledgment.acknowledged_at)
                                                                : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions Footer */}
                                            <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 justify-end gap-2 border-t p-3">
                                                <TooltipProvider>
                                                    {auth.user?.permissions?.includes('manage-acknowledgment-status') &&
                                                        acknowledgment.status !== 'acknowledged' && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            setStatusModalItem(acknowledgment)
                                                                        }
                                                                        className="h-9 w-9 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <Play className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Action')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    {auth.user?.permissions?.includes('download-acknowledgment') &&
                                                        acknowledgment.status === 'acknowledged' && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const link = document.createElement('a');
                                                                            link.href = getImagePath(
                                                                                acknowledgment.document?.document
                                                                            );
                                                                            link.download =
                                                                                acknowledgment.document?.title ||
                                                                                'document';
                                                                            link.click();
                                                                        }}
                                                                        className="h-9 w-9 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Download')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    {auth.user?.permissions?.includes('view-acknowledgments') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setViewingItem(acknowledgment)}
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
                                                    {auth.user?.permissions?.includes('edit-acknowledgments') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openModal('edit', acknowledgment)}
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
                                                    {auth.user?.permissions?.includes('delete-acknowledgments') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openDeleteDialog(acknowledgment.id)}
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
                                    icon={FileCheckIcon}
                                    title={t('No Acknowledgments found')}
                                    description={t('Get started by creating your first Acknowledgment.')}
                                    hasFilters={
                                        !!(
                                            filters.acknowledgment_note ||
                                            filters.employee_id ||
                                            filters.document_id ||
                                            filters.status
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-acknowledgments"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Acknowledgment')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={acknowledgments || { data: [], links: [], meta: {} }}
                        routeName="hrm.acknowledgments.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditAcknowledgment acknowledgment={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View acknowledgment={viewingItem} />}
            </Dialog>

            <StatusModal acknowledgment={statusModalItem} onClose={() => setStatusModalItem(null)} />

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Acknowledgment')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
