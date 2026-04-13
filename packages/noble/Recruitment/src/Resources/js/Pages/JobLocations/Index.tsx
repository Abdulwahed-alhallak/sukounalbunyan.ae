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
import { Plus, Edit as EditIcon, Trash2, Eye, MapPin as MapPinIcon, Download, FileImage } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditJobLocation from './Edit';
import View from './View';
import NoRecordsFound from '@/components/no-records-found';
import { JobLocation, JobLocationsIndexProps, JobLocationFilters, JobLocationModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { joblocations, auth } = usePage<JobLocationsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<JobLocationFilters>({
        name: urlParams.get('name') || '',
        city: urlParams.get('city') || '',
        state: urlParams.get('state') || '',
        country: urlParams.get('country') || '',
        status: urlParams.get('status') || '',
        remote_work: urlParams.get('remote_work') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<JobLocationModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<JobLocation | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'recruitment.job-locations.destroy',
        defaultMessage: t('Are you sure you want to delete this job location?'),
    });

    const handleFilter = () => {
        router.get(
            route('recruitment.job-locations.index'),
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
            route('recruitment.job-locations.index'),
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
            city: '',
            state: '',
            country: '',
            status: '',
            remote_work: '',
        });
        router.get(route('recruitment.job-locations.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: JobLocation | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: true,
        },
        {
            key: 'address',
            header: t('Address'),
            sortable: false,
            render: (value: any, row: any) => (
                <span className={`text-sm ${row.remote_work ? 'font-medium text-foreground' : ''}`}>
                    {row.remote_work ? t('Remote Work') : row.address || '-'}
                </span>
            ),
        },
        {
            key: 'country',
            header: t('Country'),
            sortable: true,
        },
        {
            key: 'type',
            header: t('Type'),
            sortable: false,
            render: (value: any, row: any) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${row.remote_work ? 'bg-muted text-foreground' : 'bg-muted text-foreground'}`}
                >
                    {row.remote_work ? t('Remote') : t('On-site')}
                </span>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: boolean) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${value ? 'bg-muted text-foreground' : 'bg-muted text-destructive'}`}
                >
                    {value ? t('Active') : t('Inactive')}
                </span>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-job-locations', 'edit-job-locations', 'delete-job-locations'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, joblocation: JobLocation) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('view-job-locations') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(joblocation)}
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
                                  {auth.user?.permissions?.includes('edit-job-locations') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', joblocation)}
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
                                  {auth.user?.permissions?.includes('delete-job-locations') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(joblocation.id)}
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
            breadcrumbs={[{ label: t('Recruitment'), url: route('recruitment.index') }, { label: t('Job Locations') }]}
            pageTitle={t('Manage Job Locations')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-job-locations') && (
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
            <Head title={t('Job Locations')} />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.name}
                                onChange={(value) => setFilters({ ...filters, name: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search Job Locations...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="recruitment.job-locations.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="recruitment.job-locations.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [filters.status, filters.remote_work].filter(
                                        (f) => f !== '' && f !== null && f !== undefined
                                    ).length;
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

                {showFilters && (
                    <CardContent className="bg-muted/50/30 border-b p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Type')}</label>
                                <Select
                                    value={filters.remote_work || ''}
                                    onValueChange={(value) => setFilters({ ...filters, remote_work: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">{t('Remote')}</SelectItem>
                                        <SelectItem value="0">{t('On-site')}</SelectItem>
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
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={joblocations?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={MapPinIcon}
                                            title={t('No Job Locations found')}
                                            description={t('Get started by creating your first Job Location.')}
                                            hasFilters={
                                                !!(
                                                    filters.name ||
                                                    filters.city ||
                                                    filters.state ||
                                                    filters.country ||
                                                    filters.status
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-job-locations"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Job Location')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {joblocations?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {joblocations?.data?.map((joblocation) => (
                                        <Card
                                            key={joblocation.id}
                                            className="relative flex h-full min-w-0 flex-col overflow-hidden p-0 transition-all duration-200 hover:shadow-lg"
                                        >
                                            <div className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-transparent p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-foreground/10 p-2">
                                                        <MapPinIcon className="h-5 w-5 text-foreground" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-sm font-semibold text-foreground">
                                                            {joblocation.name}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            {joblocation.remote_work ? t('Remote') : t('On-site')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="min-h-0 flex-1 p-4">
                                                <div className="mb-4 grid grid-cols-1 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Address')}
                                                        </p>
                                                        <p
                                                            className={`font-medium ${joblocation.remote_work ? 'text-foreground' : 'text-foreground'}`}
                                                        >
                                                            {joblocation.remote_work
                                                                ? t('Remote Work')
                                                                : joblocation.address || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Country')}
                                                        </p>
                                                        <p className="font-medium">{joblocation.country || '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('City')}
                                                        </p>
                                                        <p className="font-medium">{joblocation.city || '-'}</p>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('State')}
                                                        </p>
                                                        <p className="font-medium">{joblocation.state || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 items-center justify-between border-t p-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs ${joblocation.status ? 'bg-muted text-foreground' : 'bg-muted text-destructive'}`}
                                                >
                                                    {joblocation.status ? t('Active') : t('Inactive')}
                                                </span>
                                                <div className="flex gap-2">
                                                    <TooltipProvider>
                                                        {auth.user?.permissions?.includes('view-job-locations') && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setViewingItem(joblocation)}
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
                                                        {auth.user?.permissions?.includes('edit-job-locations') && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openModal('edit', joblocation)}
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
                                                        {auth.user?.permissions?.includes('delete-job-locations') && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openDeleteDialog(joblocation.id)}
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
                                    ))}
                                </div>
                            ) : (
                                <NoRecordsFound
                                    icon={MapPinIcon}
                                    title={t('No Job Locations found')}
                                    description={t('Get started by creating your first Job Location.')}
                                    hasFilters={
                                        !!(
                                            filters.name ||
                                            filters.city ||
                                            filters.state ||
                                            filters.country ||
                                            filters.status
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-job-locations"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Job Location')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={joblocations || { data: [], links: [], meta: {} }}
                        routeName="recruitment.job-locations.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditJobLocation joblocation={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View joblocation={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Job Location')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
