import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { usePageButtons } from '@/hooks/usePageButtons';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit as EditIcon, Trash2, Eye, FileText, Receipt, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { getStatusBadgeClasses } from './utils';
import { DateRangePicker } from '@/components/ui/date-range-picker';

import NoRecordsFound from '@/components/no-records-found';
import { PurchaseInvoice, PurchaseFilters } from './types';
interface PurchaseIndexProps {
    invoices: {
        data: PurchaseInvoice[];
        links: any[];
        meta: any;
    };
    vendors: Array<{ id: number; name: string; email: string }>;
    warehouses: Array<{ id: number; name: string; address: string }>;
    products: Array<{ id: number; name: string; price: number; tax_rate?: number }>;
    auth: any;
    [key: string]: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { invoices, vendors, warehouses, products, auth } = usePage<PurchaseIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<PurchaseFilters>({
        search: urlParams.get('search') || '',
        vendor_id: urlParams.get('vendor_id') || '',
        warehouse_id: urlParams.get('warehouse_id') || '',
        status: urlParams.get('status') || '',
        date_range: urlParams.get('date_range') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');

    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');

    const [showFilters, setShowFilters] = useState(false);

    // Component for signature buttons
    const SignatureButtons = ({ invoice }: { invoice: PurchaseInvoice }) => {
        const signatureButtons = usePageButtons('signatureBtn', { invoice });

        return (
            <>
                {signatureButtons.map((button) => (
                    <div key={button.id}>{button.component}</div>
                ))}
            </>
        );
    };

    const pageButtons = usePageButtons('purchaseBtn', 'Purchase data');
    const spreadsheetButtons = usePageButtons('spreadsheetBtn', { module: 'Purchase', sub_module: 'Purchase' });
    const googleDriveButtons = usePageButtons('googleDriveBtn', {
        module: 'Purchase Invoice',
        settingKey: 'GoogleDrive Purchase Invoice',
    });
    const oneDriveButtons = usePageButtons('oneDriveBtn', {
        module: 'Purchase Invoice',
        settingKey: 'OneDrive Purchase Invoice',
    });
    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'purchase-invoices.destroy',
        defaultMessage: t('Are you sure you want to delete this purchase invoice?'),
    });

    const handleFilter = () => {
        router.get(
            route('purchase-invoices.index'),
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
            route('purchase-invoices.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ search: '', vendor_id: '', warehouse_id: '', status: '', date_range: '' });
        router.get(route('purchase-invoices.index'), { per_page: perPage, view: viewMode });
    };

    const tableColumns = [
        {
            key: 'invoice_number',
            header: t('Invoice Number'),
            sortable: true,
            render: (value: string, invoice: PurchaseInvoice) =>
                auth.user?.permissions?.includes('view-purchase-invoices') ? (
                    <span
                        className="cursor-pointer text-foreground hover:text-foreground"
                        onClick={() => router.get(route('purchase-invoices.show', invoice.id))}
                    >
                        {value}
                    </span>
                ) : (
                    value
                ),
        },
        {
            key: 'vendor',
            header: t('Vendor'),
            render: (value: any) => value?.name || '-',
        },
        {
            key: 'invoice_date',
            header: t('Invoice Date'),
            sortable: true,
            render: (value: string) => formatDate(value),
        },
        {
            key: 'due_date',
            header: t('Due Date'),
            sortable: true,
            render: (value: string, invoice: PurchaseInvoice) => {
                const isOverdue = invoice.display_status === 'overdue';
                return (
                    <div>
                        <span className={isOverdue ? 'font-medium text-destructive' : ''}>{formatDate(value)}</span>
                        {isOverdue && <div className="mt-1 text-xs font-medium text-destructive">{t('Overdue')}</div>}
                    </div>
                );
            },
        },
        {
            key: 'subtotal',
            header: t('Subtotal'),
            sortable: true,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'tax_amount',
            header: t('Tax'),
            sortable: true,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'total_amount',
            header: t('Total Amount'),
            sortable: true,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'balance_amount',
            header: t('Balance'),
            sortable: true,
            render: (value: number) => formatCurrency(value),
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
            [
                'view-purchase-invoices',
                'edit-purchase-invoices',
                'delete-purchase-invoices',
                'post-purchase-invoices',
                'print-purchase-invoices',
            ].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, invoice: PurchaseInvoice) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  <SignatureButtons invoice={invoice} />
                                  {auth.user?.permissions?.includes('print-purchase-invoices') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                      window.open(
                                                          route('purchase-invoices.print', invoice.id) +
                                                              '?download=pdf',
                                                          '_blank'
                                                      )
                                                  }
                                                  className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                              >
                                                  <Download className="h-4 w-4" />
                                              </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>{t('Download PDF')}</p>
                                          </TooltipContent>
                                      </Tooltip>
                                  )}
                                  {auth.user?.permissions?.includes('view-purchase-invoices') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                      router.get(route('purchase-invoices.show', invoice.id))
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
                                  {invoice.status === 'draft' && (
                                      <>
                                          {auth.user?.permissions?.includes('post-purchase-invoices') && (
                                              <Tooltip delayDuration={0}>
                                                  <TooltipTrigger asChild>
                                                      <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() =>
                                                              router.post(route('purchase-invoices.post', invoice.id))
                                                          }
                                                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                      >
                                                          <FileText className="h-4 w-4" />
                                                      </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                      <p>{t('Post invoice to finalize and create journal entries')}</p>
                                                  </TooltipContent>
                                              </Tooltip>
                                          )}
                                          {auth.user?.permissions?.includes('edit-purchase-invoices') && (
                                              <Tooltip delayDuration={0}>
                                                  <TooltipTrigger asChild>
                                                      <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() =>
                                                              router.visit(route('purchase-invoices.edit', invoice.id))
                                                          }
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
                                          {auth.user?.permissions?.includes('delete-purchase-invoices') && (
                                              <Tooltip delayDuration={0}>
                                                  <TooltipTrigger asChild>
                                                      <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => openDeleteDialog(invoice.id)}
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
            breadcrumbs={[{ label: t('Purchase Invoices') }]}
            pageTitle={t('Manage Purchase Invoices')}
            pageActions={
                <div className="flex gap-2">
                    {googleDriveButtons.map((button) => (
                        <div key={button.id}>{button.component}</div>
                    ))}
                    {oneDriveButtons.map((button) => (
                        <div key={button.id}>{button.component}</div>
                    ))}
                    <TooltipProvider>
                        {pageButtons.map((button) => (
                            <div key={button.id}>{button.component}</div>
                        ))}

                        {spreadsheetButtons.map((button) => (
                            <div key={button.id}>{button.component}</div>
                        ))}
                        {auth.user?.permissions?.includes('create-purchase-invoices') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" onClick={() => router.visit(route('purchase-invoices.create'))}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Create')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={t('Purchase Invoices')} />

            {/* Main Content Card */}
            <Card className="shadow-sm">
                {/* Search & Controls Header */}
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.search || ''}
                                onChange={(value) => setFilters({ ...filters, search: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search by invoice number...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="purchase-invoices.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="purchase-invoices.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.vendor_id,
                                        filters.warehouse_id,
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

                {/* Advanced Filters */}
                {showFilters && (
                    <CardContent className="border-b bg-muted/30 p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            {auth.user?.permissions?.includes('manage-users') && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        {t('Vendor')}
                                    </label>
                                    <Select
                                        value={filters.vendor_id}
                                        onValueChange={(value) => setFilters({ ...filters, vendor_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('Filter by vendor')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vendors.map((vendor) => (
                                                <SelectItem key={vendor.id} value={vendor.id.toString()}>
                                                    {vendor.name}
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
                                            {warehouses.map((warehouse) => (
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
                                        <SelectItem value="posted">{t('Posted')}</SelectItem>
                                        <SelectItem value="partial">{t('Partial')}</SelectItem>
                                        <SelectItem value="paid">{t('Paid')}</SelectItem>
                                        <SelectItem value="overdue">{t('Overdue')}</SelectItem>
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

                {/* Table Content */}
                <CardContent className="p-0">
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={invoices.data}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={Receipt}
                                            title={t('No purchase invoices found')}
                                            description={t('Get started by creating your first purchase invoice.')}
                                            hasFilters={!!(filters.search || filters.vendor_id || filters.status)}
                                            onClearFilters={clearFilters}
                                            createPermission="create-purchase-invoices"
                                            onCreateClick={() => router.visit(route('purchase-invoices.create'))}
                                            createButtonText={t('Create Purchase Invoice')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-4">
                            {invoices.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {invoices.data.map((invoice) => (
                                        <Card key={invoice.id} className="flex flex-col border border-border">
                                            <div className="flex-1 p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    {auth.user?.permissions?.includes('view-purchase-invoices') ? (
                                                        <h3
                                                            className="cursor-pointer text-base font-semibold text-foreground hover:text-foreground"
                                                            onClick={() =>
                                                                router.get(route('purchase-invoices.show', invoice.id))
                                                            }
                                                        >
                                                            {invoice.invoice_number}
                                                        </h3>
                                                    ) : (
                                                        <h3 className="text-base font-semibold text-foreground">
                                                            {invoice.invoice_number}
                                                        </h3>
                                                    )}
                                                    <span className={getStatusBadgeClasses(invoice.status)}>
                                                        {t(
                                                            invoice.status.charAt(0).toUpperCase() +
                                                                invoice.status.slice(1)
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="mb-4 space-y-3">
                                                    <div>
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                            {t('Vendor')}
                                                        </p>
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {invoice.vendor?.name}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Invoice Date')}
                                                            </p>
                                                            <p className="text-xs text-foreground">
                                                                {formatDate(invoice.invoice_date)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Due Date')}
                                                            </p>
                                                            <p
                                                                className={`text-xs ${invoice.display_status === 'overdue' ? 'font-medium text-destructive' : 'text-foreground'}`}
                                                            >
                                                                {formatDate(invoice.due_date)}
                                                                {invoice.display_status === 'overdue' && (
                                                                    <span className="block font-medium text-destructive">
                                                                        {t('Overdue')}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-lg bg-muted/50 p-3">
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">
                                                                    {t('Subtotal')}:
                                                                </span>
                                                                <span className="font-medium">
                                                                    {formatCurrency(invoice.subtotal)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">
                                                                    {t('Tax')}:
                                                                </span>
                                                                <span className="font-medium">
                                                                    {formatCurrency(invoice.tax_amount)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 border-t pt-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-foreground">
                                                                    {t('Total Amount')}
                                                                </span>
                                                                <span className="text-lg font-bold text-foreground">
                                                                    {formatCurrency(invoice.total_amount)}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 flex items-center justify-between">
                                                                <span className="text-xs text-muted-foreground">
                                                                    {t('Balance Due')}
                                                                </span>
                                                                <span className="text-sm font-semibold text-foreground">
                                                                    {formatCurrency(invoice.balance_amount)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-muted/50/50 flex items-center justify-between border-t p-3">
                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        <SignatureButtons invoice={invoice} />
                                                        {auth.user?.permissions?.includes(
                                                            'print-purchase-invoices'
                                                        ) && (
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            window.open(
                                                                                route(
                                                                                    'purchase-invoices.print',
                                                                                    invoice.id
                                                                                ) + '?download=pdf',
                                                                                '_blank'
                                                                            )
                                                                        }
                                                                        className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Download PDF')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {auth.user?.permissions?.includes('view-purchase-invoices') && (
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            router.get(
                                                                                route(
                                                                                    'purchase-invoices.show',
                                                                                    invoice.id
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
                                                    </TooltipProvider>
                                                </div>

                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        {invoice.status === 'draft' && (
                                                            <>
                                                                {auth.user?.permissions?.includes(
                                                                    'post-purchase-invoices'
                                                                ) && (
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    router.post(
                                                                                        route(
                                                                                            'purchase-invoices.post',
                                                                                            invoice.id
                                                                                        )
                                                                                    )
                                                                                }
                                                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                                            >
                                                                                <FileText className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>
                                                                                {t(
                                                                                    'Post invoice to finalize and create journal entries'
                                                                                )}
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                                {auth.user?.permissions?.includes(
                                                                    'edit-purchase-invoices'
                                                                ) && (
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    router.visit(
                                                                                        route(
                                                                                            'purchase-invoices.edit',
                                                                                            invoice.id
                                                                                        )
                                                                                    )
                                                                                }
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
                                                                {auth.user?.permissions?.includes(
                                                                    'delete-purchase-invoices'
                                                                ) && (
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    openDeleteDialog(invoice.id)
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
                                                            </>
                                                        )}
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <NoRecordsFound
                                    icon={Receipt}
                                    title={t('No purchase invoices found')}
                                    description={t('Get started by creating your first purchase invoice.')}
                                    hasFilters={!!(filters.search || filters.vendor_id || filters.status)}
                                    onClearFilters={clearFilters}
                                    createPermission="create-purchase-invoices"
                                    onCreateClick={() => router.visit(route('purchase-invoices.create'))}
                                    createButtonText={t('Create Purchase Invoice')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={{ ...invoices, ...invoices.meta }}
                        routeName="purchase-invoices.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Purchase Invoice')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
