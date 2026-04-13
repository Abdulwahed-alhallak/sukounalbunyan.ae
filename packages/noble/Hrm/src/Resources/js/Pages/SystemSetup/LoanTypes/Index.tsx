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
import { Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

import Create from './Create';
import EditLoanType from './Edit';
import NoRecordsFound from '@/components/no-records-found';
import { LoanType, LoanTypesIndexProps, LoanTypeModalState } from './types';
import SystemSetupSidebar from '../SystemSetupSidebar';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { loantypes, auth } = usePage<LoanTypesIndexProps>().props;

    const [modalState, setModalState] = useState<LoanTypeModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.loan-types.destroy',
        defaultMessage: t('Are you sure you want to delete this LoanType?'),
    });

    const openModal = (mode: 'add' | 'edit', data: LoanType | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: false,
        },
        {
            key: 'description',
            header: t('Description'),
            sortable: false,
        },
        ...(auth.user?.permissions?.some((p: string) => ['edit-loan-types', 'delete-loan-types'].includes(p))
            ? [
                  {
                      key: 'actions',
                      header: t('Action'),
                      render: (_: any, loantype: LoanType) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('edit-loan-types') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', loantype)}
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
                                  {auth.user?.permissions?.includes('delete-loan-types') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(loantype.id)}
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
        <TooltipProvider>
            <AuthenticatedLayout
                breadcrumbs={[
                    { label: t('Hrm'), url: route('hrm.index') },
                    { label: t('System Setup') },
                    { label: t('Loan Types') },
                ]}
                pageTitle={t('System Setup')}
            >
                <Head title={t('Loan Types')} />

                <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex-shrink-0 md:w-64">
                        <SystemSetupSidebar activeItem="loan-types" />
                    </div>

                    <div className="flex-1">
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-medium">{t('Loan Types')}</h3>
                                    {auth.user?.permissions?.includes('create-loan-types') && (
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
                                <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[75vh] w-full overflow-y-auto rounded-none">
                                    <div className="min-w-[600px]">
                                        <DataTable
                                            data={loantypes}
                                            columns={tableColumns}
                                            className="rounded-none"
                                            emptyState={
                                                <NoRecordsFound
                                                    icon={CreditCard}
                                                    title={t('No Loan Types found')}
                                                    description={t('Get started by creating your first Loan Type.')}
                                                    createPermission="create-loan-types"
                                                    onCreateClick={() => openModal('add')}
                                                    createButtonText={t('Create Loan Type')}
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
                        <EditLoanType loantype={modalState.data} onSuccess={closeModal} />
                    )}
                </Dialog>

                <ConfirmationDialog
                    open={deleteState.isOpen}
                    onOpenChange={closeDeleteDialog}
                    title={t('Delete LoanType')}
                    message={deleteState.message}
                    confirmText={t('Delete')}
                    onConfirm={confirmDelete}
                    variant="destructive"
                />
            </AuthenticatedLayout>
        </TooltipProvider>
    );
}
