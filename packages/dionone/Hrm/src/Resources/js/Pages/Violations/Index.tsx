import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Pagination } from "@/components/ui/pagination";
import { AlertCircle, HelpCircle, Plus, Edit as EditIcon, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Violation {
    id: number;
    employee_id: number;
    violation_type_id: number;
    violation_date: string;
    incident_date: string | null;
    action_taken: string;
    deduction_amount: string;
    description: string;
    status: string;
    employee: { id: number; name: string };
    violation_type: { id: number; name: string; severity: string; default_deduction_amount: number };
}

interface PageProps {
    violations: { data: Violation[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number };
    users: { id: number; name: string }[];
    violationTypes: { id: number; name: string; severity: string; default_deduction_amount: number }[];
    auth: any;
    [key: string]: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { violations, users, violationTypes } = usePage<PageProps>().props;

    const [showCreate, setShowCreate] = useState(false);
    const [editingItem, setEditingItem] = useState<Violation | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [form, setForm] = useState({
        employee_id: '',
        violation_type_id: '',
        violation_date: new Date().toISOString().split('T')[0],
        incident_date: '',
        action_taken: 'Warning',
        deduction_amount: '0',
        description: '',
    });

    const resetForm = () => setForm({
        employee_id: '', violation_type_id: '', 
        violation_date: new Date().toISOString().split('T')[0], 
        incident_date: '', action_taken: 'Warning', deduction_amount: '0', description: '',
    });

    const handleEdit = (item: Violation) => {
        setForm({
            employee_id: String(item.employee_id),
            violation_type_id: String(item.violation_type_id),
            violation_date: item.violation_date ? item.violation_date.split('T')[0] : '',
            incident_date: item.incident_date ? item.incident_date.split('T')[0] : '',
            action_taken: item.action_taken || 'Warning',
            deduction_amount: item.deduction_amount || '0',
            description: item.description || '',
        });
        setEditingItem(item);
    };

    const handleViolationTypeChange = (typeId: string) => {
        const type = violationTypes.find(t => String(t.id) === typeId);
        setForm({
            ...form, 
            violation_type_id: typeId,
            deduction_amount: type?.default_deduction_amount ? String(type.default_deduction_amount) : form.deduction_amount
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...form,
            employee_id: parseInt(form.employee_id),
            violation_type_id: parseInt(form.violation_type_id),
            deduction_amount: parseFloat(form.deduction_amount) || 0,
        };

        if (editingItem) {
            router.put(route('hrm.violations.update', editingItem.id), data, {
                onSuccess: () => { setEditingItem(null); resetForm(); },
            });
        } else {
            router.post(route('hrm.violations.store'), data, {
                onSuccess: () => { setShowCreate(false); resetForm(); },
            });
        }
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('hrm.violations.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
        }
    };

    const data = violations?.data || [];

    return (
        <AuthenticatedLayout 
            breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Violations') }]} 
            pageTitle={t('Violations Framework')}
        >
            <Head title={t('Violations Management')} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t('Disciplinary Framework')}</h2>
                        <p className="text-muted-foreground text-sm">{t('Manage and define employee policy violations and corresponding actions/deductions.')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => { resetForm(); setShowCreate(true); }}><Plus className="h-4 w-4 mr-2" /> {t('Record Violation')}</Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                            {t('Recent Violations')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6 sm:pt-0">
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>{t('Employee')}</TableHead>
                                        <TableHead>{t('Violation Type')}</TableHead>
                                        <TableHead>{t('Severity')}</TableHead>
                                        <TableHead>{t('Date')}</TableHead>
                                        <TableHead>{t('Action Taken')}</TableHead>
                                        <TableHead className="text-right">{t('Deduction')}</TableHead>
                                        <TableHead className="text-right">{t('Actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length > 0 ? (
                                        data.map((violation) => (
                                            <TableRow key={violation.id}>
                                                <TableCell className="font-medium">{violation.employee?.name || t('Unknown')}</TableCell>
                                                <TableCell>{violation.violation_type?.name || t('Custom')}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        violation.violation_type?.severity === 'critical' ? 'destructive' :
                                                        violation.violation_type?.severity === 'high' ? 'destructive' : 'secondary'
                                                    }>{violation.violation_type?.severity || 'medium'}</Badge>
                                                </TableCell>
                                                <TableCell>{new Date(violation.violation_date).toLocaleDateString()}</TableCell>
                                                <TableCell>{violation.action_taken || t('Pending')}</TableCell>
                                                <TableCell className="text-right font-medium text-destructive">
                                                    {Number(violation.deduction_amount) > 0 ? `-${violation.deduction_amount}` : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <TooltipProvider>
                                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(violation)}><EditIcon className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>{t('Edit')}</TooltipContent></Tooltip>
                                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(violation.id)}><Trash2 className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>{t('Delete')}</TooltipContent></Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <HelpCircle className="h-10 w-10 mb-2 opacity-20" />
                                                    <p>{t('No violations recorded yet.')}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {violations && violations.last_page > 1 && <div className="mt-4"><Pagination data={violations} /></div>}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={showCreate || !!editingItem} onOpenChange={() => { setShowCreate(false); setEditingItem(null); }}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editingItem ? t('Edit Violation') : t('Record New Violation')}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('Employee')} *</Label>
                                <Select value={form.employee_id} onValueChange={v => setForm({ ...form, employee_id: v })} required disabled={!!editingItem}>
                                    <SelectTrigger><SelectValue placeholder={t('Select Employee')} /></SelectTrigger>
                                    <SelectContent>{users.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Violation Type')} *</Label>
                                <Select value={form.violation_type_id} onValueChange={handleViolationTypeChange} required>
                                    <SelectTrigger><SelectValue placeholder={t('Select Type')} /></SelectTrigger>
                                    <SelectContent>{violationTypes.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>{t('Violation Date')} *</Label><Input type="date" value={form.violation_date} onChange={e => setForm({ ...form, violation_date: e.target.value })} required /></div>
                            <div className="space-y-2"><Label>{t('Incident Date')}</Label><Input type="date" value={form.incident_date} onChange={e => setForm({ ...form, incident_date: e.target.value })} /></div>
                            <div className="space-y-2">
                                <Label>{t('Action Taken')}</Label>
                                <Select value={form.action_taken} onValueChange={v => setForm({ ...form, action_taken: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Warning">{t('Warning')}</SelectItem>
                                        <SelectItem value="Suspension">{t('Suspension')}</SelectItem>
                                        <SelectItem value="Deduction">{t('Salary Deduction')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>{t('Deduction Amount')}</Label><Input type="number" step="0.01" value={form.deduction_amount} onChange={e => setForm({ ...form, deduction_amount: e.target.value })} /></div>
                        </div>
                        <div className="space-y-2"><Label>{t('Description')}</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder={t('Enter incident details...')} /></div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setShowCreate(false); setEditingItem(null); }}>{t('Cancel')}</Button>
                            <Button type="submit">{editingItem ? t('Update') : t('Record')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} title={t('Delete Violation')} message={t('Are you sure you want to delete this violation record?')} />
        </AuthenticatedLayout>
    );
}
