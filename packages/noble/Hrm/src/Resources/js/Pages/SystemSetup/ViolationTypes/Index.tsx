import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NoRecordsFound from '@/components/no-records-found';
import SystemSetupSidebar from '../SystemSetupSidebar';

export interface ViolationType {
    id: number;
    name: string;
    severity: string;
    default_deduction_amount: number;
}

export default function Index() {
    const { t } = useTranslation();
    const { violationTypes, auth } = usePage<{ violationTypes: ViolationType[]; auth: any }>().props;

    const [modalState, setModalState] = useState<{ isOpen: boolean; mode: string; data: ViolationType | null }>({
        isOpen: false,
        mode: '',
        data: null,
    });
    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'hrm.violation-types.destroy',
        defaultMessage: t('Are you sure?'),
    });

    const [form, setForm] = useState({ name: '', severity: 'medium', default_deduction_amount: '0' });

    const openModal = (mode: 'add' | 'edit', data: ViolationType | null = null) => {
        if (mode === 'edit' && data) {
            setForm({
                name: data.name,
                severity: data.severity,
                default_deduction_amount: String(data.default_deduction_amount),
            });
        } else {
            setForm({ name: '', severity: 'medium', default_deduction_amount: '0' });
        }
        setModalState({ isOpen: true, mode, data });
    };
    const closeModal = () => setModalState({ isOpen: false, mode: '', data: null });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...form, default_deduction_amount: parseFloat(form.default_deduction_amount) || 0 };
        if (modalState.mode === 'edit' && modalState.data) {
            router.put(route('hrm.violation-types.update', modalState.data.id), data, { onSuccess: closeModal });
        } else {
            router.post(route('hrm.violation-types.store'), data, { onSuccess: closeModal });
        }
    };

    const tableColumns = [
        { key: 'name', header: t('Name'), sortable: true },
        {
            key: 'severity',
            header: t('Severity'),
            render: (_: any, item: ViolationType) => (
                <Badge
                    variant={
                        item.severity === 'critical'
                            ? 'destructive'
                            : item.severity === 'high'
                              ? 'destructive'
                              : 'secondary'
                    }
                >
                    {t(item.severity)}
                </Badge>
            ),
        },
        { key: 'default_deduction_amount', header: t('Default Deduction Amount'), sortable: true },
        ...(auth.user?.permissions?.some((p: string) => ['manage-hrm-setup'].includes(p))
            ? [
                  {
                      key: 'actions',
                      header: t('Action'),
                      render: (_: any, item: ViolationType) => (
                          <div className="flex gap-1">
                              <TooltipProvider>
                                  <Tooltip delayDuration={0}>
                                      <TooltipTrigger asChild>
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => openModal('edit', item)}
                                              className="h-8 w-8 p-0 text-foreground"
                                          >
                                              <Edit className="h-4 w-4" />
                                          </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>{t('Edit')}</p>
                                      </TooltipContent>
                                  </Tooltip>
                                  <Tooltip delayDuration={0}>
                                      <TooltipTrigger asChild>
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => openDeleteDialog(item.id)}
                                              className="h-8 w-8 p-0 text-destructive"
                                          >
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>{t('Delete')}</p>
                                      </TooltipContent>
                                  </Tooltip>
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
                    { label: t('HRM'), url: route('hrm.index') },
                    { label: t('System Setup') },
                    { label: t('Violation Types') },
                ]}
                pageTitle={t('System Setup')}
            >
                <Head title={t('Violation Types')} />
                <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex-shrink-0 md:w-64">
                        <SystemSetupSidebar activeItem="violation-types" />
                    </div>
                    <div className="flex-1">
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-medium">{t('Violation Types')}</h3>
                                    {auth.user?.permissions?.includes('manage-hrm-setup') && (
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
                                <div className="w-full overflow-y-auto">
                                    <DataTable
                                        data={violationTypes}
                                        columns={tableColumns}
                                        className="rounded-none"
                                        emptyState={
                                            <NoRecordsFound
                                                icon={ShieldAlert}
                                                title={t('No Violation Types')}
                                                createPermission="manage-hrm-setup"
                                                onCreateClick={() => openModal('add')}
                                                createButtonText={t('Create Violation Type')}
                                            />
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {modalState.mode === 'edit' ? t('Edit Violation Type') : t('Create Violation Type')}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('Name')} *</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Severity')} *</Label>
                                <Select
                                    value={form.severity}
                                    onValueChange={(v) => setForm({ ...form, severity: v })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">{t('Low')}</SelectItem>
                                        <SelectItem value="medium">{t('Medium')}</SelectItem>
                                        <SelectItem value="high">{t('High')}</SelectItem>
                                        <SelectItem value="critical">{t('Critical')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Default Deduction Amount')}</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={form.default_deduction_amount}
                                    onChange={(e) => setForm({ ...form, default_deduction_amount: e.target.value })}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeModal}>
                                    {t('Cancel')}
                                </Button>
                                <Button type="submit">{modalState.mode === 'edit' ? t('Update') : t('Create')}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <ConfirmationDialog
                    open={deleteState.isOpen}
                    onOpenChange={closeDeleteDialog}
                    title={t('Delete Violation Type')}
                    message={deleteState.message}
                    confirmText={t('Delete')}
                    onConfirm={confirmDelete}
                    variant="destructive"
                />
            </AuthenticatedLayout>
        </TooltipProvider>
    );
}
