import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    formatAdminCurrency,
    formatDate as formatDateHelper,
    getPackageFavicon,
    getPackageAlias,
} from '@/utils/helpers';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { FilterButton } from '@/components/ui/filter-button';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { Eye, Check, X, Download, FileText, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import NoRecordsFound from '@/components/no-records-found';

interface BankTransferRequest {
    id: number;
    order_id: string;
    status: 'pending' | 'approved' | 'rejected';
    price_currency: string;
    attachment: string;
    price: number;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    plan?: {
        id: number;
        name: string;
    };
    request: {
        plan_id: number;
        user_counter_input: number;
        storage_counter_input: number;
        time_period: string;
        coupon_code?: string;
        addon_name?: string;
    };
}

interface Props {
    requests: {
        data: BankTransferRequest[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: any;
        meta: any;
    };
}

export default function BankTransferIndex({ requests }: Props) {
    const { t } = useTranslation();
    const pageProps = usePage().props as any;
    const { auth, imageUrlPrefix } = pageProps;
    const urlParams = new URLSearchParams(window.location.search);

    const [viewingRequest, setViewingRequest] = useState<BankTransferRequest | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; requestId: number | null }>({
        isOpen: false,
        requestId: null,
    });
    const [approveDialog, setApproveDialog] = useState<{ isOpen: boolean; request: BankTransferRequest | null }>({
        isOpen: false,
        request: null,
    });
    const [rejectDialog, setRejectDialog] = useState<{ isOpen: boolean; request: BankTransferRequest | null }>({
        isOpen: false,
        request: null,
    });
    const [filters, setFilters] = useState({
        order_number: urlParams.get('order_number') || '',
        status: urlParams.get('status') || '',
        user_name: urlParams.get('user_name') || '',
    });
    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'desc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [showFilters, setShowFilters] = useState(false);

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'px-2 py-1 rounded-full text-sm bg-muted text-foreground',
            approved: 'px-2 py-1 rounded-full text-sm bg-muted text-foreground',
            rejected: 'px-2 py-1 rounded-full text-sm bg-muted text-destructive',
        };

        return (
            <span className={variants[status as keyof typeof variants]}>
                {t(status.charAt(0).toUpperCase() + status.slice(1))}
            </span>
        );
    };

    const handleFilter = () => {
        router.get(
            route('bank-transfer.index'),
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
            route('bank-transfer.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ order_number: '', status: '', user_name: '' });
        router.get(route('bank-transfer.index'), { per_page: perPage, view: viewMode });
    };

    const handleApprove = (request: BankTransferRequest) => {
        setApproveDialog({ isOpen: true, request });
    };

    const confirmApprove = () => {
        if (approveDialog.request) {
            setProcessingId(approveDialog.request.id);
            router.post(
                route('bank-transfer.update', approveDialog.request.id),
                { status: 'approved' },
                {
                    onFinish: () => setProcessingId(null),
                }
            );
        }
        setApproveDialog({ isOpen: false, request: null });
    };

    const handleReject = (request: BankTransferRequest) => {
        setRejectDialog({ isOpen: true, request });
    };

    const confirmReject = () => {
        if (rejectDialog.request) {
            setProcessingId(rejectDialog.request.id);
            router.post(
                route('bank-transfer.update', rejectDialog.request.id),
                { status: 'rejected' },
                {
                    onFinish: () => setProcessingId(null),
                }
            );
        }
        setRejectDialog({ isOpen: false, request: null });
    };

    const handleDelete = (requestId: number) => {
        setProcessingId(requestId);
        router.delete(route('bank-transfer.destroy', requestId), {
            onFinish: () => setProcessingId(null),
        });
        setDeleteDialog({ isOpen: false, requestId: null });
    };

    const downloadReceipt = (attachment: string) => {
        const link = document.createElement('a');
        link.href = `${imageUrlPrefix}/${attachment}`;
        link.download = attachment.split('/').pop() || 'receipt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const tableColumns = [
        {
            key: 'order_id',
            header: t('Order Number'),
            sortable: true,
            render: (_: any, request: BankTransferRequest) => request.order_id,
        },
        {
            key: 'user',
            header: t('User'),
            sortable: true,
            render: (_: any, request: BankTransferRequest) => (
                <div>
                    <div className="font-medium">{request.user?.name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">{request.user?.email || 'N/A'}</div>
                </div>
            ),
        },
        {
            key: 'plan',
            header: t('Plan'),
            render: (_: any, request: BankTransferRequest) => (
                <div>
                    <div>{request.plan?.name || 'N/A'}</div>
                </div>
            ),
        },
        {
            key: 'amount',
            header: t('Amount'),
            render: (_: any, request: BankTransferRequest) => formatAdminCurrency(request.price, pageProps),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: true,
            render: (_: any, request: BankTransferRequest) => getStatusBadge(request.status),
        },
        {
            key: 'created_at',
            header: t('Date'),
            sortable: true,
            render: (_: any, request: BankTransferRequest) => formatDateHelper(request.created_at, pageProps),
        },
        {
            key: 'actions',
            header: t('Actions'),
            render: (_: any, request: BankTransferRequest) => (
                <div className="flex gap-1">
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewingRequest(request)}
                                    className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('View')}</p>
                            </TooltipContent>
                        </Tooltip>
                        {request.status === 'pending' && auth?.user?.roles?.includes('superadmin') && (
                            <>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleApprove(request)}
                                            disabled={processingId === request.id}
                                            className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Approve')}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleReject(request)}
                                            disabled={processingId === request.id}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Reject')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                        {(auth?.user?.roles?.includes('superadmin') || request.status === 'pending') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteDialog({ isOpen: true, requestId: request.id })}
                                        disabled={processingId === request.id}
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
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Bank Transfer Requests') }]}
            pageTitle={t('Manage Bank Transfer Requests')}
        >
            <Head title={t('Bank Transfer Requests')} />

            {/* Main Content Card */}
            <Card className="shadow-sm">
                {/* Search & Controls Header */}
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.order_number}
                                onChange={(value) => setFilters({ ...filters, order_number: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search by order number...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <PerPageSelector routeName="bank-transfer.index" filters={{ ...filters, view: viewMode }} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [filters.status, filters.user_name].filter(Boolean).length;
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                                        <SelectItem value="approved">{t('Approved')}</SelectItem>
                                        <SelectItem value="rejected">{t('Rejected')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('User Name')}
                                </label>
                                <Input
                                    placeholder={t('Filter by user name')}
                                    value={filters.user_name}
                                    onChange={(e) => setFilters({ ...filters, user_name: e.target.value })}
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
                    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                        <div className="min-w-[800px]">
                            <DataTable
                                data={requests.data}
                                columns={tableColumns}
                                onSort={handleSort}
                                sortKey={sortField}
                                sortDirection={sortDirection as 'asc' | 'desc'}
                                className="rounded-none"
                                emptyState={
                                    <NoRecordsFound
                                        icon={FileText}
                                        title={t('No bank transfer requests found')}
                                        description={t(
                                            'Bank transfer requests will appear here when users submit them.'
                                        )}
                                        hasFilters={!!(filters.order_number || filters.status || filters.user_name)}
                                        onClearFilters={clearFilters}
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
                        data={requests}
                        routeName="bank-transfer.index"
                        filters={{ ...filters, per_page: perPage }}
                    />
                </CardContent>
            </Card>

            {/* View Request Dialog */}
            <Dialog open={!!viewingRequest} onOpenChange={() => setViewingRequest(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t('Bank Transfer Request Details')}</DialogTitle>
                        <DialogDescription>
                            {t('Order')}: {viewingRequest?.order_id}
                        </DialogDescription>
                    </DialogHeader>

                    {viewingRequest && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">{t('User')}</Label>
                                    <div className="mt-1">
                                        <div className="font-medium">{viewingRequest.user?.name || 'N/A'}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {viewingRequest.user?.email || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">{t('Plan')}</Label>
                                    <div className="mt-1">
                                        <div className="font-medium">{viewingRequest.plan?.name || '-'}</div>
                                        {viewingRequest.request?.addon_name && (
                                            <div className="mt-1 text-sm text-muted-foreground">
                                                {t('Feature')}: {viewingRequest.request.addon_name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">{t('Amount')}</Label>
                                    <div className="mt-1 font-medium">
                                        {formatAdminCurrency(viewingRequest.price, pageProps)}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">{t('Status')}</Label>
                                    <div className="mt-1">{getStatusBadge(viewingRequest.status)}</div>
                                </div>
                            </div>

                            {viewingRequest.request?.coupon_code && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('Coupon Code')}
                                    </Label>
                                    <div className="mt-1 font-medium">{viewingRequest.request.coupon_code}</div>
                                </div>
                            )}

                            {viewingRequest.attachment && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('Payment Receipt')}
                                    </Label>
                                    <div className="mt-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => downloadReceipt(viewingRequest.attachment)}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            {t('Download Receipt')}
                                        </Button>
                                    </div>

                                    {/* Feature List */}
                                    <div className="mt-3">
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('Features')}
                                        </Label>
                                        <div className="mt-2">
                                            {(() => {
                                                const requestData =
                                                    typeof viewingRequest.request === 'string'
                                                        ? JSON.parse(viewingRequest.request)
                                                        : viewingRequest.request;
                                                return requestData?.user_module_input ? (
                                                    <div className="max-h-96 overflow-y-auto">
                                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                            {requestData.user_module_input.split(',').map(
                                                                (module: string, index: number) =>
                                                                    module.trim() && (
                                                                        <div
                                                                            key={index}
                                                                            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                                                        >
                                                                            <img
                                                                                src={getPackageFavicon(module.trim())}
                                                                                alt={module.trim()}
                                                                                className="h-6 w-6 flex-shrink-0"
                                                                            />
                                                                            <span className="truncate text-sm font-medium">
                                                                                {getPackageAlias(module.trim())}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground">
                                                        {t('No features')}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {viewingRequest?.status === 'pending' && auth?.user?.type === 'superadmin' && (
                        <DialogFooter className="flex justify-end gap-2 pt-4">
                            <Button
                                onClick={() => {
                                    handleApprove(viewingRequest);
                                    setViewingRequest(null);
                                }}
                                disabled={processingId === viewingRequest.id}
                                className="bg-foreground hover:bg-accent"
                            >
                                <Check className="h-4 w-4" />
                                {t('Approve')}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    handleReject(viewingRequest);
                                    setViewingRequest(null);
                                }}
                                disabled={processingId === viewingRequest.id}
                            >
                                <X className="h-4 w-4" />
                                {t('Reject')}
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={deleteDialog.isOpen}
                onOpenChange={(open) => setDeleteDialog({ isOpen: open, requestId: null })}
                title={t('Delete Request')}
                message={t('Are you sure you want to delete this bank transfer request? This action cannot be undone.')}
                confirmText={t('Delete')}
                onConfirm={() => deleteDialog.requestId && handleDelete(deleteDialog.requestId)}
                variant="destructive"
            />

            <ConfirmationDialog
                open={approveDialog.isOpen}
                onOpenChange={(open) => setApproveDialog({ isOpen: open, request: null })}
                title={t('Approve Request')}
                message={t('Are you sure you want to approve this bank transfer request?')}
                confirmText={t('Approve')}
                onConfirm={confirmApprove}
                variant="default"
            />

            <ConfirmationDialog
                open={rejectDialog.isOpen}
                onOpenChange={(open) => setRejectDialog({ isOpen: open, request: null })}
                title={t('Reject Request')}
                message={t('Are you sure you want to reject this bank transfer request?')}
                confirmText={t('Reject')}
                onConfirm={confirmReject}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
