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
    FileText as FileTextIcon,
    Download,
    FileImage,
    Play,
    CheckCircle,
    XCircle,
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
import EditLeaveApplication from './Edit';
import View from './View';
import StatusUpdate from './StatusUpdate';
import NoRecordsFound from '@/components/no-records-found';
import {
    LeaveApplication,
    LeaveApplicationsIndexProps,
    LeaveApplicationFilters,
    LeaveApplicationModalState,
} from './types';
import { Input } from '@/components/ui/input';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const {
        leaveapplications,
        auth,
        users = [],
        leavetypes,
        employees = [],
        isMultiTierEnabled,
    } = usePage<LeaveApplicationsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<LeaveApplicationFilters>({
        reason: urlParams.get('reason') || '',
        status: urlParams.get('status') || '',
        employee_id: urlParams.get('employee_id') || '',
        start_date: urlParams.get('start_date') || '',
        end_date: urlParams.get('end_date') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<LeaveApplicationModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<LeaveApplication | null>(null);
    const [statusModalItem, setStatusModalItem] = useState<LeaveApplication | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.leave-applications.destroy',
        defaultMessage: t('Are you sure you want to delete this leaveapplication?'),
    });

    const handleFilter = () => {
        router.get(
            route('hrm.leave-applications.index'),
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
            route('hrm.leave-applications.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            reason: '',
            status: '',
            employee_id: '',
            start_date: '',
            end_date: '',
        });
        router.get(route('hrm.leave-applications.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: LeaveApplication | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const openStatusModal = (leaveapplication: LeaveApplication) => {
        setStatusModalItem(leaveapplication);
    };

    const tableColumns = [
        {
            key: 'employee.name',
            header: t('Employee'),
            sortable: false,
            render: (value: any, row: any) => row.employee?.name || '-',
        },
        {
            key: 'leave_type.name',
            header: t('Leave Type'),
            sortable: false,
            render: (value: any, row: any) => (
                <div className="flex items-center gap-2">
                    <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: row.leave_type?.color || '#gray' }}
                    ></div>
                    <div className="flex flex-col">
                        <span>{row.leave_type?.name || '-'}</span>
                        <span
                            className={`w-fit rounded-full px-1.5 py-0.5 text-xs ${
                                row.leave_type?.is_paid ? 'bg-muted text-foreground' : 'bg-muted text-foreground'
                            }`}
                        >
                            {row.leave_type?.is_paid ? t('Paid') : t('Unpaid')}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'start_date',
            header: t('Start Date'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'end_date',
            header: t('End Date'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'total_days',
            header: t('Days'),
            sortable: false,
            render: (value: number) => value || '-',
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: string, leave: LeaveApplication) => {
                const statusColors = {
                    pending: 'bg-muted-foreground/20 text-muted-foreground border-border/20',
                    approved: 'bg-foreground/20 text-foreground border-foreground/20',
                    rejected: 'bg-destructive/20 text-destructive border-destructive/20',
                };

                if (isMultiTierEnabled) {
                    return (
                        <div className="flex w-24 flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="truncate text-muted-foreground">{t('Manager')}</span>
                                <span
                                    className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${statusColors[leave.manager_status as keyof typeof statusColors] || statusColors['pending']}`}
                                >
                                    {t(leave.manager_status || 'pending')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="truncate text-muted-foreground">{t('HR')}</span>
                                <span
                                    className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${statusColors[value as keyof typeof statusColors] || statusColors['pending']}`}
                                >
                                    {t(value?.charAt(0).toUpperCase() + value?.slice(1) || 'Unknown')}
                                </span>
                            </div>
                        </div>
                    );
                }

                return (
                    <span
                        className={`rounded-full px-2 py-1 text-sm font-black uppercase ${statusColors[value as keyof typeof statusColors] || statusColors['pending']}`}
                    >
                        {t(value?.charAt(0).toUpperCase() + value?.slice(1) || 'Unknown')}
                    </span>
                );
            },
        },
        {
            key: 'created_at',
            header: t('Applied On'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'attachment',
            header: t('Document'),
            sortable: false,
            render: (_: any, leaveapplication: LeaveApplication) =>
                leaveapplication.attachment ? (
                    <a
                        href={getImagePath(leaveapplication.attachment)}
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
        ...(auth.user?.permissions?.some((p: string) =>
            [
                'manage-leave-status',
                'view-leave-applications',
                'edit-leave-applications',
                'delete-leave-applications',
            ].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, leaveapplication: LeaveApplication) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {(auth.user?.permissions?.includes('manage-leave-status') ||
                                      (isMultiTierEnabled && leaveapplication.is_line_manager)) &&
                                      leaveapplication.status === 'pending' && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openStatusModal(leaveapplication)}
                                                      className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                  >
                                                      <Play className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('Manage Status')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                  {auth.user?.permissions?.includes('view-leave-applications') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(leaveapplication)}
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
                                  {auth.user?.permissions?.includes('edit-leave-applications') &&
                                      leaveapplication.status === 'pending' && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openModal('edit', leaveapplication)}
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
                                  {auth.user?.permissions?.includes('delete-leave-applications') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(leaveapplication.id)}
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
            breadcrumbs={[{ label: t('Hrm'), url: route('hrm.index') }, { label: t('LeaveApplications') }]}
            pageTitle={t('Manage Leave Applications')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-leave-applications') && (
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
            <Head title={t('LeaveApplications')} />

            <div className="space-y-8 duration-1000 animate-in fade-in">
                {/* Tactical KPI Board */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="premium-card from-muted/500/10 bg-gradient-to-br via-transparent to-transparent p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="bg-muted/500/20 flex h-10 w-10 items-center justify-center rounded-xl text-foreground">
                                <FileTextIcon className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Total Requests')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">{leaveapplications?.total || 0}</h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('All-Time Vectors')}</p>
                        </div>
                    </div>

                    <div className="premium-card bg-gradient-to-br from-foreground/10 via-transparent to-transparent p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-foreground/20 text-muted-foreground">
                                <Play className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Pending Ops')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {leaveapplications?.data?.filter((l) => l.status === 'pending').length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Awaiting Authorization')}</p>
                        </div>
                    </div>

                    <div className="premium-card bg-gradient-to-br from-foreground/10 via-transparent to-transparent p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/20 text-foreground">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Authorized')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {leaveapplications?.data?.filter((l) => l.status === 'approved').length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">
                                {t('Active Personnel Absences')}
                            </p>
                        </div>
                    </div>

                    <div className="premium-card bg-gradient-to-br from-foreground/10 via-transparent to-transparent p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/20 text-destructive">
                                <XCircle className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Terminated')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {leaveapplications?.data?.filter((l) => l.status === 'rejected').length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Declined Requests')}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Interface */}
                <Card className="premium-card overflow-hidden border-none bg-foreground/40 backdrop-blur-3xl">
                    {/* Tactical Filter Bar */}
                    <div className="border-b border-white/5 bg-card/5 p-6">
                        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                            <div className="w-full max-w-xl lg:flex-1">
                                <SearchInput
                                    value={filters.reason}
                                    onChange={(value) => setFilters({ ...filters, reason: value })}
                                    onSearch={handleFilter}
                                    placeholder={t('Search mission dossiers...')}
                                    className="border-white/10 bg-background/20"
                                />
                            </div>
                            <div className="flex w-full items-center gap-4 overflow-x-auto pb-2 lg:w-auto lg:pb-0">
                                <div className="flex h-10 items-center rounded-xl border border-white/5 bg-background/20 p-1">
                                    <ListGridToggle
                                        currentView={viewMode}
                                        routeName="hrm.leave-applications.index"
                                        filters={{ ...filters, per_page: perPage }}
                                    />
                                </div>
                                <div className="flex h-10 items-center rounded-xl border border-white/5 bg-background/20 px-1">
                                    <PerPageSelector
                                        routeName="hrm.leave-applications.index"
                                        filters={{ ...filters, view: viewMode }}
                                    />
                                </div>
                                <div className="relative">
                                    <FilterButton
                                        showFilters={showFilters}
                                        onToggle={() => setShowFilters(!showFilters)}
                                        className={`h-10 rounded-xl border border-white/5 transition-all ${showFilters ? 'bg-foreground text-background' : 'bg-background/20'}`}
                                    />
                                    {(() => {
                                        const activeFilters = [
                                            filters.status,
                                            filters.employee_id,
                                            filters.start_date,
                                            filters.end_date,
                                        ].filter((f) => f !== '' && f !== null && f !== undefined).length;
                                        return (
                                            activeFilters > 0 && (
                                                <span className="absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-foreground text-[8px] font-black text-background">
                                                    {activeFilters}
                                                </span>
                                            )
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Advanced Filters Drawer */}
                        {showFilters && (
                            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/5 pt-6 duration-500 animate-in slide-in-from-top md:grid-cols-2 lg:grid-cols-4">
                                {auth.user?.permissions?.includes('manage-employees') && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            {t('Personnel Unit')}
                                        </label>
                                        <Select
                                            value={filters.employee_id}
                                            onValueChange={(value) => setFilters({ ...filters, employee_id: value })}
                                        >
                                            <SelectTrigger className="h-11 border-white/5 bg-background/20">
                                                <SelectValue placeholder={t('Select Agent')} />
                                            </SelectTrigger>
                                            <SelectContent className="border-white/10 bg-foreground">
                                                {employees?.map((employee) => (
                                                    <SelectItem key={employee.id} value={employee.id.toString()}>
                                                        {employee.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Mission Status')}
                                    </label>
                                    <Select
                                        value={filters.status}
                                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                                    >
                                        <SelectTrigger className="h-11 border-white/5 bg-background/20 text-xs">
                                            <SelectValue placeholder={t('All States')} />
                                        </SelectTrigger>
                                        <SelectContent className="border-white/10 bg-foreground text-[10px] font-black uppercase tracking-widest">
                                            <SelectItem value="pending">{t('Pending')}</SelectItem>
                                            <SelectItem value="approved">{t('Approved')}</SelectItem>
                                            <SelectItem value="rejected">{t('Rejected')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Deployment Start')}
                                    </label>
                                    <Input
                                        type="date"
                                        value={filters.start_date}
                                        onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                                        className="h-11 border-white/5 bg-background/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Deployment End')}
                                    </label>
                                    <Input
                                        type="date"
                                        value={filters.end_date}
                                        onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                                        className="h-11 border-white/5 bg-background/20"
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-4 lg:col-span-4">
                                    <Button
                                        onClick={handleFilter}
                                        className="h-10 rounded-xl bg-foreground px-8 text-xs font-black uppercase tracking-widest hover:bg-foreground/80"
                                    >
                                        {t('Synchronize')}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={clearFilters}
                                        className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-background"
                                    >
                                        {t('Reset Matrix')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Data Vector Projection */}
                    <div className="p-0">
                        {viewMode === 'list' ? (
                            <div className="w-full">
                                <DataTable
                                    data={(leaveapplications as any)?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="border-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={FileTextIcon}
                                            title={t('No Leave Dossiers Found')}
                                            description={t('System clear. No active absence vectors detected.')}
                                            hasFilters={
                                                !!(
                                                    filters.reason ||
                                                    filters.status ||
                                                    filters.employee_id ||
                                                    filters.start_date ||
                                                    filters.end_date
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-leave-applications"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Authorize New Leave')}
                                            className="h-96"
                                        />
                                    }
                                />
                            </div>
                        ) : (
                            <div className="p-6">
                                {leaveapplications?.data?.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                                        {(leaveapplications as any)?.data?.map((leave: LeaveApplication) => (
                                            <div
                                                key={leave.id}
                                                className="premium-card group flex h-full flex-col overflow-hidden border border-white/5 bg-background/20 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02]"
                                            >
                                                {/* Card Signal Bar */}
                                                <div
                                                    className={`h-1 w-full ${leave.status === 'approved' ? 'bg-foreground' : leave.status === 'pending' ? 'bg-muted-foreground' : 'bg-destructive'}`}
                                                />

                                                <div className="flex flex-1 flex-col p-6">
                                                    <div className="mb-6 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/10 text-foreground transition-all duration-500 group-hover:bg-foreground group-hover:text-background">
                                                                <FileTextIcon className="h-6 w-6" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="truncate text-sm font-black uppercase tracking-tight">
                                                                    {leave.employee?.name || 'Unknown Agent'}
                                                                </h3>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                                    {leave.leave_type?.name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {isMultiTierEnabled ? (
                                                            <div className="flex flex-col items-end gap-1">
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`text-[9px] font-black uppercase ${leave.manager_status === 'approved' ? 'border-foreground/20 bg-foreground/10 text-foreground' : leave.manager_status === 'pending' ? 'border-border/20 bg-muted-foreground/10 text-muted-foreground' : 'border-destructive/20 bg-destructive/10 text-destructive'}`}
                                                                >
                                                                    {t('Mgr')}: {t(leave.manager_status || 'pending')}
                                                                </Badge>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`text-[9px] font-black uppercase ${leave.status === 'approved' ? 'border-foreground/20 bg-foreground/10 text-foreground' : leave.status === 'pending' ? 'border-border/20 bg-muted-foreground/10 text-muted-foreground' : 'border-destructive/20 bg-destructive/10 text-destructive'}`}
                                                                >
                                                                    {t('HR')}: {t(leave.status || 'pending')}
                                                                </Badge>
                                                            </div>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-[10px] font-black uppercase ${leave.status === 'approved' ? 'border-foreground/20 bg-foreground/10 text-foreground' : leave.status === 'pending' ? 'border-border/20 bg-muted-foreground/10 text-muted-foreground' : 'border-destructive/20 bg-destructive/10 text-destructive'}`}
                                                            >
                                                                {t(leave.status)}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="mb-8 grid grid-cols-2 gap-6">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                                {t('Start Window')}
                                                            </p>
                                                            <p className="text-xs font-bold">
                                                                {formatDate(leave.start_date)}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                                {t('End Window')}
                                                            </p>
                                                            <p className="text-xs font-bold">
                                                                {formatDate(leave.end_date)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                                                {leave.total_days} {t('Cycles')}
                                                            </span>
                                                            <span
                                                                className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase ${leave.leave_type?.is_paid ? 'bg-foreground/20 text-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}
                                                            >
                                                                {leave.leave_type?.is_paid ? t('Paid') : t('Unpaid')}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            {(auth.user?.permissions?.includes('manage-leave-status') ||
                                                                (isMultiTierEnabled && leave.is_line_manager)) &&
                                                                leave.status === 'pending' && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openStatusModal(leave)}
                                                                        className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted-foreground/10 hover:text-muted-foreground"
                                                                    >
                                                                        <Play className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setViewingItem(leave)}
                                                                className="h-8 w-8 p-0 text-foreground hover:bg-foreground/10 hover:text-foreground"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            {auth.user?.permissions?.includes(
                                                                'edit-leave-applications'
                                                            ) &&
                                                                leave.status === 'pending' && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openModal('edit', leave)}
                                                                        className="hover:bg-muted/500/10 h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <EditIcon className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            {auth.user?.permissions?.includes(
                                                                'delete-leave-applications'
                                                            ) && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openDeleteDialog(leave.id)}
                                                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <NoRecordsFound
                                        icon={FileTextIcon}
                                        title={t('No Leave Dossiers Found')}
                                        description={t('System clear. No active absence vectors detected.')}
                                        hasFilters={
                                            !!(
                                                filters.reason ||
                                                filters.status ||
                                                filters.employee_id ||
                                                filters.start_date ||
                                                filters.end_date
                                            )
                                        }
                                        onClearFilters={clearFilters}
                                        createPermission="create-leave-applications"
                                        onCreateClick={() => openModal('add')}
                                        createButtonText={t('Authorize New Leave')}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Matrix Pagination */}
                    <div className="border-t border-white/5 bg-card/5 px-6 py-4">
                        <Pagination
                            data={
                                (leaveapplications as any) || {
                                    data: [],
                                    links: [],
                                    total: 0,
                                    current_page: 1,
                                    last_page: 1,
                                    per_page: 10,
                                    from: 0,
                                    to: 0,
                                }
                            }
                            routeName="hrm.leave-applications.index"
                            filters={{ ...filters, per_page: perPage, view: viewMode }}
                        />
                    </div>
                </Card>
            </div>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditLeaveApplication leaveapplication={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View leaveapplication={viewingItem} />}
            </Dialog>

            <Dialog open={!!statusModalItem} onOpenChange={() => setStatusModalItem(null)}>
                {statusModalItem && (
                    <StatusUpdate leaveapplication={statusModalItem} onSuccess={() => setStatusModalItem(null)} />
                )}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete LeaveApplication')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
