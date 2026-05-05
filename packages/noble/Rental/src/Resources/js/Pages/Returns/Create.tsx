import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
    PackageCheck, 
    Calendar, 
    Plus, 
    Trash2, 
    AlertCircle,
    CheckCircle2,
    ArrowLeft
} from 'lucide-react';
import axios from 'axios';

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

interface Props {
    contracts: ContractOption[];
}

export default function CreateReturn({ contracts }: Props) {
    const { t } = useTranslation();
    const [items, setItems] = useState<ContractItem[]>([]);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        contract_id: '',
        return_date: new Date().toISOString().split('T')[0],
        returns: [] as { product_id: number, quantity: number, condition: string, damage_fee: number }[],
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
            setItems(response.data);
            // Initialize returns with zero quantity
            setData('returns', response.data.map((item: ContractItem) => ({
                product_id: item.product_id,
                quantity: 0,
                condition: 'Good',
                damage_fee: 0
            })));
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (index: number, value: number) => {
        const newReturns = [...data.returns];
        newReturns[index].quantity = value;
        setData('returns', newReturns);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rental-returns.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Rentals'), href: route('rental.index') },
                { label: t('Register Return') }
            ]}
            pageTitle={t('Register Scaffolding Return')}
        >
            <Head title={t('Register Return')} />

            <div className="mx-auto max-w-5xl space-y-6">
                <form onSubmit={submit} className="space-y-6">
                    {/* Header Card */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Select Contract')}</label>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-foreground/20"
                                    value={data.contract_id}
                                    onChange={(e) => setData('contract_id', e.target.value)}
                                    required
                                >
                                    <option value="">{t('Choose a contract...')}</option>
                                    {contracts.map((c) => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                                {errors.contract_id && <p className="mt-1 text-xs text-red-500">{errors.contract_id}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">{t('Return Date')}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-foreground/20"
                                        value={data.return_date}
                                        onChange={(e) => setData('return_date', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.return_date && <p className="mt-1 text-xs text-red-500">{errors.return_date}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        <div className="border-b border-border bg-muted/30 px-6 py-4">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <PackageCheck className="h-4 w-4" />
                                {t('Items to Return')}
                            </h3>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-sm text-muted-foreground">{t('Loading items...')}</div>
                        ) : items.length === 0 ? (
                            <div className="p-12 text-center text-sm text-muted-foreground">
                                {data.contract_id ? t('No items found in this contract') : t('Select a contract to see items')}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/20 text-left">
                                            <th className="px-6 py-3 font-medium text-muted-foreground">{t('Product')}</th>
                                            <th className="px-6 py-3 font-medium text-muted-foreground text-center">{t('Rented')}</th>
                                            <th className="px-6 py-3 font-medium text-muted-foreground text-center">{t('On Site')}</th>
                                            <th className="px-6 py-3 font-medium text-muted-foreground w-40">{t('Returning Quantity')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {items.map((item, index) => (
                                            <tr key={item.id} className="transition hover:bg-muted/10">
                                                <td className="px-6 py-4 font-medium text-foreground">{item.product_name}</td>
                                                <td className="px-6 py-4 text-center text-muted-foreground">{item.rented_quantity}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.outstanding_quantity > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20'}`}>
                                                        {item.outstanding_quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        max={item.outstanding_quantity}
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:ring-2 focus:ring-foreground/20"
                                                        value={data.returns[index]?.quantity || 0}
                                                        onChange={(e) => handleQuantityChange(index, parseFloat(e.target.value))}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Footer / Summary */}
                    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
                        <p className="text-xs text-muted-foreground max-w-md">
                            <AlertCircle className="inline h-3 w-3 me-1 mb-0.5" />
                            {t('Recording a return will automatically adjust the on-site balance for this client and stop rental charges for the returned units from today.')}
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !data.contract_id || data.returns.every(r => r.quantity <= 0)}
                                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50"
                            >
                                {processing ? t('Processing...') : t('Register Return')}
                                <CheckCircle2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
