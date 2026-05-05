import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarDays, Building2, FileStack, Briefcase } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface RentalContract {
    id: number;
    contract_number: string;
    start_date: string;
    billing_cycle: string;
    project?: { name: string };
    items: Array<{
        product: { name: string };
        quantity: number;
        price_per_cycle: number;
    }>;
    security_deposit_check?: string;
    security_deposit_amount?: number;
    security_deposit_notes?: string;
}

interface Props {
    customers: Customer[];
}

export default function ConsolidatedBilling() {
    const { t } = useTranslation();
    const { customers } = usePage<Props>().props;
    const [contracts, setContracts] = useState<RentalContract[]>([]);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        billing_date: new Date().toISOString().split('T')[0],
        selected_contracts: [] as number[],
    });

    const handleCustomerChange = async (customerId: string) => {
        setData('customer_id', customerId);
        if (!customerId) {
            setContracts([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(route('consolidated-billing.customer-contracts', customerId));
            const data = await response.json();
            setContracts(data);
            // Default to select all
            setData(prev => ({
                ...prev,
                customer_id: customerId,
                selected_contracts: data.map((c: RentalContract) => c.id)
            }));
        } catch (error) {
            console.error('Failed to fetch contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleContract = (id: number) => {
        const current = [...data.selected_contracts];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('selected_contracts', current);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('consolidated-billing.store'));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Sales'), url: route('sales-invoices.index') },
                { label: t('Consolidated Billing') },
            ]}
            pageTitle={t('Consolidated Billing')}
        >
            <Head title={t('Consolidated Billing')} />

            <div className="space-y-6">
                <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted/20">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary">
                            <FileStack className="h-6 w-6" />
                            {t('Grouped Invoicing Engine')}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {t('Generate a single unified invoice for multiple projects and rental contracts.')}
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="customer_id" className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-primary" />
                                        {t('Select Client')}
                                    </Label>
                                    <Select
                                        value={data.customer_id}
                                        onValueChange={handleCustomerChange}
                                    >
                                        <SelectTrigger className="h-12 border-primary/20 bg-background focus:ring-primary">
                                            <SelectValue placeholder={t('Choose a customer...')} />
                                        </SelectTrigger>
                                        <SelectContent searchable>
                                            {customers?.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.name} ({customer.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.customer_id && <p className="text-xs text-destructive">{errors.customer_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="billing_date" className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-primary" />
                                        {t('Billing Target Date')}
                                    </Label>
                                    <DatePicker
                                        id="billing_date"
                                        value={data.billing_date}
                                        onChange={(value) => setData('billing_date', value)}
                                        className="h-12"
                                    />
                                    {errors.billing_date && <p className="text-xs text-destructive">{errors.billing_date}</p>}
                                </div>
                            </div>

                            {/* Smart Security Deposit Alert */}
                            {contracts.some(c => c.security_deposit_check) && (
                                <div className="mt-6 p-4 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800 animate-in zoom-in-95 duration-300">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-amber-100 dark:bg-amber-900 p-1.5 rounded-full">
                                            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                                                {t('Active Security Guarantees')}
                                                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] uppercase">
                                                    {t('Secured Client')}
                                                </Badge>
                                            </h4>
                                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {contracts.filter(c => c.security_deposit_check).map(c => (
                                                    <div key={c.id} className="text-xs text-amber-800/80 dark:text-amber-300/80 bg-white/50 dark:bg-black/20 p-2 rounded border border-amber-100 dark:border-amber-900/50">
                                                        <span className="font-semibold">{t('Contract')}: {c.contract_number}</span>
                                                        <div className="mt-1 flex flex-wrap gap-x-4">
                                                            <span><span className="opacity-60">{t('Check #')}:</span> {c.security_deposit_check}</span>
                                                            <span><span className="opacity-60">{t('Amount')}:</span> {formatCurrency(c.security_deposit_amount || 0)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.customer_id && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Briefcase className="h-5 w-5 text-primary" />
                                            {t('Available Projects & Contracts')}
                                        </h3>
                                        <Badge variant="outline" className="px-3 py-1">
                                            {contracts.length} {t('Contracts Found')}
                                        </Badge>
                                    </div>

                                    <div className="rounded-xl border border-primary/10 bg-background/50 backdrop-blur-sm overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead className="w-12"></TableHead>
                                                    <TableHead>{t('Contract #')}</TableHead>
                                                    <TableHead>{t('Project')}</TableHead>
                                                    <TableHead>{t('Start Date')}</TableHead>
                                                    <TableHead>{t('Billing Cycle')}</TableHead>
                                                    <TableHead className="text-right">{t('Items')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                                            {t('Loading contracts...')}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : contracts.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                                            {t('No active rental contracts found for this client.')}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    contracts.map((contract) => (
                                                        <TableRow key={contract.id} className="hover:bg-primary/5 transition-colors">
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={data.selected_contracts.includes(contract.id)}
                                                                    onCheckedChange={() => toggleContract(contract.id)}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">{contract.contract_number}</TableCell>
                                                            <TableCell>
                                                                {contract.project ? (
                                                                    <Badge variant="secondary" className="font-normal">
                                                                        {contract.project.name}
                                                                    </Badge>
                                                                ) : (
                                                                    <span className="text-muted-foreground italic text-xs">--</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">{contract.start_date}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="capitalize">
                                                                    {t(contract.billing_cycle)}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold">
                                                                {contract.items?.length || 0}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => window.history.back()}
                                    className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                    {t('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.customer_id || data.selected_contracts.length === 0}
                                    className="px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    {processing ? t('Generating Invoice...') : t('Generate Unified Invoice')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-md bg-primary/5">
                        <CardContent className="pt-6">
                            <h4 className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">{t('Smart Grouping')}</h4>
                            <p className="text-xs text-muted-foreground">
                                {t('Items are automatically grouped by project in the final invoice PDF for better clarity.')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md bg-secondary/5">
                        <CardContent className="pt-6">
                            <h4 className="text-sm font-semibold text-secondary mb-1 uppercase tracking-wider">{t('Period Tracking')}</h4>
                            <p className="text-xs text-muted-foreground">
                                {t('Calculates billing based on actual lease duration (Daily/Monthly) per project.')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md bg-accent/5">
                        <CardContent className="pt-6">
                            <h4 className="text-sm font-semibold text-accent mb-1 uppercase tracking-wider">{t('Tax Accuracy')}</h4>
                            <p className="text-xs text-muted-foreground">
                                {t('Unified tax calculations across all projects and contracts in a single transaction.')}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
