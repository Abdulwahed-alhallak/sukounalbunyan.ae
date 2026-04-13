import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit as EditIcon, Trash2, UserPlus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import NoRecordsFound from '@/components/no-records-found';

interface ChecklistItem {
    key: string;
    label: string;
    completed: boolean;
    [key: string]: string | boolean;
}

interface Onboarding {
    id: number;
    employee_id: number;
    status: string;
    start_date: string | null;
    due_date: string | null;
    completed_at: string | null;
    checklist_items: ChecklistItem[];
    notes: string | null;
    assigned_to: number | null;
    employee?: { id: number; name: string } | null;
    assignee?: { id: number; name: string } | null;
    created_at: string;
}

interface PageProps {
    onboardings: { data: Onboarding[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number };
    employees: { id: number; name: string }[];
    defaultChecklist: ChecklistItem[];
    auth: any;
    [key: string]: any;
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock, label: 'Pending' },
    in_progress: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: AlertCircle, label: 'In Progress' },
    completed: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2, label: 'Completed' },
};

export default function Index() {
    const { t } = useTranslation();
    const { onboardings, employees, defaultChecklist } = usePage<PageProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(urlParams.get('search') || '');
    const [showCreate, setShowCreate] = useState(false);
    const [editingItem, setEditingItem] = useState<Onboarding | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [form, setForm] = useState({
        employee_id: '',
        start_date: new Date().toISOString().split('T')[0],
        due_date: '',
        assigned_to: '',
        notes: '',
        checklist_items: (defaultChecklist || []) as ChecklistItem[],
    });

    const resetForm = () => {
        setForm({
            employee_id: '', start_date: new Date().toISOString().split('T')[0],
            due_date: '', assigned_to: '', notes: '',
            checklist_items: (defaultChecklist || []) as ChecklistItem[],
        });
    };

    const applySearch = (clearSearch = false) => {
        router.get(route('hrm.onboarding.index'), { search: clearSearch ? '' : search }, { preserveState: true, preserveScroll: true });
    };

    const handleEdit = (item: Onboarding) => {
        setForm({
            employee_id: String(item.employee_id),
            start_date: item.start_date ? item.start_date.split('T')[0] : '',
            due_date: item.due_date ? item.due_date.split('T')[0] : '',
            assigned_to: item.assigned_to ? String(item.assigned_to) : '',
            notes: item.notes || '',
            checklist_items: (item.checklist_items || defaultChecklist) as ChecklistItem[],
        });
        setEditingItem(item);
    };

    const toggleChecklistItem = (index: number) => {
        const updated = [...form.checklist_items];
        updated[index] = { ...updated[index], completed: !updated[index].completed };
        setForm({ ...form, checklist_items: updated });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: Record<string, any> = {
            employee_id: parseInt(form.employee_id),
            start_date: form.start_date,
            due_date: form.due_date || null,
            assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
            notes: form.notes || null,
            checklist_items: form.checklist_items,
        };

        if (editingItem) {
            router.put(route('hrm.onboarding.update', editingItem.id), data, {
                onSuccess: () => { setEditingItem(null); resetForm(); },
            });
        } else {
            router.post(route('hrm.onboarding.store'), data, {
                onSuccess: () => { setShowCreate(false); resetForm(); },
            });
        }
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('hrm.onboarding.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
        }
    };

    const items = onboardings?.data || [];
    const getProgress = (checklist: ChecklistItem[]) => {
        if (!checklist?.length) return 0;
        const completed = checklist.filter(i => i.completed).length;
        return Math.round((completed / checklist.length) * 100);
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Onboarding') }]} pageTitle={t('Employee Onboarding')}>
            <Head title={t('Employee Onboarding')} />

            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['pending', 'in_progress', 'completed'] as const).map(status => {
                        const cfg = statusConfig[status];
                        const count = items.filter(i => i.status === status).length;
                        const Icon = cfg.icon;
                        return (
                            <Card key={status} className="border">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${cfg.color}`}><Icon className="h-6 w-6" /></div>
                                    <div><p className="text-2xl font-bold">{count}</p><p className="text-sm text-muted-foreground">{t(cfg.label)}</p></div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <SearchInput value={search} onChange={setSearch} onSearch={applySearch} placeholder={t('Search by employee name...')} />
                        <Button onClick={() => { resetForm(); setShowCreate(true); }}><Plus className="h-4 w-4 mr-2" />{t('New Onboarding')}</Button>
                    </CardHeader>
                    <CardContent>
                        {items.length > 0 ? (
                            <div className="space-y-4">
                                {items.map(item => {
                                    const progress = getProgress(item.checklist_items);
                                    const cfg = statusConfig[item.status] || statusConfig.pending;
                                    return (
                                        <div key={item.id} className="border rounded-xl p-5 hover:shadow-md transition-all bg-card">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                        {item.employee?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-base">{item.employee?.name || t('Unknown')}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.start_date && <span>{t('Started')}: {new Date(item.start_date).toLocaleDateString()}</span>}
                                                            {item.due_date && <span className="ml-3">{t('Due')}: {new Date(item.due_date).toLocaleDateString()}</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={cfg.color}>{t(cfg.label)}</Badge>
                                                    <TooltipProvider>
                                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}><EditIcon className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>{t('Edit')}</TooltipContent></Tooltip>
                                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>{t('Delete')}</TooltipContent></Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">{t('Progress')}</span>
                                                    <span className="font-medium">{progress}%</span>
                                                </div>
                                                <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
                                                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                                                </div>
                                            </div>
                                            {item.checklist_items && (
                                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                                                    {item.checklist_items.map((task, idx) => (
                                                        <div key={idx} className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1.5 ${task.completed ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                                                            <CheckCircle2 className={`h-3.5 w-3.5 ${task.completed ? 'text-emerald-500' : 'text-muted-foreground/40'}`} />
                                                            <span className={task.completed ? 'line-through' : ''}>{t(task.label)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {onboardings.last_page > 1 && <Pagination data={onboardings} routeName="hrm.onboarding.index" />}
                            </div>
                        ) : (
                            <NoRecordsFound icon={UserPlus} title={t('No onboarding records found')} onCreateClick={() => { resetForm(); setShowCreate(true); }} createButtonText={t('New Onboarding')} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={showCreate || !!editingItem} onOpenChange={() => { setShowCreate(false); setEditingItem(null); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editingItem ? t('Edit Onboarding') : t('New Onboarding')}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('Employee')} *</Label>
                                <Select value={form.employee_id} onValueChange={v => setForm({ ...form, employee_id: v })} disabled={!!editingItem}>
                                    <SelectTrigger><SelectValue placeholder={t('Select Employee')} /></SelectTrigger>
                                    <SelectContent>{employees.map(emp => <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Assigned To')}</Label>
                                <Select value={form.assigned_to} onValueChange={v => setForm({ ...form, assigned_to: v })}>
                                    <SelectTrigger><SelectValue placeholder={t('Select Assignee')} /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">{t('None')}</SelectItem>
                                        {employees.map(emp => <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>{t('Start Date')}</Label><Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
                            <div className="space-y-2"><Label>{t('Due Date')}</Label><Input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('Onboarding Checklist')}</Label>
                            <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
                                {form.checklist_items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                        <Checkbox checked={item.completed} onCheckedChange={() => toggleChecklistItem(idx)} id={`check-${idx}`} />
                                        <label htmlFor={`check-${idx}`} className={`text-sm cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}>{t(item.label)}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2"><Label>{t('Notes')}</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setShowCreate(false); setEditingItem(null); }}>{t('Cancel')}</Button>
                            <Button type="submit">{editingItem ? t('Update') : t('Create')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} title={t('Delete Onboarding')} message={t('Are you sure?')} />
        </AuthenticatedLayout>
    );
}
