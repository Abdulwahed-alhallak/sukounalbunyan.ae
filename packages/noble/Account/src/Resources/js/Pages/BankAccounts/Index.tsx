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
import { Plus, Edit as EditIcon, Trash2, Eye, CreditCard as CreditCardIcon, Download, FileImage } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { Input } from '@/components/ui/input';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditBankAccount from './Edit';
import View from './View';
import NoRecordsFound from '@/components/no-records-found';
import { BankAccount, BankAccountsIndexProps, BankAccountFilters, BankAccountModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';
import { usePageButtons } from '@/hooks/usePageButtons';

export default function Index() {
    const { t } = useTranslation();
    const { bankaccounts, auth, chartofaccounts } = usePage<BankAccountsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<BankAccountFilters>({
        account_number: urlParams.get('account_number') || '',
        account_name: urlParams.get('account_name') || '',
        bank_name: urlParams.get('bank_name') || '',
        account_type: urlParams.get('account_type') || '',
        is_active: urlParams.get('is_active') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<BankAccountModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<BankAccount | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const googleDriveButtons = usePageButtons('googleDriveBtn', {
        module: 'Bank Accounts',
        settingKey: 'GoogleDrive Bank Accounts',
    });
    const oneDriveButtons = usePageButtons('oneDriveBtn', {
        module: 'Bank Accounts',
        settingKey: 'OneDrive Bank Accounts',
    });
    const dropboxBtn = usePageButtons('dropboxBtn', {
        module: 'Account Bank Accounts',
        settingKey: 'Dropbox Account Bank Accounts',
    });
    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'account.bank-accounts.destroy',
        defaultMessage: t('Are you sure you want to delete this bank account?'),
    });

    const handleFilter = () => {
        router.get(
            route('account.bank-accounts.index'),
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
            route('account.bank-accounts.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            account_number: '',
            account_name: '',
            bank_name: '',
            account_type: '',
            is_active: '',
        });
        router.get(route('account.bank-accounts.index'), {
            per_page: perPage,
            sort: sortField,
            direction: sortDirection,
            view: viewMode,
        });
    };

    const openModal = (mode: 'add' | 'edit', data: BankAccount | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'account_number',
            header: t('Account Number'),
            sortable: true,
        },
        {
            key: 'account_name',
            header: t('Account Name'),
            sortable: true,
        },
        {
            key: 'bank_name',
            header: t('Bank Name'),
            sortable: true,
        },
        {
            key: 'account_type',
            header: t('Account Type'),
            sortable: false,
            render: (value: any) => {
                const options: any = { '0': t('checking'), '1': t('savings'), '2': t('credit'), '3': t('loan') };
                return options[value] || value;
            },
        },
        {
            key: 'current_balance',
            header: t('Current Balance'),
            sortable: false,
            render: (value: number) => (value ? formatCurrency(value) : '-'),
        },
        {
            key: 'is_active',
            header: t('Is Active'),
            sortable: false,
            render: (value: boolean) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                    }`}
                >
                    {value ? t('Active') : t('Inactive')}
                </span>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-bank-accounts', 'edit-bank-accounts', 'delete-bank-accounts'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, bankaccount: BankAccount) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('view-bank-accounts') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingItem(bankaccount)}
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
                                  {auth.user?.permissions?.includes('edit-bank-accounts') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', bankaccount)}
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
                                  {auth.user?.permissions?.includes('delete-bank-accounts') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(bankaccount.id)}
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
            breadcrumbs={[{ label: t('Accounting'), url: route('account.index') }, { label: t('Bank Accounts') }]}
            pageTitle={t('Manage Bank Accounts')}
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
                        {auth.user?.permissions?.includes('create-bank-accounts') && (
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
                </div>
            }
        >
            <Head title={t('Bank Accounts')} />

            {/* Main Content Card */}
            <Card className="shadow-sm">
                {/* Search & Controls Header */}
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.account_number}
                                onChange={(value) => setFilters({ ...filters, account_number: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search Bank Accounts...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="account.bank-accounts.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="account.bank-accounts.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.bank_name,
                                        filters.account_type,
                                        filters.is_active,
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
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Bank Name')}
                                </label>
                                <Input
                                    placeholder={t('Filter by Bank Name')}
                                    value={filters.bank_name}
                                    onChange={(e) => setFilters({ ...filters, bank_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Account Type')}
                                </label>
                                <Select
                                    value={filters.account_type}
                                    onValueChange={(value) => setFilters({ ...filters, account_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Account Type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">{t('checking')}</SelectItem>
                                        <SelectItem value="1">{t('savings')}</SelectItem>
                                        <SelectItem value="2">{t('credit')}</SelectItem>
                                        <SelectItem value="3">{t('loan')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Status')}</label>
                                <Select
                                    value={filters.is_active}
                                    onValueChange={(value) => setFilters({ ...filters, is_active: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">{t('Active')}</SelectItem>
                                        <SelectItem value="0">{t('Inactive')}</SelectItem>
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
                                    data={bankaccounts?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={CreditCardIcon}
                                            title={t('No Bank Accounts found')}
                                            description={t('Get started by creating your first Bank Account.')}
                                            hasFilters={
                                                !!(
                                                    filters.account_number ||
                                                    filters.bank_name ||
                                                    filters.account_type ||
                                                    filters.is_active
                                                )
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-bank-accounts"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Bank Account')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {bankaccounts?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {bankaccounts?.data?.map((bankaccount) => (
                                        <Card key={bankaccount.id} className="flex flex-col border border-border">
                                            <div className="flex-1 p-4">
                                                <div className="mb-3 flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-foreground">
                                                        <CreditCardIcon className="h-6 w-6 text-background" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-semibold text-foreground">
                                                            {bankaccount.account_number}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="mb-3 space-y-3">
                                                    <div>
                                                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                                                            {t('Account Name')}
                                                        </p>
                                                        <p className="truncate text-xs text-foreground">
                                                            {bankaccount.account_name || '-'}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('Type')}
                                                        </span>
                                                        <span className="rounded-full bg-muted px-2 py-1 text-sm capitalize text-foreground">
                                                            {(() => {
                                                                const options: any = {
                                                                    '0': t('checking'),
                                                                    '1': t('savings'),
                                                                    '2': t('credit'),
                                                                    '3': t('loan'),
                                                                };
                                                                return (
                                                                    options[bankaccount.account_type] ||
                                                                    bankaccount.account_type
                                                                );
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('Bank Name')}
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            {bankaccount.bank_name || '-'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('Current Balance')}
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            {bankaccount.current_balance
                                                                ? formatCurrency(bankaccount.current_balance)
                                                                : '-'}
                                                        </span>
                                                    </div>
                                                    {bankaccount.payment_gateway && (
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">
                                                                {t('Payment Gateway')}
                                                            </span>
                                                            <span className="text-sm">
                                                                {bankaccount.payment_gateway}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {bankaccount.gl_account && (
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-muted-foreground">
                                                                {t('GL Account')}
                                                            </span>
                                                            <span className="text-sm">
                                                                {bankaccount.gl_account.account_name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-muted/50/50 flex items-center justify-between border-t p-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-sm ${
                                                        bankaccount.is_active
                                                            ? 'bg-muted text-foreground'
                                                            : 'bg-muted text-destructive'
                                                    }`}
                                                >
                                                    {bankaccount.is_active ? t('Active') : t('Inactive')}
                                                </span>
                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        {auth.user?.permissions?.includes('view-bank-accounts') && (
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setViewingItem(bankaccount)}
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
                                                        {auth.user?.permissions?.includes('edit-bank-accounts') && (
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openModal('edit', bankaccount)}
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
                                                        {auth.user?.permissions?.includes('delete-bank-accounts') && (
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openDeleteDialog(bankaccount.id)}
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
                                    icon={CreditCardIcon}
                                    title={t('No Bank Accounts found')}
                                    description={t('Get started by creating your first Bank Account.')}
                                    hasFilters={
                                        !!(
                                            filters.account_number ||
                                            filters.bank_name ||
                                            filters.account_type ||
                                            filters.is_active
                                        )
                                    }
                                    onClearFilters={clearFilters}
                                    createPermission="create-bank-accounts"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Bank Account')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={bankaccounts || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }}
                        routeName="account.bank-accounts.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditBankAccount bankaccount={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View bankaccount={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Bank Account')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
