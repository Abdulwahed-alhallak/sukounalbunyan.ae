import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit as EditIcon, Trash2, Eye, UserCheck as UserCheckIcon, Download, FileImage } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import Create from './Create';
import EditCandidateOnboarding from './Edit';
import View from './View';
import NoRecordsFound from '@/components/no-records-found';
import {
    CandidateOnboarding,
    CandidateOnboardingsIndexProps,
    CandidateOnboardingFilters,
    CandidateOnboardingModalState,
} from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const {
        candidateonboardings,
        auth,
        candidates,
        onboardingchecklists,
        users = [],
    } = usePage<CandidateOnboardingsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<CandidateOnboardingFilters>({
        search: urlParams.get('search') || '',
        candidate_id: urlParams.get('candidate_id') || 'all',
        checklist_id: urlParams.get('checklist_id') || 'all',
        buddy_employee_id: urlParams.get('buddy_employee_id') || 'all',
        status: urlParams.get('status') || '',
        start_date_from: urlParams.get('start_date_from') || '',
        start_date_to: urlParams.get('start_date_to') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<CandidateOnboardingModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<CandidateOnboarding | null>(null);
    const [filteredChecklists, setFilteredChecklists] = useState(onboardingchecklists || []);
    const [filteredBuddyEmployees, setFilteredBuddyEmployees] = useState(users || []);
    const [showFilters, setShowFilters] = useState(false);

    // Handle dependent dropdown for checklist filters
    useEffect(() => {
        if (filters.candidate_id && filters.candidate_id !== 'all') {
            // Fetch checklists for selected candidate
            fetch(route('recruitment.candidates.checklists', filters.candidate_id))
                .then((response) => response.json())
                .then((data) => {
                    setFilteredChecklists(data);
                    // Clear checklist if it doesn't belong to selected candidate
                    if (filters.checklist_id && filters.checklist_id !== 'all') {
                        const checklistExists = data.find((sub: any) => sub.id.toString() === filters.checklist_id);
                        if (!checklistExists) {
                            setFilters((prev) => ({ ...prev, checklist_id: 'all' }));
                        }
                    }
                })
                .catch(() => setFilteredChecklists([]));
        } else {
            setFilteredChecklists(onboardingchecklists || []);
            setFilters((prev) => ({ ...prev, checklist_id: 'all' }));
        }
    }, [filters.candidate_id]);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'recruitment.candidate-onboardings.destroy',
        defaultMessage: t('Are you sure you want to delete this candidate onboarding?'),
    });

    const handleFilter = () => {
        router.get(
            route('recruitment.candidate-onboardings.index'),
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
            route('recruitment.candidate-onboardings.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            candidate_id: 'all',
            checklist_id: 'all',
            buddy_employee_id: 'all',
            status: '',
            start_date_from: '',
            start_date_to: '',
        });
        router.get(route('recruitment.candidate-onboardings.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: CandidateOnboarding | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'candidate.name',
            header: t('Candidate'),
            sortable: true,
            render: (value: any, row: any) =>
                row.candidate ? (
                    <div>
                        <div className="font-medium">{row.candidate.name}</div>
                        <div className="text-xs text-muted-foreground">{row.candidate.email}</div>
                    </div>
                ) : (
                    '-'
                ),
        },
        {
            key: 'checklist.name',
            header: t('Checklist Name'),
            sortable: true,
            render: (value: any, row: any) => row.checklist?.name || '-',
        },
        {
            key: 'start_date',
            header: t('Start Date'),
            sortable: true,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'buddy.name',
            header: t('Buddy Name'),
            sortable: false,
            render: (value: any, row: any) => row.buddy?.name || '-',
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: string) => {
                const getStatusBadge = (status: string) => {
                    switch (status) {
                        case 'Pending':
                            return 'bg-muted text-foreground';
                        case 'In Progress':
                            return 'bg-muted text-foreground';
                        case 'Completed':
                            return 'bg-muted text-foreground';
                        default:
                            return 'bg-muted text-foreground';
                    }
                };
                return <span className={`rounded-full px-2 py-1 text-sm ${getStatusBadge(value)}`}>{t(value)}</span>;
            },
        },
        {
            key: 'created_at',
            header: t('Created'),
            sortable: true,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-candidate-onboardings', 'edit-candidate-onboardings', 'delete-candidate-onboardings'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, candidateonboarding: CandidateOnboarding) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('view-candidate-onboardings') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(candidateonboarding)}
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
                                  {auth.user?.permissions?.includes('edit-candidate-onboardings') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', candidateonboarding)}
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
                                  {auth.user?.permissions?.includes('delete-candidate-onboardings') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(candidateonboarding.id)}
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
                { label: t('Candidate Onboarding') },
            ]}
            pageTitle={t('Manage Candidate Onboarding')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-candidate-onboardings') && (
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
            <Head title={t('Candidate Onboarding')} />

            {/* Main Content Card */}
            <Card className="shadow-sm">
                {/* Search & Controls Header */}
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.search}
                                onChange={(value) => setFilters({ ...filters, search: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search Candidate Onboarding...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="recruitment.candidate-onboardings.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="recruitment.candidate-onboardings.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.start_date_from,
                                        filters.start_date_to,
                                        filters.buddy_employee_id !== 'all' ? filters.buddy_employee_id : '',
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
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Start Date From')}
                                </label>
                                <DatePicker
                                    value={filters.start_date_from}
                                    onChange={(value) => setFilters({ ...filters, start_date_from: value })}
                                    placeholder={t('Start Date From')}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Start Date To')}
                                </label>
                                <DatePicker
                                    value={filters.start_date_to}
                                    onChange={(value) => setFilters({ ...filters, start_date_to: value })}
                                    placeholder={t('Start Date To')}
                                    minDate={filters.start_date_from}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Buddy')}</label>
                                <Select
                                    value={filters.buddy_employee_id}
                                    onValueChange={(value) => setFilters({ ...filters, buddy_employee_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('All Buddys')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('All Buddys')}</SelectItem>
                                        {filteredBuddyEmployees?.map((buddy: any) => (
                                            <SelectItem key={buddy.id} value={buddy.id.toString()}>
                                                {buddy.name}
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
                                        <SelectItem value="Pending">{t('Pending')}</SelectItem>
                                        <SelectItem value="In Progress">{t('In Progress')}</SelectItem>
                                        <SelectItem value="Completed">{t('Completed')}</SelectItem>
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
                                    data={candidateonboardings?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={UserCheckIcon}
                                            title={t('No Candidate Onboarding found')}
                                            description={t('Get started by creating your first Candidate Onboarding.')}
                                            hasFilters={
                                                !!(
                                                    filters.search ||
                                                    (filters.candidate_id !== 'all' && filters.candidate_id) ||
                                                    (filters.checklist_id !== 'all' && filters.checklist_id) ||
                                                    (filters.buddy_employee_id !== 'all' &&
                                                        filters.buddy_employee_id) ||
                                                    filters.status
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-candidate-onboardings"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Candidate Onboarding')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {candidateonboardings?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {candidateonboardings?.data?.map((candidateonboarding) => {
                                        const getStatusBadge = (status: string) => {
                                            switch (status) {
                                                case 'Pending':
                                                    return 'bg-muted text-foreground';
                                                case 'In Progress':
                                                    return 'bg-muted text-foreground';
                                                case 'Completed':
                                                    return 'bg-muted text-foreground';
                                                default:
                                                    return 'bg-muted text-foreground';
                                            }
                                        };

                                        return (
                                            <Card
                                                key={candidateonboarding.id}
                                                className="flex h-full flex-col transition-shadow duration-200 hover:shadow-md"
                                            >
                                                <div className="bg-muted/50/50 flex items-center gap-3 border-b p-3">
                                                    <div className="flex-shrink-0 rounded-lg bg-foreground/10 p-2">
                                                        <UserCheckIcon className="h-5 w-5 text-foreground" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-sm font-semibold leading-tight">
                                                            {candidateonboarding.candidate?.name || 'Unknown'}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            {candidateonboarding.candidate?.email || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-3 p-3">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Checklist')}
                                                        </p>
                                                        <p className="font-medium">
                                                            {candidateonboarding.checklist?.name || '-'}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Start Date')}
                                                            </p>
                                                            <p className="font-medium">
                                                                {candidateonboarding.start_date
                                                                    ? formatDate(candidateonboarding.start_date)
                                                                    : '-'}
                                                            </p>
                                                        </div>
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Buddy')}
                                                            </p>
                                                            <p className="font-medium">
                                                                {candidateonboarding.buddy?.name || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Created')}
                                                        </p>
                                                        <p className="font-medium">
                                                            {candidateonboarding.created_at
                                                                ? formatDate(candidateonboarding.created_at)
                                                                : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 items-center justify-between border-t p-3">
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs ${getStatusBadge(candidateonboarding.status)}`}
                                                    >
                                                        {t(candidateonboarding.status)}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <TooltipProvider>
                                                            {auth.user?.permissions?.includes(
                                                                'view-candidate-onboardings'
                                                            ) && (
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                setViewingItem(candidateonboarding)
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
                                                                'edit-candidate-onboardings'
                                                            ) && (
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                openModal('edit', candidateonboarding)
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
                                                                'delete-candidate-onboardings'
                                                            ) && (
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                openDeleteDialog(candidateonboarding)
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
                                    icon={UserCheckIcon}
                                    title={t('No Candidate Onboarding found')}
                                    description={t('Get started by creating your first Candidate Onboarding.')}
                                    hasFilters={
                                        !!(
                                            filters.search ||
                                            (filters.candidate_id !== 'all' && filters.candidate_id) ||
                                            (filters.checklist_id !== 'all' && filters.checklist_id) ||
                                            (filters.buddy_employee_id !== 'all' && filters.buddy_employee_id) ||
                                            filters.status
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-candidate-onboardings"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Candidate Onboarding')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={candidateonboardings || { data: [], links: [], meta: {} }}
                        routeName="recruitment.candidate-onboardings.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditCandidateOnboarding candidateonboarding={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View candidateonboarding={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Candidate Onboarding')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
