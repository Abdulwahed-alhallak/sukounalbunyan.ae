import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputError } from '@/components/ui/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { CalendarDays, Package, Trash2, MapPin, CreditCard, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import MediaPicker from '@/components/MediaPicker';

interface CreateProps {
    customers: Array<{ id: number; name: string }>;
    projects: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string; sale_price: number }>;
    warehouses: Array<{ id: number; name: string }>;
}

export default function Create() {
    const { t } = useTranslation();
    const { customers, projects, products, warehouses } = usePage<CreateProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        project_id: '',
        warehouse_id: '',
        start_date: new Date().toISOString().split('T')[0],
        billing_cycle: 'daily',
        security_deposit: 0,
        min_days: 0,
        notes: '',
        payment_method: 'cash',
        site_name: '',
        site_address: '',
        site_contact_person: '',
        site_contact_phone: '',
        delivery_fee: 0,
        pickup_fee: 0,
        installments: [] as Array<{ amount: number, due_date: string }>,
        items: [
            {
                product_id: '',
                quantity: 1,
                price_per_cycle: 0,
            },
        ],
        status: 'active',
        attachments: [] as string[],
    });

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', quantity: 1, price_per_cycle: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        
        if (field === 'product_id') {
            const product = products.find(p => p.id.toString() === value);
            if (product) {
                newItems[index].price_per_cycle = product.sale_price;
            }
        }
        
        setData('items', newItems);
    };

    const addInstallment = () => {
        setData('installments', [...data.installments, { amount: 0, due_date: new Date().toISOString().split('T')[0] }]);
    };

    const removeInstallment = (index: number) => {
        const newInst = [...data.installments];
        newInst.splice(index, 1);
        setData('installments', newInst);
    };

    const updateInstallment = (index: number, field: string, value: any) => {
        const newInst = [...data.installments];
        newInst[index] = { ...newInst[index], [field]: value };
        setData('installments', newInst);
    };

    const handleSubmit = (e: React.FormEvent, status: string = 'active') => {
        e.preventDefault();
        setData('status', status);
        // We use a small timeout to ensure state update is processed or just pass it in manually if Inertia allows
        // Better: just post with the specific status
        post(route('rental.store'), {
            onBefore: () => { data.status = status } // Temporary hack for status
        });
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Rental Contracts'), url: route('rental.index') }, { label: t('Create Contract') }]}
            pageTitle={t('Create Rental Contract')}
        >
            <Head title={t('Create Rental Contract')} />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            {t('Contract Details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor="customer_id">{t('Customer')}</Label>
                            <Select value={data.customer_id} onValueChange={(v) => setData('customer_id', v)}>
                                <SelectTrigger><SelectValue placeholder={t('Select Customer')} /></SelectTrigger>
                                <SelectContent>
                                    {customers.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.customer_id} />
                        </div>
                        <div>
                            <Label htmlFor="project_id">{t('Project')} <span className="text-muted-foreground text-xs">({t('optional')})</span></Label>
                            <Select value={data.project_id} onValueChange={(v) => setData('project_id', v === 'none' ? '' : v)}>
                                <SelectTrigger><SelectValue placeholder={t('Select Project (Optional)')} /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('None')}</SelectItem>
                                    {projects?.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="start_date">{t('Start Date')}</Label>
                            <DatePicker value={data.start_date} onChange={(v) => setData('start_date', v)} />
                            <InputError message={errors.start_date} />
                        </div>
                        <div>
                            <Label htmlFor="billing_cycle">{t('Billing Cycle')}</Label>
                            <Select value={data.billing_cycle} onValueChange={(v) => setData('billing_cycle', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">{t('Daily')}</SelectItem>
                                    <SelectItem value="monthly">{t('Monthly')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="min_days">{t('Minimum Days')}</Label>
                            <Input
                                id="min_days"
                                type="number"
                                value={data.min_days}
                                onChange={(e) => setData('min_days', e.target.value)}
                                placeholder="0"
                            />
                            <p className="text-[0.8rem] text-muted-foreground mt-1">{t('Items returned early will bill for these days.')}</p>
                            <InputError message={errors.min_days} />
                        </div>
                        <div>
                            <Label htmlFor="security_deposit">{t('Security Deposit')} (AED)</Label>
                            <Input
                                id="security_deposit"
                                type="number"
                                value={data.security_deposit}
                                onChange={(e) => setData('security_deposit', e.target.value)}
                                placeholder="0.00"
                            />
                            <p className="text-[0.8rem] text-muted-foreground mt-1">{t('Amount held for risk/damages.')}</p>
                            <InputError message={errors.security_deposit} />
                        </div>
                        <div>
                            <Label htmlFor="warehouse_id">{t('Source Warehouse')}</Label>
                            <Select value={data.warehouse_id} onValueChange={(v) => setData('warehouse_id', v)}>
                                <SelectTrigger><SelectValue placeholder={t('Select Warehouse')} /></SelectTrigger>
                                <SelectContent>
                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.warehouse_id} />
                        </div>
                        <div className="md:col-span-3">
                            <Label htmlFor="notes">{t('Notes')} <span className="text-muted-foreground text-xs">({t('optional')})</span></Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder={t('Enter any notes about this rental contract...')}
                                rows={2}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <MediaPicker
                                label={t('Attachments')}
                                multiple
                                value={data.attachments}
                                onChange={(v) => setData('attachments', v as string[])}
                                placeholder={t('Select documents or photos...')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            {t('Site & Logistics Details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="site_name">{t('Site Name')}</Label>
                            <Input
                                id="site_name"
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                placeholder={t('e.g. Al Barsha Villa Project')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="site_address">{t('Site Address')}</Label>
                            <Input
                                id="site_address"
                                value={data.site_address}
                                onChange={(e) => setData('site_address', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="site_contact_person">{t('Site Contact Person')}</Label>
                            <Input
                                id="site_contact_person"
                                value={data.site_contact_person}
                                onChange={(e) => setData('site_contact_person', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="site_contact_phone">{t('Site Contact Phone')}</Label>
                            <Input
                                id="site_contact_phone"
                                value={data.site_contact_phone}
                                onChange={(e) => setData('site_contact_phone', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="delivery_fee">{t('Delivery Fee')} (AED)</Label>
                            <Input
                                id="delivery_fee"
                                type="number"
                                value={data.delivery_fee}
                                onChange={(e) => setData('delivery_fee', parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="pickup_fee">{t('Pickup Fee')} (AED)</Label>
                            <Input
                                id="pickup_fee"
                                type="number"
                                value={data.pickup_fee}
                                onChange={(e) => setData('pickup_fee', parseFloat(e.target.value))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            {t('Payment Terms & Installments')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="w-full md:w-1/3">
                            <Label htmlFor="payment_method">{t('Payment Method')}</Label>
                            <Select value={data.payment_method} onValueChange={(v) => setData('payment_method', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">{t('Cash / Immediate')}</SelectItem>
                                    <SelectItem value="on_credit">{t('On Credit')}</SelectItem>
                                    <SelectItem value="installments">{t('Installments')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {data.payment_method === 'installments' && (
                            <div className="mt-4 border rounded-md p-4 bg-muted/20">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium">{t('Installment Schedule')}</h4>
                                    <Button type="button" size="sm" variant="outline" onClick={addInstallment}>
                                        <Plus className="h-4 w-4 mr-2" /> {t('Add Installment')}
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {data.installments.map((inst, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <Label>{t('Amount')} (AED)</Label>
                                                <Input 
                                                    type="number" 
                                                    value={inst.amount} 
                                                    onChange={(e) => updateInstallment(index, 'amount', e.target.value)} 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label>{t('Due Date')}</Label>
                                                <DatePicker 
                                                    value={inst.due_date} 
                                                    onChange={(v) => updateInstallment(index, 'due_date', v)} 
                                                />
                                            </div>
                                            <div className="pt-6">
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeInstallment(index)} className="text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {data.installments.length === 0 && (
                                        <p className="text-sm text-muted-foreground">{t('No installments added. Click "Add Installment" to schedule payments.')}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {t('Materials / Items')}
                        </CardTitle>
                        <Button type="button" size="sm" onClick={addItem}>{t('Add Item')}</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.items.map((item, index) => (
                                <div key={index} className="flex items-end gap-4 border-b pb-4 last:border-0">
                                    <div className="flex-1">
                                        <Label>{t('Product')}</Label>
                                        <Select value={item.product_id} onValueChange={(v) => updateItem(index, 'product_id', v)}>
                                            <SelectTrigger><SelectValue placeholder={t('Select Product')} /></SelectTrigger>
                                            <SelectContent>
                                                {products.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-32">
                                        <Label>{t('Quantity')}</Label>
                                        <Input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} />
                                    </div>
                                    <div className="w-40">
                                        <Label>{t('Price / Cycle')}</Label>
                                        <Input type="number" value={item.price_per_cycle} onChange={(e) => updateItem(index, 'price_per_cycle', e.target.value)} />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>{t('Cancel')}</Button>
                    <Button 
                        type="button" 
                        variant="secondary" 
                        disabled={processing}
                        onClick={(e) => handleSubmit(e as any, 'draft')}
                    >
                        {t('Save as Draft')}
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={processing}
                        onClick={(e) => handleSubmit(e as any, 'active')}
                    >
                        {processing ? t('Saving...') : t('Create & Activate')}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
