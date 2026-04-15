import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { usePageButtons } from '@/hooks/usePageButtons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Trash2, Eye, CheckCircle, Check, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import NoRecordsFound from '@/components/no-records-found';
import { SalesReturn, SalesFilters } from './types';
import { getStatusBadgeClasses } from './utils';

interface SalesReturnIndexProps {
    returns: {
        data: SalesReturn[];
        links: any[];
        meta: any;
    };
    customers: Array<{ id: number; name: string; email: string }>;
    warehouses: Array<{ id: number; name: string }>;
    filters: SalesFilters;
    auth: any;
    [key: string]: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { returns, customers, warehouses, filters: initialFilters, auth } = usePage<SalesReturnIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<SalesFilters>({
        search: initialFilters?.search || urlParams.get('search') || '',
        customer_id: initialFilters?.customer_id || urlParams.get('customer_id') || '',
        status: initialFilters?.status || urlParams.get('status') || '',
        date_range: initialFilters?.date_range || urlParams.get('date_range') || '',
        warehouse_id: initialFilters?.warehouse_id || urlParams.get('warehouse_id') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [showFilters, setShowFilters] = useState(false);

    const pageButtons = usePageButtons('salesReturnBtn', 'Sales Return data');

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'sales-returns.destroy',
        defaultMessage: t('Are you sure you want to delete this sales return?'),
    });

    const handleFilter = () => {
        router.get(
            route('sales-returns.index'),
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
            route('sales-returns.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ search: '', customer_id: '', status: '', date_range: '', warehouse_id: '' });
        router.get(route('sales-returns.index'), { per_page: perPage, view: viewMode });
    };

    const tableColumns = [
        {
            key: 'return_number',
            header: t('Return Number'),
            sortable: true,
            render: (value: string, returnItem: SalesReturn) =>
                auth.user?.permissions?.includes('view-sales-return-invoices') ? (
                    <span
                        className="cursor-pointer text-foreground hover:text-foreground"
                        onClick={() => router.get(route('sales-returns.show', returnItem.id))}
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
            key: 'warehouse',
            header: t('Warehouse'),
            render: (value: any) => value?.name || '-',
        },
        {
            key: 'return_date',
            header: t('Return Date'),
            sortable: true,
            render: (value: string) => formatDate(value),
        },
        {
            key: 'total_amount',
            header: t('Total Amount'),
            sortable: true,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'items',
            header: t('Items'),
            render: (value: any, returnItem: SalesReturn) => (
                <div className="text-sm">
                    {returnItem.items?.slice(0, 2).map((item: any, index: number) => (
                        <div key={index} className="flex justify-between">
                            <span className="truncate">{item.product?.name}</span>
                            <span className="ms-2 text-muted-foreground">×{item.return_quantity}</span>
                        </div>
                    ))}
                    {returnItem.items && returnItem.items.length > 2 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                            +{returnItem.items.length - 2} more items
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: true,
            render: (value: string) => (
                <span className={getStatusBadgeClasses(value)}>
                    {t(value.charAt(0).toUpperCase() + value.slice(1))}
                </span>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-sales-return-invoices', 'delete-sales-return-invoices', 'approve-sales-returns-invoices'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, returnItem: SalesReturn) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {returnItem.status === 'draft' && (
                                      <>
                                          {auth.user?.permissions?.includes('approve-sales-returns-invoices') && (
                                              <Tooltip delayDuration={0}>
                                                  <TooltipTrigger asChild>
                                                      <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() =>
                                                              router.post(route('sales-returns.approve', returnItem.id))
                                                          }
                                                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                      >
                                                          <CheckCircle className="h-4 w-4" />
                                                      </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                      <p>{t('Approve Return')}</p>
                                                  </TooltipContent>
                                              </Tooltip>
                                          )}
                                      </>
                                  )}
                                  {returnItem.status === 'approved' &&
                                      auth.user?.permissions?.includes('complete-sales-returns-invoices') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                          router.post(route('sales-returns.complete', returnItem.id))
                                                      }
                                                      className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                  >
                                                      <Check className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('Complete Return')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                  {auth.user?.permissions?.includes('view-sales-return-invoices') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => router.get(route('sales-returns.show', returnItem.id))}
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
                                  {returnItem.status === 'draft' && (
                                      <>
                                          {auth.user?.permissions?.includes('delete-sales-return-invoices') && (
                                              <Tooltip delayDuration={0}>
                                                  <TooltipTrigger asChild>
                                                      <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => openDeleteDialog(returnItem.id)}
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
                                      </>
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
            breadcrumbs={[{ label: t('Sales Returns') }]}
            pageTitle={t('Manage Sales Returns')}
            pageActions={
                <div className="flex gap-2">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('create-sales-return-invoices') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" onClick={() => router.visit(route('sales-returns.create'))}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Create')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {pageButtons.map((button) => (
                            <div key={button.id}>{button.component}</div>
                        ))}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={t('Sales Returns')} />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.search || ''}
                                onChange={(value) => setFilters({ ...filters, search: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search by return number...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="sales-returns.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector routeName="sales-returns.index" filters={{ ...filters, view: viewMode }} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.customer_id,
                                        filters.status,
                                        filters.date_range,
                                        filters.warehouse_id,
                                    ].filter(Boolean).length;
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

                {showFilters && (
                    <CardContent className="border-b bg-muted/30 p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            {auth.user?.permissions?.includes('manage-users') && (
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
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {auth.user?.permissions?.includes('manage-warehouses') && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        {t('Warehouse')}
                                    </label>
                                    <Select
                                        value={filters.warehouse_id}
                                        onValueChange={(value) => setFilters({ ...filters, warehouse_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('Filter by warehouse')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouses?.map((warehouse) => (
                                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                    {warehouse.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
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
                                        <SelectItem value="draft">{t('Draft')}</SelectItem>
                                        <SelectItem value="approved">{t('Approved')}</SelectItem>
                                        <SelectItem value="completed">{t('Completed')}</SelectItem>
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
                                    data={returns.data}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={XCircle}
                                            title={t('No sales returns found')}
                                            description={t('Get started by creating your first sales return.')}
                                            hasFilters={
                                                !!(
                                                    filters.search ||
                                                    filters.customer_id ||
                                                    filters.status ||
                                                    filters.warehouse_id ||
                                                    filters.date_range
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-sales-return-invoices"
                                            onCreateClick={() => router.visit(route('sales-returns.create'))}
                                            createButtonText={t('Create Sales Return')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-4">
                            {returns.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {returns.data.map((returnItem) => (
                                        <Card key={returnItem.id} className="flex flex-col border border-border">
                                            <div className="flex-1 p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    {auth.user?.permissions?.includes('view-sales-return-invoices') ? (
                                                        <h3
                                                            className="cursor-pointer text-base font-semibold text-foreground hover:text-foreground"
                                                            onClick={() =>
                                                                router.get(route('sales-returns.show', returnItem.id))
                                                            }
                                                        >
                                                            {returnItem.return_number}
                                                        </h3>
                                                    ) : (
                                                        <h3 className="text-base font-semibold text-foreground">
                                                            {returnItem.return_number}
                                                        </h3>
                                                    )}
                                                    <span className={getStatusBadgeClasses(returnItem.status)}>
                                                        {t(
                                                            returnItem.status.charAt(0).toUpperCase() +
                                                                returnItem.status.slice(1)
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="mb-4 space-y-2">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Customer')}
                                                            </p>
                                                            <p className="truncate text-sm font-medium text-foreground">
                                                                {returnItem.customer?.name}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 text-end text-xs font-medium text-muted-foreground">
                                                                {t('Return Date')}
                                                            </p>
                                                            <p className="text-end text-xs text-foreground">
                                                                {formatDate(returnItem.return_date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {returnItem.warehouse && (
                                                        <div>
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Warehouse')}
                                                            </p>
                                                            <p className="text-xs text-foreground">
                                                                {returnItem.warehouse.name}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                            {t('Items')}
                                                        </p>
                                                        <div className="text-xs text-foreground">
                                                            {returnItem.items
                                                                ?.slice(0, 2)
                                                                .map((item: any, index: number) => (
                                                                    <div key={index} className="flex justify-between">
                                                                        <span className="truncate">
                                                                            {item.product?.name}
                                                                        </span>
                                                                        <span className="ms-2 text-muted-foreground">
                                                                            ×{item.return_quantity}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            {returnItem.items && returnItem.items.length > 2 && (
                                                                <div className="mt-1 text-xs text-muted-foreground">
                                                                    +{returnItem.items.length - 2} more items
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="rounded-lg bg-muted/50 p-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {t('Total Amount')}
                                                            </span>
                                                            <span className="text-lg font-bold text-foreground">
                                                                {formatCurrency(returnItem.total_amount)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-muted/50/50 flex items-center justify-between border-t p-3">
                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        {returnItem.status === 'draft' &&
                                                            auth.user?.permissions?.includes(
                                                                'approve-sales-returns-invoices'
                                                            ) && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                router.post(
                                                                                    route(
                                                                                        'sales-returns.approve',
                                                                                        returnItem.id
                                                                                    )
                                                                                )
                                                                            }
                                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                                        >
                                                                            <CheckCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('Approve Return')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        {returnItem.status === 'approved' &&
                                                            auth.user?.permissions?.includes(
                                                                'complete-sales-returns-invoices'
                                                            ) && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                router.post(
                                                                                    route(
                                                                                        'sales-returns.complete',
                                                                                        returnItem.id
                                                                                    )
                                                                                )
                                                                            }
                                                                            className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                        >
                                                                            <Check className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('Complete Return')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                    </TooltipProvider>
                                                </div>
                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        {auth.user?.permissions?.includes(
                                                            'view-sales-return-invoices'
                                                        ) && (
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            router.get(
                                                                                route(
                                                                                    'sales-returns.show',
                                                                                    returnItem.id
                                                                                )
                                                                            )
                                                                        }
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

                                                        {returnItem.status === 'draft' &&
                                                            auth.user?.permissions?.includes(
                                                                'delete-sales-return-invoices'
                                                            ) && (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                openDeleteDialog(returnItem.id)
                                                                            }
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
                                    icon={XCircle}
                                    title={t('No sales returns found')}
                                    description={t('Get started by creating your first sales return.')}
                                    hasFilters={
                                        !!(
                                            filters.search ||
                                            filters.customer_id ||
                                            filters.status ||
                                            filters.warehouse_id ||
                                            filters.date_range
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-sales-return-invoices"
                                    onCreateClick={() => router.visit(route('sales-returns.create'))}
                                    createButtonText={t('Create Sales Return')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={{ ...returns, ...returns.meta }}
                        routeName="sales-returns.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Sales Return')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
