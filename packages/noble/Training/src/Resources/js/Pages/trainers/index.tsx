import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import Create from './create';
import EditTrainer from './edit';
import NoRecordsFound from '@/components/no-records-found';
import { Trainer, TrainersIndexProps, TrainerFilters, TrainerModalState } from './types';

export default function Index() {
    const { t } = useTranslation();
    const { trainers, branches, departments, auth } = usePage<TrainersIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<TrainerFilters>({
        name: urlParams.get('name') || '',
        branch_id: urlParams.get('branch_id') || '',
        department_id: urlParams.get('department_id') || '',
    });

    const [filteredDepartments, setFilteredDepartments] = useState(departments || []);
    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');

    const [modalState, setModalState] = useState<TrainerModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const [showFilters, setShowFilters] = useState(false);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'training.trainers.destroy',
        defaultMessage: t('Are you sure you want to delete this trainer?'),
    });

    const handleFilter = () => {
        router.get(
            route('training.trainers.index'),
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
            route('training.trainers.index'),
            { ...filters, per_page: perPage, sort: field, direction },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ name: '', branch_id: '', department_id: '' });
        router.get(route('training.trainers.index'), { per_page: perPage });
    };

    const openModal = (mode: 'add' | 'edit', data: Trainer | null = null) => {
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

    useEffect(() => {
        if (filters.branch_id) {
            const branchDepartments = departments.filter((dept) => dept.branch_id.toString() === filters.branch_id);
            setFilteredDepartments(branchDepartments);
            if (
                filters.department_id &&
                !branchDepartments.find((dept) => dept.id.toString() === filters.department_id)
            ) {
                setFilters((prev) => ({ ...prev, department_id: '' }));
            }
        } else {
            setFilteredDepartments([]);
            setFilters((prev) => ({ ...prev, department_id: '' }));
        }
    }, [filters.branch_id]);

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: true,
        },
        {
            key: 'contact',
            header: t('Contact'),
        },
        {
            key: 'email',
            header: t('Email'),
        },
        {
            key: 'experience',
            header: t('Experience'),
        },
        {
            key: 'branch',
            header: t('Branch'),
            render: (value: any, trainer: Trainer) => trainer.branch?.branch_name || '-',
        },
        {
            key: 'department',
            header: t('Department'),
            render: (value: any, trainer: Trainer) => trainer.department?.department_name || '-',
        },
        ...(auth.user?.permissions?.some((p: string) => ['edit-trainers', 'delete-trainers'].includes(p))
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, trainer: Trainer) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('edit-trainers') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', trainer)}
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
                                  {auth.user?.permissions?.includes('delete-trainers') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(trainer.id)}
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
            breadcrumbs={[{ label: t('Training') }, { label: t('Trainers') }]}
            pageTitle={t('Manage Trainers')}
            pageActions={
                <div className="flex gap-2">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('create-trainers') && (
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
            <Head title={t('Trainers')} />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.name}
                                onChange={(value) => setFilters({ ...filters, name: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search trainers...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <PerPageSelector routeName="training.trainers.index" filters={filters} />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [filters.branch_id, filters.department_id].filter(
                                        Boolean
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Branch')}</label>
                                <Select
                                    value={filters.branch_id}
                                    onValueChange={(value) => setFilters({ ...filters, branch_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by branch')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches?.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id.toString()}>
                                                {branch.branch_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Department')}
                                </label>
                                <Select
                                    value={filters.department_id}
                                    onValueChange={(value) => setFilters({ ...filters, department_id: value })}
                                    disabled={!filters.branch_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                filters.branch_id ? t('Filter by department') : t('Select branch first')
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredDepartments?.map((department) => (
                                            <SelectItem key={department.id} value={department.id.toString()}>
                                                {department.department_name}
                                            </SelectItem>
                                        ))}
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
                    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                        <div className="min-w-[800px]">
                            <DataTable
                                data={trainers.data}
                                columns={tableColumns}
                                onSort={handleSort}
                                sortKey={sortField}
                                sortDirection={sortDirection as 'asc' | 'desc'}
                                className="rounded-none"
                                emptyState={
                                    <NoRecordsFound
                                        icon={Users}
                                        title={t('No trainers found')}
                                        description={t('Get started by creating your first trainer.')}
                                        hasFilters={!!(filters.name || filters.branch_id || filters.department_id)}
                                        onClearFilters={clearFilters}
                                        createPermission="create-trainers"
                                        onCreateClick={() => openModal('add')}
                                        createButtonText={t('Create Trainer')}
                                        className="h-auto"
                                    />
                                }
                            />
                        </div>
                    </div>
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={trainers}
                        routeName="training.trainers.index"
                        filters={{ ...filters, per_page: perPage }}
                    />
                </CardContent>
            </Card>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && (
                    <Create onSuccess={closeModal} branches={branches} departments={departments} />
                )}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditTrainer
                        data={modalState.data}
                        trainer={modalState.data}
                        onSuccess={closeModal}
                        branches={branches}
                        departments={departments}
                    />
                )}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Trainer')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
