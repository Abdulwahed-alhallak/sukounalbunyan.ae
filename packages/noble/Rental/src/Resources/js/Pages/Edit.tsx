import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputError } from '@/components/ui/input-error';
import { DatePicker } from '@/components/ui/date-picker';
import { CalendarDays, Save, ArrowLeft, MapPin, CreditCard, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from '@inertiajs/react';

interface EditProps {
    contract: any;
}

export default function Edit() {
    const { t } = useTranslation();
    const { contract } = usePage<EditProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        end_date: contract.end_date ? contract.end_date.split('T')[0] : '',
        min_days: contract.min_days || 0,
        security_deposit: contract.security_deposit || 0,
        notes: contract.notes || '',
        terms: contract.terms || '',
        payment_method: contract.payment_method || 'cash',
        site_name: contract.site_name || '',
        site_address: contract.site_address || '',
        site_contact_person: contract.site_contact_person || '',
        site_contact_phone: contract.site_contact_phone || '',
        delivery_fee: contract.delivery_fee || 0,
        pickup_fee: contract.pickup_fee || 0,
        installments: contract.installments || [] as Array<{ id?: number, amount: number, due_date: string }>,
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('rental.update', contract.id));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Rental Contracts'), url: route('rental.index') },
                { label: contract.contract_number, url: route('rental.show', contract.id) },
                { label: t('Edit Contract') }
            ]}
            pageTitle={t('Edit Rental Contract')}
        >
            <Head title={t('Edit Rental Contract')} />

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            {t('Edit Contract Terms')} - {contract.contract_number}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="end_date">{t('End Date')}</Label>
                            <DatePicker 
                                value={data.end_date} 
                                onChange={(v) => setData('end_date', v)} 
                            />
                            <p className="text-[0.8rem] text-muted-foreground mt-1">{t('Optional. Can be updated later.')}</p>
                            <InputError message={errors.end_date} />
                        </div>
                        
                        <div>
                            <Label htmlFor="min_days">{t('Minimum Rental Days')}</Label>
                            <Input
                                id="min_days"
                                type="number"
                                value={data.min_days}
                                onChange={(e) => setData('min_days', e.target.value)}
                            />
                            <p className="text-[0.8rem] text-muted-foreground mt-1">{t('Items returned early will bill for these days.')}</p>
                            <InputError message={errors.min_days} />
                        </div>

                        <div>
                            <Label htmlFor="security_deposit">{t('Security Deposit')} (AED)</Label>
                            <Input
                                id="security_deposit"
                                type="number"
                                step="0.01"
                                value={data.security_deposit}
                                onChange={(e) => setData('security_deposit', e.target.value)}
                            />
                            <p className="text-[0.8rem] text-muted-foreground mt-1">{t('Amount held for risk/damages.')}</p>
                            <InputError message={errors.security_deposit} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="notes">{t('Notes')}</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={4}
                            />
                            <InputError message={errors.notes} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="terms">{t('Terms & Conditions')}</Label>
                            <Textarea
                                id="terms"
                                value={data.terms}
                                onChange={(e) => setData('terms', e.target.value)}
                                rows={6}
                                placeholder={t('Specify any custom terms for this contract...')}
                            />
                            <InputError message={errors.terms} />
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
                        <div className="w-full md:w-1/2">
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

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href={route('rental.show', contract.id)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('Cancel')}
                        </Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        <Save className="w-4 h-4 mr-2" />
                        {processing ? t('Saving...') : t('Save Changes')}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
