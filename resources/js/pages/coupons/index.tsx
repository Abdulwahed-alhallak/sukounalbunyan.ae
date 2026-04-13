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
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit, Trash2, Ticket, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/utils/helpers';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import Create from './create';
import EditCoupon from './edit';
import NoRecordsFound from '@/components/no-records-found';

import { Coupon, CouponsIndexProps, CouponFilters, CouponModalState } from './types';

export default function Index() {
    const { t } = useTranslation();
    const { coupons, auth, ...pageProps } = usePage<CouponsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);
    const currencySymbol = (pageProps as any)?.companyAllSetting?.currencySymbol || '$';

    const [filters, setFilters] = useState<CouponFilters>({
        name: urlParams.get('name') || '',
        code: urlParams.get('code') || '',
        type: urlParams.get('type') || '',
        status: urlParams.get('status') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');

    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<CouponModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [showFilters, setShowFilters] = useState(false);

    const pageButtons = usePageButtons('couponBtn', 'Test data');

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'coupons.destroy',
        defaultMessage: t('Are you sure you want to delete this coupon?'),
    });

    const handleFilter = () => {
        router.get(
            route('coupons.index'),
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
            route('coupons.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ name: '', code: '', type: '', status: '' });
        router.get(route('coupons.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: Coupon | null = null) => {
        setModalState({
            isOpen: true,
            mode,
            data,
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            mode: '',
            data: null,
        });
    };

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: true,
        },
        {
            key: 'code',
            header: t('Code'),
            sortable: true,
            render: (value: string) => (
                <span className="rounded-full bg-muted px-2 py-1 font-mono text-sm">{value}</span>
            ),
        },
        {
            key: 'discount',
            header: t('Discount'),
            render: (value: number, coupon: Coupon) => (
                <span className="font-medium">
                    {coupon.type === 'percentage' ? `${value}%` : `${currencySymbol}${value}`}
                </span>
            ),
        },
        {
            key: 'type',
            header: t('Type'),
            sortable: true,
            render: (value: string) => (
                <span className="rounded-full bg-muted px-2 py-1 text-sm capitalize text-foreground">{value}</span>
            ),
        },
        {
            key: 'limit',
            header: t('Limit'),
            render: (value: number) => value || t('Unlimited'),
        },
        {
            key: 'expiry_date',
            header: t('Expiry Date'),
            render: (value: string) => (value ? formatDate(value, pageProps) : t('No Expiry')),
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: true,
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
        {
            key: 'actions',
            header: t('Actions'),
            render: (_: any, coupon: Coupon) => (
                <div className="flex gap-1">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('view-coupons') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => (window.location.href = route('coupons.show', coupon.id))}
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
                        {auth.user?.permissions?.includes('edit-coupons') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openModal('edit', coupon)}
                                        className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Edit')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('delete-coupons') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDeleteDialog(coupon.id)}
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
            breadcrumbs={[{ label: t('Coupons') }]}
            pageTitle={t('Manage Coupons')}
            pageActions={
                <div className="flex gap-2">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('create-coupons') && (
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
                        {pageButtons.map((button) => (
                            <div key={button.id}>{button.component}</div>
                        ))}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={t('Coupons')} />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.name}
                                onChange={(value) => setFilters({ ...filters, name: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search coupons...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="coupons.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector routeName="coupons.index" filters={{ ...filters, view: viewMode }} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [filters.code, filters.type, filters.status].filter(
                                        Boolean
                                    ).length;
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
                    <CardContent className="border-b bg-muted/30 p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Code')}</label>
                                <Input
                                    placeholder={t('Filter by code')}
                                    value={filters.code}
                                    onChange={(e) => setFilters({ ...filters, code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Type')}</label>
                                <Select
                                    value={filters.type}
                                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">{t('Percentage')}</SelectItem>
                                        <SelectItem value="flat">{t('Flat')}</SelectItem>
                                        <SelectItem value="fixed">{t('Fixed')}</SelectItem>
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

                <CardContent className="p-0">
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={coupons.data}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={Ticket}
                                            title={t('No coupons found')}
                                            description={t('Get started by creating your first coupon.')}
                                            hasFilters={
                                                !!(filters.name || filters.code || filters.type || filters.status)
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-coupons"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Coupon')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-4">
                            {coupons.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {coupons.data.map((coupon) => (
                                        <Card key={coupon.id} className="border border-border">
                                            <div className="p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="rounded-lg bg-foreground/10 p-1.5">
                                                            <Ticket className="h-4 w-4 text-foreground" />
                                                        </div>
                                                        <h3 className="break-words text-sm font-semibold leading-tight">
                                                            {coupon.name}
                                                        </h3>
                                                    </div>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                            coupon.status
                                                                ? 'bg-muted text-foreground'
                                                                : 'bg-muted text-destructive'
                                                        }`}
                                                    >
                                                        {coupon.status ? t('Active') : t('Inactive')}
                                                    </span>
                                                </div>

                                                <div className="mb-3 space-y-2">
                                                    <div className="text-xs">
                                                        <p className="mb-1 text-muted-foreground">{t('Code')}</p>
                                                        <p className="rounded bg-muted px-2 py-1 font-mono text-xs font-medium text-foreground">
                                                            {coupon.code}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="text-xs">
                                                            <p className="mb-1 text-muted-foreground">
                                                                {t('Discount')}
                                                            </p>
                                                            <p className="font-medium text-foreground">
                                                                {coupon.type === 'percentage'
                                                                    ? `${coupon.discount}%`
                                                                    : `${currencySymbol}${coupon.discount}`}
                                                            </p>
                                                        </div>
                                                        <div className="text-xs">
                                                            <p className="mb-1 text-muted-foreground">{t('Type')}</p>
                                                            <p className="font-medium capitalize text-foreground">
                                                                {coupon.type}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {(coupon.limit || coupon.expiry_date) && (
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {coupon.limit && (
                                                                <div className="text-xs">
                                                                    <p className="mb-1 text-muted-foreground">
                                                                        {t('Limit')}
                                                                    </p>
                                                                    <p className="font-medium text-foreground">
                                                                        {coupon.limit}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {coupon.expiry_date && (
                                                                <div className="text-xs">
                                                                    <p className="mb-1 text-muted-foreground">
                                                                        {t('Expiry')}
                                                                    </p>
                                                                    <p className="font-medium text-foreground">
                                                                        {formatDate(coupon.expiry_date, pageProps)}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-end gap-1 border-t pt-2">
                                                    <TooltipProvider>
                                                        {auth.user?.permissions?.includes('view-coupons') && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            (window.location.href = route(
                                                                                'coupons.show',
                                                                                coupon.id
                                                                            ))
                                                                        }
                                                                        className="h-7 w-7 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <Eye className="h-3 w-3" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('View')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {auth.user?.permissions?.includes('edit-coupons') && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openModal('edit', coupon)}
                                                                        className="h-7 w-7 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <Edit className="h-3 w-3" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Edit')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {auth.user?.permissions?.includes('delete-coupons') && (
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openDeleteDialog(coupon.id)}
                                                                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
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
                                    icon={Ticket}
                                    title={t('No coupons found')}
                                    description={t('Get started by creating your first coupon.')}
                                    hasFilters={!!(filters.name || filters.code || filters.type || filters.status)}
                                    onClearFilters={clearFilters}
                                    createPermission="create-coupons"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Create Coupon')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={coupons}
                        routeName="coupons.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditCoupon coupon={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Coupon')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
