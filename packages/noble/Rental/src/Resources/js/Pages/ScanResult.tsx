import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Package, CheckCircle2 } from 'lucide-react';

export default function ScanResult({ contract, scanned_product_id }: any) {
    const { t } = useTranslation();
    
    const product = contract.items.find((i: any) => i.product_id == scanned_product_id)?.product;
    const item = contract.items.find((i: any) => i.product_id == scanned_product_id);

    const { data, setData, post, processing } = useForm({
        product_id: scanned_product_id?.toString() || '',
        returned_quantity: '1',
        damage_fee: '0',
        damage_notes: '',
        condition: 'good',
        return_date: new Date().toISOString().split('T')[0],
    });

    const handleReturn = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rental.return', contract.id));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Rental'), url: route('rental.index') },
                { label: contract.contract_number, url: route('rental.show', contract.id) },
                { label: t('Scan Result') }
            ]}
            pageTitle={t('Quick Logistics Return')}
        >
            <Head title={t('Scan Result')} />
            
            <div className="max-w-md mx-auto space-y-6">
                <Card className="border-primary/20 shadow-lg">
                    <CardHeader className="bg-primary/5 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{t('Asset Detected')}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">{contract.contract_number} | {contract.customer?.name}</p>
                            </div>
                            <Badge variant="default" className="bg-green-600">
                                <CheckCircle2 className="w-3 h-3 me-1" />
                                {t('Verified')}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {product ? (
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                                <div className="p-3 bg-white rounded-md shadow-sm">
                                    <Package className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{product.name}</h4>
                                    <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
                                {t('No specific equipment item detected in the scan. Please select from the list.')}
                            </div>
                        )}

                        <form onSubmit={handleReturn} className="space-y-5">
                            {!scanned_product_id && (
                                <div>
                                    <Label className="text-base">{t('Select Material')}</Label>
                                    <Select value={data.product_id} onValueChange={(v) => setData('product_id', v)}>
                                        <SelectTrigger className="h-12 text-lg">
                                            <SelectValue placeholder={t('Choose material...')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contract.items.map((item: any) => (
                                                <SelectItem key={item.product_id} value={item.product_id.toString()}>
                                                    {item.product?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-base">{t('Return Quantity')}</Label>
                                    <Input 
                                        type="number" 
                                        className="h-12 text-lg" 
                                        value={data.returned_quantity} 
                                        onChange={e => setData('returned_quantity', e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <Label className="text-base">{t('Condition')}</Label>
                                    <Select value={data.condition} onValueChange={(v) => setData('condition', v)}>
                                        <SelectTrigger className="h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="good">{t('Good')}</SelectItem>
                                            <SelectItem value="lost">{t('Lost')}</SelectItem>
                                            <SelectItem value="scrap">{t('Scrap')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label className="text-base">{t('Return Date')}</Label>
                                <DatePicker 
                                    value={data.return_date} 
                                    onChange={(v: string) => setData('return_date', v)} 
                                    className="h-12 w-full"
                                />
                            </div>

                            <div className="pt-4">
                                <Button 
                                    type="submit" 
                                    className="w-full h-14 text-lg gap-2 shadow-md" 
                                    disabled={processing}
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    {t('Confirm Return to Warehouse')}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="w-full mt-2" 
                                    onClick={() => window.history.back()}
                                >
                                    {t('Cancel')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
