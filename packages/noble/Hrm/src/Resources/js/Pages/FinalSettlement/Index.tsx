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
import { Plus, Trash2, UserMinus, DollarSign, FileDown, Briefcase } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import NoRecordsFound from '@/components/no-records-found';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface Settlement {
    id: number;
    employee_id: number;
    last_working_day: string;
    status: string;
    basic_salary: number;
    leave_encashment: number;
    gratuity: number;
    other_earnings: number;
    deductions: number;
    total_amount: number;
    separation_reason: string | null;
    notes: string | null;
    employee?: { id: number; name: string } | null;
    created_at: string;
}

interface PageProps {
    settlements: { data: Settlement[]; links: any; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number; };
    employees: { id: number; name: string }[];
    auth: any;
    [key: string]: any;
}

const statusColors: Record<string, string> = {
    Open: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Paid: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
};

export default function Index() {
    const { t } = useTranslation();
    const { settlements, employees } = usePage<PageProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(urlParams.get('search') || '');
    const [showCreate, setShowCreate] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [statusUpdate, setStatusUpdate] = useState<{ id: number; status: string } | null>(null);

    const [form, setForm] = useState({
        employee_id: '', last_working_day: '', basic_salary: '', leave_encashment: '',
        gratuity: '', other_earnings: '', deductions: '', separation_reason: '', notes: '',
    });

    const resetForm = () => setForm({
        employee_id: '', last_working_day: '', basic_salary: '', leave_encashment: '',
        gratuity: '', other_earnings: '', deductions: '', separation_reason: '', notes: '',
    });

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('hrm.final-settlement.index'), { search: value }, { preserveState: true, preserveScroll: true });
    };

    const calculateTotal = () => {
        const salary = parseFloat(form.basic_salary) || 0;
        const leave = parseFloat(form.leave_encashment) || 0;
        const grat = parseFloat(form.gratuity) || 0;
        const other = parseFloat(form.other_earnings) || 0;
        const deduct = parseFloat(form.deductions) || 0;
        return (salary + leave + grat + other - deduct).toFixed(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('hrm.final-settlement.store'), {
            employee_id: parseInt(form.employee_id),
            last_working_day: form.last_working_day,
            basic_salary: parseFloat(form.basic_salary) || 0,
            leave_encashment: parseFloat(form.leave_encashment) || 0,
            gratuity: parseFloat(form.gratuity) || 0,
            other_earnings: parseFloat(form.other_earnings) || 0,
            deductions: parseFloat(form.deductions) || 0,
            separation_reason: form.separation_reason || null,
            notes: form.notes || null,
        }, {
            onSuccess: () => { setShowCreate(false); resetForm(); },
        });
    };

    const handleStatusUpdate = () => {
        if (statusUpdate) {
            router.put(route('hrm.final-settlement.update', statusUpdate.id), { status: statusUpdate.status }, {
                onSuccess: () => setStatusUpdate(null),
            });
        }
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('hrm.final-settlement.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
        }
    };

    const items = settlements?.data || [];
    const totalAmount = items.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Final Settlement') }]} pageTitle={t('Final Settlement')}>
            <Head title={t('Final Settlement')} />

            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-900/10">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-rose-500/10"><UserMinus className="h-6 w-6 text-rose-600 dark:text-rose-400" /></div>
                            <div><p className="text-2xl font-bold text-rose-700 dark:text-rose-300">{settlements?.total || items.length}</p><p className="text-sm text-rose-600/70">{t('Total Settlements')}</p></div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-500/10"><Briefcase className="h-6 w-6 text-amber-600 dark:text-amber-400" /></div>
                            <div><p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{items.filter(s => s.status === 'Open').length}</p><p className="text-sm text-amber-600/70">{t('Open')}</p></div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10"><DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" /></div>
                            <div><p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(totalAmount)}</p><p className="text-sm text-green-600/70">{t('Total Amount')}</p></div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <SearchInput value={search} onChange={handleSearch} onSearch={() => handleSearch(search)} placeholder={t('Search...')} />
                        <div className="flex gap-2">
                            <Button variant="outline"><FileDown className="h-4 w-4 mr-2" />{t('Export')}</Button>
                            <Button onClick={() => { resetForm(); setShowCreate(true); }}><Plus className="h-4 w-4 mr-2" />{t('Off-board Employee')}</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {items.length > 0 ? (
                            <>
                                <div className="rounded-lg border overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-muted/50 border-b">
                                                <th className="text-left p-3 text-sm font-semibold">{t('Employee name')}</th>
                                                <th className="text-left p-3 text-sm font-semibold">{t('Last Working Day')}</th>
                                                <th className="text-left p-3 text-sm font-semibold">{t('Status')}</th>
                                                <th className="text-left p-3 text-sm font-semibold">{t('Created at')}</th>
                                                <th className="text-right p-3 text-sm font-semibold">{t('Total amount')}</th>
                                                <th className="text-right p-3 text-sm font-semibold">{t('Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map(item => (
                                                <tr key={item.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                                                {item.employee?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">{item.employee?.name || t('Unknown')}</p>
                                                                {item.separation_reason && <p className="text-xs text-muted-foreground">{t(item.separation_reason)}</p>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-sm">{formatDate(item.last_working_day)}</td>
                                                    <td className="p-3">
                                                        <Badge className={`cursor-pointer ${statusColors[item.status] || ''}`} onClick={() => setStatusUpdate({ id: item.id, status: item.status })}>
                                                            {t(item.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-sm text-muted-foreground">{formatDate(item.created_at)}</td>
                                                    <td className="p-3 text-right text-sm font-bold">{item.total_amount > 0 ? formatCurrency(item.total_amount) : `${formatCurrency(0)}`}</td>
                                                    <td className="p-3 text-right">
                                                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger><TooltipContent>{t('Delete')}</TooltipContent></Tooltip></TooltipProvider>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {settlements.last_page > 1 && <div className="mt-4"><Pagination data={settlements} routeName="hrm.final-settlement.index" /></div>}
                            </>
                        ) : (
                            <NoRecordsFound icon={Briefcase} title={t('No final settlements found')} description={t('Create your first final settlement off-boarding.')} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{t('Off-board Employee - Final Settlement')}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t('Employee')} *</Label>
                            <Select value={form.employee_id} onValueChange={v => setForm({ ...form, employee_id: v })}>
                                <SelectTrigger><SelectValue placeholder={t('Select Employee')} /></SelectTrigger>
                                <SelectContent>
                                    {employees.map(emp => <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('Last Working Day')} *</Label>
                                <Input type="date" value={form.last_working_day} onChange={e => setForm({ ...form, last_working_day: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Separation Reason')}</Label>
                                <Select value={form.separation_reason} onValueChange={v => setForm({ ...form, separation_reason: v })}>
                                    <SelectTrigger><SelectValue placeholder={t('Select Reason')} /></SelectTrigger>
                                    <SelectContent>
                                        {['Resignation', 'Termination', 'Contract End', 'Retirement'].map(r => <SelectItem key={r} value={r}>{t(r)}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>{t('Basic Salary')} *</Label><Input type="number" step="0.01" value={form.basic_salary} onChange={e => setForm({ ...form, basic_salary: e.target.value })} required /></div>
                            <div className="space-y-2"><Label>{t('Leave Encashment')}</Label><Input type="number" step="0.01" value={form.leave_encashment} onChange={e => setForm({ ...form, leave_encashment: e.target.value })} /></div>
                            <div className="space-y-2"><Label>{t('Gratuity (EoS)')}</Label><Input type="number" step="0.01" value={form.gratuity} onChange={e => setForm({ ...form, gratuity: e.target.value })} /></div>
                            <div className="space-y-2"><Label>{t('Other Earnings')}</Label><Input type="number" step="0.01" value={form.other_earnings} onChange={e => setForm({ ...form, other_earnings: e.target.value })} /></div>
                        </div>
                        <div className="space-y-2"><Label>{t('Deductions')}</Label><Input type="number" step="0.01" value={form.deductions} onChange={e => setForm({ ...form, deductions: e.target.value })} /></div>
                        <div className="rounded-lg bg-muted/50 p-4 border">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{t('Net Payable')}</span>
                                <span className="text-xl font-bold text-primary">{formatCurrency(parseFloat(calculateTotal()))}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{t('Salary + Leave + Gratuity + Others − Deductions')}</p>
                        </div>
                        <div className="space-y-2"><Label>{t('Notes')}</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>{t('Cancel')}</Button>
                            <Button type="submit">{t('Create Settlement')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Status Update */}
            <Dialog open={!!statusUpdate} onOpenChange={() => setStatusUpdate(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>{t('Update Status')}</DialogTitle></DialogHeader>
                    <Select value={statusUpdate?.status || ''} onValueChange={v => setStatusUpdate(prev => prev ? { ...prev, status: v } : null)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {['Open', 'Processing', 'Paid'].map(s => <SelectItem key={s} value={s}>{t(s)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusUpdate(null)}>{t('Cancel')}</Button>
                        <Button onClick={handleStatusUpdate}>{t('Update')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)} onConfirm={handleDelete} title={t('Delete Settlement')} message={t('Are you sure?')} />
        </AuthenticatedLayout>
    );
}
