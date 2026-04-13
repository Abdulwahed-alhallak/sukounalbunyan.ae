import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog } from '@/components/ui/dialog';
import { Eye, Trash2, CheckCircle, Plus, CreditCard, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { formatCurrency, formatDate } from '@/utils/helpers';
import NoRecordsFound from '@/components/no-records-found';
import Create from './Create';
import View from './View';
import { CustomerPaymentsIndexProps, CustomerPaymentModalState, CustomerPayment } from './types';

interface CustomerPaymentFilters {
    search: string;
    customer_id: string;
    status: string;
    date_range: string;
}

export default function Index() {
    const { t } = useTranslation();
    const {
        payments = [],
        customers = [],
        bankAccounts,
        filters: initialFilters,
        auth,
    } = usePage<CustomerPaymentsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<CustomerPaymentFilters>({
        search: initialFilters?.search || '',
        customer_id: initialFilters?.customer_id || '',
        status: initialFilters?.status || '',
        date_range: (() => {
            const fromDate = urlParams.get('date_from');
            const toDate = urlParams.get('date_to');
            return fromDate && toDate ? `${fromDate} - ${toDate}` : '';
        })(),
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || 'created_at');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'desc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [showFilters, setShowFilters] = useState(false);
    const [modalState, setModalState] = useState<CustomerPaymentModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<CustomerPayment | null>(null);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'account.customer-payments.destroy',
        defaultMessage: t('Are you sure you want to delete this payment?'),
    });

    const getStatusBadgeClasses = (status: string) => {
        switch (status) {
            case 'pending':
                return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-muted text-foreground';
            case 'cleared':
                return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-muted text-foreground';
            default:
                return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-muted text-foreground';
        }
    };

    const handleFilter = () => {
        const filterParams = { ...filters };

        // Convert date_range to date_from and date_to for backend
        if (filters.date_range) {
            const [fromDate, toDate] = filters.date_range.split(' - ');
            filterParams.date_from = fromDate;
            filterParams.date_to = toDate;
        }
        delete filterParams.date_range;

        router.get(
            route('account.customer-payments.index'),
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
        router.get(
            route('account.customer-payments.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ search: '', customer_id: '', status: '', date_range: '' });
        router.get(route('account.customer-payments.index'), { per_page: perPage, view: viewMode });
    };

    const handleStatusUpdate = (paymentId: number, status: string) => {
        router.patch(route('account.customer-payments.update-status', paymentId), { status });
    };

    const openModal = (mode: 'add', data: CustomerPayment | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'payment_number',
            header: t('Payment Number'),
            sortable: true,
            render: (value: string, payment: CustomerPayment) =>
                auth.user?.permissions?.includes('view-customer-payments') ? (
                    <span
                        className="cursor-pointer text-foreground hover:text-foreground"
                        onClick={() => setViewingItem(payment)}
                    >
                        {value}
                    </span>
                ) : (
                    value
                ),
        },
        {
            key: 'customer',
            header: t('Customer'),
            render: (value: any) => value?.name || '-',
        },
        {
            key: 'payment_date',
            header: t('Payment Date'),
            sortable: true,
            render: (value: string) => formatDate(value),
        },
        {
            key: 'payment_amount',
            header: t('Amount'),
            sortable: true,
            render: (value: number) => formatCurrency(parseFloat(value.toString())),
        },
        {
            key: 'bank_account',
            header: t('Bank Account'),
            render: (value: any) => value?.account_name || '-',
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: true,
            render: (value: string) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value === 'cleared'
                            ? 'bg-muted text-foreground'
                            : value === 'pending'
                              ? 'bg-muted text-foreground'
                              : 'bg-muted text-destructive'
                    }`}
                >
                    {t(value)}
                </span>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-customer-payments', 'cleared-customer-payments', 'delete-customer-payments'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, payment: CustomerPayment) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {payment.status === 'pending' &&
                                      auth.user?.permissions?.includes('cleared-customer-payments') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleStatusUpdate(payment.id, 'cleared')}
                                                      className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                  >
                                                      <CheckCircle className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('Mark as Cleared')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                  {payment.status === 'pending' &&
                                      auth.user?.permissions?.includes('cleared-customer-payments') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleStatusUpdate(payment.id, 'cancelled')}
                                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                  >
                                                      <X className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('Cancel Payment')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                  {auth.user?.permissions?.includes('view-customer-payments') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(payment)}
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
                                  {payment.status === 'pending' &&
                                      auth.user?.permissions?.includes('delete-customer-payments') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openDeleteDialog(payment.id)}
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
            breadcrumbs={[{ label: t('Accounting'), url: route('account.index') }, { label: t('Customer Payments') }]}
            pageTitle={t('Manage Customer Payments')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-customer-payments') && (
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
            <Head title={t('Customer Payments')} />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.search || ''}
                                onChange={(value) => setFilters({ ...filters, search: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search payments...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="account.customer-payments.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="account.customer-payments.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.customer_id,
                                        filters.status,
                                        filters.date_range,
                                    ].filter(Boolean).length;
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Customer')}
                                </label>
                                <Select
                                    value={filters.customer_id}
                                    onValueChange={(value) => setFilters({ ...filters, customer_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by customer')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers?.map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id.toString()}>
                                                {customer.name}
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
                                        <SelectValue placeholder={t('Filter by status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">{t('Pending')}</SelectItem>
                                        <SelectItem value="cleared">{t('Cleared')}</SelectItem>
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
                                    placeholder={t('Select date range')}
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

                <CardContent className="p-0">
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={payments.data}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={CreditCard}
                                            title={t('No payments found')}
                                            description={t('Get started by creating your first customer payment.')}
                                            hasFilters={
                                                !!(
                                                    filters.search ||
                                                    filters.customer_id ||
                                                    filters.status ||
                                                    filters.date_range
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-customer-payments"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Payment')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {payments.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
                                    {payments.data?.map((payment) => (
                                        <Card key={payment.id} className="flex flex-col border border-border">
                                            <div className="flex-1 p-4">
                                                <div className="mb-3">
                                                    {auth.user?.permissions?.includes('view-customer-payments') ? (
                                                        <h3
                                                            className="cursor-pointer text-base font-semibold text-foreground hover:text-foreground"
                                                            onClick={() => setViewingItem(payment)}
                                                        >
                                                            {payment.payment_number}
                                                        </h3>
                                                    ) : (
                                                        <h3 className="text-base font-semibold text-foreground">
                                                            {payment.payment_number}
                                                        </h3>
                                                    )}
                                                </div>

                                                <div className="mb-3 space-y-3">
                                                    <div>
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                            {t('Customer')}
                                                        </p>
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {payment.customer?.name}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Date')}
                                                            </p>
                                                            <p className="text-xs text-foreground">
                                                                {formatDate(payment.payment_date)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 text-end text-xs font-medium text-muted-foreground">
                                                                {t('Bank Account')}
                                                            </p>
                                                            <p className="text-end text-xs text-foreground">
                                                                {payment.bank_account?.account_name || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="rounded-lg bg-muted/50 p-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {t('Amount')}
                                                            </span>
                                                            <span className="text-lg font-bold text-foreground">
                                                                {formatCurrency(
                                                                    parseFloat(payment.payment_amount.toString())
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {payment.notes && (
                                                        <div>
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Notes')}
                                                            </p>
                                                            <p className="line-clamp-2 text-xs text-foreground">
                                                                {payment.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-muted/50/50 flex items-center justify-between border-t p-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-sm ${
                                                        payment.status === 'cleared'
                                                            ? 'bg-muted text-foreground'
                                                            : payment.status === 'pending'
                                                              ? 'bg-muted text-foreground'
                                                              : 'bg-muted text-destructive'
                                                    }`}
                                                >
                                                    {t(payment.status)}
                                                </span>
                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        {payment.status === 'pending' &&
                                                            auth.user?.permissions?.includes(
                                                                'cleared-customer-payments'
                                                            ) && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    payment.id,
                                                                                    'cleared'
                                                                                )
                                                                            }
                                                                            className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                        >
                                                                            <CheckCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('Mark as Cleared')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        {payment.status === 'pending' &&
                                                            auth.user?.permissions?.includes(
                                                                'cleared-customer-payments'
                                                            ) && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    payment.id,
                                                                                    'cancelled'
                                                                                )
                                                                            }
                                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('Cancel Payment')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        {auth.user?.permissions?.includes('view-customer-payments') && (
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setViewingItem(payment)}
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
                                                        {payment.status === 'pending' &&
                                                            auth.user?.permissions?.includes(
                                                                'delete-customer-payments'
                                                            ) && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => openDeleteDialog(payment.id)}
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
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <NoRecordsFound
                                    icon={CreditCard}
                                    title={t('No payments found')}
                                    description={t('Get started by creating your first customer payment.')}
                                    hasFilters={
                                        !!(
                                            filters.search ||
                                            filters.customer_id ||
                                            filters.status ||
                                            filters.date_range
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-customer-payments"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Payment')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={{ ...payments, ...payments.meta }}
                        routeName="account.customer-payments.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && (
                    <Create customers={customers} bankAccounts={bankAccounts} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View payment={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Payment')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
