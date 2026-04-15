import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Trash2, FileText, CheckCircle, GitCompare, Calendar, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import NoRecordsFound from '@/components/no-records-found';
import Generate from './Generate';
import YearEndClose from './YearEndClose';
import { BalanceSheet, BalanceSheetsIndexProps, BalanceSheetFilters } from './types';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { balanceSheets, auth } = usePage<BalanceSheetsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<BalanceSheetFilters>({
        financial_year: urlParams.get('financial_year') || '',
        status: urlParams.get('status') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || 'balance_sheet_date');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'desc');
    const [showFilters, setShowFilters] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showYearEndModal, setShowYearEndModal] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'double-entry.balance-sheets.destroy',
        defaultMessage: t('Are you sure you want to delete this balance sheet?'),
    });

    const handleFilter = () => {
        router.get(
            route('double-entry.balance-sheets.list'),
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
            route('double-entry.balance-sheets.list'),
            { ...filters, per_page: perPage, sort: field, direction },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            financial_year: '',
            status: '',
        });
        router.get(route('double-entry.balance-sheets.list'), {
            per_page: perPage,
            sort: sortField,
            direction: sortDirection,
        });
    };

    const handleFinalize = (id: number) => {
        router.post(
            route('double-entry.balance-sheets.finalize', id),
            {},
            {
                preserveState: true,
                onSuccess: () => {
                    // Success message will be handled by flash messages
                },
            }
        );
    };

    const tableColumns = [
        {
            key: 'balance_sheet_date',
            header: t('Date'),
            sortable: true,
            render: (value: string) => formatDate(value),
        },
        {
            key: 'financial_year',
            header: t('Financial Year'),
            sortable: true,
        },
        {
            key: 'total_assets',
            header: <div className="text-end">{t('Total Assets')}</div>,
            sortable: false,
            render: (value: number) => (
                <div className="text-end tabular-nums font-medium">{formatCurrency(value)}</div>
            ),
        },
        {
            key: 'total_liabilities',
            header: <div className="text-end">{t('Total Liabilities')}</div>,
            sortable: false,
            render: (value: number) => (
                <div className="text-end tabular-nums font-medium text-destructive">{formatCurrency(value)}</div>
            ),
        },
        {
            key: 'total_equity',
            header: <div className="text-end">{t('Total Equity')}</div>,
            sortable: false,
            render: (value: number) => (
                <div className="text-end tabular-nums font-medium">{formatCurrency(value)}</div>
            ),
        },
        {
            key: 'is_balanced',
            header: t('Balanced'),
            sortable: false,
            render: (value: boolean) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                    }`}
                >
                    {t(value ? 'Yes' : 'No')}
                </span>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: true,
            render: (value: string) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value === 'finalized' ? 'bg-muted text-foreground' : 'bg-muted text-foreground'
                    }`}
                >
                    {t(value === 'finalized' ? 'Finalized' : 'Draft')}
                </span>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) =>
            [
                'view-balance-sheets',
                'print-balance-sheets',
                'finalize-balance-sheets',
                'delete-balance-sheets',
            ].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, balanceSheet: BalanceSheet) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('finalize-balance-sheets') &&
                                      balanceSheet.status === 'draft' &&
                                      balanceSheet.is_balanced && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleFinalize(balanceSheet.id)}
                                                      className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                  >
                                                      <CheckCircle className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('Finalize')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                  {auth.user?.permissions?.includes('print-balance-sheets') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => {
                                                      const printUrl =
                                                          route('double-entry.balance-sheets.print', balanceSheet.id) +
                                                          '?download=pdf';
                                                      window.open(printUrl, '_blank');
                                                  }}
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
                                  {auth.user?.permissions?.includes('view-balance-sheets') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                      router.get(
                                                          route('double-entry.balance-sheets.show', balanceSheet.id)
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
                                  {auth.user?.permissions?.includes('delete-balance-sheets') &&
                                      balanceSheet.status === 'draft' && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openDeleteDialog(balanceSheet.id)}
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
            breadcrumbs={[{ label: t('Double Entry') }, { label: t('Balance Sheets') }]}
            pageTitle={t('Balance Sheets')}
            pageActions={
                <div className="flex gap-2">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('view-balance-sheet-comparisons') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(route('double-entry.balance-sheets.comparisons'))}
                                    >
                                        <GitCompare className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('View Comparisons')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('year-end-close') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => setShowYearEndModal(true)}>
                                        <Calendar className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Year-End Close')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('create-balance-sheets') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" onClick={() => setShowGenerateModal(true)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Generate Balance Sheet')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={t('Balance Sheets')} />

            <Card className="border-0 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                <CardContent className="border-b bg-muted/50 p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.financial_year || ''}
                                onChange={(value) => setFilters({ ...filters, financial_year: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search by financial year...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <PerPageSelector routeName="double-entry.balance-sheets.list" filters={filters} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [filters.status].filter(
                                        (f) => f !== '' && f !== null && f !== undefined
                                    ).length;
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
                    <CardContent className="bg-muted/50/30 border-b p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                                        <SelectItem value="draft">{t('Draft')}</SelectItem>
                                        <SelectItem value="finalized">{t('Finalized')}</SelectItem>
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
                    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                        <div className="min-w-[800px]">
                            <DataTable
                                data={balanceSheets?.data || []}
                                columns={tableColumns}
                                onSort={handleSort}
                                sortKey={sortField}
                                sortDirection={sortDirection as 'asc' | 'desc'}
                                className="rounded-none"
                                emptyState={
                                    <NoRecordsFound
                                        icon={FileText}
                                        title={t('No Balance Sheets found')}
                                        description={t('Get started by generating your first balance sheet.')}
                                        hasFilters={!!(filters.financial_year || filters.status)}
                                        onClearFilters={clearFilters}
                                        createPermission="create-balance-sheets"
                                        onCreateClick={() => setShowGenerateModal(true)}
                                        createButtonText={t('Generate Balance Sheet')}
                                        className="h-auto"
                                    />
                                }
                            />
                        </div>
                    </div>
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={balanceSheets || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }}
                        routeName="double-entry.balance-sheets.list"
                        filters={{ ...filters, per_page: perPage }}
                    />
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Balance Sheet')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />

            <Generate open={showGenerateModal} onOpenChange={setShowGenerateModal} />

            <YearEndClose open={showYearEndModal} onOpenChange={setShowYearEndModal} />
        </AuthenticatedLayout>
    );
}
