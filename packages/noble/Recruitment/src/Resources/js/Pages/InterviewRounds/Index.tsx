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
    MessageCircle as MessageCircleIcon,
    Download,
    FileImage,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';

import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditInterviewRound from './Edit';
import View from './View';
import NoRecordsFound from '@/components/no-records-found';
import { InterviewRound, InterviewRoundsIndexProps, InterviewRoundFilters, InterviewRoundModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { interviewrounds, auth, jobpostings } = usePage<InterviewRoundsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<InterviewRoundFilters>({
        name: urlParams.get('name') || '',
        description: urlParams.get('description') || '',
        job_id: urlParams.get('job_id') || 'all',
        status: urlParams.get('status') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');

    const [modalState, setModalState] = useState<InterviewRoundModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<InterviewRound | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'recruitment.interview-rounds.destroy',
        defaultMessage: t('Are you sure you want to delete this interview round?'),
    });

    const handleFilter = () => {
        router.get(
            route('recruitment.interview-rounds.index'),
            { ...filters, per_page: perPage, sort: sortField, direction: sortDirection },
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
            route('recruitment.interview-rounds.index'),
            { ...filters, per_page: perPage, sort: field, direction },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            description: '',
            job_id: 'all',
            status: '',
        });
        router.get(route('recruitment.interview-rounds.index'), { per_page: perPage });
    };

    const openModal = (mode: 'add' | 'edit', data: InterviewRound | null = null) => {
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
            key: 'job_posting.title',
            header: t('Job'),
            sortable: true,
            render: (value: any, row: any) => row.job_posting?.title || '-',
        },
        {
            key: 'sequence_number',
            header: t('Sequence'),
            sortable: true,
            render: (value: number) => (
                <span className="rounded-full bg-muted px-2 py-1 text-sm text-foreground">{value || '-'}</span>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: string) => {
                const isActive = value === '0';
                return (
                    <span
                        className={`rounded-full px-2 py-1 text-sm ${
                            isActive ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                        }`}
                    >
                        {isActive ? t('Active') : t('Inactive')}
                    </span>
                );
            },
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-interview-rounds', 'edit-interview-rounds', 'delete-interview-rounds'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, interviewround: InterviewRound) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('view-interview-rounds') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(interviewround)}
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
                                  {auth.user?.permissions?.includes('edit-interview-rounds') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', interviewround)}
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
                                  {auth.user?.permissions?.includes('delete-interview-rounds') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(interviewround.id)}
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
                { label: t('Interview Rounds') },
            ]}
            pageTitle={t('Manage Interview Rounds')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-interview-rounds') && (
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
            <Head title={t('Interview Rounds')} />

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
                                placeholder={t('Search Interview Rounds...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <PerPageSelector routeName="recruitment.interview-rounds.index" filters={{ ...filters }} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.job_id !== 'all' ? filters.job_id : '',
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
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Job')}</label>
                                <Select
                                    value={filters.job_id}
                                    onValueChange={(value) => setFilters({ ...filters, job_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('All Job')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('All Job')}</SelectItem>
                                        {jobpostings?.map((jobPosting: any) => (
                                            <SelectItem key={jobPosting.id} value={jobPosting.id.toString()}>
                                                {jobPosting.title}
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
                                        <SelectItem value="0">{t('Active')}</SelectItem>
                                        <SelectItem value="1">{t('Inactive')}</SelectItem>
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
                    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                        <div className="min-w-[800px]">
                            <DataTable
                                data={interviewrounds?.data || []}
                                columns={tableColumns}
                                onSort={handleSort}
                                sortKey={sortField}
                                sortDirection={sortDirection as 'asc' | 'desc'}
                                className="rounded-none"
                                emptyState={
                                    <NoRecordsFound
                                        icon={MessageCircleIcon}
                                        title={t('No Interview Rounds found')}
                                        description={t('Get started by creating your first Interview Round.')}
                                        hasFilters={
                                            !!(
                                                filters.name ||
                                                filters.description ||
                                                (filters.job_id !== 'all' && filters.job_id) ||
                                                filters.status
                                            )
                                        }
                                        onClearFilters={clearFilters}
                                        createPermission="create-interview-rounds"
                                        onCreateClick={() => openModal('add')}
                                        createButtonText={t('Create Interview Round')}
                                        className="h-auto"
                                    />
                                }
                            />
                        </div>
                    </div>
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={interviewrounds || { data: [], links: [], meta: {} }}
                        routeName="recruitment.interview-rounds.index"
                        filters={{ ...filters, per_page: perPage }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditInterviewRound interviewround={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View interviewround={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Interview Round')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
