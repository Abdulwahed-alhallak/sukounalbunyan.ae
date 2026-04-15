import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { FilterButton } from '@/components/ui/filter-button';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { Input } from '@/components/ui/input';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NoRecordsFound from '@/components/no-records-found';
import { CreditCard as CreditCardIcon, CheckCircle, Circle } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { usePageButtons } from '@/hooks/usePageButtons';
interface BankTransaction {
    id: number;
    bank_account_id: number;
    transaction_date: string;
    transaction_type: 'debit' | 'credit';
    reference_number: string;
    description: string;
    amount: number;
    running_balance: number;
    transaction_status: 'pending' | 'cleared' | 'cancelled';
    reconciliation_status: 'unreconciled' | 'reconciled';
    bank_account: {
        id: number;
        account_name: string;
        account_number: string;
    };
}

interface BankAccount {
    id: number;
    account_name: string;
    account_number: string;
}

interface BankTransactionsIndexProps {
    [key: string]: any;
    transactions: {
        data: BankTransaction[];
        links: any[];
        meta: any;
    };
    bankAccounts: BankAccount[];
    filters: {
        bank_account_id?: string;
        transaction_type?: string;
        search?: string;
    };
    auth: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { transactions, bankAccounts, auth } = usePage<BankTransactionsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState({
        bank_account_id: urlParams.get('bank_account_id') || '',
        transaction_type: urlParams.get('transaction_type') || '',
        search: urlParams.get('search') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [showFilters, setShowFilters] = useState(false);

    const googleDriveButtons = usePageButtons('googleDriveBtn', {
        module: 'Transaction',
        settingKey: 'GoogleDrive Transaction',
    });
    const oneDriveButtons = usePageButtons('oneDriveBtn', {
        module: 'Transaction',
        settingKey: 'OneDrive Transaction',
    });
    const dropboxBtn = usePageButtons('dropboxBtn', {
        module: 'Account Transaction',
        settingKey: 'Dropbox Account Transaction',
    });
    const handleFilter = () => {
        router.get(
            route('account.bank-transactions.index'),
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
            route('account.bank-transactions.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            bank_account_id: '',
            transaction_type: '',
            search: '',
        });
        router.get(route('account.bank-transactions.index'), {
            per_page: perPage,
            sort: sortField,
            direction: sortDirection,
            view: viewMode,
        });
    };

    const markReconciled = (id: number) => {
        router.post(
            route('account.bank-transactions.mark-reconciled', id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Page will refresh automatically
                },
            }
        );
    };

    const tableColumns = [
        {
            key: 'transaction_date',
            header: t('Date'),
            sortable: true,
            render: (value: string) => formatDate(value),
        },
        {
            key: 'bank_account',
            header: t('Bank Account'),
            sortable: false,
            render: (value: any) => `${value.account_name} (${value.account_number})`,
        },
        {
            key: 'reference_number',
            header: t('Reference'),
            sortable: true,
        },
        {
            key: 'transaction_type',
            header: t('Type'),
            sortable: true,
            render: (value: string) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value === 'debit' ? 'bg-muted text-destructive' : 'bg-muted text-foreground'
                    }`}
                >
                    {t(value.charAt(0).toUpperCase() + value.slice(1))}
                </span>
            ),
        },
        {
            key: 'amount',
            header: t('Amount'),
            sortable: true,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'running_balance',
            header: t('Balance'),
            sortable: false,
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'description',
            header: t('Description'),
            sortable: false,
        },
        {
            key: 'transaction_status',
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
                    {t(value.charAt(0).toUpperCase() + value.slice(1))}
                </span>
            ),
        },
        {
            key: 'actions',
            header: t('Actions'),
            render: (_: any, transaction: BankTransaction) => (
                <div className="flex items-center justify-center">
                    <TooltipProvider>
                        {transaction.reconciliation_status === 'unreconciled' ? (
                            auth.user?.permissions?.includes('reconcile-bank-transactions') ? (
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => markReconciled(transaction.id)}
                                            className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                        >
                                            <Circle className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Mark as Reconciled')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                            )
                        ) : (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div className="inline-flex">
                                        <CheckCircle className="h-4 w-4 text-foreground" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Reconciled')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Accounting'), url: route('account.index') }, { label: t('Bank Transactions') }]}
            pageTitle={t('Manage Bank Transactions')}
            pageActions={
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        {googleDriveButtons?.map((button) => (
                            <span key={button.id}>{button.component}</span>
                        ))}
                        {oneDriveButtons?.map((button) => (
                            <span key={button.id}>{button.component}</span>
                        ))}
                        {dropboxBtn?.map((button) => (
                            <span key={button.id}>{button.component}</span>
                        ))}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={t('Bank Transactions')} />
            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.search}
                                onChange={(value) => setFilters({ ...filters, search: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search transactions...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="account.bank-transactions.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="account.bank-transactions.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [filters.bank_account_id, filters.transaction_type].filter(
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
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Bank Account')}
                                </label>
                                <Select
                                    value={filters.bank_account_id}
                                    onValueChange={(value) => setFilters({ ...filters, bank_account_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Bank Account')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bankAccounts?.map((account) => (
                                            <SelectItem key={account.id} value={account.id.toString()}>
                                                {account.account_name} ({account.account_number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Transaction Type')}
                                </label>
                                <Select
                                    value={filters.transaction_type}
                                    onValueChange={(value) => setFilters({ ...filters, transaction_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="debit">{t('Debit')}</SelectItem>
                                        <SelectItem value="credit">{t('Credit')}</SelectItem>
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
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={transactions?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={CreditCardIcon}
                                            title={t('No transactions found')}
                                            description={t('Bank transactions will appear here once created.')}
                                            hasFilters={
                                                !!(
                                                    filters.search ||
                                                    filters.bank_account_id ||
                                                    filters.transaction_type
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {transactions?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {transactions?.data?.map((transaction) => (
                                        <Card key={transaction.id} className="flex flex-col border border-border">
                                            <div className="flex-1 p-4">
                                                <div className="mb-3 flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-foreground">
                                                        <CreditCardIcon className="h-6 w-6 text-background" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-semibold text-foreground">
                                                            {transaction.reference_number}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                                                            {t('Bank Account')}
                                                        </p>
                                                        <p className="truncate text-xs text-foreground">
                                                            {transaction.bank_account.account_name} (
                                                            {transaction.bank_account.account_number})
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('Date')}
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            {formatDate(transaction.transaction_date)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('Type')}
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-sm ${
                                                                transaction.transaction_type === 'debit'
                                                                    ? 'bg-muted text-destructive'
                                                                    : 'bg-muted text-foreground'
                                                            }`}
                                                        >
                                                            {t(
                                                                transaction.transaction_type.charAt(0).toUpperCase() +
                                                                    transaction.transaction_type.slice(1)
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('Amount')}
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            {formatCurrency(transaction.amount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('Balance')}
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            {formatCurrency(transaction.running_balance)}
                                                        </span>
                                                    </div>
                                                    {transaction.description && (
                                                        <div>
                                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                {t('Description')}
                                                            </p>
                                                            <p className="text-xs text-foreground">
                                                                {transaction.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-muted/50/50 flex items-center justify-between border-t p-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-sm ${
                                                        transaction.transaction_status === 'cleared'
                                                            ? 'bg-muted text-foreground'
                                                            : transaction.transaction_status === 'pending'
                                                              ? 'bg-muted text-foreground'
                                                              : 'bg-muted text-destructive'
                                                    }`}
                                                >
                                                    {t(
                                                        transaction.transaction_status.charAt(0).toUpperCase() +
                                                            transaction.transaction_status.slice(1)
                                                    )}
                                                </span>
                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        {transaction.reconciliation_status === 'unreconciled' ? (
                                                            auth.user?.permissions?.includes(
                                                                'reconcile-bank-transactions'
                                                            ) ? (
                                                                <Tooltip delayDuration={0}>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                markReconciled(transaction.id)
                                                                            }
                                                                            className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                        >
                                                                            <Circle className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('Mark as Reconciled')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            ) : (
                                                                <Circle className="h-4 w-4 text-muted-foreground" />
                                                            )
                                                        ) : (
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <div className="inline-flex">
                                                                        <CheckCircle className="h-4 w-4 text-foreground" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Reconciled')}</p>
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
                                    icon={CreditCardIcon}
                                    title={t('No transactions found')}
                                    description={t('Bank transactions will appear here once created.')}
                                    hasFilters={
                                        !!(filters.search || filters.bank_account_id || filters.transaction_type)
                                    }
                                    onClearFilters={clearFilters}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={transactions || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }}
                        routeName="account.bank-transactions.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
