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
    Calculator as CalculatorIcon,
    Download,
    FileImage,
    Play,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';

import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditPayroll from './Edit';
import View from './View';
import NoRecordsFound from '@/components/no-records-found';
import { Payroll, PayrollsIndexProps, PayrollFilters, PayrollModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { payrolls, auth } = usePage<PayrollsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<PayrollFilters>({
        title: urlParams.get('title') || '',
        payroll_frequency: urlParams.get('payroll_frequency') || '',
        status: urlParams.get('status') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const viewMode = 'list';
    const [modalState, setModalState] = useState<PayrollModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<Payroll | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.payrolls.destroy',
        defaultMessage: t('Are you sure you want to delete this payroll?'),
    });

    const handleFilter = () => {
        router.get(
            route('hrm.payrolls.index'),
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
            route('hrm.payrolls.index'),
            { ...filters, per_page: perPage, sort: field, direction },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            title: '',
            payroll_frequency: '',
            status: '',
        });
        router.get(route('hrm.payrolls.index'), { per_page: perPage });
    };

    const openModal = (mode: 'add' | 'edit', data: Payroll | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const runPayroll = (payrollId: number) => {
        router.post(route('hrm.payrolls.run', payrollId));
    };

    const tableColumns = [
        {
            key: 'title',
            header: t('Title'),
            sortable: true,
        },
        {
            key: 'payroll_frequency',
            header: t('Payroll Frequency'),
            sortable: false,
            render: (value: string) => {
                const frequencyLabels = {
                    weekly: 'Weekly',
                    biweekly: 'Bi-Weekly',
                    monthly: 'Monthly',
                };
                return (
                    frequencyLabels[value as keyof typeof frequencyLabels] ||
                    value?.charAt(0).toUpperCase() + value?.slice(1) ||
                    '-'
                );
            },
        },
        {
            key: 'pay_period_start',
            header: t('Pay Period Start'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'pay_period_end',
            header: t('Pay Period End'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'pay_date',
            header: t('Pay Date'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: string) => {
                const statusColors = {
                    draft: 'bg-muted text-foreground',
                    processing: 'bg-muted text-foreground',
                    completed: 'bg-muted text-foreground',
                    cancelled: 'bg-muted text-destructive',
                };
                return (
                    <span
                        className={`rounded-full px-2 py-1 text-sm ${statusColors[value as keyof typeof statusColors] || statusColors.draft}`}
                    >
                        {t(value?.charAt(0).toUpperCase() + value?.slice(1) || 'Draft')}
                    </span>
                );
            },
        },
        {
            key: 'total_net_pay',
            header: t('Total Net Pay'),
            sortable: false,
            render: (value: number) => (value ? formatCurrency(value) : '-'),
        },
        {
            key: 'employee_count',
            header: t('Employee Count'),
            sortable: false,
            render: (value: number) => value || '-',
        },
        {
            key: 'is_payroll_paid',
            header: t('Payment Status'),
            sortable: false,
            render: (value: string) => {
                const isPaid = value === 'paid';
                return (
                    <span
                        className={`rounded-full px-2 py-1 text-sm ${
                            isPaid ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                        }`}
                    >
                        {t(isPaid ? 'Paid' : 'Unpaid')}
                    </span>
                );
            },
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['run-payrolls', 'view-payrolls', 'edit-payrolls', 'delete-payrolls'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, payroll: Payroll) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('run-payrolls') &&
                                      payroll.is_payroll_paid !== 'paid' && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => runPayroll(payroll.id)}
                                                      className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                  >
                                                      <Play className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('Run Payroll')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                  {auth.user?.permissions?.includes('view-payrolls') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => router.get(route('hrm.payrolls.show', payroll.id))}
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
                                  {auth.user?.permissions?.includes('edit-payrolls') &&
                                      payroll.is_payroll_paid !== 'paid' && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openModal('edit', payroll)}
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
                                  {auth.user?.permissions?.includes('delete-payrolls') &&
                                      payroll.is_payroll_paid !== 'paid' && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openDeleteDialog(payroll.id)}
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
            breadcrumbs={[{ label: t('Hrm'), url: route('hrm.index') }, { label: t('Payrolls') }]}
            pageTitle={t('Manage Payrolls')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-payrolls') && (
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
            <Head title={t('Payrolls')} />

            <div className="space-y-8 duration-1000 animate-in fade-in">
                {/* Financial Intelligence Board */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="premium-card from-muted/500/10 bg-gradient-to-br via-transparent to-transparent p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="bg-muted/500/20 flex h-10 w-10 items-center justify-center rounded-xl text-foreground">
                                <CalculatorIcon className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Total Liquidity')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {formatCurrency(
                                    payrolls?.data?.reduce((acc, curr) => acc + (curr.total_net_pay || 0), 0) || 0
                                )}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Total Payout Vector')}</p>
                        </div>
                    </div>

                    <div className="premium-card bg-gradient-to-br from-foreground/10 via-transparent to-transparent p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-foreground/20 text-muted-foreground">
                                <Play className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Processing')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {payrolls?.data?.filter((p) => p.status === 'processing').length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Active Compute Cycles')}</p>
                        </div>
                    </div>

                    <div className="premium-card bg-gradient-to-br from-foreground/10 via-transparent to-transparent p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/20 text-foreground">
                                <Download className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Completed')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {payrolls?.data?.filter((p) => p.status === 'completed').length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Archived Transactions')}</p>
                        </div>
                    </div>

                    <div className="premium-card from-muted/500/10 bg-gradient-to-br via-transparent to-transparent p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/20 text-foreground">
                                <EditIcon className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Drafting')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {payrolls?.data?.filter((p) => p.status === 'draft').length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Unstaged Assets')}</p>
                        </div>
                    </div>
                </div>

                {/* Main Command Interface */}
                <Card className="premium-card overflow-hidden border-none bg-foreground/40 backdrop-blur-3xl">
                    {/* Tactical Control Bar */}
                    <div className="border-b border-white/5 bg-card/5 p-6">
                        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                            <div className="w-full max-w-xl lg:flex-1">
                                <SearchInput
                                    value={filters.title}
                                    onChange={(value) => setFilters({ ...filters, title: value })}
                                    onSearch={handleFilter}
                                    placeholder={t('Search financial registers...')}
                                    className="border-white/10 bg-background/20 placeholder:text-muted-foreground/30"
                                />
                            </div>
                            <div className="flex w-full items-center gap-4 lg:w-auto">
                                <div className="flex h-10 items-center rounded-xl border border-white/5 bg-background/20 px-1">
                                    <PerPageSelector routeName="hrm.payrolls.index" filters={{ ...filters }} />
                                </div>
                                <div className="relative">
                                    <FilterButton
                                        showFilters={showFilters}
                                        onToggle={() => setShowFilters(!showFilters)}
                                        className={`h-10 rounded-xl border border-white/5 transition-all ${showFilters ? 'bg-foreground text-background' : 'bg-background/20'}`}
                                    />
                                    {(() => {
                                        const activeFilters = [filters.payroll_frequency, filters.status].filter(
                                            (f) => f !== '' && f !== null && f !== undefined
                                        ).length;
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

                        {/* Advanced Vectors Drawer */}
                        {showFilters && (
                            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/5 pt-6 duration-500 animate-in slide-in-from-top md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Payout Frequency')}
                                    </label>
                                    <Select
                                        value={filters.payroll_frequency}
                                        onValueChange={(value) => setFilters({ ...filters, payroll_frequency: value })}
                                    >
                                        <SelectTrigger className="h-11 border-white/5 bg-background/20 text-xs">
                                            <SelectValue placeholder={t('All Frequencies')} />
                                        </SelectTrigger>
                                        <SelectContent className="border-white/10 bg-foreground text-[10px] font-black uppercase tracking-widest">
                                            <SelectItem value="weekly">{t('Weekly')}</SelectItem>
                                            <SelectItem value="biweekly">{t('Bi-Weekly')}</SelectItem>
                                            <SelectItem value="monthly">{t('Monthly')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Register Status')}
                                    </label>
                                    <Select
                                        value={filters.status}
                                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                                    >
                                        <SelectTrigger className="h-11 border-white/5 bg-background/20 text-xs">
                                            <SelectValue placeholder={t('All States')} />
                                        </SelectTrigger>
                                        <SelectContent className="border-white/10 bg-foreground text-[10px] font-black uppercase tracking-widest">
                                            <SelectItem value="draft">{t('Draft')}</SelectItem>
                                            <SelectItem value="processing">{t('Processing')}</SelectItem>
                                            <SelectItem value="completed">{t('Completed')}</SelectItem>
                                            <SelectItem value="cancelled">{t('Cancelled')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end gap-3 pb-0.5">
                                    <Button
                                        onClick={handleFilter}
                                        className="h-11 rounded-xl bg-foreground px-8 text-xs font-black uppercase tracking-widest hover:bg-foreground/80"
                                    >
                                        {t('Sync Matrix')}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={clearFilters}
                                        className="h-11 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-background"
                                    >
                                        {t('Reset')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Financial Data Sector */}
                    <div className="p-0">
                        <div className="w-full">
                            <DataTable
                                data={payrolls?.data || []}
                                columns={tableColumns}
                                onSort={handleSort}
                                sortKey={sortField}
                                sortDirection={sortDirection as 'asc' | 'desc'}
                                className="border-none"
                                emptyState={
                                    <NoRecordsFound
                                        icon={CalculatorIcon}
                                        title={t('No Payroll Registers Found')}
                                        description={t('System clear. No active financial payout vectors detected.')}
                                        hasFilters={!!(filters.title || filters.payroll_frequency || filters.status)}
                                        onClearFilters={clearFilters}
                                        createPermission="create-payrolls"
                                        onCreateClick={() => openModal('add')}
                                        createButtonText={t('Initiate New Payroll')}
                                        className="h-96"
                                    />
                                }
                            />
                        </div>
                    </div>

                    {/* Matrix Pagination */}
                    <div className="border-t border-white/5 bg-card/5 px-6 py-4">
                        <Pagination
                            data={payrolls || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }}
                            routeName="hrm.payrolls.index"
                            filters={{ ...filters, per_page: perPage }}
                        />
                    </div>
                </Card>
            </div>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditPayroll payroll={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View payroll={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Payroll')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
