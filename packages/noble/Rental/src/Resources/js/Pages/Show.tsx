import React, { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { FileText, RotateCcw, XCircle, Trash2, CheckCheck, Download, Clock, Paperclip, ReceiptText, Eye, Printer, MapPin, CreditCard, Truck, QrCode, PackagePlus, ShoppingCart, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModuleAttachments from '@/components/ModuleAttachments';
import MediaPicker from '@/components/MediaPicker';
import { Link } from '@inertiajs/react';

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'active': return 'default';
        case 'closed': return 'secondary';
        case 'draft':  return 'outline';
        default:       return 'outline';
    }
}

function paymentVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'paid':    return 'default';
        case 'partial': return 'outline';
        case 'unpaid':  return 'destructive';
        default:        return 'secondary';
    }
}

export default function Show() {
    const { t } = useTranslation();
    const { contract, accruedRent, currentDailyRate, custodySummary } = usePage<any>().props;
    const addons: any[] = contract.addons ?? [];
    const events: any[] = contract.events ?? [];

    const [returnOpen, setReturnOpen]   = useState(false);
    const [renewOpen, setRenewOpen]     = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [settleOpen, setSettleOpen]   = useState(false);
    const [attachmentOpen, setAttachmentOpen] = useState(false);
    const [addMaterialsOpen, setAddMaterialsOpen] = useState(false);
    const [leaseToOwnOpen, setLeaseToOwnOpen] = useState(false);

    // Return form
    const { data, setData, post, processing } = useForm({
        product_id:        '',
        returned_quantity: '',
        damage_fee:        '0',
        damage_notes:      '',
        condition:         'good',
        return_date:       new Date().toISOString().split('T')[0],
    });

    // Renew form
    const renewForm = useForm({ new_end_date: '' });

    // Payment form
    const paymentForm = useForm({
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    // Deposit Settlement form
    const settleForm = useForm({
        status: 'refunded',
        amount: contract.security_deposit,
        notes: '',
    });

    // Add Materials form
    const addMaterialsForm = useForm({
        effective_date: new Date().toISOString().split('T')[0],
        notes: '',
        items: [{ product_id: '', quantity: '', price_per_cycle: '' }] as any[],
    });

    // Lease-to-Own form
    const leaseToOwnForm = useForm({
        purchase_price: '',
        conversion_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    // Attachment form
    const attachmentForm = useForm({
        attachments: [] as string[],
    });

    const handleReturn = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rental.return', contract.id), {
            onSuccess: () => {
                setReturnOpen(false);
                setData({ 
                    product_id: '', 
                    returned_quantity: '', 
                    damage_fee: '0', 
                    damage_notes: '', 
                    condition: 'good',
                    return_date: new Date().toISOString().split('T')[0] 
                });
            },
        });
    };

    const handleRenew = (e: React.FormEvent) => {
        e.preventDefault();
        renewForm.post(route('rental.renew', contract.id), {
            onSuccess: () => setRenewOpen(false),
        });
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(route('rental.payment', contract.id), {
            onSuccess: () => {
                setPaymentOpen(false);
                paymentForm.reset();
            },
        });
    };

    const handleSettleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        settleForm.post(route('rental.settle-deposit', contract.id), {
            onSuccess: () => setSettleOpen(false),
        });
    };

    const handleAddAttachments = (e: React.FormEvent) => {
        e.preventDefault();
        attachmentForm.post(route('rental.update', contract.id), {
            onSuccess: () => {
                setAttachmentOpen(false);
                attachmentForm.reset();
            },
        });
    };

    const handleClose = () => {
        if (confirm(t('Are you sure you want to close this contract?'))) {
            router.post(route('rental.close', contract.id));
        }
    };

    const generateInvoice = () => {
        if (confirm(t('Are you sure you want to generate an invoice for the accrued rent?'))) {
            router.post(route('rental.invoice', contract.id));
        }
    };

    const handleDelete = () => {
        if (confirm(t('Are you sure you want to delete this contract? Inventory will be restored.'))) {
            router.delete(route('rental.destroy', contract.id));
        }
    };

    const handleReturnAll = () => {
        if (confirm(t('Are you sure you want to return ALL remaining materials? This will close the contract.'))) {
            router.post(route('rental.returnAll', contract.id));
        }
    };

    const handleInvoiceInstallment = (installmentId: number) => {
        if (confirm(t('Generate invoice for this installment now?'))) {
            router.post(route('rental.installment.invoice', { rental: contract.id, installment: installmentId }));
        }
    };

    const handleAddMaterials = (e: React.FormEvent) => {
        e.preventDefault();
        addMaterialsForm.post(route('rental.add-materials', contract.id), {
            onSuccess: () => { setAddMaterialsOpen(false); addMaterialsForm.reset(); },
        });
    };

    const handleLeaseToOwn = (e: React.FormEvent) => {
        e.preventDefault();
        leaseToOwnForm.post(route('rental.lease-to-own', contract.id), {
            onSuccess: () => setLeaseToOwnOpen(false),
        });
    };

    const addAddonRow = () => {
        addMaterialsForm.setData('items', [
            ...addMaterialsForm.data.items,
            { product_id: '', quantity: '', price_per_cycle: '' },
        ]);
    };

    const removeAddonRow = (idx: number) => {
        addMaterialsForm.setData('items', addMaterialsForm.data.items.filter((_: any, i: number) => i !== idx));
    };

    const updateAddonItem = (idx: number, field: string, value: string) => {
        const items = [...addMaterialsForm.data.items];
        items[idx] = { ...items[idx], [field]: value };
        addMaterialsForm.setData('items', items);
    };

    const totalInCustody = custodySummary.reduce((s: number, i: any) => s + i.remaining_qty, 0);
    const isActive = contract.status === 'active';

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Rental Contracts'), url: route('rental.index') },
                { label: contract.contract_number },
            ]}
            pageTitle={t('Contract Details')}
        >
            <Head title={contract.contract_number} />

            <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('Accrued Rent')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(contract.accrued_rent)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t('Estimated since last billing')}</p>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-orange-600">{t('Damage Fees')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-700">{formatCurrency(contract.total_damage_fees)}</div>
                        <p className="text-xs text-orange-600/70 mt-1">{t('Recorded from returns')}</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-info">{t('Total Invoiced')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">{formatCurrency(contract.total_invoiced)}</div>
                        <p className="text-xs text-info/70 mt-1">{t('Official billing documents')}</p>
                    </CardContent>
                </Card>
                <Card className={Number(contract.balance_due) > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('Balance Due')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${Number(contract.balance_due) > 0 ? 'text-destructive' : 'text-green-600'}`}>
                            {formatCurrency(contract.balance_due)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{t('Outstanding amount to pay')}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* ── Left: Tabs for Materials, History, Attachments ── */}
                <div className="md:col-span-2 space-y-6">
                    <Tabs defaultValue="materials" className="w-full">
                        <TabsList className="flex flex-wrap h-auto w-full justify-start gap-1 p-1 bg-muted/50 rounded-lg mb-4">
                            <TabsTrigger value="materials" className="flex-grow min-w-[100px] whitespace-nowrap">{t('Materials')}</TabsTrigger>
                            <TabsTrigger value="addons" className="flex-grow min-w-[100px] whitespace-nowrap">
                                <PackagePlus className="h-3.5 w-3.5 me-1" />{t('Addons')}
                                {addons.length > 0 && <span className="ms-1 bg-violet-500 text-white text-[10px] rounded-full px-1.5">{addons.length}</span>}
                            </TabsTrigger>
                            <TabsTrigger value="logistics" className="flex-grow min-w-[100px] whitespace-nowrap">{t('Logistics')}</TabsTrigger>
                            <TabsTrigger value="installments" className="flex-grow min-w-[100px] whitespace-nowrap">{t('Installments')}</TabsTrigger>
                            <TabsTrigger value="history" className="flex-grow min-w-[100px] whitespace-nowrap">{t('Returns')}</TabsTrigger>
                            <TabsTrigger value="attachments" className="flex-grow min-w-[100px] whitespace-nowrap">{t('Files')}</TabsTrigger>
                            <TabsTrigger value="events" className="flex-grow min-w-[100px] whitespace-nowrap">
                                <Activity className="h-3.5 w-3.5 me-1" />{t('Events')}
                            </TabsTrigger>
                            <TabsTrigger value="timeline" className="flex-grow min-w-[100px] whitespace-nowrap">{t('Timeline')}</TabsTrigger>
                            <TabsTrigger value="invoices" className="flex-grow min-w-[100px] whitespace-nowrap">{t('Invoices')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="materials">
                            {/* Contract Items */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                                    <CardTitle>{t('Materials in Custody')}</CardTitle>
                                    <div className="flex gap-2 flex-wrap">
                                        {contract.status === 'draft' && (
                                            <Button 
                                                className="gap-2 bg-green-600 hover:bg-green-700"
                                                onClick={() => router.post(route('rental.activate', contract.id))}
                                            >
                                                <CheckCheck className="h-4 w-4" />
                                                {t('Activate Contract')}
                                            </Button>
                                        )}
                                        {isActive && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                                                onClick={() => setLeaseToOwnOpen(true)}
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                {t('Lease to Own')}
                                            </Button>
                                        )}
                                        {isActive && (
                                            <>
                                                <Button variant="outline" className="gap-2" onClick={() => window.open(route('rental.pdf', contract.id))}>
                                                    <Download className="h-4 w-4" />
                                                    {t('Download PDF')}
                                                </Button>
                                                <Button variant="outline" onClick={generateInvoice} className="gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    {t('Generate Invoice')}
                                                </Button>

                                                {/* Return All Dialog */}
                                                {totalInCustody > 0 && (
                                                    <Button variant="outline" className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50" onClick={handleReturnAll}>
                                                        <CheckCheck className="h-4 w-4" />
                                                        {t('Return All Materials')}
                                                    </Button>
                                                )}

                                                {/* Return Dialog */}
                                                <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="gap-2">
                                                            <RotateCcw className="h-4 w-4" />
                                                            {t('Return Materials')}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{t('Return Materials')}</DialogTitle>
                                                        </DialogHeader>
                                                        <form onSubmit={handleReturn} className="space-y-4">
                                                            <div>
                                                                <Label>{t('Select Material')}</Label>
                                                                <Select
                                                                    value={data.product_id}
                                                                    onValueChange={(v) => setData('product_id', v)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder={t('Select Material')} />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {custodySummary
                                                                            .filter((i: any) => i.remaining_qty > 0)
                                                                            .map((item: any) => (
                                                                                <SelectItem key={item.product_id} value={item.product_id.toString()}>
                                                                                    {item.product_name} ({t('Remaining')}: {item.remaining_qty})
                                                                                </SelectItem>
                                                                            ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label>{t('Return Quantity')}</Label>
                                                                <Input
                                                                    type="number"
                                                                    min="0.01"
                                                                    step="0.01"
                                                                    value={data.returned_quantity}
                                                                    onChange={(e) => setData('returned_quantity', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>{t('Condition')}</Label>
                                                                <Select
                                                                    value={data.condition}
                                                                    onValueChange={(v) => setData('condition', v)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="good">{t('Good (Return to Stock)')}</SelectItem>
                                                                        <SelectItem value="lost">{t('Lost (Penalty Fee)')}</SelectItem>
                                                                        <SelectItem value="scrap">{t('Scrap (Damaged Beyond Repair)')}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label>{t('Damage Fee')}</Label>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={data.damage_fee}
                                                                    onChange={(e) => setData('damage_fee', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>{t('Damage Notes')}</Label>
                                                                <Input
                                                                    value={data.damage_notes}
                                                                    onChange={(e) => setData('damage_notes', e.target.value)}
                                                                    placeholder={t('Describe any damages...')}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>{t('Return Date')}</Label>
                                                                <DatePicker
                                                                    value={data.return_date}
                                                                    onChange={(v: string) => setData('return_date', v)}
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <Button type="button" variant="outline" onClick={() => setReturnOpen(false)}>{t('Cancel')}</Button>
                                                                <Button type="submit" disabled={processing}>{t('Save Return')}</Button>
                                                            </DialogFooter>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* Payment Dialog */}
                                                <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button className="gap-2">
                                                            <FileText className="h-4 w-4" />
                                                            {t('Record Payment')}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{t('Record Payment')}</DialogTitle>
                                                        </DialogHeader>
                                                        <form onSubmit={handlePayment} className="space-y-4">
                                                            <div>
                                                                <Label>{t('Payment Amount')}</Label>
                                                                <Input
                                                                    type="number"
                                                                    min="0.01"
                                                                    step="0.01"
                                                                    value={paymentForm.data.amount}
                                                                    onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                                                    placeholder={t('Enter amount to pay...')}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>{t('Payment Date')}</Label>
                                                                <DatePicker
                                                                    value={paymentForm.data.payment_date}
                                                                    onChange={(v: string) => paymentForm.setData('payment_date', v)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>{t('Notes')}</Label>
                                                                <Input
                                                                    value={paymentForm.data.notes}
                                                                    onChange={(e) => paymentForm.setData('notes', e.target.value)}
                                                                    placeholder={t('Optional notes...')}
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <Button type="button" variant="outline" onClick={() => setPaymentOpen(false)}>{t('Cancel')}</Button>
                                                                <Button type="submit" disabled={paymentForm.processing}>{t('Confirm Payment')}</Button>
                                                            </DialogFooter>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* Renew Dialog */}
                                                <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="gap-2 text-info border-blue-200">
                                                            {t('Renew Contract')}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{t('Renew Rental Contract')}</DialogTitle>
                                                        </DialogHeader>
                                                        <form onSubmit={handleRenew} className="space-y-4">
                                                            <p className="text-sm text-muted-foreground">
                                                                {t('Renewing will reset the billing cycle start to today. Optionally set a new end date.')}
                                                            </p>
                                                            <div>
                                                                <Label>{t('New End Date (optional)')}</Label>
                                                                <DatePicker
                                                                    value={renewForm.data.new_end_date}
                                                                    onChange={(v: string) => renewForm.setData('new_end_date', v)}
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <Button type="submit" disabled={renewForm.processing}>
                                                                    {renewForm.processing ? t('Processing...') : t('Confirm Renewal')}
                                                                </Button>
                                                            </DialogFooter>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* Edit Contract */}
                                                <Button
                                                    variant="outline"
                                                    className="gap-2 border-primary/30 text-primary"
                                                    asChild
                                                >
                                                    <Link href={route('rental.edit', contract.id)}>
                                                        <FileText className="h-4 w-4" />
                                                        {t('Edit Contract')}
                                                    </Link>
                                                </Button>

                                                {/* Close Contract */}
                                                <Button
                                                    variant="outline"
                                                    className="gap-2 text-destructive border-destructive/30"
                                                    onClick={handleClose}
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    {t('Close Contract')}
                                                </Button>

                                                {/* Delete Contract */}
                                                {contract.total_invoiced == 0 && contract.paid_amount == 0 && (
                                                    <Button
                                                        variant="outline"
                                                        className="gap-2 text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
                                                        onClick={handleDelete}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        {t('Delete Contract')}
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('Material')}</TableHead>
                                                <TableHead className="text-center">{t('Original Qty')}</TableHead>
                                                <TableHead className="text-center">{t('Returned')}</TableHead>
                                                <TableHead className="text-center">{t('In Custody')}</TableHead>
                                                <TableHead>{t('Rate / Cycle')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {custodySummary.map((item: any) => (
                                                <TableRow key={item.id} className={item.remaining_qty === 0 ? 'opacity-50' : ''}>
                                                    <TableCell className="font-medium">{item.product_name}</TableCell>
                                                    <TableCell className="text-center">{item.original_qty}</TableCell>
                                                    <TableCell className="text-center text-orange-600">{item.returned_qty}</TableCell>
                                                    <TableCell className="text-center font-bold">
                                                        {item.remaining_qty === 0 ? (
                                                            <Badge variant="secondary">{t('Fully Returned')}</Badge>
                                                        ) : (
                                                            <span className="text-primary">{item.remaining_qty}</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{formatCurrency(item.price_per_cycle)} / {contract.billing_cycle}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="logistics">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        {t('Site & Logistics Information')}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(route('rental.labels', contract.id))}>
                                            <QrCode className="h-4 w-4" />
                                            {t('Print QR Labels')}
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(route('rental.logistics.pdf', contract.id))}>
                                            <Printer className="h-4 w-4" />
                                            {t('Print Logistics Note')}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground text-xs uppercase">{t('Site Name')}</Label>
                                            <div className="font-medium mt-1">{contract.site_name || '—'}</div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground text-xs uppercase">{t('Site Address')}</Label>
                                            <div className="font-medium mt-1">{contract.site_address || '—'}</div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground text-xs uppercase">{t('Site Contact Person')}</Label>
                                            <div className="font-medium mt-1">{contract.site_contact_person || '—'}</div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground text-xs uppercase">{t('Site Contact Phone')}</Label>
                                            <div className="font-medium mt-1">{contract.site_contact_phone || '—'}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                        <div>
                                            <Label className="text-muted-foreground text-xs uppercase">{t('Delivery Fee')}</Label>
                                            <div className="font-medium mt-1">{formatCurrency(contract.delivery_fee)}</div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground text-xs uppercase">{t('Pickup Fee')}</Label>
                                            <div className="font-medium mt-1">{formatCurrency(contract.pickup_fee)}</div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground text-xs uppercase">{t('Logistics Status')}</Label>
                                            <div className="font-medium mt-1">
                                                <Badge variant="outline" className="capitalize">
                                                    {contract.logistics_status ? contract.logistics_status.replace('_', ' ') : 'Pending'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ── Addons Tab ── */}
                        <TabsContent value="addons">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <PackagePlus className="h-5 w-5 text-violet-500" />
                                        {t('Additional Materials Added During Contract')}
                                    </CardTitle>
                                    {isActive && (
                                        <Dialog open={addMaterialsOpen} onOpenChange={setAddMaterialsOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-700">
                                                    <PackagePlus className="h-4 w-4" />
                                                    {t('Add Materials')}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>{t('Add Extra Materials to Contract')}</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleAddMaterials} className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>{t('Effective From Date')} *</Label>
                                                            <Input
                                                                type="date"
                                                                value={addMaterialsForm.data.effective_date}
                                                                onChange={e => addMaterialsForm.setData('effective_date', e.target.value)}
                                                            />
                                                            <p className="text-xs text-muted-foreground mt-1">{t('Billing starts from this date')}</p>
                                                        </div>
                                                        <div>
                                                            <Label>{t('Notes')}</Label>
                                                            <Input
                                                                value={addMaterialsForm.data.notes}
                                                                onChange={e => addMaterialsForm.setData('notes', e.target.value)}
                                                                placeholder={t('Reason for addition...')}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('Materials')} *</Label>
                                                        {addMaterialsForm.data.items.map((item: any, idx: number) => (
                                                            <div key={idx} className="grid grid-cols-[1fr_80px_100px_36px] gap-2 items-center">
                                                                <Select
                                                                    value={item.product_id}
                                                                    onValueChange={v => updateAddonItem(idx, 'product_id', v)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder={t('Select material...')} />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {custodySummary.map((cs: any) => (
                                                                            <SelectItem key={cs.product_id} value={cs.product_id.toString()}>
                                                                                {cs.product_name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Input
                                                                    type="number" min="0.01" step="0.01" placeholder={t('Qty')}
                                                                    value={item.quantity}
                                                                    onChange={e => updateAddonItem(idx, 'quantity', e.target.value)}
                                                                />
                                                                <Input
                                                                    type="number" min="0" step="0.01" placeholder={t('Rate')}
                                                                    value={item.price_per_cycle}
                                                                    onChange={e => updateAddonItem(idx, 'price_per_cycle', e.target.value)}
                                                                />
                                                                <Button type="button" size="icon" variant="ghost"
                                                                    className="text-destructive" onClick={() => removeAddonRow(idx)}
                                                                    disabled={addMaterialsForm.data.items.length === 1}>
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button type="button" variant="outline" size="sm" onClick={addAddonRow} className="gap-2">
                                                            <PackagePlus className="h-3.5 w-3.5" />{t('Add Row')}
                                                        </Button>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="button" variant="outline" onClick={() => setAddMaterialsOpen(false)}>{t('Cancel')}</Button>
                                                        <Button type="submit" disabled={addMaterialsForm.processing} className="bg-violet-600 hover:bg-violet-700">
                                                            {addMaterialsForm.processing ? t('Adding...') : t('Add to Contract')}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {addons.length === 0 ? (
                                        <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                                            <PackagePlus className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                            <p>{t('No additional materials added yet.')}</p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>{t('Material')}</TableHead>
                                                    <TableHead className="text-center">{t('Quantity')}</TableHead>
                                                    <TableHead>{t('Rate/Cycle')}</TableHead>
                                                    <TableHead>{t('Effective From')}</TableHead>
                                                    <TableHead>{t('Status')}</TableHead>
                                                    <TableHead>{t('Notes')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {addons.map((addon: any) => (
                                                    <TableRow key={addon.id}>
                                                        <TableCell className="font-medium">{addon.product?.name ?? `#${addon.product_id}`}</TableCell>
                                                        <TableCell className="text-center">{addon.quantity}</TableCell>
                                                        <TableCell>{addon.price_per_cycle}</TableCell>
                                                        <TableCell className="text-sm">{addon.effective_date}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={addon.status === 'approved' ? 'default' : 'secondary'} className="capitalize">
                                                                {addon.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-xs text-muted-foreground">{addon.notes ?? '—'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="installments">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        {t('Payment Installments')}
                                    </CardTitle>
                                    <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                                        {t('Payment Method')}: {contract.payment_method ? t(contract.payment_method.replace('_', ' ')) : t('Cash')}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    {contract.installments && contract.installments.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>{t('Due Date')}</TableHead>
                                                    <TableHead>{t('Amount')}</TableHead>
                                                    <TableHead>{t('Status')}</TableHead>
                                                    <TableHead>{t('Linked Invoice')}</TableHead>
                                                    <TableHead className="text-right">{t('Action')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {contract.installments.map((inst: any) => (
                                                    <TableRow key={inst.id}>
                                                        <TableCell className={new Date(inst.due_date) < new Date() && inst.status === 'pending' ? 'text-destructive font-bold' : ''}>
                                                            {formatDate(inst.due_date)}
                                                            {new Date(inst.due_date) < new Date() && inst.status === 'pending' && (
                                                                <span className="ms-2 text-xs text-destructive">({t('Overdue')})</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-bold">{formatCurrency(inst.amount)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={inst.status === 'paid' ? 'default' : inst.status === 'invoiced' ? 'outline' : 'secondary'} className="capitalize">
                                                                {t(inst.status)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {inst.invoice_id ? (
                                                                <Link href={route('sales-invoices.show', inst.invoice_id)} className="text-info hover:underline">
                                                                    #{inst.invoice?.invoice_number || inst.invoice_id}
                                                                </Link>
                                                            ) : '—'}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {inst.status === 'pending' && (
                                                                <Button variant="outline" size="sm" onClick={() => handleInvoiceInstallment(inst.id)}>
                                                                    <FileText className="h-4 w-4 me-2" />
                                                                    {t('Invoice Now')}
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                                            {contract.payment_method === 'installments' ? t('No installments scheduled for this contract.') : t('This contract is not set to use installments.')}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history">
                            {/* Return History */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('Return History')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('Date')}</TableHead>
                                                <TableHead>{t('Material')}</TableHead>
                                                <TableHead>{t('Quantity Returned')}</TableHead>
                                                <TableHead>{t('Condition')}</TableHead>
                                                <TableHead>{t('Damage Fee')}</TableHead>
                                                <TableHead className="text-right">{t('Action')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {contract.returns.map((ret: any) => (
                                                <TableRow key={ret.id}>
                                                    <TableCell>{formatDate(ret.return_date)}</TableCell>
                                                    <TableCell>{ret.product?.name ?? '—'}</TableCell>
                                                    <TableCell>{ret.returned_quantity}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={ret.condition === 'good' ? 'outline' : 'destructive'} className="capitalize">
                                                            {t(ret.condition)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{ret.damage_fee > 0 ? formatCurrency(ret.damage_fee) : '—'}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" asChild title={t('Print Receipt')}>
                                                            <a href={route('rental.return.pdf', ret.id)} target="_blank">
                                                                <Printer className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {contract.returns.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                        {t('No returns recorded yet.')}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="attachments">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Paperclip className="h-5 w-5" />
                                        {t('Contract Documents & Photos')}
                                    </CardTitle>
                                    <Dialog open={attachmentOpen} onOpenChange={setAttachmentOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <CheckCheck className="h-4 w-4" />
                                                {t('Add Attachments')}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{t('Upload Contract Documents')}</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleAddAttachments} className="space-y-4">
                                                <MediaPicker
                                                    label={t('Select Files')}
                                                    multiple
                                                    value={attachmentForm.data.attachments}
                                                    onChange={(v) => attachmentForm.setData('attachments', v as string[])}
                                                />
                                                <DialogFooter>
                                                    <Button type="button" variant="outline" onClick={() => setAttachmentOpen(false)}>{t('Cancel')}</Button>
                                                    <Button type="submit" disabled={attachmentForm.processing}>{t('Upload')}</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <ModuleAttachments
                                        attachments={contract.attachments || []}
                                        deleteRoute="rental.attachment.destroy"
                                        onRefresh={() => router.reload()}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ── Events Tab ── */}
                        <TabsContent value="events">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-primary" />
                                        {t('Contract Event Log')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {events.length === 0 ? (
                                        <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                                            <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                            <p>{t('No events recorded yet.')}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {events.map((ev: any) => (
                                                <div key={ev.id} className="flex gap-4 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${ev.color_class ?? 'bg-gray-100 text-gray-600'}`}>
                                                        <Activity className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="font-medium text-sm">{ev.label ?? ev.event_type}</p>
                                                            {ev.amount && (
                                                                <span className="text-sm font-bold text-primary shrink-0">
                                                                    {parseFloat(ev.amount).toLocaleString('ar-AE', { style: 'currency', currency: 'AED' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(ev.occurred_at).toLocaleString('ar-AE')}
                                                            {ev.created_by_user?.name && ` · ${ev.created_by_user.name}`}
                                                        </p>
                                                        {ev.details && Object.keys(ev.details).length > 0 && (
                                                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                                {Object.entries(ev.details).map(([k, v]: any) => (
                                                                    <span key={k} className="text-xs bg-background border border-border rounded-full px-2 py-0.5">
                                                                        <span className="text-muted-foreground">{k}: </span>
                                                                        <span className="font-medium">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="timeline">
                            {/* Rental Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        {t('Rental Timeline')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative border-l-2 border-primary/20 ms-3 ps-6 space-y-8">
                                        <div className="relative">
                                            <div className="absolute -start-[31px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-white"></div>
                                            <div className="font-bold text-sm">{t('Contract Started')}</div>
                                            <div className="text-xs text-muted-foreground">{formatDate(contract.start_date)}</div>
                                        </div>
                                        {contract.returns.map((ret: any) => (
                                            <div key={ret.id} className="relative">
                                                <div className="absolute -start-[31px] top-1 h-4 w-4 rounded-full bg-orange-500 border-4 border-white"></div>
                                                <div className="font-bold text-sm">{t('Items Returned')}: {ret.product?.name}</div>
                                                <div className="text-xs text-muted-foreground">{formatDate(ret.return_date)} — {ret.returned_quantity} {t('units')}</div>
                                                {ret.damage_fee > 0 && <div className="text-xs text-destructive font-medium">+{t('Damage Fee')}: {formatCurrency(ret.damage_fee)}</div>}
                                            </div>
                                        ))}
                                        {contract.status === 'closed' && (
                                            <div className="relative">
                                                <div className="absolute -start-[31px] top-1 h-4 w-4 rounded-full bg-secondary border-4 border-white"></div>
                                                <div className="font-bold text-sm">{t('Contract Closed')}</div>
                                                <div className="text-xs text-muted-foreground">{formatDate(contract.updated_at)}</div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="invoices">
                            {/* Billing History */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ReceiptText className="h-5 w-5 text-primary" />
                                        {t('Billing History')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('Invoice #')}</TableHead>
                                                <TableHead>{t('Date')}</TableHead>
                                                <TableHead>{t('Amount')}</TableHead>
                                                <TableHead>{t('Status')}</TableHead>
                                                <TableHead className="text-right">{t('Action')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {contract.invoices?.length > 0 ? (
                                                contract.invoices.map((inv: any) => (
                                                    <TableRow key={inv.id}>
                                                        <TableCell className="font-mono">{inv.invoice_number}</TableCell>
                                                        <TableCell>{formatDate(inv.invoice_date)}</TableCell>
                                                        <TableCell className="font-bold">{formatCurrency(inv.total_amount)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={paymentVariant(inv.status)} className="capitalize">
                                                                {t(inv.status)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={route('sales-invoices.show', inv.id)}>
                                                                    <Eye className="h-4 w-4 me-2" />
                                                                    {t('View Invoice')}
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                        {t('No invoices generated yet.')}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* ── Right: Stats + Info ── */}
                <div className="space-y-4">

                    {/* Return Progress */}
                    <Card className="bg-secondary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('Material Return Progress')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(() => {
                                const totalQty = contract.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
                                const returnedQty = contract.items.reduce((acc: number, item: any) => acc + (item.quantity - (item.remaining_quantity ?? item.quantity)), 0);
                                const progressPct = totalQty > 0 ? Math.round((returnedQty / totalQty) * 100) : 0;
                                const remainingQty = totalQty - returnedQty;
                                return (
                                    <>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span>{progressPct}%</span>
                                                <span className="text-muted-foreground">{returnedQty} / {totalQty}</span>
                                            </div>
                                            <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000 ease-out"
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-white/50 p-2 rounded border border-black/5 text-center">
                                                <div className="text-lg font-bold text-orange-600">{remainingQty}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase">{t('Remaining')}</div>
                                            </div>
                                            <div className="bg-white/50 p-2 rounded border border-black/5 text-center">
                                                <div className="text-lg font-bold text-green-600">{returnedQty}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase">{t('Returned')}</div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </CardContent>
                    </Card>

                    {/* Daily Rate */}
                    <Card className="bg-orange-50 border-orange-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-800">{t('Current Daily Rate')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{formatCurrency(currentDailyRate)}</div>
                            <p className="text-xs text-orange-700/70 mt-1">{t('Based on items currently in custody.')}</p>
                        </CardContent>
                    </Card>

                    {/* Contract Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">{t('Contract Info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <span className="text-muted-foreground">{t('Contract #')}: </span>
                                <span className="font-mono font-medium">{contract.contract_number}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">{t('Customer')}: </span>
                                <span className="font-medium">{contract.customer?.name}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">{t('Start Date')}: </span>
                                <span>{formatDate(contract.start_date)}</span>
                            </div>
                            {contract.end_date && (
                                <div>
                                    <span className="text-muted-foreground">{t('End Date')}: </span>
                                    <span>{formatDate(contract.end_date)}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-muted-foreground">{t('Billing Cycle')}: </span>
                                <Badge variant="outline" className="capitalize">{contract.billing_cycle}</Badge>
                            </div>
                            <div>
                                <span className="text-muted-foreground">{t('Status')}: </span>
                                <Badge variant={statusVariant(contract.status)} className="capitalize">{contract.status}</Badge>
                            </div>
                            {contract.warehouse && (
                                <div>
                                    <span className="text-muted-foreground">{t('Warehouse')}: </span>
                                    <span>{contract.warehouse.name}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-muted-foreground">{t('Min Rental Period')}: </span>
                                <span className="font-medium text-orange-600">{contract.min_days} {t('Days')}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">{t('Security Deposit')}: </span>
                                <span className="font-medium text-info">{formatCurrency(contract.security_deposit)}</span>
                                {contract.deposit_status === 'held' && Number(contract.security_deposit) > 0 && (
                                    <Dialog open={settleOpen} onOpenChange={setSettleOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="h-auto p-0 ms-2 text-[10px] uppercase font-bold text-primary hover:no-underline">
                                                [{t('Settle')}]
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{t('Settle Security Deposit')}</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleSettleDeposit} className="space-y-4">
                                                <div>
                                                    <Label>{t('Settlement Type')}</Label>
                                                    <Select
                                                        value={settleForm.data.status}
                                                        onValueChange={(v) => settleForm.setData('status', v)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="refunded">{t('Refund to Customer')}</SelectItem>
                                                            <SelectItem value="applied">{t('Apply to Balance')}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>{t('Settlement Amount')}</Label>
                                                    <Input
                                                        type="number"
                                                        max={contract.security_deposit}
                                                        value={settleForm.data.amount}
                                                        onChange={(e) => settleForm.setData('amount', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>{t('Notes')}</Label>
                                                    <Input
                                                        value={settleForm.data.notes}
                                                        onChange={(e) => settleForm.setData('notes', e.target.value)}
                                                        placeholder={t('Reason for deduction or refund notes...')}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="button" variant="outline" onClick={() => setSettleOpen(false)}>{t('Cancel')}</Button>
                                                    <Button type="submit" disabled={settleForm.processing}>{t('Confirm Settlement')}</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                                {contract.deposit_status !== 'held' && (
                                    <Badge variant="outline" className="ms-2 text-[10px] capitalize bg-green-50">
                                        {t(contract.deposit_status)}: {formatCurrency(contract.deposit_settled_amount)}
                                    </Badge>
                                )}
                            </div>
                            {contract.last_billed_at && (
                                <div>
                                    <span className="text-muted-foreground">{t('Last Billed')}: </span>
                                    <span>{formatDate(contract.last_billed_at)}</span>
                                </div>
                            )}
                            {contract.notes && (
                                <div className="pt-2 border-t">
                                    <div className="text-muted-foreground text-[10px] uppercase mb-1">{t('Internal Notes')}</div>
                                    <p className="text-xs">{contract.notes}</p>
                                </div>
                            )}
                            {contract.terms && (
                                <div className="pt-2 border-t">
                                    <div className="text-muted-foreground text-[10px] uppercase mb-1">{t('Terms & Conditions')}</div>
                                    <p className="text-xs whitespace-pre-wrap leading-relaxed opacity-80">{contract.terms}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ── Lease-to-Own Dialog ── */}
            <Dialog open={leaseToOwnOpen} onOpenChange={setLeaseToOwnOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-orange-600">
                            <ShoppingCart className="h-5 w-5" />
                            {t('Convert Contract to Sale (Lease-to-Own)')}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLeaseToOwn} className="space-y-4">
                        <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 text-sm text-orange-800">
                            <p className="font-semibold mb-2">{t('What happens when you confirm:')}</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>{t('Contract status → Closed')}</li>
                                <li>{t('Remaining accrued rent is invoiced')}</li>
                                <li>{t('Purchase price is added to the final invoice')}</li>
                                <li>{t('Materials ownership transferred — no return needed')}</li>
                            </ul>
                        </div>
                        <div className="space-y-1">
                            <Label>{t('Purchase Price (AED)')} *</Label>
                            <Input
                                type="number" min="0" step="0.01"
                                value={leaseToOwnForm.data.purchase_price}
                                onChange={e => leaseToOwnForm.setData('purchase_price', e.target.value)}
                                placeholder="0.00"
                            />
                            {leaseToOwnForm.errors.purchase_price && (
                                <p className="text-destructive text-xs">{leaseToOwnForm.errors.purchase_price}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label>{t('Conversion Date')}</Label>
                            <Input
                                type="date"
                                value={leaseToOwnForm.data.conversion_date}
                                onChange={e => leaseToOwnForm.setData('conversion_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>{t('Notes (optional)')}</Label>
                            <textarea
                                rows={3}
                                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background"
                                value={leaseToOwnForm.data.notes}
                                onChange={e => leaseToOwnForm.setData('notes', e.target.value)}
                                placeholder={t('Reason or terms of sale...')}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setLeaseToOwnOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={leaseToOwnForm.processing || !leaseToOwnForm.data.purchase_price}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                {leaseToOwnForm.processing ? t('Processing...') : t('Convert & Generate Invoice')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
