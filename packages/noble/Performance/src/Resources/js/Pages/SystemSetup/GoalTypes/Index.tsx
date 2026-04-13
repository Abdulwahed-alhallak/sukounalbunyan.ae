import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NoRecordsFound from '@/components/no-records-found';
import SystemSetupSidebar from '../SystemSetupSidebar';
import Create from './Create';
import EditGoalType from './Edit';

interface GoalType {
    id: number;
    name: string;
    description: string;
    status: string;
    created_at: string;
}

interface Props {
    goalTypes: GoalType[];
    auth: any;
}

interface ModalState {
    isOpen: boolean;
    mode: string;
    data: GoalType | null;
}

export default function Index() {
    const { t } = useTranslation();
    const { goalTypes, auth } = usePage<Props>().props;

    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'performance.goal-types.destroy',
        defaultMessage: t('Are you sure you want to delete this goal type?'),
    });

    const openModal = (mode: 'add' | 'edit', data: GoalType | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
        },
        {
            key: 'description',
            header: t('Description'),
            render: (value: string) => value || '-',
        },
        {
            key: 'status',
            header: t('Status'),
            render: (value: string) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value === 'active' ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                    }`}
                >
                    {value === 'active' ? t('Active') : t('Inactive')}
                </span>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) => ['edit-goal-types', 'delete-goal-types'].includes(p))
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, item: GoalType) => (
                          <div className="flex gap-1">
                              {auth.user?.permissions?.includes('edit-goal-types') && (
                                  <Tooltip delayDuration={0}>
                                      <TooltipTrigger asChild>
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => openModal('edit', item)}
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
                              {auth.user?.permissions?.includes('delete-goal-types') && (
                                  <Tooltip delayDuration={0}>
                                      <TooltipTrigger asChild>
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => openDeleteDialog(item.id)}
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
                          </div>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <TooltipProvider>
            <AuthenticatedLayout
                breadcrumbs={[{ label: t('Performance') }, { label: t('System Setup') }, { label: t('Goal Types') }]}
                pageTitle={t('System Setup')}
            >
                <Head title={t('Goal Types')} />

                <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex-shrink-0 md:w-64">
                        <SystemSetupSidebar activeItem="goal-types" />
                    </div>

                    <div className="flex-1">
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-medium">{t('Goal Types')}</h3>
                                    {auth.user?.permissions?.includes('create-goal-types') && (
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
                                </div>
                                <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[60vh] w-full overflow-y-auto rounded-none">
                                    <div className="min-w-[600px]">
                                        <DataTable
                                            data={goalTypes}
                                            columns={tableColumns}
                                            className="rounded-none"
                                            emptyState={
                                                <NoRecordsFound
                                                    icon={Target}
                                                    title={t('No goal types found')}
                                                    description={t('Get started by creating your first goal type.')}
                                                    createPermission="create-goal-types"
                                                    onCreateClick={() => openModal('add')}
                                                    createButtonText={t('Create Goal Type')}
                                                    className="h-auto"
                                                />
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                    {modalState.mode === 'add' && <Create onSuccess={closeModal} />}
                    {modalState.mode === 'edit' && modalState.data && (
                        <EditGoalType goalType={modalState.data} onSuccess={closeModal} />
                    )}
                </Dialog>

                <ConfirmationDialog
                    open={deleteState.isOpen}
                    onOpenChange={closeDeleteDialog}
                    title={t('Delete Goal Type')}
                    message={deleteState.message}
                    confirmText={t('Delete')}
                    onConfirm={confirmDelete}
                    variant="destructive"
                />
            </AuthenticatedLayout>
        </TooltipProvider>
    );
}
