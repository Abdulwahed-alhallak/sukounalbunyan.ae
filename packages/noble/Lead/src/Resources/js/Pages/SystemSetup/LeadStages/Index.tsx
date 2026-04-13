import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useFlashMessages } from '@/hooks/useFlashMessages';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit, Trash2, Layers, GripVertical } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import Create from './Create';
import EditLeadStage from './Edit';
import NoRecordsFound from '@/components/no-records-found';
import { LeadStage, LeadStagesIndexProps, LeadStageModalState } from './types';
import SystemSetupSidebar from '../SystemSetupSidebar';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { leadstages, auth, pipelines } = usePage<LeadStagesIndexProps>().props;

    // Filter pipelines that have lead stages
    const pipelinesWithStages = pipelines.filter((pipeline: any) =>
        leadstages.some((stage: LeadStage) => stage.pipeline_id === pipeline.id)
    );

    const [activePipeline, setActivePipeline] = useState<number>(pipelinesWithStages[0]?.id || 0);
    const [modalState, setModalState] = useState<LeadStageModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });

    useFlashMessages();

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'lead.lead-stages.destroy',
        defaultMessage: t('Are you sure you want to delete this Lead Stage?'),
    });

    const openModal = (mode: 'add' | 'edit', data: LeadStage | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    // Filter stages by active pipeline
    const filteredStages = leadstages.filter((stage: LeadStage) => stage.pipeline_id === activePipeline);

    const updateStageOrder = (newOrder: number[]) => {
        router.post(
            route('lead.lead-stages.update-order'),
            {
                stage_ids: newOrder,
                pipeline_id: activePipeline,
            },
            {
                preserveScroll: true,
                onSuccess: () => {},
                onError: () => {
                    toast.error(t('Failed to update stage order'));
                },
            }
        );
    };

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: true,
        },
        ...(auth.user?.permissions?.some((p: string) => ['edit-lead-stages', 'delete-lead-stages'].includes(p))
            ? [
                  {
                      key: 'actions',
                      header: t('Action'),
                      render: (_: any, leadstage: LeadStage) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('edit-lead-stages') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', leadstage)}
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
                                  {auth.user?.permissions?.includes('delete-lead-stages') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(leadstage.id)}
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
                    { label: t('CRM'), url: route('lead.leads.index') },
                    { label: t('System Setup') },
                    { label: t('Lead Stages') },
                ]}
                pageTitle={t('System Setup')}
            >
                <Head title={t('Lead Stages')} />

                <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex-shrink-0 md:w-64">
                        <SystemSetupSidebar activeItem="lead-stages" />
                    </div>

                    <div className="flex-1">
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-medium">{t('Lead Stages')}</h3>
                                    {auth.user?.permissions?.includes('create-lead-stages') && (
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

                                {/* Pipeline Tabs - Only show pipelines with stages */}
                                {pipelinesWithStages.length > 0 && (
                                    <div className="mb-6 flex border-b border-border">
                                        {pipelinesWithStages?.map((pipeline: any) => (
                                            <button
                                                key={pipeline.id}
                                                onClick={() => setActivePipeline(pipeline.id)}
                                                className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                                                    activePipeline === pipeline.id
                                                        ? 'rounded-t-lg text-background'
                                                        : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                }`}
                                                style={
                                                    activePipeline === pipeline.id
                                                        ? {
                                                              backgroundColor: 'hsl(var(--primary))',
                                                              borderColor: 'hsl(var(--primary))',
                                                          }
                                                        : {}
                                                }
                                            >
                                                {pipeline.name}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[75vh] w-full overflow-y-auto rounded-none">
                                    {filteredStages.length > 0 ? (
                                        <div className="space-y-3">
                                            {filteredStages
                                                .sort((a: LeadStage, b: LeadStage) => a.order - b.order)
                                                ?.map((stage: LeadStage, index: number) => (
                                                    <div
                                                        key={stage.id}
                                                        draggable
                                                        onDragStart={(e) => {
                                                            e.dataTransfer.setData('text/plain', index.toString());
                                                        }}
                                                        onDragOver={(e) => {
                                                            e.preventDefault();
                                                        }}
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            const dragIndex = parseInt(
                                                                e.dataTransfer.getData('text/plain')
                                                            );
                                                            const sortedStages = filteredStages.sort(
                                                                (a: LeadStage, b: LeadStage) => a.order - b.order
                                                            );
                                                            const newOrder = sortedStages?.map((s: LeadStage) => s.id);
                                                            const draggedItem = newOrder[dragIndex];
                                                            newOrder.splice(dragIndex, 1);
                                                            newOrder.splice(index, 0, draggedItem);

                                                            updateStageOrder(newOrder);
                                                        }}
                                                        className="flex cursor-move items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
                                                    >
                                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                        <div className="flex flex-1 items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                                                                    {stage.order}
                                                                </span>
                                                                <div>
                                                                    <h4 className="font-medium text-foreground">
                                                                        {stage.name}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <TooltipProvider>
                                                                    {auth.user?.permissions?.includes(
                                                                        'edit-lead-stages'
                                                                    ) && (
                                                                        <Tooltip delayDuration={0}>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        openModal('edit', stage)
                                                                                    }
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
                                                                    {auth.user?.permissions?.includes(
                                                                        'delete-lead-stages'
                                                                    ) && (
                                                                        <Tooltip delayDuration={0}>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        openDeleteDialog(stage.id)
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <NoRecordsFound
                                            icon={Layers}
                                            title={t('No Lead Stages found')}
                                            description={t('Get started by creating your first Lead Stage.')}
                                            createPermission="create-lead-stages"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Lead Stage')}
                                            className="h-auto"
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                    {modalState.mode === 'add' && (
                        <Create onSuccess={closeModal} pipelines={pipelines} defaultPipelineId={activePipeline} />
                    )}
                    {modalState.mode === 'edit' && modalState.data && (
                        <EditLeadStage leadstage={modalState.data} onSuccess={closeModal} pipelines={pipelines} />
                    )}
                </Dialog>

                <ConfirmationDialog
                    open={deleteState.isOpen}
                    onOpenChange={closeDeleteDialog}
                    title={t('Delete Lead Stage')}
                    message={deleteState.message}
                    confirmText={t('Delete')}
                    onConfirm={confirmDelete}
                    variant="destructive"
                />
            </AuthenticatedLayout>
        </TooltipProvider>
    );
}
