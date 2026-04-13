import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit as EditIcon, Trash2, Play, Eye, ArrowRightLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import Create from './Create';
import Edit from './Edit';
import View from './View';
import NoRecordsFound from '@/components/no-records-found';
import { BankTransfer, BankTransfersIndexProps, BankTransferFilters, BankTransferModalState } from './types';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { banktransfers, auth, bankaccounts } = usePage<BankTransfersIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<BankTransferFilters>({
        transfer_number: urlParams.get('transfer_number') || '',
        status: urlParams.get('status') || '',
        from_account_id: urlParams.get('from_account_id') || '',
        to_account_id: urlParams.get('to_account_id') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'desc');
    const [modalState, setModalState] = useState<BankTransferModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });

    const [showFilters, setShowFilters] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [viewingTransfer, setViewingTransfer] = useState<BankTransfer | null>(null);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'account.bank-transfers.destroy',
        defaultMessage: t('Are you sure you want to delete this bank transfer?'),
    });

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-muted text-foreground dark:bg-foreground/20 dark:text-muted-foreground',
            completed: 'bg-muted text-foreground dark:bg-foreground/20 dark:text-muted-foreground',
            failed: 'bg-muted text-destructive dark:bg-destructive/20 dark:text-destructive',
        };

        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {t(status.charAt(0).toUpperCase() + status.slice(1))}
            </Badge>
        );
    };

    const handleFilter = () => {
        router.get(
            route('account.bank-transfers.index'),
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
            route('account.bank-transfers.index'),
            { ...filters, per_page: perPage, sort: field, direction },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({
            transfer_number: '',
            status: '',
            from_account_id: '',
            to_account_id: '',
        });
        router.get(route('account.bank-transfers.index'), {
            per_page: perPage,
            sort: sortField,
            direction: sortDirection,
        });
    };

    const openModal = (mode: 'add' | 'edit', data: BankTransfer | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const handleProcess = (transfer: BankTransfer) => {
        setProcessingId(transfer.id);
        router.post(
            route('account.bank-transfers.process', transfer.id),
            {},
            {
                onFinish: () => setProcessingId(null),
            }
        );
    };

    const tableColumns = [
        {
            key: 'transfer_number',
            header: t('Transfer Number'),
            sortable: true,
            render: (value: string, transfer: BankTransfer) =>
                auth.user?.permissions?.includes('view-bank-transfers') ? (
                    <span
                        className="cursor-pointer text-foreground hover:text-foreground"
                        onClick={() => setViewingTransfer(transfer)}
                    >
                        {value}
                    </span>
                ) : (
                    value
                ),
        },
        {
            key: 'transfer_date',
            header: t('Date'),
            sortable: true,
            render: (value: string) => formatDate(value),
        },
        {
            key: 'from_account',
            header: t('From Account'),
            render: (_: any, transfer: BankTransfer) => (
                <div>
                    <div className="font-medium">{transfer.from_account.account_name}</div>
                    <div className="text-sm text-muted-foreground">{transfer.from_account.account_number}</div>
                </div>
            ),
        },
        {
            key: 'to_account',
            header: t('To Account'),
            render: (_: any, transfer: BankTransfer) => (
                <div>
                    <div className="font-medium">{transfer.to_account.account_name}</div>
                    <div className="text-sm text-muted-foreground">{transfer.to_account.account_number}</div>
                </div>
            ),
        },
        {
            key: 'transfer_amount',
            header: t('Amount'),
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: true,
            render: (value: string) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value === 'completed'
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
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-bank-transfers', 'edit-bank-transfers', 'delete-bank-transfers', 'process-bank-transfers'].includes(
                p
            )
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, transfer: BankTransfer) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {transfer.status === 'pending' &&
                                      auth.user?.permissions?.includes('process-bank-transfers') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleProcess(transfer)}
                                                      disabled={processingId === transfer.id}
                                                      className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                  >
                                                      <Play className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('Process Transfer')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                  {auth.user?.permissions?.includes('view-bank-transfers') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setViewingTransfer(transfer)}
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
                                  {transfer.status === 'pending' &&
                                      auth.user?.permissions?.includes('edit-bank-transfers') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openModal('edit', transfer)}
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
                                  {transfer.status === 'pending' &&
                                      auth.user?.permissions?.includes('delete-bank-transfers') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openDeleteDialog(transfer.id)}
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
                { label: t('Accounting'), url: route('account.index') },
                { label: t('Banking') },
                { label: t('Bank Transfers') },
            ]}
            pageTitle={t('Manage Bank Transfers')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-bank-transfers') && (
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
            <Head title={t('Bank Transfers')} />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.transfer_number}
                                onChange={(value) => setFilters({ ...filters, transfer_number: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search by transfer number or reference...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <PerPageSelector routeName="account.bank-transfers.index" filters={filters} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [
                                        filters.status,
                                        filters.from_account_id,
                                        filters.to_account_id,
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

                {showFilters && (
                    <CardContent className="bg-muted/50/30 border-b p-6">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="min-w-[200px] flex-1">
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Status')}</label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">{t('Pending')}</SelectItem>
                                        <SelectItem value="completed">{t('Completed')}</SelectItem>
                                        <SelectItem value="failed">{t('Failed')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="min-w-[200px] flex-1">
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('From Account')}
                                </label>
                                <Select
                                    value={filters.from_account_id}
                                    onValueChange={(value) => setFilters({ ...filters, from_account_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by From Account')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bankaccounts?.map((account) => (
                                            <SelectItem key={account.id} value={account.id.toString()}>
                                                {account.account_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="min-w-[200px] flex-1">
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('To Account')}
                                </label>
                                <Select
                                    value={filters.to_account_id}
                                    onValueChange={(value) => setFilters({ ...filters, to_account_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by To Account')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bankaccounts?.map((account) => (
                                            <SelectItem key={account.id} value={account.id.toString()}>
                                                {account.account_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
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
                                data={banktransfers?.data || []}
                                columns={tableColumns}
                                onSort={handleSort}
                                sortKey={sortField}
                                sortDirection={sortDirection as 'asc' | 'desc'}
                                className="rounded-none"
                                emptyState={
                                    <NoRecordsFound
                                        icon={ArrowRightLeft}
                                        title={t('No Bank Transfers found')}
                                        description={t('Get started by creating your first Bank Transfer.')}
                                        hasFilters={
                                            !!(
                                                filters.transfer_number ||
                                                filters.status ||
                                                filters.from_account_id ||
                                                filters.to_account_id
                                            )
                                        }
                                        onClearFilters={clearFilters}
                                        createPermission="create-bank-transfers"
                                        onCreateClick={() => openModal('add')}
                                        createButtonText={t('Create Bank Transfer')}
                                        className="h-auto"
                                    />
                                }
                            />
                        </div>
                    </div>
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={banktransfers || { data: [], links: [], meta: {} }}
                        routeName="account.bank-transfers.index"
                        filters={filters}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <Edit banktransfer={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingTransfer} onOpenChange={() => setViewingTransfer(null)}>
                {viewingTransfer && <View banktransfer={viewingTransfer} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Bank Transfer')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
