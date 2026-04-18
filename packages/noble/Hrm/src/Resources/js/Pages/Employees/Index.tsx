import { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit as EditIcon, Trash2, Eye, Users as UsersIcon, Lock, Download, FileImage, Upload } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NoRecordsFound from '@/components/no-records-found';
import { Employee, EmployeesIndexProps, EmployeeFilters } from './types';
import { formatDate, getImagePath, formatCurrency } from '@/utils/helpers';
import { usePageButtons } from '@/hooks/usePageButtons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Index() {
    const { t } = useTranslation();
    const { employees,
        auth,
        users = [],
        branches = [],
        departments = [],
        designations = [],
    } = usePage<EmployeesIndexProps>().props;
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
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');

    const [filteredBranches, setFilteredBranches] = useState(branches || []);
    const [filteredDepartments, setFilteredDepartments] = useState(departments || []);
    const [filteredDesignations, setFilteredDesignations] = useState(designations || []);
    const [showFilters, setShowFilters] = useState(false);

    // Handle dependent dropdown for department filters
    useEffect(() => {
        if (filters.branch_id && filters.branch_id !== 'all') {
            const branchDepartments = departments.filter((dept) => dept.branch_id.toString() === filters.branch_id);
            setFilteredDepartments(branchDepartments);
            // Clear department if it doesn't belong to selected branch
            if (filters.department_id && filters.department_id !== 'all') {
                const departmentExists = branchDepartments.find((dept) => dept.id.toString() === filters.department_id);
                if (!departmentExists) {
                    setFilters((prev) => ({ ...prev, department_id: 'all' }));
                }
            }
        } else {
            setFilteredDepartments(departments || []);
            setFilters((prev) => ({ ...prev, department_id: 'all' }));
        }
    }, [filters.branch_id]);

    // Handle dependent dropdown for designation filters
    useEffect(() => {
        if (filters.department_id && filters.department_id !== 'all') {
            const departmentDesignations = designations.filter(
                (desig) => desig.department_id.toString() === filters.department_id
            );
            setFilteredDesignations(departmentDesignations);
        } else {
            setFilteredDesignations(designations || []);
        }
    }, [filters.department_id]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if(confirm(t('Are you sure you want to import this CSV? Exact matches will be updated, new entries will be added.'))) {
                const formData = new FormData();
                formData.append('file', file);
                router.post(route('hrm.employees.import'), formData, {
                    onSuccess: () => {
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    },
                    onError: () => {
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                });
            } else {
                 if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const pageButtons = usePageButtons('googleDriveBtn', { module: 'Employee', settingKey: 'GoogleDrive Employee' });
    const oneDriveButtons = usePageButtons('oneDriveBtn', { module: 'Employee', settingKey: 'OneDrive Employee' });

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.employees.destroy',
        defaultMessage: t('Are you sure you want to delete this employee?'),
    });

    const handleFilter = () => {
        router.get(
            route('hrm.employees.index'),
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
            route('hrm.employees.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
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
                    <span
                        className="cursor-pointer text-foreground hover:text-foreground"
                        onClick={() => router.get(route('hrm.employees.show', employee.id))}
                    >
                        {value}
                    </span>
                ) : (
                    <span>{value}</span>
                ),
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
                            className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = getImagePath('avatar.png');
                            }}
                        />
                    ) : (
                        <img
                            src={getImagePath('avatar.png')}
                            alt="Avatar"
                            className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                        />
                    )}
                    <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{row.user?.name || '-'}</span>
                        {row.name_ar && (
                            <span className="block truncate text-[11px] font-medium text-muted-foreground" dir="rtl">
                                {row.name_ar}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'job_title',
            header: t('Job Title'),
            sortable: false,
            render: (value: any, row: any) => (
                <div className="min-w-0">
                    <span className="block truncate text-sm">{row.job_title || '-'}</span>
                    {row.job_title_ar && (
                        <span className="block truncate text-[11px] font-medium text-muted-foreground" dir="rtl">
                            {row.job_title_ar}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'nationality',
            header: t('Nationality'),
            sortable: false,
            render: (value: any) => value || '-',
        },
        {
            key: 'allocated_area',
            header: t('Work Area'),
            sortable: false,
            render: (value: any) => value || '-',
        },
        {
            key: 'employee_status',
            header: t('Status'),
            sortable: false,
            render: (value: any) => {
                const colors: any = {
                    Active: 'vercel-badge-success',
                    Resigned: 'vercel-badge-warning',
                    Terminated: 'vercel-badge-error',
                    Transferred: 'vercel-badge-info',
                };
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight',
                            colors[value] || 'vercel-badge-neutral'
                        )}
                    >
                        {t(value) || '-'}
                    </Badge>
                );
            },
        },
        {
            key: 'basic_salary',
            header: t('Salary'),
            sortable: false,
            render: (value: any) => (value ? formatCurrency(value) : '-'),
        },
        {
            key: 'date_of_joining',
            header: t('Joining Date'),
            sortable: false,
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-employees', 'edit-employees', 'delete-employees'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, employee: Employee) => (
                          <div className="flex gap-1">
                              {employee.user?.is_disable === 1 ? (
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
                                      {auth.user?.permissions?.includes('view-employees') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                          router.get(route('hrm.employees.show', employee.id))
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
                                      {auth.user?.permissions?.includes('edit-employees') && (
                                          <Tooltip delayDuration={0}>
                                              <TooltipTrigger asChild>
                                                  <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                          router.visit(route('hrm.employees.edit', employee.id))
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
                      ),
                  },
              ]
            : []),
    ];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Hrm'), url: route('hrm.index') }, { label: t('Employees') }]}>
            <Head title={t('Employees')} />

            <div className="space-y-6 pb-12">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground">
                            {t('Employees')}
                        </h1>
                        <p className="text-sm text-muted-foreground">{t('Manage employee records and information.')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth.user?.permissions?.includes('create-employees') && (
                            <>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept=".csv,.txt" 
                                    onChange={handleFileChange} 
                                />
                                <Button
                                    size="sm"
                                    onClick={handleImportClick}
                                    variant="outline"
                                    className="font-medium"
                                >
                                    <Upload className="me-2 h-4 w-4" />
                                    {t('Import CSV')}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => router.visit(route('hrm.employees.create'))}
                                    className="h-9 bg-foreground px-4 font-bold tracking-tight text-background hover:opacity-90 dark:bg-muted dark:text-foreground"
                                >
                                    <Plus className="me-2 h-4 w-4" />
                                    {t('Add Employee')}
                                </Button>
                            </>
                        )}
                        {pageButtons?.map((button) => (
                            <div key={button.id}>{button.component}</div>
                        ))}
                    </div>
                </div>

                {/* Metrics Board */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="premium-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <UsersIcon className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {t('Total Employees')}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">{employees?.total || 0}</h3>
                    </div>

                    <div className="premium-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <Plus className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {t('Active')}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">
                            {employees?.data?.filter((e) => e.employee_status === 'Active').length || 0}
                        </h3>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="space-y-4">
                    {/* Filter Bar */}
                    <div className="premium-card p-4">
                        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
                            <div className="w-full max-w-lg lg:flex-1">
                                <SearchInput
                                    value={filters.employee_id}
                                    onChange={(value) => setFilters({ ...filters, employee_id: value })}
                                    onSearch={handleFilter}
                                    placeholder={t('Search employees...')}
                                    className="h-9 border-border bg-transparent dark:border-border"
                                />
                            </div>
                            <div className="flex w-full items-center gap-3 lg:w-auto">
                                <div className="flex h-9 items-center gap-1 rounded-md border border-border bg-muted p-1 dark:border-border dark:bg-foreground">
                                    <ListGridToggle
                                        currentView={viewMode}
                                        routeName="hrm.employees.index"
                                        filters={{ ...filters, per_page: perPage }}
                                    />
                                </div>
                                <div className="flex h-9 items-center rounded-md border border-border bg-muted px-1 dark:border-border dark:bg-foreground">
                                    <PerPageSelector
                                        routeName="hrm.employees.index"
                                        filters={{ ...filters, view: viewMode }}
                                    />
                                </div>
                                <div className="relative">
                                    <FilterButton
                                        showFilters={showFilters}
                                        onToggle={() => setShowFilters(!showFilters)}
                                        className={`h-9 rounded-md border transition-all ${showFilters ? 'bg-foreground text-foreground dark:bg-muted dark:text-foreground' : 'border-border bg-transparent dark:border-border'}`}
                                    />
                                    {(() => {
                                        const activeFiltersCount = [
                                            filters.branch_id !== 'all' ? filters.branch_id : '',
                                            filters.department_id !== 'all' ? filters.department_id : '',
                                            filters.employment_type,
                                        ].filter(Boolean).length;
                                        return (
                                            activeFiltersCount > 0 && (
                                                <span className="absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-foreground text-[9px] font-bold text-background dark:border-black dark:bg-card dark:text-black">
                                                    {activeFiltersCount}
                                                </span>
                                            )
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Filter Drawer */}
                        {showFilters && (
                            <div className="mt-4 grid grid-cols-1 gap-4 overflow-hidden border-t border-border pt-4 dark:border-border sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        {t('Branch')}
                                    </label>
                                    <Select
                                        value={filters.branch_id}
                                        onValueChange={(value) => setFilters({ ...filters, branch_id: value })}
                                    >
                                        <SelectTrigger className="h-9 border-border bg-transparent text-xs dark:border-border">
                                            <SelectValue placeholder={t('All Branches')} />
                                        </SelectTrigger>
                                        <SelectContent className="border-border bg-card dark:border-border dark:bg-foreground">
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
                                    <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        {t('Department')}
                                    </label>
                                    <Select
                                        value={filters.department_id}
                                        onValueChange={(value) => setFilters({ ...filters, department_id: value })}
                                    >
                                        <SelectTrigger className="h-9 border-border bg-transparent text-xs dark:border-border">
                                            <SelectValue placeholder={t('All Departments')} />
                                        </SelectTrigger>
                                        <SelectContent className="border-border bg-card dark:border-border dark:bg-foreground">
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
                                    <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        {t('Employment Type')}
                                    </label>
                                    <Select
                                        value={filters.employment_type}
                                        onValueChange={(value) => setFilters({ ...filters, employment_type: value })}
                                    >
                                        <SelectTrigger className="h-9 border-border bg-transparent text-xs dark:border-border">
                                            <SelectValue placeholder={t('All Types')} />
                                        </SelectTrigger>
                                        <SelectContent className="border-border bg-card dark:border-border dark:bg-foreground">
                                            <SelectItem value="Full Time">{t('Full Time')}</SelectItem>
                                            <SelectItem value="Part Time">{t('Part Time')}</SelectItem>
                                            <SelectItem value="Contract">{t('Contract')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button
                                        onClick={handleFilter}
                                        className="h-9 flex-1 rounded-md bg-foreground px-6 text-xs font-medium text-background hover:opacity-90 dark:bg-muted dark:text-foreground"
                                    >
                                        {t('Apply Filters')}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={clearFilters}
                                        className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                                    >
                                        {t('Clear')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content View */}
                    <div className="duration-500 animate-in fade-in">
                        {viewMode === 'list' ? (
                            <div className="premium-card overflow-hidden">
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
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {employees?.data?.map((employee, idx) => (
                                    <div
                                        key={employee.id}
                                        className="premium-card mb-4 flex h-full flex-col p-5"
                                    >
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="h-12 w-12 overflow-hidden rounded-full border border-border dark:border-border">
                                                <img
                                                    src={getImagePath(employee.user?.avatar || 'avatar.png')}
                                                    alt="Personnel"
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = getImagePath('avatar.png');
                                                    }}
                                                />
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                                            >
                                                {t(employee.employee_status) || employee.employee_status}
                                            </Badge>
                                        </div>

                                        <div className="mb-4 flex-1 space-y-1">
                                            <h3 className="text-sm font-bold text-foreground dark:text-foreground">
                                                {employee.user?.name}
                                            </h3>
                                            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                                {employee.job_title || t('Unassigned')}
                                            </p>
                                            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                                                {employee.employee_id}
                                            </p>
                                        </div>

                                        <div className="mb-4 grid grid-cols-2 gap-4 border-y border-border py-4 dark:border-border/50">
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                    {t('Department')}
                                                </p>
                                                <p className="truncate text-[11px] font-semibold">
                                                    {employee.department?.name || '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                    {t('Salary')}
                                                </p>
                                                <p className="text-[11px] font-semibold">
                                                    {employee.basic_salary
                                                        ? formatCurrency(employee.basic_salary)
                                                        : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-1">
                                                {auth.user?.permissions?.includes('view-employees') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.get(route('hrm.employees.show', employee.id))
                                                        }
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                {auth.user?.permissions?.includes('edit-employees') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.visit(route('hrm.employees.edit', employee.id))
                                                        }
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                                                    >
                                                        <EditIcon className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                            {auth.user?.permissions?.includes('delete-employees') && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(employee.id)}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-8">
                    <Pagination
                        data={employees}
                        routeName="hrm.employees.index"
                        filters={{
                            ...filters,
                            view: viewMode,
                            per_page: perPage,
                            sort: sortField,
                            direction: sortDirection,
                        }}
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
