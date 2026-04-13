import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { Plus, Trash2, Palmtree, DollarSign, FileDown, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NoRecordsFound from '@/components/no-records-found';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface Settlement {
    id: number;
    employee_id: number;
    vacation_start_date: string;
    vacation_days: number;
    status: string;
    basic_salary: number;
    allowances_total: number;
    total_amount: number;
    notes: string | null;
    employee?: { id: number; name: string } | null;
    created_at: string;
}

interface PageProps {
    settlements: {
        data: Settlement[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    employees: { id: number; name: string }[];
    auth: any;
    [key: string]: any;
}

const statusColors: Record<string, string> = {
    Open: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Paid: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
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
        employee_id: '',
        vacation_start_date: '',
        vacation_days: '',
        basic_salary: '',
        allowances_total: '',
        notes: '',
    });

    const resetForm = () =>
        setForm({
            employee_id: '',
            vacation_start_date: '',
            vacation_days: '',
            basic_salary: '',
            allowances_total: '',
            notes: '',
        });

    const applySearch = (clearSearch = false) => {
        router.get(
            route('hrm.vacation-settlement.index'),
            { search: clearSearch ? '' : search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const calculateTotal = () => {
        const salary = parseFloat(form.basic_salary) || 0;
        const allowances = parseFloat(form.allowances_total) || 0;
        const days = parseInt(form.vacation_days) || 0;
        return (((salary + allowances) / 30) * days).toFixed(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: Record<string, any> = {
            employee_id: parseInt(form.employee_id),
            vacation_start_date: form.vacation_start_date,
            vacation_days: parseInt(form.vacation_days),
            basic_salary: parseFloat(form.basic_salary),
            allowances_total: parseFloat(form.allowances_total) || 0,
            notes: form.notes || null,
        };
        router.post(route('hrm.vacation-settlement.store'), data, {
            onSuccess: () => {
                setShowCreate(false);
                resetForm();
            },
        });
    };

    const handleStatusUpdate = () => {
        if (statusUpdate) {
            router.put(
                route('hrm.vacation-settlement.update', statusUpdate.id),
                { status: statusUpdate.status } as Record<string, any>,
                {
                    onSuccess: () => setStatusUpdate(null),
                }
            );
        }
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('hrm.vacation-settlement.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
        }
    };

    const items = settlements?.data || [];
    const totalAmount = items.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Vacation Settlement') }]}
            pageTitle={t('Vacation Settlement')}
        >
            <Head title={t('Vacation Settlement')} />

            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/20 dark:to-teal-900/10">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-xl bg-teal-500/10 p-3">
                                <Palmtree className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                                    {settlements?.total || items.length}
                                </p>
                                <p className="text-sm text-teal-600/70">{t('Total Settlements')}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-xl bg-amber-500/10 p-3">
                                <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                                    {items.filter((s) => s.status === 'Open').length}
                                </p>
                                <p className="text-sm text-amber-600/70">{t('Open')}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-xl bg-green-500/10 p-3">
                                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {formatCurrency(totalAmount)}
                                </p>
                                <p className="text-sm text-green-600/70">{t('Total Amount')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            onSearch={applySearch}
                            placeholder={t('Search...')}
                        />
                        <Button
                            onClick={() => {
                                resetForm();
                                setShowCreate(true);
                            }}
                        >
                            <Plus className="me-2 h-4 w-4" />
                            {t('Request Annual Leave')}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {items.length > 0 ? (
                            <>
                                <div className="overflow-hidden rounded-lg border">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="p-3 text-start text-sm font-semibold">
                                                    {t('Employee name')}
                                                </th>
                                                <th className="p-3 text-start text-sm font-semibold">
                                                    {t('Vacation starts on')}
                                                </th>
                                                <th className="p-3 text-start text-sm font-semibold">
                                                    {t('Vacation days')}
                                                </th>
                                                <th className="p-3 text-start text-sm font-semibold">{t('Status')}</th>
                                                <th className="p-3 text-start text-sm font-semibold">
                                                    {t('Created at')}
                                                </th>
                                                <th className="p-3 text-end text-sm font-semibold">
                                                    {t('Total amount')}
                                                </th>
                                                <th className="p-3 text-end text-sm font-semibold">{t('Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b transition-colors last:border-b-0 hover:bg-muted/30"
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                                                {item.employee?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <p className="text-sm font-medium">
                                                                {item.employee?.name || t('Unknown')}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-sm">
                                                        {formatDate(item.vacation_start_date)}
                                                    </td>
                                                    <td className="p-3 text-sm font-medium">{item.vacation_days}</td>
                                                    <td className="p-3">
                                                        <Badge
                                                            className={`cursor-pointer ${statusColors[item.status] || ''}`}
                                                            onClick={() =>
                                                                setStatusUpdate({ id: item.id, status: item.status })
                                                            }
                                                        >
                                                            {t(item.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-sm text-muted-foreground">
                                                        {formatDate(item.created_at)}
                                                    </td>
                                                    <td className="p-3 text-end text-sm font-bold">
                                                        {formatCurrency(item.total_amount)}
                                                    </td>
                                                    <td className="p-3 text-end">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-destructive"
                                                                        onClick={() => setDeleteId(item.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{t('Delete')}</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {settlements.last_page > 1 && (
                                    <div className="mt-4">
                                        <Pagination data={settlements} routeName="hrm.vacation-settlement.index" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <NoRecordsFound
                                icon={Palmtree}
                                title={t('No vacation settlements found')}
                                onCreateClick={() => {
                                    resetForm();
                                    setShowCreate(true);
                                }}
                                createButtonText={t('Request Annual Leave')}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t('Request Annual Leave Settlement')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t('Employee')} *</Label>
                            <Select
                                value={form.employee_id}
                                onValueChange={(v) => setForm({ ...form, employee_id: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('Select Employee')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((emp) => (
                                        <SelectItem key={emp.id} value={String(emp.id)}>
                                            {emp.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('Vacation Start Date')} *</Label>
                                <Input
                                    type="date"
                                    value={form.vacation_start_date}
                                    onChange={(e) => setForm({ ...form, vacation_start_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Vacation Days')} *</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={form.vacation_days}
                                    onChange={(e) => setForm({ ...form, vacation_days: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('Basic Salary')} *</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={form.basic_salary}
                                    onChange={(e) => setForm({ ...form, basic_salary: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Allowances Total')}</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={form.allowances_total}
                                    onChange={(e) => setForm({ ...form, allowances_total: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{t('Estimated Total')}</span>
                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(parseFloat(calculateTotal()))}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t('(Basic + Allowances) / 30 × Vacation Days')}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('Notes')}</Label>
                            <Textarea
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                rows={2}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit">{t('Create Settlement')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Status Update */}
            <Dialog open={!!statusUpdate} onOpenChange={() => setStatusUpdate(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{t('Update Status')}</DialogTitle>
                    </DialogHeader>
                    <Select
                        value={statusUpdate?.status || ''}
                        onValueChange={(v) => setStatusUpdate((prev) => (prev ? { ...prev, status: v } : null))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {['Open', 'Processing', 'Paid', 'Cancelled'].map((s) => (
                                <SelectItem key={s} value={s}>
                                    {t(s)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusUpdate(null)}>
                            {t('Cancel')}
                        </Button>
                        <Button onClick={handleStatusUpdate}>{t('Update')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title={t('Delete Settlement')}
                message={t('Are you sure?')}
            />
        </AuthenticatedLayout>
    );
}
