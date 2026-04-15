import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileText } from 'lucide-react';
import { formatDate, getImagePath, getCurrencySymbol } from '@/utils/helpers';
import { SearchInput } from '@/components/ui/search-input';
import NoRecordsFound from '@/components/no-records-found';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContractsIndex() {
    const { t } = useTranslation();
    const { contracts, employees = [] } = usePage<any>().props;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        employee_id: '',
        contract_type: 'Fixed Term',
        start_date: '',
        end_date: '',
        probation_end_date: '',
        basic_salary: '',
        status: 'Active',
        notes: '',
        document: null as File | null,
    });

    const resetForm = () => {
        setFormData({
            employee_id: '',
            contract_type: 'Fixed Term',
            start_date: '',
            end_date: '',
            probation_end_date: '',
            basic_salary: '',
            status: 'Active',
            notes: '',
            document: null,
        });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('hrm.employee-contracts.store'), formData as any, {
            onSuccess: () => {
                setIsCreateOpen(false);
                resetForm();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { _method, ...submitData } = formData as any;
        submitData._method = 'PUT';

        router.post(route('hrm.employee-contracts.update', selectedContract.id), submitData, {
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedContract(null);
                resetForm();
            },
        });
    };

    const handleDelete = (id: number) => {
        router.delete(route('hrm.employee-contracts.destroy', id));
    };

    const filteredContracts = contracts.filter(
        (c: any) =>
            c.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.contract_type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('HRM'), url: route('hrm.index') },
                { label: t('Employee Contracts') },
            ]}
            pageTitle={t('Employee Contracts')}
            pageActions={
                <Button
                    onClick={() => {
                        resetForm();
                        setIsCreateOpen(true);
                    }}
                    className="gap-2"
                >
                    <PlusCircle className="h-4 w-4" />
                    {t('New Contract')}
                </Button>
            }
        >
            <Head title={t('Employee Contracts')} />

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 px-6 py-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                        <FileText className="h-5 w-5 text-primary" />
                        {t('Contracts Overview')}
                    </CardTitle>
                    <div className="w-1/3">
                        <SearchInput
                            value={searchQuery}
                            onChange={(val) => setSearchQuery(val)}
                            onSearch={(val) => setSearchQuery(val)}
                            placeholder={t('Search by employee Name...')}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredContracts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="p-4 text-start font-medium">{t('Employee')}</th>
                                        <th className="p-4 text-start font-medium">{t('Type')}</th>
                                        <th className="p-4 text-start font-medium">{t('Timeline')}</th>
                                        <th className="p-4 text-start font-medium">{t('Basic Salary')}</th>
                                        <th className="p-4 text-start font-medium">{t('Status')}</th>
                                        <th className="p-4 text-end font-medium">{t('Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContracts.map((contract: any) => (
                                        <tr
                                            key={contract.id}
                                            className="border-b transition-colors last:border-0 hover:bg-muted/30"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            contract.employee?.avatar
                                                                ? getImagePath(contract.employee.avatar)
                                                                : getImagePath('avatar.png')
                                                        }
                                                        alt=""
                                                        className="h-8 w-8 rounded-full"
                                                        onError={(e) =>
                                                            (e.currentTarget.src = getImagePath('avatar.png'))
                                                        }
                                                    />
                                                    <span
                                                        className="cursor-pointer font-medium hover:underline"
                                                        onClick={() =>
                                                            router.get(
                                                                route('hrm.employees.show', contract.employee_id)
                                                            )
                                                        }
                                                    >
                                                        {contract.employee?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="bg-background font-medium">
                                                    {t(contract.contract_type)}
                                                </Badge>
                                                {contract.probation_end_date &&
                                                    new Date(contract.probation_end_date) > new Date() && (
                                                        <div className="mt-1 text-xs text-muted-foreground text-orange-500">
                                                            {t('Probation until')}{' '}
                                                            {formatDate(contract.probation_end_date)}
                                                        </div>
                                                    )}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                <div>{formatDate(contract.start_date)}</div>
                                                {contract.end_date && (
                                                    <div>
                                                        <span className="me-2 text-xs">➜</span>
                                                        {formatDate(contract.end_date)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 font-semibold text-primary">
                                                {contract.basic_salary
                                                    ? `${Number(contract.basic_salary).toLocaleString()} ${getCurrencySymbol()}`
                                                    : '-'}
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    className={
                                                        contract.status === 'Active'
                                                            ? 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600'
                                                            : contract.status === 'Expired'
                                                              ? 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600'
                                                              : 'bg-muted-foreground'
                                                    }
                                                >
                                                    {t(contract.status)}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-end">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedContract(contract);
                                                            setFormData({
                                                                employee_id: contract.employee_id,
                                                                contract_type: contract.contract_type,
                                                                start_date: contract.start_date,
                                                                end_date: contract.end_date || '',
                                                                probation_end_date: contract.probation_end_date || '',
                                                                basic_salary: contract.basic_salary || '',
                                                                status: contract.status,
                                                                notes: contract.notes || '',
                                                                document: null,
                                                            });
                                                            setIsEditOpen(true);
                                                        }}
                                                    >
                                                        {t('Edit')}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    t('Are you sure you want to delete this contract?')
                                                                )
                                                            ) {
                                                                handleDelete(contract.id);
                                                            }
                                                        }}
                                                    >
                                                        {t('Delete')}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <NoRecordsFound
                            title={t('No Contracts')}
                            icon={FileText}
                            description={t('No contracts found. Assign a contract to an employee to get started.')}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Create Contract')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>
                                    {t('Employee')} <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.employee_id}
                                    onValueChange={(val) => setFormData({ ...formData, employee_id: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select Employee')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e: any) => (
                                            <SelectItem key={e.id} value={String(e.id)}>
                                                {e.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {t('Contract Type')} <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.contract_type}
                                    onValueChange={(val) => setFormData({ ...formData, contract_type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select Type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fixed Term">{t('Fixed Term')}</SelectItem>
                                        <SelectItem value="Unlimited">{t('Unlimited')}</SelectItem>
                                        <SelectItem value="Freelance">{t('Freelance')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {t('Start Date')} <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('End Date')}</Label>
                                <Input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Probation End Date')}</Label>
                                <Input
                                    type="date"
                                    value={formData.probation_end_date}
                                    onChange={(e) => setFormData({ ...formData, probation_end_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Basic Salary')}</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.basic_salary}
                                    onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>{t('Notes')}</Label>
                                <Textarea
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{t('Assign')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Edit Contract')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>
                                    {t('Contract Type')} <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.contract_type}
                                    onValueChange={(val) => setFormData({ ...formData, contract_type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select Type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fixed Term">{t('Fixed Term')}</SelectItem>
                                        <SelectItem value="Unlimited">{t('Unlimited')}</SelectItem>
                                        <SelectItem value="Freelance">{t('Freelance')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {t('Status')} <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">{t('Active')}</SelectItem>
                                        <SelectItem value="Expired">{t('Expired')}</SelectItem>
                                        <SelectItem value="Terminated">{t('Terminated')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {t('Start Date')} <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('End Date')}</Label>
                                <Input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Probation End Date')}</Label>
                                <Input
                                    type="date"
                                    value={formData.probation_end_date}
                                    onChange={(e) => setFormData({ ...formData, probation_end_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Basic Salary')}</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.basic_salary}
                                    onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>{t('Notes')}</Label>
                                <Textarea
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{t('Update')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
