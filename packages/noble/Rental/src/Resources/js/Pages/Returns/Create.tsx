import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    PackageCheck,
    AlertCircle,
    CheckCircle2,
    RotateCcw,
    ChevronDown,
    Wrench,
    AlertTriangle,
    Package2,
} from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/helpers';
import { Link } from '@inertiajs/react';

interface ContractOption {
    value: number;
    label: string;
}

interface ContractItem {
    id: number;
    product_id: number;
    product_name: string;
    rented_quantity: number;
    returned_quantity_total: number;
    outstanding_quantity: number;
}

interface ReturnLine {
    product_id: number;
    quantity: number;
    condition: string;
    damage_fee: number;
    damage_notes: string;
}

interface Props {
    contracts: ContractOption[];
}

const CONDITIONS = [
    { value: 'good',    label: 'Good',    color: 'bg-green-100 text-green-700' },
    { value: 'damaged', label: 'Damaged', color: 'bg-amber-100 text-amber-700' },
    { value: 'lost',    label: 'Lost',    color: 'bg-red-100 text-red-700' },
];

export default function CreateReturn({ contracts }: Props) {
    const { t } = useTranslation();
    const [items, setItems] = useState<ContractItem[]>([]);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm<{
        contract_id: string;
        return_date: string;
        returns: ReturnLine[];
    }>({
        contract_id: '',
        return_date: new Date().toISOString().split('T')[0],
        returns: [],
    });

    useEffect(() => {
        if (data.contract_id) {
            fetchContractItems(data.contract_id);
        } else {
            setItems([]);
            setData('returns', []);
        }
    }, [data.contract_id]);

    const fetchContractItems = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.get(route('rental-returns.items', id));
            const fetched: ContractItem[] = response.data;
            setItems(fetched);
            setData('returns', fetched.map((item) => ({
                product_id:   item.product_id,
                quantity:     0,
                condition:    'good',
                damage_fee:   0,
                damage_notes: '',
            })));
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateReturn = (index: number, field: keyof ReturnLine, value: any) => {
        const updated = [...data.returns];
        updated[index] = { ...updated[index], [field]: value };
        // Auto-clear damage fields if condition goes back to 'good'
        if (field === 'condition' && value === 'good') {
            updated[index].damage_fee   = 0;
            updated[index].damage_notes = '';
        }
        setData('returns', updated);
    };

    const activeReturns   = data.returns.filter((r) => r.quantity > 0);
    const totalDamageFees = activeReturns.reduce((sum, r) => sum + (r.damage_fee || 0), 0);
    const totalItems      = activeReturns.reduce((sum, r) => sum + r.quantity, 0);
    const canSubmit       = data.contract_id && activeReturns.length > 0 && !processing;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rental-returns.store'));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Rentals'), url: route('rental.index') },
                { label: t('Register Return') },
            ]}
            pageTitle={t('Register Scaffolding Return')}
        >
            <Head title={t('Register Return')} />

            <form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">

                {/* ── Contract & Date Selection ── */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <RotateCcw className="h-4 w-4 text-primary" />
                            {t('Return Details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="contract_id">{t('Rental Contract')}</Label>
                                <Select
                                    value={data.contract_id}
                                    onValueChange={(v) => setData('contract_id', v)}
                                >
                                    <SelectTrigger id="contract_id" className="h-10">
                                        <SelectValue placeholder={t('Choose a contract…')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contracts.map((c) => (
                                            <SelectItem key={c.value} value={c.value.toString()}>
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.contract_id && (
                                    <p className="text-xs text-destructive">{errors.contract_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="return_date">{t('Return Date')}</Label>
                                <Input
                                    id="return_date"
                                    type="date"
                                    value={data.return_date}
                                    onChange={(e) => setData('return_date', e.target.value)}
                                    required
                                    className="h-10"
                                />
                                {errors.return_date && (
                                    <p className="text-xs text-destructive">{errors.return_date}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Items Table ── */}
                <Card>
                    <CardHeader className="pb-3 flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <PackageCheck className="h-4 w-4 text-primary" />
                            {t('Items to Return')}
                        </CardTitle>
                        {items.length > 0 && (
                            <Badge variant="secondary">
                                {items.filter((_, i) => data.returns[i]?.quantity > 0).length} / {items.length} {t('selected')}
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            /* Loading skeleton */
                            <div className="divide-y">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                                        <div className="h-4 w-1/3 rounded bg-muted" />
                                        <div className="h-4 w-16 rounded bg-muted" />
                                        <div className="h-8 w-24 rounded bg-muted" />
                                    </div>
                                ))}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                                <Package2 className="h-10 w-10 opacity-30" />
                                <p className="text-sm">
                                    {data.contract_id
                                        ? t('No outstanding items in this contract.')
                                        : t('Select a contract to see items.')}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {items.map((item, index) => {
                                    const line = data.returns[index];
                                    const isDamaged = line?.condition !== 'good';
                                    const isActive  = (line?.quantity ?? 0) > 0;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`px-6 py-4 transition-colors ${isActive ? 'bg-primary/3' : ''}`}
                                        >
                                            {/* Row header */}
                                            <div className="grid grid-cols-12 items-center gap-4">
                                                {/* Product name */}
                                                <div className="col-span-12 md:col-span-4">
                                                    <p className="font-medium text-sm text-foreground">{item.product_name}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {t('Rented')}: {item.rented_quantity} &nbsp;·&nbsp;
                                                        {t('On Site')}: <span className={item.outstanding_quantity > 0 ? 'text-amber-600 font-semibold' : 'text-green-600'}>{item.outstanding_quantity}</span>
                                                    </p>
                                                </div>

                                                {/* Quantity */}
                                                <div className="col-span-6 md:col-span-3 space-y-1">
                                                    <Label className="text-xs text-muted-foreground">{t('Returning Qty')}</Label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={item.outstanding_quantity}
                                                        step={1}
                                                        value={line?.quantity || 0}
                                                        onChange={(e) => updateReturn(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        className="h-9 text-center font-semibold"
                                                    />
                                                </div>

                                                {/* Condition */}
                                                <div className="col-span-6 md:col-span-3 space-y-1">
                                                    <Label className="text-xs text-muted-foreground">{t('Condition')}</Label>
                                                    <Select
                                                        value={line?.condition ?? 'good'}
                                                        onValueChange={(v) => updateReturn(index, 'condition', v)}
                                                    >
                                                        <SelectTrigger className="h-9">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CONDITIONS.map((c) => (
                                                                <SelectItem key={c.value} value={c.value}>
                                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${c.color}`}>
                                                                        {t(c.label)}
                                                                    </span>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Damage fee (only when not good) */}
                                                <div className="col-span-6 md:col-span-2 space-y-1">
                                                    <Label className="text-xs text-muted-foreground">{t('Damage Fee')}</Label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step={0.01}
                                                        value={line?.damage_fee || 0}
                                                        disabled={!isDamaged}
                                                        onChange={(e) => updateReturn(index, 'damage_fee', parseFloat(e.target.value) || 0)}
                                                        className={`h-9 ${!isDamaged ? 'opacity-40' : 'border-amber-300 focus-visible:ring-amber-400'}`}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>

                                            {/* Damage notes — shown when condition is damaged/lost */}
                                            {isDamaged && (
                                                <div className="mt-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Wrench className="h-3 w-3" />
                                                        {t('Damage Notes')}
                                                    </Label>
                                                    <Textarea
                                                        rows={2}
                                                        value={line?.damage_notes || ''}
                                                        onChange={(e) => updateReturn(index, 'damage_notes', e.target.value)}
                                                        placeholder={t('Describe the damage or reason for loss…')}
                                                        className="text-sm resize-none border-amber-200 focus-visible:ring-amber-300"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Summary + Submit ── */}
                {items.length > 0 && (
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="pt-5">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                {/* Summary stats */}
                                <div className="flex items-center gap-6 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('Total Items')}</p>
                                        <p className="text-2xl font-bold text-primary">{totalItems}</p>
                                    </div>
                                    {totalDamageFees > 0 && (
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('Damage Fees')}</p>
                                            <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalDamageFees)}</p>
                                        </div>
                                    )}
                                    <div className="max-w-xs">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {t('Rental charges stop from the return date for returned units.')}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('rental.index')}>{t('Cancel')}</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!canSubmit}
                                        className="gap-2 px-8"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {processing ? t('Processing…') : t('Register Return')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </form>
        </AuthenticatedLayout>
    );
}
