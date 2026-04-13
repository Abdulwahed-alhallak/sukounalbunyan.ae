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
    Video as VideoIcon,
    Download,
    FileImage,
    Play,
    Users,
    ChevronDown,
    ExternalLink,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditZoomMeeting from './Edit';
import Show from './Show';

import NoRecordsFound from '@/components/no-records-found';
import { ZoomMeeting, ZoomMeetingsIndexProps, ZoomMeetingFilters, ZoomMeetingModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { zoommeetings, auth, users = [] } = usePage<ZoomMeetingsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<ZoomMeetingFilters>({
        title: urlParams.get('title') || '',
        description: urlParams.get('description') || '',
        meeting_id: urlParams.get('meeting_id') || '',
        status: urlParams.get('status') || '',
        host_video: urlParams.get('host_video') || '',
        participant_video: urlParams.get('participant_video') || '',
        recording: urlParams.get('recording') || '',
        date_range: urlParams.get('date_range') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<ZoomMeetingModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [showModal, setShowModal] = useState<{ isOpen: boolean; data: ZoomMeeting | null }>({
        isOpen: false,
        data: null,
    });

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'zoommeeting.zoom-meetings.destroy',
        defaultMessage: t('Are you sure you want to delete this zoommeeting?'),
    });

    const handleFilter = () => {
        router.get(
            route('zoommeeting.zoom-meetings.index'),
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
            route('zoommeeting.zoom-meetings.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const updateStatus = (meetingId: number, newStatus: string) => {
        router.patch(
            route('zoommeeting.zoom-meetings.update-status', meetingId),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Status updated successfully
                },
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            title: '',
            description: '',
            meeting_id: '',
            status: '',
            host_video: '',
            participant_video: '',
            recording: '',
            date_range: '',
        });
        router.get(route('zoommeeting.zoom-meetings.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: ZoomMeeting | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'title',
            header: t('Title'),
            sortable: true,
        },

        {
            key: 'start_time',
            header: t('Start Time'),
            sortable: false,
            render: (value: string) => (value ? formatDateTime(value) : '-'),
        },
        {
            key: 'duration',
            header: t('Duration'),
            sortable: false,
            render: (value: number) => (value ? `${value} minutes` : '-'),
        },
        {
            key: 'host.name',
            header: t('Host Name'),
            sortable: false,
            render: (value: any, row: any) => {
                if (!row.host?.name) return '-';
                return (
                    <div className="flex items-center gap-2">
                        <img
                            src={getImagePath(row.host?.avatar || '')}
                            alt={row.host.name}
                            className="h-8 w-8 cursor-pointer rounded-full border-2 border-white object-cover shadow-sm transition-transform hover:scale-110"
                        />
                        <span className="text-sm">{row.host.name}</span>
                    </div>
                );
            },
        },
        {
            key: 'participants',
            header: t('Participants'),
            sortable: false,
            render: (value: string[] | string, row: any) => {
                if (!value) return '-';
                let items = [];
                if (typeof value === 'string') {
                    try {
                        items = JSON.parse(value);
                    } catch {
                        items = [value];
                    }
                } else if (Array.isArray(value)) {
                    items = value;
                }
                if (items.length === 0) return '-';
                const modelData = users || [];
                return (
                    <div className="flex items-center -space-x-2">
                        <TooltipProvider>
                            {items.slice(0, 4)?.map((item: any, index: number) => {
                                const modelItem = modelData.find((m: any) => m.id.toString() === item?.toString());
                                const userName = modelItem?.name || item;
                                return (
                                    <Tooltip key={index} delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <img
                                                src={getImagePath(modelItem?.avatar || '')}
                                                alt={userName}
                                                className="h-8 w-8 cursor-pointer rounded-full border-2 border-white object-cover transition-all duration-200 hover:z-10 hover:scale-110"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{userName}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </TooltipProvider>
                        {items.length > 4 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-muted">
                                <span className="text-xs font-medium text-muted-foreground">+{items.length - 4}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: any, row: any) => {
                const statusColors = {
                    Scheduled: 'bg-muted text-foreground',
                    Started: 'bg-muted text-foreground',
                    Ended: 'bg-muted text-foreground',
                    Cancelled: 'bg-muted text-destructive',
                };

                if (auth.user?.permissions?.includes('update-zoom-meeting-status')) {
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`h-auto rounded-full px-2 py-1 text-sm ${statusColors[value as keyof typeof statusColors] || 'bg-muted text-foreground'}`}
                                >
                                    {value} <ChevronDown className="ms-1 h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => updateStatus(row.id, 'Scheduled')}>
                                    {t('Scheduled')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(row.id, 'Started')}>
                                    {t('Started')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(row.id, 'Ended')}>
                                    {t('Ended')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(row.id, 'Cancelled')}>
                                    {t('Cancelled')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                }

                return (
                    <span
                        className={`rounded-full px-2 py-1 text-sm ${statusColors[value as keyof typeof statusColors] || 'bg-muted text-foreground'}`}
                    >
                        {value}
                    </span>
                );
            },
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['edit-zoom-meetings', 'delete-zoom-meetings', 'join-zoom-meetings', 'start-zoom-meetings'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, zoommeeting: ZoomMeeting) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {zoommeeting.meeting_id && ['Scheduled', 'Started'].includes(zoommeeting.status) && (
                                      <>
                                          {auth.user?.permissions?.includes('join-zoom-meetings') && (
                                              <Tooltip delayDuration={0}>
                                                  <TooltipTrigger asChild>
                                                      <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() =>
                                                              window.open(
                                                                  zoommeeting.join_url ||
                                                                      `https://zoom.us/j/${zoommeeting.meeting_id}`,
                                                                  '_blank'
                                                              )
                                                          }
                                                          className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                      >
                                                          <ExternalLink className="h-4 w-4" />
                                                      </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                      <p>{t('Join Meeting')}</p>
                                                  </TooltipContent>
                                              </Tooltip>
                                          )}
                                          {auth.user?.permissions?.includes('start-zoom-meetings') &&
                                              (zoommeeting.host_id === auth.user?.id ||
                                                  auth.user?.type === 'company') && (
                                                  <Tooltip delayDuration={0}>
                                                      <TooltipTrigger asChild>
                                                          <Button
                                                              variant="ghost"
                                                              size="sm"
                                                              onClick={() =>
                                                                  window.open(
                                                                      zoommeeting.start_url ||
                                                                          `https://zoom.us/s/${zoommeeting.meeting_id}`,
                                                                      '_blank'
                                                                  )
                                                              }
                                                              className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                          >
                                                              <Play className="h-4 w-4" />
                                                          </Button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                          <p>{t('Start Meeting')}</p>
                                                      </TooltipContent>
                                                  </Tooltip>
                                              )}
                                      </>
                                  )}
                                  {auth.user?.permissions?.includes('view-zoom-meetings') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setShowModal({ isOpen: true, data: zoommeeting })}
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
                                  {auth.user?.permissions?.includes('edit-zoom-meetings') &&
                                      zoommeeting.status === 'Scheduled' && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openModal('edit', zoommeeting)}
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
                                  {auth.user?.permissions?.includes('delete-zoom-meetings') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(zoommeeting.id)}
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
            breadcrumbs={[{ label: t('Zoom Meetings') }]}
            pageTitle={t('Manage Zoom Meetings')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-zoom-meetings') && (
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
            <Head title={t('Zoom Meetings')} />

            {/* Main Content Card */}
            <Card className="shadow-sm">
                {/* Search & Controls Header */}
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.title}
                                onChange={(value) => setFilters({ ...filters, title: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search Zoom Meetings...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="zoommeeting.zoom-meetings.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="zoommeeting.zoom-meetings.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.status,
                                        filters.host_video,
                                        filters.participant_video,
                                        filters.recording,
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

                {/* Advanced Filters */}
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
                                        <SelectItem value="Scheduled">{t('Scheduled')}</SelectItem>
                                        <SelectItem value="Started">{t('Started')}</SelectItem>
                                        <SelectItem value="Ended">{t('Ended')}</SelectItem>
                                        <SelectItem value="Cancelled">{t('Cancelled')}</SelectItem>
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
                                    placeholder={t('Select Date Range')}
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

                {/* Table Content */}
                <CardContent className="p-0">
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[1000px]">
                                <DataTable
                                    data={zoommeetings?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={VideoIcon}
                                            title={t('No Zoom Meetings found')}
                                            description={t('Get started by creating your first ZoomMeeting.')}
                                            hasFilters={
                                                !!(
                                                    filters.title ||
                                                    filters.description ||
                                                    filters.meeting_id ||
                                                    filters.status ||
                                                    filters.host_video ||
                                                    filters.participant_video ||
                                                    filters.recording ||
                                                    filters.date_range
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-zoom-meetings"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Zoom Meeting')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {zoommeetings?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {zoommeetings?.data?.map((zoommeeting) => (
                                        <Card
                                            key={zoommeeting.id}
                                            className="relative flex h-full min-w-0 flex-col overflow-hidden p-0 transition-all duration-200 hover:shadow-lg"
                                        >
                                            {/* Header */}
                                            <div className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-transparent p-4">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/10 text-foreground">
                                                        <VideoIcon className="h-5 w-5" />
                                                    </div>
                                                    {(() => {
                                                        const statusColors = {
                                                            Scheduled: 'bg-muted text-foreground',
                                                            Started: 'bg-muted text-foreground',
                                                            Ended: 'bg-muted text-foreground',
                                                            Cancelled: 'bg-muted text-destructive',
                                                        };
                                                        return (
                                                            <div
                                                                className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest ${statusColors[zoommeeting.status as keyof typeof statusColors] || 'bg-muted text-foreground'}`}
                                                            >
                                                                {zoommeeting.status}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                                <h3 className="truncate text-lg font-semibold">{zoommeeting.title}</h3>
                                                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                    {zoommeeting.description || '-'}
                                                </p>
                                            </div>

                                            {/* Body */}
                                            <div className="min-h-0 flex-1 p-4">
                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Start Time')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {zoommeeting.start_time
                                                                ? formatDateTime(zoommeeting.start_time)
                                                                : '-'}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Duration')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {zoommeeting.duration ? `${zoommeeting.duration} min` : '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Host')}
                                                        </p>
                                                        {zoommeeting.host?.name ? (
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={getImagePath(zoommeeting.host?.avatar || '')}
                                                                    alt={zoommeeting.host.name}
                                                                    className="h-6 w-6 rounded-full border border-white object-cover"
                                                                />
                                                                <span className="text-xs font-medium">
                                                                    {zoommeeting.host.name}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs font-medium">-</p>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Status')}
                                                        </p>
                                                        {(() => {
                                                            const statusColors = {
                                                                Scheduled: 'bg-muted text-foreground',
                                                                Started: 'bg-muted text-foreground',
                                                                Ended: 'bg-muted text-foreground',
                                                                Cancelled: 'bg-muted text-destructive',
                                                            };
                                                            return (
                                                                <span
                                                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColors[zoommeeting.status as keyof typeof statusColors] || 'bg-muted text-foreground'}`}
                                                                >
                                                                    {zoommeeting.status}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>

                                                <div className="min-w-0 text-xs">
                                                    <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                        {t('Participants')} (
                                                        {(() => {
                                                            let items = [];
                                                            if (typeof zoommeeting.participants === 'string') {
                                                                try {
                                                                    items = JSON.parse(zoommeeting.participants);
                                                                } catch {
                                                                    items = [zoommeeting.participants];
                                                                }
                                                            } else if (Array.isArray(zoommeeting.participants)) {
                                                                items = zoommeeting.participants;
                                                            }
                                                            return items.length;
                                                        })()}
                                                        )
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        {(() => {
                                                            let items = [];
                                                            if (typeof zoommeeting.participants === 'string') {
                                                                try {
                                                                    items = JSON.parse(zoommeeting.participants);
                                                                } catch {
                                                                    items = [zoommeeting.participants];
                                                                }
                                                            } else if (Array.isArray(zoommeeting.participants)) {
                                                                items = zoommeeting.participants;
                                                            }
                                                            const modelData = users || [];
                                                            if (items.length === 0)
                                                                return (
                                                                    <span className="text-xs text-muted-foreground">
                                                                        No participants
                                                                    </span>
                                                                );
                                                            return (
                                                                <div className="flex items-center -space-x-1">
                                                                    <TooltipProvider>
                                                                        {items
                                                                            .slice(0, 3)
                                                                            ?.map((item: any, index: number) => {
                                                                                const modelItem = modelData.find(
                                                                                    (m: any) =>
                                                                                        m.id.toString() ===
                                                                                        item?.toString()
                                                                                );
                                                                                const userName =
                                                                                    modelItem?.name || item;
                                                                                return (
                                                                                    <Tooltip
                                                                                        key={index}
                                                                                        delayDuration={0}
                                                                                    >
                                                                                        <TooltipTrigger asChild>
                                                                                            <img
                                                                                                src={getImagePath(
                                                                                                    modelItem?.avatar ||
                                                                                                        ''
                                                                                                )}
                                                                                                alt={userName}
                                                                                                className="h-6 w-6 cursor-pointer rounded-full border border-white object-cover transition-all duration-200 hover:z-10 hover:scale-110"
                                                                                            />
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent>
                                                                                            <p>{userName}</p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                );
                                                                            })}
                                                                    </TooltipProvider>
                                                                    {items.length > 3 && (
                                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-muted">
                                                                            <span className="text-xs font-medium text-muted-foreground">
                                                                                +{items.length - 3}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions Footer */}
                                            <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 justify-end gap-2 border-t p-3">
                                                <TooltipProvider>
                                                    {zoommeeting.meeting_id &&
                                                        ['Scheduled', 'Started'].includes(zoommeeting.status) && (
                                                            <>
                                                                {auth.user?.permissions?.includes(
                                                                    'join-zoom-meetings'
                                                                ) && (
                                                                    <Tooltip delayDuration={300}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    window.open(
                                                                                        zoommeeting.join_url ||
                                                                                            `https://zoom.us/j/${zoommeeting.meeting_id}`,
                                                                                        '_blank'
                                                                                    )
                                                                                }
                                                                                className="h-9 w-9 p-0 text-foreground hover:bg-muted/50 hover:text-foreground"
                                                                            >
                                                                                <ExternalLink className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{t('Join Meeting')}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                                {auth.user?.permissions?.includes(
                                                                    'start-zoom-meetings'
                                                                ) &&
                                                                    (zoommeeting.host_id === auth.user?.id ||
                                                                        auth.user?.type === 'company') && (
                                                                        <Tooltip delayDuration={300}>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        window.open(
                                                                                            zoommeeting.start_url ||
                                                                                                `https://zoom.us/s/${zoommeeting.meeting_id}`,
                                                                                            '_blank'
                                                                                        )
                                                                                    }
                                                                                    className="h-9 w-9 p-0 text-foreground hover:bg-muted/50 hover:text-foreground"
                                                                                >
                                                                                    <Play className="h-4 w-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>{t('Start Meeting')}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    )}
                                                            </>
                                                        )}
                                                    {auth.user?.permissions?.includes('view-zoom-meetings') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setShowModal({
                                                                            isOpen: true,
                                                                            data: zoommeeting,
                                                                        })
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
                                                    {auth.user?.permissions?.includes('edit-zoom-meetings') &&
                                                        zoommeeting.status === 'Scheduled' && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openModal('edit', zoommeeting)}
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
                                                    {auth.user?.permissions?.includes('delete-zoom-meetings') && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openDeleteDialog(zoommeeting.id)}
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
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <NoRecordsFound
                                    icon={VideoIcon}
                                    title={t('No Zoom Meetings found')}
                                    description={t('Get started by creating your first ZoomMeeting.')}
                                    hasFilters={
                                        !!(
                                            filters.title ||
                                            filters.description ||
                                            filters.meeting_id ||
                                            filters.status ||
                                            filters.host_video ||
                                            filters.participant_video ||
                                            filters.recording ||
                                            filters.date_range
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-zoom-meetings"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create ZoomMeeting')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={zoommeetings || { data: [], links: [], meta: {} }}
                        routeName="zoommeeting.zoom-meetings.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditZoomMeeting zoommeeting={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete ZoomMeeting')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />

            {showModal.data && (
                <Show
                    isOpen={showModal.isOpen}
                    onClose={() => setShowModal({ isOpen: false, data: null })}
                    zoommeeting={showModal.data}
                    users={users}
                />
            )}
        </AuthenticatedLayout>
    );
}
