import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit as EditIcon, Trash2, Eye, Calendar as CalendarIcon, Download, FileImage } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Create from './Create';
import EditHoliday from './Edit';
import View from './View';
import NoRecordsFound from '@/components/no-records-found';
import { Holiday, HolidaysIndexProps, HolidayFilters, HolidayModalState } from './types';
import { formatDate } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { holidays = [], auth, holidaytypes } = usePage<HolidaysIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);
    
    const [filters, setFilters] = useState<HolidayFilters>({
        name: urlParams.get('name') || '',
        holiday_type_id: urlParams.get('holiday_type_id') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');

    const [modalState, setModalState] = useState<HolidayModalState>({
        isOpen: false,
        mode: '',
        data: null
    });
    const [viewingItem, setViewingItem] = useState<Holiday | null>(null);

    const [showFilters, setShowFilters] = useState(false);




    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.holidays.destroy',
        defaultMessage: t('Are you sure you want to delete this holiday?')
    });

    const handleFilter = () => {
        router.get(route('hrm.holidays.index'), {...filters, per_page: perPage, sort: sortField, direction: sortDirection}, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('hrm.holidays.index'), {...filters, per_page: perPage, sort: field, direction}, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            holiday_type_id: '',
        });
        router.get(route('hrm.holidays.index'), {per_page: perPage});
    };

    const openModal = (mode: 'add' | 'edit', data: Holiday | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: true
        },
        {
            key: 'start_date',
            header: t('Start Date'),
            sortable: false,
            render: (value: string) => value ? formatDate(value) : '-'
        },
        {
            key: 'end_date',
            header: t('End Date'),
            sortable: false,
            render: (value: string) => value ? formatDate(value) : '-'
        },
        {
            key: 'holiday_type',
            header: t('Holiday Type'),
            sortable: false,
            render: (_: any, row: any) => row.holiday_type?.holiday_type || '-'
        },

        {
            key: 'is_paid',
            header: t('Paid'),
            sortable: false,
            render: (value: boolean) => (
                <span className={`px-2 py-1 rounded-full text-sm ${
                    value ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                }`}>
                    {value ? t('Yes') : t('No')}
                </span>
            )
        },
        ...(auth.user?.permissions?.some((p: string) => ['edit-holidays', 'delete-holidays'].includes(p)) ? [{
            key: 'actions',
            header: t('Actions'),
            render: (_: any, holiday: Holiday) => (
                <div className="flex gap-1">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('view-holidays') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => setViewingItem(holiday)} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('View')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {auth.user?.permissions?.includes('edit-holidays') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => openModal('edit', holiday)} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
                                        <EditIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Edit')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('delete-holidays') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDeleteDialog(holiday.id)}
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
            )
        }] : [])
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Hrm'), url: route('hrm.index') },
                {label: t('Holidays')}
            ]}
            pageTitle={t('Manage Holidays')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-holidays') && (
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
            <Head title={t('Holidays')} />

            <div className="space-y-8 animate-in fade-in duration-1000">
                {/* Tactical Suspension Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="premium-card p-6 bg-gradient-to-br from-muted/500/10 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-muted/500/20 flex items-center justify-center text-foreground">
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Global Downtime')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">{holidays?.total || 0}</h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('System Suspension Points')}</p>
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-foreground/20 flex items-center justify-center text-foreground">
                                <Plus className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Authorized Downtime')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {holidays?.data?.filter(h => h.is_paid).length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Compensated Intervals')}</p>
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-destructive/20 flex items-center justify-center text-destructive">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Maintenance Mode')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {holidays?.data?.filter(h => !h.is_paid).length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Uncompensated Halts')}</p>
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-gradient-to-br from-muted/500/10 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-foreground/20 flex items-center justify-center text-foreground">
                                <Plus className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Sector Vector')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {holidaytypes?.length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Suspension Categories')}</p>
                        </div>
                    </div>
                </div>

                {/* Main Command Dashboard */}
                <Card className="premium-card border-none bg-foreground/40 backdrop-blur-3xl overflow-hidden">
                    {/* Tactical Control Bar */}
                    <div className="p-6 border-b border-white/5 bg-card/5">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="w-full lg:flex-1 max-w-xl">
                                <SearchInput
                                    value={filters.name}
                                    onChange={(value) => setFilters({...filters, name: value})}
                                    onSearch={handleFilter}
                                    placeholder={t('Identify downtime vector or type...')}
                                    className="bg-background/20 border-white/10"
                                />
                            </div>
                            <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                                <div className="h-10 px-1 rounded-xl bg-background/20 border border-white/5 flex items-center">
                                    <PerPageSelector
                                        routeName="hrm.holidays.index"
                                        filters={{...filters}}
                                    />
                                </div>
                                <div className="relative">
                                    <FilterButton
                                        showFilters={showFilters}
                                        onToggle={() => setShowFilters(!showFilters)}
                                        className={`h-10 rounded-xl border border-white/5 transition-all ${showFilters ? 'bg-foreground text-background' : 'bg-background/20'}`}
                                    />
                                    {(() => {
                                        const activeFilters = [filters.holiday_type_id].filter(f => f !== '' && f !== 'all').length;
                                        return activeFilters > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-foreground text-background text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-border">
                                                {activeFilters}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Tactical Filter Projection */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top duration-500">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Holiday Category')}</label>
                                    <Select value={filters.holiday_type_id} onValueChange={(value) => setFilters({...filters, holiday_type_id: value})}>
                                        <SelectTrigger className="bg-background/20 border-white/5 h-11 text-xs">
                                            <SelectValue placeholder={t('All Categories')} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-foreground border-white/10">
                                            <SelectItem value="all">{t('All Categories')}</SelectItem>
                                            {holidaytypes?.map((item: any) => (
                                                <SelectItem key={item.id} value={item.id.toString()}>
                                                    {item.holiday_type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="lg:col-span-3 flex items-end gap-3 pt-4">
                                    <Button onClick={handleFilter} className="bg-foreground hover:bg-foreground/80 font-black uppercase text-xs tracking-widest h-10 px-8 rounded-xl">{t('Synchronize')}</Button>
                                    <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-background font-black uppercase text-xs tracking-widest h-10">{t('Reset Matrix')}</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Data Matrix Sector */}
                    <div className="p-0">
                        <div className="w-full overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <DataTable
                                data={holidays?.data || []}
                                columns={tableColumns}
                                onSort={handleSort}
                                sortKey={sortField}
                                sortDirection={sortDirection as 'asc' | 'desc'}
                                className="border-none"
                                emptyState={
                                    <NoRecordsFound
                                        icon={CalendarIcon}
                                        title={t('No Suspension Vectors')}
                                        description={t('Operational continuity confirmed. No scheduled downtime detected.')}
                                        hasFilters={!!(filters.name || filters.holiday_type_id)}
                                        onClearFilters={clearFilters}
                                        createPermission="create-holidays"
                                        onCreateClick={() => openModal('add')}
                                        createButtonText={t('Register Downtime Event')}
                                        className="h-96"
                                    />
                                }
                            />
                        </div>
                    </div>

                    {/* Matrix Pagination */}
                    <div className="px-6 py-4 border-t border-white/5 bg-card/5">
                        <Pagination
                            data={holidays || { data: [], links: [], meta: {} }}
                            routeName="hrm.holidays.index"
                            filters={{...filters, per_page: perPage}}
                        />
                    </div>
                </Card>
            </div>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && (
                    <Create onSuccess={closeModal} />
                )}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditHoliday
                        holiday={modalState.data}
                        onSuccess={closeModal}
                    />
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View holiday={viewingItem} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Erase Suspension Point')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}