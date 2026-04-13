import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { cn } from "@/lib/utils";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { 
    Plus, Edit as EditIcon, Trash2, Eye, 
    Clock as ClockIcon, Download, FileImage,
    TrendingUp, XCircle 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Create from './Create';
import Edit from './Edit';
import View from './Show';

import NoRecordsFound from '@/components/no-records-found';
import { Attendance, AttendancesIndexProps, AttendanceFilters, AttendanceModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { attendances, auth, employees = [], shifts } = usePage<AttendancesIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<AttendanceFilters>({
        search: urlParams.get('search') || '',
        status: urlParams.get('status') || '',
        employee_id: urlParams.get('employee_id') || '',
        date_from: urlParams.get('date_from') || '',
        date_to: urlParams.get('date_to') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>(urlParams.get('view') as 'list' | 'grid' || 'list');
    const [modalState, setModalState] = useState<AttendanceModalState>({
        isOpen: false,
        mode: '',
        data: null
    });


    const [showFilters, setShowFilters] = useState(false);




    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.attendances.destroy',
        defaultMessage: t('Are you sure you want to delete this attendance?')
    });

    const handleFilter = () => {
        router.get(route('hrm.attendances.index'), { ...filters, per_page: perPage, sort: sortField, direction: sortDirection, view: viewMode }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('hrm.attendances.index'), { ...filters, per_page: perPage, sort: field, direction, view: viewMode }, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: '',
            employee_id: '',
            date_from: '',
            date_to: '',
        });
        router.get(route('hrm.attendances.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit' | 'view', data: Attendance | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'employee.user.name',
            header: t('Employee Name'),
            sortable: false,
            render: (value: any, row: any) => row.user?.name || '-'
        },
        {
            key: 'date',
            header: t('Date'),
            sortable: true,
            render: (value: string) => value ? formatDate(value) : '-'
        },
        {
            key: 'shift.shift_name',
            header: t('Shift'),
            sortable: false,
            render: (value: any, row: any) => row.shift?.shift_name || '-'
        },
        {
            key: 'clock_in',
            header: t('Clock In'),
            sortable: false,
            render: (value: string) => value ? formatDateTime(value) : '-'
        },
        {
            key: 'clock_out',
            header: t('Clock Out'),
            sortable: false,
            render: (value: string) => value ? formatDateTime(value) : '-'
        },
        {
            key: 'total_hour',
            header: t('Total Hour'),
            sortable: false,
            render: (value: number) => value ? `${value}h` : '-'
        },
        {
            key: 'break_hour',
            header: t('Break Hour'),
            sortable: false,
            render: (value: number) => value ? `${value}h` : '-'
        },
        {
            key: 'overtime_hours',
            header: t('Overtime'),
            sortable: false,
            render: (value: number) => value ? `${value}h` : '-'
        },
        {
            key: 'status',
            header: t('Status'),
            sortable: false,
            render: (value: string) => {
                const statusColors = {
                    present: 'bg-foreground/10 text-foreground border-foreground/20',
                    'half day': 'bg-muted-foreground/10 text-muted-foreground border-border/20',
                    absent: 'bg-destructive/10 text-destructive border-destructive/20'
                };
                const formatStatus = (status: string) => {
                    return status.toUpperCase();
                };

                return (
                    <Badge variant="outline" className={cn("text-[10px] font-black tracking-widest", statusColors[value as keyof typeof statusColors] || 'bg-muted/10 text-muted-foreground border-muted/20')}>
                        {t(formatStatus(value || 'Unknown'))}
                    </Badge>
                );
            }
        },
        ...(auth.user?.permissions?.some((p: string) => ['view-attendances', 'edit-attendances', 'delete-attendances'].includes(p)) ? [{
            key: 'actions',
            header: t('Actions'),
            render: (_: any, attendance: Attendance) => (
                <div className="flex gap-1">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('view-attendances') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => openModal('view', attendance)} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('View')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('edit-attendances') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => openModal('edit', attendance)} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
                                        <EditIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Edit')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('delete-attendances') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDeleteDialog(attendance.id)}
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
                { label: t('Attendances') }
            ]}
            pageTitle={t('Manage Attendances')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('create-attendances') && (
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
            <Head title={t('Attendances')} />

            <div className="space-y-8 animate-in fade-in duration-1000">
                {/* Duty Presence Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="premium-card p-6 bg-gradient-to-br from-muted/500/10 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-muted/500/20 flex items-center justify-center text-foreground">
                                <ClockIcon className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Presence Level')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {attendances?.data?.filter(a => a.status === 'present').length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Active Field Agents')}</p>
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-muted-foreground/20 flex items-center justify-center text-muted-foreground">
                                <ClockIcon className="h-5 w-5 rotate-45" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Partial Duty')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {attendances?.data?.filter(a => a.status === 'half day').length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Resticted Field Ops')}</p>
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-foreground/20 flex items-center justify-center text-foreground">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Combat Hours')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {attendances?.data?.reduce((acc, curr) => acc + (parseFloat(curr.total_hour?.toString()) || 0), 0).toFixed(1)}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Total Operational Cycles')}</p>
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-destructive/20 flex items-center justify-center text-destructive">
                                <XCircle className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Absence Delta')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">
                                {attendances?.data?.filter(a => a.status === 'absent').length || 0}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Units Off-Station')}</p>
                        </div>
                    </div>
                </div>

                {/* Main Command Dashboard */}
                <Card className="premium-card border-none bg-foreground/40 backdrop-blur-3xl overflow-hidden">
                    {/* Tactical Control Bar */}
                    <div className="p-6 border-b border-white/5 bg-card/5">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="w-full lg:flex-1 max-w-xl">
                                {auth.user?.permissions?.includes('manage-employees') && (
                                    <SearchInput
                                        value={filters.search}
                                        onChange={(value) => setFilters({ ...filters, search: value })}
                                        onSearch={handleFilter}
                                        placeholder={t('Identify personnel or date vector...')}
                                        className="bg-background/20 border-white/10"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                                <div className="h-10 px-1 rounded-xl bg-background/20 border border-white/5 flex items-center">
                                    <PerPageSelector
                                        routeName="hrm.attendances.index"
                                        filters={{ ...filters, view: viewMode }}
                                    />
                                </div>
                                <div className="relative">
                                    <FilterButton
                                        showFilters={showFilters}
                                        onToggle={() => setShowFilters(!showFilters)}
                                        className={`h-10 rounded-xl border border-white/5 transition-all ${showFilters ? 'bg-foreground text-background' : 'bg-background/20'}`}
                                    />
                                    {(() => {
                                        const activeFilters = [filters.status, filters.employee_id, filters.date_from, filters.date_to].filter(f => f !== '' && f !== null && f !== undefined).length;
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Personnel Unit')}</label>
                                    <Select value={filters.employee_id} onValueChange={(value) => setFilters({ ...filters, employee_id: value })}>
                                        <SelectTrigger className="bg-background/20 border-white/5 h-11 text-xs">
                                            <SelectValue placeholder={t('Assign Unit')} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-foreground border-white/10">
                                            {employees?.map((employee: any) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.user?.name || employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Operational State')}</label>
                                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                                        <SelectTrigger className="bg-background/20 border-white/5 h-11 text-xs">
                                            <SelectValue placeholder={t('All States')} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-foreground border-white/10 uppercase font-black text-[10px] tracking-widest">
                                            <SelectItem value="present">{t('Present')}</SelectItem>
                                            <SelectItem value="half day">{t('Half Day')}</SelectItem>
                                            <SelectItem value="absent">{t('Absent')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Vector Start')}</label>
                                    <Input
                                        type="date"
                                        value={filters.date_from}
                                        onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                                        className="bg-background/20 border-white/5 h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Vector End')}</label>
                                    <Input
                                        type="date"
                                        value={filters.date_to}
                                        onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                                        className="bg-background/20 border-white/5 h-11"
                                    />
                                </div>
                                <div className="lg:col-span-4 flex items-center gap-3 pt-4">
                                    <Button onClick={handleFilter} className="bg-foreground hover:bg-foreground/80 font-black uppercase text-xs tracking-widest h-10 px-8 rounded-xl">{t('Synchronize')}</Button>
                                    <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-background font-black uppercase text-xs tracking-widest h-10">{t('Reset')}</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Data Matrix Sector */}
                    <div className="p-0">
                        <div className="w-full overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <DataTable
                                data={attendances?.data || []}
                                columns={tableColumns}
                                onSort={handleSort}
                                sortKey={sortField}
                                sortDirection={sortDirection as 'asc' | 'desc'}
                                className="border-none"
                                emptyState={
                                    <NoRecordsFound
                                        icon={ClockIcon}
                                        title={t('No Attendance Vectors')}
                                        description={t('System clear. No personnel movement detected in the current matrix.')}
                                        hasFilters={!!(filters.search || filters.status || filters.employee_id || filters.date_from || filters.date_to)}
                                        onClearFilters={clearFilters}
                                        createPermission="create-attendances"
                                        onCreateClick={() => openModal('add')}
                                        createButtonText={t('Register Manual Unit')}
                                        className="h-96"
                                    />
                                }
                            />
                        </div>
                    </div>

                    {/* Matrix Pagination */}
                    <div className="px-6 py-4 border-t border-white/5 bg-card/5">
                        <Pagination
                            data={attendances || { data: [], links: [], meta: {} }}
                            routeName="hrm.attendances.index"
                            filters={{ ...filters, per_page: perPage, view: viewMode }}
                        />
                    </div>
                </Card>
            </div>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && (
                    <Create onSuccess={closeModal} />
                )}
                {modalState.mode === 'edit' && modalState.data && (
                    <Edit
                        attendance={modalState.data}
                        onSuccess={closeModal}
                    />
                )}
                {modalState.mode === 'view' && modalState.data && (
                    <View
                        attendance={modalState.data}
                        onSuccess={closeModal}
                    />
                )}
            </Dialog>



            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Attendance')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}