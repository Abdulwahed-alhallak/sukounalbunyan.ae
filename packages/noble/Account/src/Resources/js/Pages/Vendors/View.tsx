import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { Vendor } from './types';

interface ViewProps {
    vendor: Vendor;
}

export default function View({ vendor }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <Building2 className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Vendor Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{vendor.company_name}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Vendor Code')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{vendor.vendor_code}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Company Name')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{vendor.company_name}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Contact Person Name')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {vendor.contact_person_name || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Contact Person Email')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {vendor.contact_person_email || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Contact Person Mobile')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {vendor.contact_person_mobile || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Primary Email')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{vendor.primary_email || '-'}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Primary Mobile')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {vendor.primary_mobile || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Tax Number')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{vendor.tax_number || '-'}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Payment Terms')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{vendor.payment_terms || '-'}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Currency Code')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{vendor.currency_code || '-'}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Credit Limit')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {vendor.credit_limit ? `$${Number(vendor.credit_limit).toFixed(2)}` : '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('User')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{vendor.user?.name || '-'}</p>
                    </div>
                </div>

                {vendor.billing_address && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Billing Address')}</label>
                        <div className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {vendor.billing_address.address && <p>{vendor.billing_address.address}</p>}
                            {vendor.billing_address.city && (
                                <p>
                                    {vendor.billing_address.city}, {vendor.billing_address.state}{' '}
                                    {vendor.billing_address.zip_code}
                                </p>
                            )}
                            {vendor.billing_address.country && <p>{vendor.billing_address.country}</p>}
                        </div>
                    </div>
                )}

                {vendor.shipping_address && !vendor.same_as_billing && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Shipping Address')}</label>
                        <div className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {vendor.shipping_address.address && <p>{vendor.shipping_address.address}</p>}
                            {vendor.shipping_address.city && (
                                <p>
                                    {vendor.shipping_address.city}, {vendor.shipping_address.state}{' '}
                                    {vendor.shipping_address.zip_code}
                                </p>
                            )}
                            {vendor.shipping_address.country && <p>{vendor.shipping_address.country}</p>}
                        </div>
                    </div>
                )}

                {vendor.notes && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Notes')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{vendor.notes}</p>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
