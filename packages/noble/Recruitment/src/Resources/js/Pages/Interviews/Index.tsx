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
import { Plus, Edit as EditIcon, Trash2, Eye, Calendar as CalendarIcon, Download, FileImage } from 'lucide-react';
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
import EditInterview from './Edit';
import View from './View';
import NoRecordsFound from '@/components/no-records-found';
import { Interview, InterviewsIndexProps, InterviewFilters, InterviewModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { interviews, auth, candidates, jobpostings, interviewrounds, interviewtypes } =
        usePage<InterviewsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<InterviewFilters>({
        location: urlParams.get('location') || '',
        interview_date: urlParams.get('interview_date') || '',
        feedback: urlParams.get('feedback') || 'all',
        status: urlParams.get('status') || '',
        interview_type_id: urlParams.get('interview_type_id') || 'all',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<InterviewModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<Interview | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'recruitment.interviews.destroy',
        defaultMessage: t('Are you sure you want to delete this interview?'),
    });

    const handleFilter = () => {
        const filterParams = { ...filters };
        if (filterParams.feedback === 'all') {
            filterParams.feedback = '';
        }
        router.get(
            route('recruitment.interviews.index'),
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
        if (filterParams.feedback === 'all') {
            filterParams.feedback = '';
        }
        router.get(
            route('recruitment.interviews.index'),
            { ...filterParams, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            interview_date: '',
            feedback: 'all',
            status: '',
            interview_type_id: 'all',
        });
        router.get(route('recruitment.interviews.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: Interview | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    // Check if any interview has non-remote job to show location column
    const hasNonRemoteJobs =
        interviews?.data?.some((interview: any) => !interview.jobPosting?.location?.remote_work) || false;

    const tableColumns = [
        {
            key: 'candidate_name',
            header: t('Candidate'),
            sortable: true,
            render: (value: any, row: any) => (
                <div>
                    <div className="font-medium">
                        {`${row.candidate?.first_name || ''} ${row.candidate?.last_name || ''}`.trim() || '-'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {row.jobPosting?.title ||
                            row.job_posting?.title ||
                            (row.job_id ? `Job ID: ${row.job_id}` : '-')}
                    </div>
                </div>
            ),
        },
        {
            key: 'round_name',
            header: t('Round'),
            sortable: true,
            render: (value: any, row: any) =>
                row.interviewRound?.name ||
                row.interview_round?.name ||
                (row.round_id ? `Round ID: ${row.round_id}` : '-'),
        },
        {
            key: 'interview_type_name',
            header: t('Interview Type'),
            sortable: true,
            render: (value: any, row: any) =>
                row.interviewType?.name ||
                row.interview_type?.name ||
                (row.interview_type_id ? `Type ID: ${row.interview_type_id}` : '-'),
        },
        {
            key: 'scheduled_date',
            header: t('Date & Time'),
            sortable: true,
            render: (value: any, row: any) => (
                <div>
                    <div className="font-medium">{formatDate(row.scheduled_date) || '-'}</div>
                    <div className="text-xs text-muted-foreground">
                        {formatTime(row.scheduled_time) || '-'} ({row.duration ? `${row.duration} min` : '-'})
                    </div>
                </div>
            ),
        },
        ...(hasNonRemoteJobs
            ? [
                  {
                      key: 'location',
                      header: t('Location'),
                      sortable: false,
                      render: (value: any, row: any) => {
                          const location = row.location || '-';
                          return location === 'Online' ? (
                              <span className="font-medium text-foreground">{location}</span>
                          ) : (
                              location
                          );
                      },
                  },
              ]
            : []),
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: string, row: any) => {
                const options: any = { '0': 'Scheduled', '1': 'Completed', '2': 'Cancelled', '3': 'No-show' };
                const statusValue = String(row.status || value || '0');
                const displayValue = options[statusValue] || statusValue || '-';

                const getStatusColor = (status: string) => {
                    switch (status) {
                        case '0':
                            return 'bg-muted text-foreground'; // Scheduled
                        case '1':
                            return 'bg-muted text-foreground'; // Completed
                        case '2':
                            return 'bg-muted text-destructive'; // Cancelled
                        case '3':
                            return 'bg-muted text-foreground'; // No-show
                        default:
                            return 'bg-muted text-foreground';
                    }
                };

                return (
                    <span className={`rounded-full px-2 py-1 text-sm ${getStatusColor(statusValue)}`}>
                        {t(displayValue)}
                    </span>
                );
            },
        },
        {
            key: 'feedback_submitted',
            header: t('Feedback'),
            sortable: false,
            render: (value: any, row: any) => {
                const isSubmitted =
                    row.feedback_submitted === true || row.feedback_submitted === 1 || row.feedback_submitted === '1';
                return (
                    <span
                        className={`rounded-full px-2 py-1 text-sm ${
                            isSubmitted ? 'bg-muted text-foreground' : 'bg-muted text-foreground'
                        }`}
                    >
                        {t(isSubmitted ? 'Submitted' : 'Pending')}
                    </span>
                );
            },
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-interviews', 'edit-interviews', 'delete-interviews'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, interview: Interview) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('view-interviews') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(interview)}
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
                                  {auth.user?.permissions?.includes('edit-interviews') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', interview)}
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
                                  {auth.user?.permissions?.includes('delete-interviews') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(interview.id)}
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
            breadcrumbs={[{ label: t('Recruitment'), url: route('recruitment.index') }, { label: t('Interviews') }]}
            pageTitle={t('Manage Interviews')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-interviews') && (
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
            <Head title={t('Interviews')} />

            {/* Main Content Card */}
            <Card className="shadow-sm">
                {/* Search & Controls Header */}
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.location}
                                onChange={(value) => setFilters({ ...filters, location: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search Interviews...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="recruitment.interviews.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="recruitment.interviews.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.interview_date,
                                        filters.feedback !== 'all' ? filters.feedback : '',
                                        filters.status,
                                        filters.interview_type_id !== 'all' ? filters.interview_type_id : '',
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Interview Date')}
                                </label>
                                <DatePicker
                                    value={filters.interview_date}
                                    onChange={(value) => setFilters({ ...filters, interview_date: value })}
                                    placeholder={t('Select Interview Date')}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Interview Type')}
                                </label>
                                <Select
                                    value={filters.interview_type_id}
                                    onValueChange={(value) => setFilters({ ...filters, interview_type_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('All Types')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('All Types')}</SelectItem>
                                        {interviewtypes?.map((type: any) => (
                                            <SelectItem key={type.id} value={type.id.toString()}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Feedback')}
                                </label>
                                <Select
                                    value={filters.feedback}
                                    onValueChange={(value) => setFilters({ ...filters, feedback: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('All Feedback')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('All Feedback')}</SelectItem>
                                        <SelectItem value="submitted">{t('Submitted')}</SelectItem>
                                        <SelectItem value="pending">{t('Pending')}</SelectItem>
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
                                        <SelectItem value="0">{t('Scheduled')}</SelectItem>
                                        <SelectItem value="1">{t('Completed')}</SelectItem>
                                        <SelectItem value="2">{t('Cancelled')}</SelectItem>
                                        <SelectItem value="3">{t('No-show')}</SelectItem>
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
                                    data={interviews?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={CalendarIcon}
                                            title={t('No Interviews found')}
                                            description={t('Get started by creating your first Interview.')}
                                            hasFilters={
                                                !!(
                                                    filters.location ||
                                                    filters.interview_date ||
                                                    (filters.feedback && filters.feedback !== 'all') ||
                                                    filters.status ||
                                                    (filters.interview_type_id && filters.interview_type_id !== 'all')
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-interviews"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Interview')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {interviews?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {interviews?.data?.map((interview) => {
                                        const statusOptions: any = {
                                            '0': 'Scheduled',
                                            '1': 'Completed',
                                            '2': 'Cancelled',
                                            '3': 'No-show',
                                        };
                                        const statusColors: any = {
                                            '0': 'bg-muted text-foreground',
                                            '1': 'bg-muted text-foreground',
                                            '2': 'bg-muted text-destructive',
                                            '3': 'bg-muted text-foreground',
                                        };
                                        const statusValue = String(interview.status || '0');
                                        const statusInfo = {
                                            label: statusOptions[statusValue] || statusValue || '-',
                                            class:
                                                statusColors[statusValue as keyof typeof statusColors] ||
                                                'bg-muted text-foreground',
                                        };
                                        const isSubmitted =
                                            interview.feedback_submitted === true ||
                                            interview.feedback_submitted === 1 ||
                                            interview.feedback_submitted === '1';

                                        return (
                                            <Card
                                                key={interview.id}
                                                className="flex h-full flex-col transition-shadow duration-200 hover:shadow-md"
                                            >
                                                <div className="bg-muted/50/50 flex items-center gap-3 border-b p-3">
                                                    <div className="flex-shrink-0 rounded-lg bg-foreground/10 p-2">
                                                        <CalendarIcon className="h-5 w-5 text-foreground" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-sm font-semibold leading-tight">
                                                            {`${interview.candidate?.first_name || ''} ${interview.candidate?.last_name || ''}`.trim() ||
                                                                'Unknown Candidate'}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            {interview.jobPosting?.title ||
                                                                interview.job_posting?.title ||
                                                                '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-3 p-3">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Schedule Date & Time')}
                                                        </p>
                                                        <p className="font-medium">
                                                            {formatDate(interview.scheduled_date)} •{' '}
                                                            {formatTime(interview.scheduled_time)}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Round')}
                                                            </p>
                                                            <p className="font-medium">
                                                                {interview.interviewRound?.name ||
                                                                    interview.interview_round?.name ||
                                                                    '-'}
                                                            </p>
                                                        </div>
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Type')}
                                                            </p>
                                                            <p className="font-medium">
                                                                {interview.interviewType?.name ||
                                                                    interview.interview_type?.name ||
                                                                    '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Location')}
                                                            </p>
                                                            <p
                                                                className={`font-medium ${
                                                                    interview.location === 'Online'
                                                                        ? 'text-foreground'
                                                                        : 'text-foreground'
                                                                }`}
                                                            >
                                                                {interview.location || '-'}
                                                            </p>
                                                        </div>
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Duration')}
                                                            </p>
                                                            <p className="font-medium">
                                                                {interview.duration ? `${interview.duration} min` : '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Feedback')}
                                                            </p>
                                                            <span
                                                                className={`rounded-full px-2 py-1 text-xs ${
                                                                    isSubmitted
                                                                        ? 'bg-muted text-foreground'
                                                                        : 'bg-muted text-foreground'
                                                                }`}
                                                            >
                                                                {t(isSubmitted ? 'Submitted' : 'Pending')}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0 text-xs">
                                                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Status')}
                                                            </p>
                                                            <span
                                                                className={`rounded-full px-2 py-1 text-xs ${statusInfo.class}`}
                                                            >
                                                                {t(statusInfo.label)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 items-center justify-end border-t p-3">
                                                    <div className="flex gap-2">
                                                        <TooltipProvider>
                                                            {auth.user?.permissions?.includes('view-interviews') && (
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => setViewingItem(interview)}
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
                                                            {auth.user?.permissions?.includes('edit-interviews') && (
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => openModal('edit', interview)}
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
                                                            {auth.user?.permissions?.includes('delete-interviews') && (
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                openDeleteDialog(interview.id)
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
                                    icon={CalendarIcon}
                                    title={t('No Interviews found')}
                                    description={t('Get started by creating your first Interview.')}
                                    hasFilters={
                                        !!(
                                            filters.location ||
                                            filters.interview_date ||
                                            (filters.feedback && filters.feedback !== 'all') ||
                                            filters.status ||
                                            (filters.interview_type_id && filters.interview_type_id !== 'all')
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-interviews"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Interview')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={interviews || { data: [], links: [], meta: {} }}
                        routeName="recruitment.interviews.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditInterview interview={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View interview={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Interview')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
