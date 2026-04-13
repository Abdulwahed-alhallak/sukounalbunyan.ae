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
import { Plus, Edit as EditIcon, Trash2, Package, Laptop, Smartphone, Key, Car, Monitor } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NoRecordsFound from '@/components/no-records-found';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface Asset {
    id: number;
    asset_name: string;
    asset_type: string;
    serial_number: string | null;
    purchase_date: string | null;
    purchase_cost: number;
    status: string;
    assigned_to: number | null;
    assigned_date: string | null;
    return_date: string | null;
    condition: string;
    notes: string | null;
    assigned_employee?: { id: number; name: string } | null;
    created_at: string;
}

interface PageProps {
    assets: {
        data: Asset[];
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

const assetTypeIcons: Record<string, any> = {
    Laptop: Laptop,
    Phone: Smartphone,
    Key: Key,
    Vehicle: Car,
    Monitor: Monitor,
    Other: Package,
};

const statusColors: Record<string, string> = {
    Available: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    Assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Under Maintenance': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    Retired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const conditionColors: Record<string, string> = {
    New: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    Good: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Fair: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    Poor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function Index() {
    const { t } = useTranslation();
    const { assets, employees } = usePage<PageProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(urlParams.get('search') || '');
    const [showCreate, setShowCreate] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [form, setForm] = useState({
        asset_name: '',
        asset_type: 'Other',
        serial_number: '',
        purchase_date: '',
        purchase_cost: '',
        status: 'Available',
        assigned_to: '',
        assigned_date: '',
        return_date: '',
        condition: 'Good',
        notes: '',
    });

    const resetForm = () => {
        setForm({
            asset_name: '',
            asset_type: 'Other',
            serial_number: '',
            purchase_date: '',
            purchase_cost: '',
            status: 'Available',
            assigned_to: '',
            assigned_date: '',
            return_date: '',
            condition: 'Good',
            notes: '',
        });
    };

    const applySearch = (clearSearch = false) => {
        router.get(
            route('hrm.assets.index'),
            { search: clearSearch ? '' : search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleEdit = (asset: Asset) => {
        setForm({
            asset_name: asset.asset_name,
            asset_type: asset.asset_type,
            serial_number: asset.serial_number || '',
            purchase_date: asset.purchase_date ? asset.purchase_date.split('T')[0] : '',
            purchase_cost: String(asset.purchase_cost || ''),
            status: asset.status,
            assigned_to: asset.assigned_to ? String(asset.assigned_to) : '',
            assigned_date: asset.assigned_date ? asset.assigned_date.split('T')[0] : '',
            return_date: asset.return_date ? asset.return_date.split('T')[0] : '',
            condition: asset.condition,
            notes: asset.notes || '',
        });
        setEditingAsset(asset);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: Record<string, any> = {
            ...form,
            purchase_cost: form.purchase_cost ? parseFloat(form.purchase_cost) : 0,
            assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
        };

        if (editingAsset) {
            router.put(route('hrm.assets.update', editingAsset.id), data, {
                onSuccess: () => {
                    setEditingAsset(null);
                    resetForm();
                },
            });
        } else {
            router.post(route('hrm.assets.store'), data, {
                onSuccess: () => {
                    setShowCreate(false);
                    resetForm();
                },
            });
        }
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('hrm.assets.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
        }
    };

    const assetItems = assets?.data || [];
    const totalAssets = assets?.total || assetItems.length;
    const assignedCount = assetItems.filter((a) => a.status === 'Assigned').length;
    const availableCount = assetItems.filter((a) => a.status === 'Available').length;

    const renderForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>{t('Asset Name')} *</Label>
                    <Input
                        value={form.asset_name}
                        onChange={(e) => setForm({ ...form, asset_name: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t('Asset Type')}</Label>
                    <Select value={form.asset_type} onValueChange={(v) => setForm({ ...form, asset_type: v })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {['Laptop', 'Phone', 'Key', 'Vehicle', 'Monitor', 'Other'].map((type) => (
                                <SelectItem key={type} value={type}>
                                    {t(type)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{t('Serial Number')}</Label>
                    <Input
                        value={form.serial_number}
                        onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t('Purchase Date')}</Label>
                    <Input
                        type="date"
                        value={form.purchase_date}
                        onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t('Purchase Cost')}</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={form.purchase_cost}
                        onChange={(e) => setForm({ ...form, purchase_cost: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t('Condition')}</Label>
                    <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {['New', 'Good', 'Fair', 'Poor'].map((c) => (
                                <SelectItem key={c} value={c}>
                                    {t(c)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{t('Status')}</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {['Available', 'Assigned', 'Under Maintenance', 'Retired'].map((s) => (
                                <SelectItem key={s} value={s}>
                                    {t(s)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{t('Assigned To')}</Label>
                    <Select value={form.assigned_to} onValueChange={(v) => setForm({ ...form, assigned_to: v })}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('Select Employee')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">{t('None')}</SelectItem>
                            {employees.map((emp) => (
                                <SelectItem key={emp.id} value={String(emp.id)}>
                                    {emp.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{t('Assigned Date')}</Label>
                    <Input
                        type="date"
                        value={form.assigned_date}
                        onChange={(e) => setForm({ ...form, assigned_date: e.target.value })}
                    />
                </div>
                {editingAsset && (
                    <div className="space-y-2">
                        <Label>{t('Return Date')}</Label>
                        <Input
                            type="date"
                            value={form.return_date}
                            onChange={(e) => setForm({ ...form, return_date: e.target.value })}
                        />
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <Label>{t('Notes')}</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
            </div>
            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setShowCreate(false);
                        setEditingAsset(null);
                    }}
                >
                    {t('Cancel')}
                </Button>
                <Button type="submit">{editingAsset ? t('Update') : t('Create')}</Button>
            </DialogFooter>
        </form>
    );

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Assets') }]}
            pageTitle={t('Company Assets')}
        >
            <Head title={t('Company Assets')} />
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:border-blue-800/30 dark:from-blue-950/20 dark:to-blue-900/10">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-xl bg-blue-500/10 p-3">
                                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalAssets}</p>
                                <p className="text-sm text-blue-600/70">{t('Total Assets')}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:border-emerald-800/30 dark:from-emerald-950/20 dark:to-emerald-900/10">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-xl bg-emerald-500/10 p-3">
                                <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                    {availableCount}
                                </p>
                                <p className="text-sm text-emerald-600/70">{t('Available')}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-violet-200/50 bg-gradient-to-br from-violet-50 to-violet-100/50 dark:border-violet-800/30 dark:from-violet-950/20 dark:to-violet-900/10">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-xl bg-violet-500/10 p-3">
                                <Package className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                                    {assignedCount}
                                </p>
                                <p className="text-sm text-violet-600/70">{t('Assigned')}</p>
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
                            placeholder={t('Search assets...')}
                        />
                        <Button
                            onClick={() => {
                                resetForm();
                                setShowCreate(true);
                            }}
                        >
                            <Plus className="me-2 h-4 w-4" />
                            {t('Add Asset')}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {assetItems.length > 0 ? (
                            <>
                                <div className="overflow-hidden rounded-lg border">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="p-3 text-start text-sm font-semibold">{t('Asset')}</th>
                                                <th className="p-3 text-start text-sm font-semibold">{t('Type')}</th>
                                                <th className="p-3 text-start text-sm font-semibold">
                                                    {t('Serial Number')}
                                                </th>
                                                <th className="p-3 text-start text-sm font-semibold">{t('Status')}</th>
                                                <th className="p-3 text-start text-sm font-semibold">
                                                    {t('Condition')}
                                                </th>
                                                <th className="p-3 text-start text-sm font-semibold">
                                                    {t('Assigned To')}
                                                </th>
                                                <th className="p-3 text-start text-sm font-semibold">{t('Cost')}</th>
                                                <th className="p-3 text-end text-sm font-semibold">{t('Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assetItems.map((asset) => {
                                                const IconComp = assetTypeIcons[asset.asset_type] || Package;
                                                return (
                                                    <tr
                                                        key={asset.id}
                                                        className="border-b transition-colors last:border-b-0 hover:bg-muted/30"
                                                    >
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                                                    <IconComp className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <span className="text-sm font-medium">
                                                                    {asset.asset_name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-sm text-muted-foreground">
                                                            {t(asset.asset_type)}
                                                        </td>
                                                        <td className="p-3 font-mono text-sm text-muted-foreground">
                                                            {asset.serial_number || '—'}
                                                        </td>
                                                        <td className="p-3">
                                                            <Badge className={statusColors[asset.status] || ''}>
                                                                {t(asset.status)}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3">
                                                            <Badge
                                                                variant="outline"
                                                                className={conditionColors[asset.condition] || ''}
                                                            >
                                                                {t(asset.condition)}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 text-sm">
                                                            {asset.assigned_employee?.name || (
                                                                <span className="text-muted-foreground">—</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-sm font-medium">
                                                            {asset.purchase_cost
                                                                ? formatCurrency(asset.purchase_cost)
                                                                : '—'}
                                                        </td>
                                                        <td className="p-3 text-end">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8"
                                                                                onClick={() => handleEdit(asset)}
                                                                            >
                                                                                <EditIcon className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>{t('Edit')}</TooltipContent>
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 text-destructive"
                                                                                onClick={() => setDeleteId(asset.id)}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>{t('Delete')}</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {assets.last_page > 1 && (
                                    <div className="mt-4">
                                        <Pagination data={assets} routeName="hrm.assets.index" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <NoRecordsFound
                                icon={Package}
                                title={t('No assets found')}
                                onCreateClick={() => {
                                    resetForm();
                                    setShowCreate(true);
                                }}
                                createButtonText={t('Add Asset')}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={showCreate || !!editingAsset}
                onOpenChange={() => {
                    setShowCreate(false);
                    setEditingAsset(null);
                }}
            >
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingAsset ? t('Edit Asset') : t('Add New Asset')}</DialogTitle>
                    </DialogHeader>
                    {renderForm()}
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title={t('Delete Asset')}
                message={t('Are you sure you want to delete this asset?')}
            />
        </AuthenticatedLayout>
    );
}
