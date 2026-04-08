import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit as EditIcon, Trash2, Eye, Users as UsersIcon, Lock, Download, FileImage } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NoRecordsFound from '@/components/no-records-found';
import { Employee, EmployeesIndexProps, EmployeeFilters } from './types';
import { formatDate, getImagePath } from '@/utils/helpers';
import { usePageButtons } from '@/hooks/usePageButtons';
import { Badge } from '@/components/ui/badge';



export default function Index() {
    const { t } = useTranslation();
    const { employees = [], auth, users = [], branches = [], departments = [], designations = [] } = usePage<EmployeesIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<EmployeeFilters>({
        employee_id: urlParams.get('employee_id') || '',
        user_name: urlParams.get('user_name') || '',
        branch_id: urlParams.get('branch_id') || 'all',
        department_id: urlParams.get('department_id') || 'all',
        employment_type: urlParams.get('employment_type') || '',
        gender: urlParams.get('gender') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>(urlParams.get('view') as 'list' | 'grid' || 'list');


    const [filteredBranches, setFilteredBranches] = useState(branches || []);
    const [filteredDepartments, setFilteredDepartments] = useState(departments || []);
    const [filteredDesignations, setFilteredDesignations] = useState(designations || []);
    const [showFilters, setShowFilters] = useState(false);

    // Handle dependent dropdown for department filters
    useEffect(() => {
        if (filters.branch_id && filters.branch_id !== 'all') {
            const branchDepartments = departments.filter(dept => dept.branch_id.toString() === filters.branch_id);
            setFilteredDepartments(branchDepartments);
            // Clear department if it doesn't belong to selected branch
            if (filters.department_id && filters.department_id !== 'all') {
                const departmentExists = branchDepartments.find(dept => dept.id.toString() === filters.department_id);
                if (!departmentExists) {
                    setFilters(prev => ({ ...prev, department_id: 'all' }));
                }
            }
        } else {
            setFilteredDepartments(departments || []);
            setFilters(prev => ({ ...prev, department_id: 'all' }));
        }
    }, [filters.branch_id]);

    // Handle dependent dropdown for designation filters
    useEffect(() => {
        if (filters.department_id && filters.department_id !== 'all') {
            const departmentDesignations = designations.filter(desig => desig.department_id.toString() === filters.department_id);
            setFilteredDesignations(departmentDesignations);
        } else {
            setFilteredDesignations(designations || []);
        }
    }, [filters.department_id]);

    const pageButtons = usePageButtons('googleDriveBtn', { module: 'Employee', settingKey: 'GoogleDrive Employee' });
    const oneDriveButtons = usePageButtons('oneDriveBtn', { module: 'Employee', settingKey: 'OneDrive Employee' });

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.employees.destroy',
        defaultMessage: t('Are you sure you want to delete this employee?')
    });

    const handleFilter = () => {
        router.get(route('hrm.employees.index'), { ...filters, per_page: perPage, sort: sortField, direction: sortDirection, view: viewMode }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('hrm.employees.index'), { ...filters, per_page: perPage, sort: field, direction, view: viewMode }, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setFilters({
            employee_id: '',
            user_name: '',
            branch_id: 'all',
            department_id: 'all',
            employment_type: '',
            gender: '',
        });
        router.get(route('hrm.employees.index'), { per_page: perPage, view: viewMode });
    };



    const tableColumns = [
        {
            key: 'employee_id',
            header: t('Employee Id'),
            sortable: true,
            render: (value: string, employee: Employee) =>
                auth.user?.permissions?.includes('view-employees') ? (
                    <span className="text-foreground hover:text-foreground cursor-pointer" onClick={() => router.get(route('hrm.employees.show', employee.id))}>{value}</span>
                ) : (
                    <span>{value}</span>
                )
        },
        {
            key: 'user.name',
            header: t('Employee Name'),
            sortable: false,
            render: (value: any, row: any) => (
                <div className="flex items-center gap-2">
                    {row.user?.avatar ? (
                        <img
                            src={getImagePath(row.user.avatar)}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                    ) : (
                        <img
                            src={getImagePath('avatar.png')}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                    )}
                    <div className="min-w-0">
                        <span className="text-sm font-medium truncate block">{row.user?.name || '-'}</span>
                        {row.name_ar && <span className="text-xs text-muted-foreground truncate block" dir="rtl">{row.name_ar}</span>}
                    </div>
                </div>
            )
        },
        {
            key: 'job_title',
            header: t('Job Title'),
            sortable: false,
            render: (value: any, row: any) => (
                <div className="min-w-0">
                    <span className="text-sm truncate block">{row.job_title || '-'}</span>
                    {row.job_title_ar && <span className="text-xs text-muted-foreground truncate block" dir="rtl">{row.job_title_ar}</span>}
                </div>
            )
        },
        {
            key: 'nationality',
            header: t('Nationality'),
            sortable: false,
            render: (value: any) => value || '-'
        },
        {
            key: 'allocated_area',
            header: t('Work Area'),
            sortable: false,
            render: (value: any) => value || '-'
        },
        {
            key: 'employee_status',
            header: t('Status'),
            sortable: false,
            render: (value: any) => {
                const colors: any = {
                    'Active': 'bg-muted text-foreground',
                    'Resigned': 'bg-muted text-destructive',
                    'Terminated': 'bg-muted text-destructive',
                    'Transferred': 'bg-muted text-foreground',
                };
                return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-muted text-foreground'}`}>{value || '-'}</span>;
            }
        },
        {
            key: 'basic_salary',
            header: t('Salary'),
            sortable: false,
            render: (value: any) => value ? `${Number(value).toLocaleString()} SAR` : '-'
        },
        {
            key: 'date_of_joining',
            header: t('Joining Date'),
            sortable: false,
            render: (value: string) => value ? formatDate(value) : '-'
        },
        ...(auth.user?.permissions?.some((p: string) => ['view-employees','edit-employees', 'delete-employees'].includes(p)) ? [{
            key: 'actions',
            header: t('Actions'),
            render: (_: any, employee: Employee) => (
                <div className="flex gap-1">
                    {employee.user?.is_disable === 1 ? (
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <div className="h-8 w-8 p-0 flex items-center justify-center text-muted-foreground">
                                    <Lock className="h-4 w-4" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent><p>{t('User is disabled')}</p></TooltipContent>
                        </Tooltip>
                    ) : (
                        <TooltipProvider>
                            {auth.user?.permissions?.includes('view-employees') && (
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" onClick={() => router.get(route('hrm.employees.show', employee.id))} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('View')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {auth.user?.permissions?.includes('edit-employees') && (
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" onClick={() => router.visit(route('hrm.employees.edit', employee.id))} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
                                            <EditIcon className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Edit')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {auth.user?.permissions?.includes('delete-employees') && (
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openDeleteDialog(employee.id)}
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
            )
        }] : [])
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Hrm'), url: route('hrm.index') },
                { label: t('Employees') }
            ]}
        >
            <Head title={t('Employees')} />

            <div className="space-y-6 pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground">{t('Employees')}</h1>
                        <p className="text-muted-foreground text-sm">
                            {t('Manage employee records and information.')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth.user?.permissions?.includes('create-employees') && (
                            <Button 
                                size="sm" 
                                onClick={() => router.visit(route('hrm.employees.create'))}
                                className="bg-foreground dark:bg-muted text-foreground dark:text-foreground hover:opacity-90 font-medium"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('Add Employee')}
                            </Button>
                        )}
                        {pageButtons?.map((button) => (
                            <div key={button.id}>{button.component}</div>
                        ))}
                    </div>
                </div>

                {/* Metrics Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-6 bg-card dark:bg-foreground border border-border dark:border-border rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-8 w-8 rounded-md bg-muted dark:bg-card flex items-center justify-center text-muted-foreground dark:text-muted-foreground">
                                <UsersIcon className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('Total Employees')}</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">{employees?.total || 0}</h3>
                    </div>
                    
                    <div className="p-6 bg-card dark:bg-foreground border border-border dark:border-border rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-8 w-8 rounded-md bg-muted dark:bg-card flex items-center justify-center text-muted-foreground dark:text-muted-foreground">
                                <Plus className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('Active')}</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">
                            {employees?.data?.filter(e => e.employee_status === 'Active').length || 0}
                        </h3>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="space-y-4">
                    {/* Filter Bar */}
                    <div className="p-4 bg-card dark:bg-foreground border border-border dark:border-border rounded-lg shadow-sm">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                            <div className="w-full lg:flex-1 max-w-lg">
                                <SearchInput
                                    value={filters.employee_id}
                                    onChange={(value) => setFilters({ ...filters, employee_id: value })}
                                    onSearch={handleFilter}
                                    placeholder={t('Search employees...')}
                                    className="bg-transparent border-border dark:border-border h-9"
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <div className="flex items-center gap-1 p-1 rounded-md bg-muted dark:bg-foreground border border-border dark:border-border h-9">
                                    <ListGridToggle
                                        currentView={viewMode}
                                        routeName="hrm.employees.index"
                                        filters={{ ...filters, per_page: perPage }}
                                    />
                                </div>
                                <div className="h-9 px-1 rounded-md bg-muted dark:bg-foreground border border-border dark:border-border flex items-center">
                                    <PerPageSelector
                                        routeName="hrm.employees.index"
                                        filters={{ ...filters, view: viewMode }}
                                    />
                                </div>
                                <div className="relative">
                                    <FilterButton
                                        showFilters={showFilters}
                                        onToggle={() => setShowFilters(!showFilters)}
                                        className={`h-9 rounded-md border transition-all ${showFilters ? 'bg-foreground dark:bg-muted text-foreground dark:text-foreground' : 'bg-transparent border-border dark:border-border'}`}
                                    />
                                    {(() => {
                                        const activeFiltersCount = [filters.branch_id !== 'all' ? filters.branch_id : '', filters.department_id !== 'all' ? filters.department_id : '', filters.employment_type].filter(Boolean).length;
                                        return activeFiltersCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-foreground dark:bg-card text-background dark:text-black text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-black">
                                                {activeFiltersCount}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Filter Drawer */}
                        {showFilters && (
                            <div 
                                className="mt-4 pt-4 border-t border-border dark:border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden"
                            >
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t('Branch')}</label>
                                        <Select value={filters.branch_id} onValueChange={(value) => setFilters({ ...filters, branch_id: value })}>
                                            <SelectTrigger className="bg-transparent border-border dark:border-border h-9 text-xs">
                                                <SelectValue placeholder={t('All Branches')} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card dark:bg-foreground border-border dark:border-border">
                                                <SelectItem value="all">{t('All Branches')}</SelectItem>
                                                {filteredBranches?.map((branch: any) => (
                                                    <SelectItem key={branch.id} value={branch.id.toString()}>
                                                        {branch.branch_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t('Department')}</label>
                                        <Select value={filters.department_id} onValueChange={(value) => setFilters({ ...filters, department_id: value })}>
                                            <SelectTrigger className="bg-transparent border-border dark:border-border h-9 text-xs">
                                                <SelectValue placeholder={t('All Departments')} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card dark:bg-foreground border-border dark:border-border">
                                                <SelectItem value="all">{t('All Departments')}</SelectItem>
                                                {filteredDepartments?.map((department: any) => (
                                                    <SelectItem key={department.id} value={department.id.toString()}>
                                                        {department.department_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t('Employment Type')}</label>
                                        <Select value={filters.employment_type} onValueChange={(value) => setFilters({ ...filters, employment_type: value })}>
                                            <SelectTrigger className="bg-transparent border-border dark:border-border h-9 text-xs">
                                                <SelectValue placeholder={t('All Types')} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card dark:bg-foreground border-border dark:border-border">
                                                <SelectItem value="Full Time">{t('Full Time')}</SelectItem>
                                                <SelectItem value="Part Time">{t('Part Time')}</SelectItem>
                                                <SelectItem value="Contract">{t('Contract')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <Button onClick={handleFilter} className="flex-1 bg-foreground dark:bg-muted text-foreground dark:text-foreground hover:opacity-90 h-9 px-6 rounded-md font-medium text-xs">{t('Apply Filters')}</Button>
                                        <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-foreground dark:hover:text-foreground h-9 font-medium text-xs">{t('Clear')}</Button>
                                    </div>
                            </div>
                        )}
                    </div>

                    {/* Content View */}
                    <div className="animate-in fade-in duration-500">
                        {viewMode === 'list' ? (
                            <div className="bg-card dark:bg-foreground border border-border dark:border-border rounded-lg overflow-hidden shadow-sm">
                                <DataTable
                                    data={employees?.data || []}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="border-none"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <div>
                                    {employees?.data?.map((employee, idx) => (
                                        <div 
                                            key={employee.id} 
                                            className="bg-card dark:bg-foreground border border-border dark:border-border rounded-lg overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow p-5 mb-4"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="h-12 w-12 rounded-full overflow-hidden border border-border dark:border-border">
                                                    <img 
                                                        src={getImagePath(employee.user?.avatar || 'avatar.png')} 
                                                        alt="Personnel" 
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    {employee.employee_status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1 mb-4 flex-1">
                                                <h3 className="font-bold text-sm text-foreground dark:text-foreground">{employee.user?.name}</h3>
                                                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{employee.job_title || t('Unassigned')}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono mt-1">{employee.employee_id}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border dark:border-border/50 mb-4">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Department')}</p>
                                                    <p className="text-[11px] font-semibold truncate">{employee.department?.name || '-'}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Salary')}</p>
                                                    <p className="text-[11px] font-semibold">{employee.basic_salary ? `${Number(employee.basic_salary).toLocaleString()} SAR` : '-'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-1">
                                                <div className="flex items-center gap-1">
                                                    {auth.user?.permissions?.includes('view-employees') && (
                                                        <Button variant="ghost" size="sm" onClick={() => router.get(route('hrm.employees.show', employee.id))} className="h-8 w-8 p-0 text-muted-foreground hover:text-black dark:hover:text-background">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                    {auth.user?.permissions?.includes('edit-employees') && (
                                                        <Button variant="ghost" size="sm" onClick={() => router.visit(route('hrm.employees.edit', employee.id))} className="h-8 w-8 p-0 text-muted-foreground hover:text-black dark:hover:text-background">
                                                            <EditIcon className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                                {auth.user?.permissions?.includes('delete-employees') && (
                                                    <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(employee.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-8">
                    <Pagination 
                        data={employees} 
                        routeName="hrm.employees.index" 
                        filters={{ ...filters, view: viewMode, per_page: perPage, sort: sortField, direction: sortDirection }} 
                    />
                </div>
                
                <ConfirmationDialog
                    open={deleteState.isOpen}
                    onOpenChange={closeDeleteDialog}
                    onConfirm={confirmDelete}
                    title={t('Delete Employee')}
                    message={deleteState.message}
                    confirmText={t('Delete')}
                    variant="destructive"
                />
            </div>
        </AuthenticatedLayout>
    );
}