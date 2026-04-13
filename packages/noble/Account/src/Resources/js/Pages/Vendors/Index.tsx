import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Edit as EditIcon, Trash2, Building2, User as UserIcon, Lock, FileText, Eye } from 'lucide-react';
import { getImagePath } from '@/utils/helpers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DataTable } from '@/components/ui/data-table';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { FilterButton } from '@/components/ui/filter-button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import NoRecordsFound from '@/components/no-records-found';
import { Pagination } from '@/components/ui/pagination';
import Create from './Create';
import Edit from './Edit';
import View from './View';
import { VendorsIndexProps, VendorFilters, VendorModalState, Vendor } from './types';
import { usePageButtons } from '@/hooks/usePageButtons';

export default function Index() {
    const { vendors, users = [], auth, is_demo } = usePage<any>().props;
    const { t } = useTranslation();
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<VendorFilters>({
        company_name: urlParams.get('company_name') || '',
        vendor_code: urlParams.get('vendor_code') || '',
        tax_number: urlParams.get('tax_number') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [modalState, setModalState] = useState<VendorModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [viewingItem, setViewingItem] = useState<Vendor | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const googleDriveButtons = usePageButtons('googleDriveBtn', { module: 'Vender', settingKey: 'GoogleDrive Vender' });
    const oneDriveButtons = usePageButtons('oneDriveBtn', { module: 'Vender', settingKey: 'OneDrive Vender' });
    const dropboxBtn = usePageButtons('dropboxBtn', { module: 'Account Vendor', settingKey: 'Dropbox Account Vendor' });
    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'account.vendors.destroy',
        defaultMessage: 'Are you sure you want to delete this vendor?',
    });

    const handleFilter = () => {
        router.get(
            route('account.vendors.index'),
            {
                ...filters,
                per_page: perPage,
                sort: sortField,
                direction: sortDirection,
                view: viewMode,
            },
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
            route('account.vendors.index'),
            {
                ...filters,
                per_page: perPage,
                sort: field,
                direction,
                view: viewMode,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ company_name: '', vendor_code: '', tax_number: '' });
        router.get(route('account.vendors.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: Vendor | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'user',
            header: t('User'),
            render: (value: any, vendor: any) => {
                if (!vendor.user) return null;
                return (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                            {vendor.user.avatar ? (
                                <img
                                    src={getImagePath(vendor.user.avatar)}
                                    alt="Avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                        </div>
                        <span className="text-sm">{vendor.user.name}</span>
                    </div>
                );
            },
        },
        {
            key: 'vendor_code',
            header: t('Vendor Code'),
            sortable: true,
        },
        {
            key: 'company_name',
            header: t('Company Name'),
            sortable: true,
        },
        {
            key: 'contact_person_name',
            header: t('Contact Person'),
            sortable: true,
        },
        {
            key: 'contact_person_email',
            header: t('Email'),
            sortable: false,
        },
        {
            key: 'tax_number',
            header: t('Tax Number'),
            sortable: false,
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-vendors', 'edit-vendors', 'delete-vendors', 'view-vendor-detail-report'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, vendor: Vendor) => (
                          <div className="flex gap-1">
                              {vendor.user?.is_disable === 1 ? (
                                  <Tooltip delayDuration={0}>
                                      <TooltipTrigger asChild>
                                          <div className="flex h-8 w-8 items-center justify-center p-0 text-muted-foreground">
                                              <Lock className="h-4 w-4" />
                                          </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>{t('User is disabled')}</p>
                                      </TooltipContent>
                                  </Tooltip>
                              ) : (
                                  <TooltipProvider>
                                      {auth.user?.permissions?.includes('view-vendor-detail-report') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {
                                                          const params: any = { vendor: vendor.user_id };
                                                          if (is_demo) {
                                                              const year = new Date().getFullYear();
                                                              params.start_date = `${year}-01-01`;
                                                              params.end_date = `${year}-12-31`;
                                                          }
                                                          router.visit(route('account.reports.vendor-detail', params));
                                                      }}
                                                      className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                  >
                                                      <FileText className="h-4 w-4" />
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>{t('View Report')}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )}
                                      {auth.user?.permissions?.includes('view-vendors') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => setViewingItem(vendor)}
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
                                      {auth.user?.permissions?.includes('edit-vendors') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openModal('edit', vendor)}
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
                                      {auth.user?.permissions?.includes('delete-vendors') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => openDeleteDialog(vendor.id)}
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
                              )}
                          </div>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Accounting'), url: route('account.index') }, { label: t('Vendors') }]}
            pageTitle={t('Manage Vendors')}
            pageActions={
                <div className="flex gap-2">
                    {googleDriveButtons?.map((button) => (
                        <div key={button.id}>{button.component}</div>
                    ))}
                    {oneDriveButtons?.map((button) => (
                        <div key={button.id}>{button.component}</div>
                    ))}
                    {dropboxBtn?.map((button) => (
                        <div key={button.id}>{button.component}</div>
                    ))}
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('create-vendors') && (
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
            <Head title="Vendors" />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.company_name}
                                onChange={(value) => setFilters({ ...filters, company_name: value })}
                                onSearch={handleFilter}
                                placeholder="Search vendors..."
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="account.vendors.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="account.vendors.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [filters.vendor_code, filters.tax_number].filter(
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

                {/* Advanced Filters */}
                {showFilters && (
                    <CardContent className="bg-muted/50/30 border-b p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Vendor Code')}
                                </label>
                                <Input
                                    value={filters.vendor_code}
                                    onChange={(e) => setFilters({ ...filters, vendor_code: e.target.value })}
                                    placeholder={t('Filter by vendor code')}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Company Name')}
                                </label>
                                <Input
                                    value={filters.company_name}
                                    onChange={(e) => setFilters({ ...filters, company_name: e.target.value })}
                                    placeholder={t('Filter by company name')}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Tax Number')}
                                </label>
                                <Input
                                    value={filters.tax_number}
                                    onChange={(e) => setFilters({ ...filters, tax_number: e.target.value })}
                                    placeholder={t('Filter by tax number')}
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
                                    data={vendors.data}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={Building2}
                                            title="No vendors found"
                                            description="Get started by creating your first vendor."
                                            hasFilters={
                                                !!(filters.company_name || filters.vendor_code || filters.tax_number)
                                            }
                                            onClearFilters={clearFilters}
                                            createPermission="create-vendors"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText="Create Vendor"
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {vendors.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {vendors.data?.map((vendor) => (
                                        <Card
                                            key={vendor.id}
                                            className="border border-border transition-all duration-200 hover:shadow-lg"
                                        >
                                            <div className="p-4">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="truncate text-base font-semibold text-foreground">
                                                            {vendor.company_name}
                                                        </h3>
                                                        {auth.user?.permissions?.includes('view-vendors') ? (
                                                            <p
                                                                className="mt-1 cursor-pointer text-xs font-medium text-foreground"
                                                                onClick={() => setViewingItem(vendor)}
                                                            >
                                                                {vendor.vendor_code}
                                                            </p>
                                                        ) : (
                                                            <p className="mt-1 text-xs font-medium">
                                                                {vendor.vendor_code}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mb-3 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">
                                                            {t('Contact')}
                                                        </span>
                                                        <span className="ml-2 truncate text-xs font-medium text-foreground">
                                                            {vendor.contact_person_name}
                                                        </span>
                                                    </div>
                                                    {vendor.contact_person_email && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-muted-foreground">
                                                                {t('Email')}
                                                            </span>
                                                            <span className="ml-2 truncate text-xs text-foreground">
                                                                {vendor.contact_person_email}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {vendor.tax_number && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-muted-foreground">
                                                                {t('Tax Number')}
                                                            </span>
                                                            <span className="text-xs font-medium text-foreground">
                                                                {vendor.tax_number}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {vendor.payment_terms && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-muted-foreground">
                                                                {t('Payment Terms')}
                                                            </span>
                                                            <span className="text-xs font-medium text-foreground">
                                                                {vendor.payment_terms}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between border-t border-border pt-3">
                                                    {vendor.user && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger asChild>
                                                                <span className="inline-flex items-center py-1">
                                                                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border bg-muted">
                                                                        {vendor.user.avatar ? (
                                                                            <img
                                                                                src={getImagePath(vendor.user.avatar)}
                                                                                alt="Avatar"
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <UserIcon className="h-3 w-3 text-muted-foreground" />
                                                                        )}
                                                                    </div>
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{vendor.user.name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    <div className="flex gap-1">
                                                        {vendor.user?.is_disable === 1 ? (
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <div className="flex h-8 w-8 items-center justify-center p-0 text-muted-foreground">
                                                                        <Lock className="h-4 w-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('User is disabled')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        ) : (
                                                            <TooltipProvider>
                                                                {auth.user?.permissions?.includes(
                                                                    'view-vendor-detail-report'
                                                                ) && (
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    const params: any = {
                                                                                        vendor: vendor.user_id,
                                                                                    };
                                                                                    if (is_demo) {
                                                                                        const year =
                                                                                            new Date().getFullYear();
                                                                                        params.start_date = `${year}-01-01`;
                                                                                        params.end_date = `${year}-12-31`;
                                                                                    }
                                                                                    router.visit(
                                                                                        route(
                                                                                            'account.reports.vendor-detail',
                                                                                            params
                                                                                        )
                                                                                    );
                                                                                }}
                                                                                className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                            >
                                                                                <FileText className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{t('View Report')}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                                {auth.user?.permissions?.includes('view-vendors') && (
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => setViewingItem(vendor)}
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
                                                                {auth.user?.permissions?.includes('edit-vendors') && (
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    openModal('edit', vendor)
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
                                                                {auth.user?.permissions?.includes('delete-vendors') && (
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    openDeleteDialog(vendor.id)
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
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <NoRecordsFound
                                    icon={Building2}
                                    title="No vendors found"
                                    description="Get started by creating your first vendor."
                                    hasFilters={!!(filters.company_name || filters.vendor_code || filters.tax_number)}
                                    onClearFilters={clearFilters}
                                    createPermission="create-vendors"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText="Create Vendor"
                                    className="h-auto"
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={vendors}
                        routeName="account.vendors.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} users={users} auth={auth} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <Edit vendor={modalState.data} onSuccess={closeModal} />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View vendor={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title="Delete Vendor"
                message={deleteState.message}
                confirmText="Delete"
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
