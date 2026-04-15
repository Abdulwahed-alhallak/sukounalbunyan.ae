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
import { Plus, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NoRecordsFound from '@/components/no-records-found';
import SystemSetupSidebar from '../SystemSetupSidebar';
import CreateModal from './Create';
import EditModal from './Edit';

interface QuickLink {
    id: number;
    title: string;
    icon: string;
    link: string;
    order: number;
}

interface QuickLinksProps {
    [key: string]: any;
    quickLinks: QuickLink[];
    auth: any;
}

interface ModalState {
    isOpen: boolean;
    mode: 'add' | 'edit' | '';
    data: QuickLink | null;
}

export default function Index() {
    const { t } = useTranslation();
    const { quickLinks, auth } = usePage<QuickLinksProps>().props;

    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'support-ticket.quick-links.destroy',
        defaultMessage: t('Are you sure you want to delete this quick link?'),
    });

    const openModal = (mode: 'add' | 'edit', data: QuickLink | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const tableColumns = [
        {
            key: 'title',
            header: t('Title'),
            sortable: false,
            render: (_: any, link: QuickLink) => <div className="font-medium">{link.title}</div>,
        },
        {
            key: 'icon',
            header: t('Icon'),
            sortable: false,
            render: (_: any, link: QuickLink) => (
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground">{link.icon}</span>
            ),
        },
        {
            key: 'link',
            header: t('Link'),
            sortable: false,
            render: (_: any, link: QuickLink) => (
                <div className="max-w-xs truncate text-sm text-muted-foreground">{link.link}</div>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) => ['manage-support-settings'].includes(p))
            ? [
                  {
                      key: 'actions',
                      header: t('Action'),
                      render: (_: any, link: QuickLink) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  {auth.user?.permissions?.includes('manage-support-settings') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openModal('edit', link)}
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
                                  {auth.user?.permissions?.includes('manage-support-settings') && (
                                      <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => openDeleteDialog(link.id)}
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
                    { label: t('Support Tickets'), url: route('dashboard.support-tickets') },
                    { label: t('System Setup') },
                    { label: t('Quick Links') },
                ]}
                pageTitle={t('System Setup')}
            >
                <Head title={t('Quick Links')} />

                <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex-shrink-0 md:w-64">
                        <SystemSetupSidebar activeItem="quick-links" />
                    </div>

                    <div className="flex-1">
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-medium">{t('Quick Links')}</h3>
                                    {auth.user?.permissions?.includes('manage-support-settings') && (
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
                                            data={quickLinks}
                                            columns={tableColumns}
                                            className="rounded-none"
                                            emptyState={
                                                <NoRecordsFound
                                                    icon={LinkIcon}
                                                    title={t('No Quick Links found')}
                                                    description={t('Get started by creating your first Quick Link.')}
                                                    createPermission="manage-support-settings"
                                                    onCreateClick={() => openModal('add')}
                                                    createButtonText={t('Create Quick Link')}
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
                    {modalState.mode === 'add' && <CreateModal onSuccess={closeModal} />}
                    {modalState.mode === 'edit' && modalState.data && (
                        <EditModal quickLink={modalState.data} onSuccess={closeModal} />
                    )}
                </Dialog>

                <ConfirmationDialog
                    open={deleteState.isOpen}
                    onOpenChange={closeDeleteDialog}
                    title={t('Delete Quick Link')}
                    message={deleteState.message}
                    confirmText={t('Delete')}
                    onConfirm={confirmDelete}
                    variant="destructive"
                />
            </AuthenticatedLayout>
        </TooltipProvider>
    );
}
