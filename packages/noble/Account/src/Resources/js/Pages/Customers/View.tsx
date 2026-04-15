import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { Customer } from './types';

interface ViewProps {
    [key: string]: any;
    customer: Customer;
}

export default function View({ customer }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <Building2 className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Customer Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{customer.company_name}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Customer Code')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{customer.customer_code}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Company Name')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{customer.company_name}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Contact Person Name')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {customer.contact_person_name || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Contact Person Email')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {customer.contact_person_email || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Contact Person Mobile')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {customer.contact_person_mobile || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Tax Number')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{customer.tax_number || '-'}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Payment Terms')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {customer.payment_terms || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('User')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{customer.user?.name || '-'}</p>
                    </div>
                </div>

                {customer.billing_address && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Billing Address')}</label>
                        <div className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {customer.billing_address.address && <p>{customer.billing_address.address}</p>}
                            {customer.billing_address.city && (
                                <p>
                                    {customer.billing_address.city}, {customer.billing_address.state}{' '}
                                    {customer.billing_address.zip_code}
                                </p>
                            )}
                            {customer.billing_address.country && <p>{customer.billing_address.country}</p>}
                        </div>
                    </div>
                )}

                {customer.shipping_address && !customer.same_as_billing && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Shipping Address')}</label>
                        <div className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {customer.shipping_address.address && <p>{customer.shipping_address.address}</p>}
                            {customer.shipping_address.city && (
                                <p>
                                    {customer.shipping_address.city}, {customer.shipping_address.state}{' '}
                                    {customer.shipping_address.zip_code}
                                </p>
                            )}
                            {customer.shipping_address.country && <p>{customer.shipping_address.country}</p>}
                        </div>
                    </div>
                )}

                {customer.notes && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Notes')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{customer.notes}</p>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
