import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VendorPaymentViewProps } from './types';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function View({ payment }: VendorPaymentViewProps) {
    const { t } = useTranslation();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'cleared':
                return 'bg-muted text-foreground';
            case 'pending':
                return 'bg-muted text-foreground';
            case 'cancelled':
                return 'bg-muted text-destructive';
            default:
                return 'bg-muted text-foreground';
        }
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {t('Payment Details')} - {payment.payment_number}
                </DialogTitle>
            </DialogHeader>

            <div className="mt-3 space-y-6">
                {/* Payment Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t('Payment Information')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <span className="font-semibold">{t('Payment Number')}</span>
                                <p className="mt-1 text-muted-foreground">{payment.payment_number}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Payment Date')}</span>
                                <p className="mt-1 text-muted-foreground">{formatDate(payment.payment_date)}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Vendor')}</span>
                                <p className="mt-1 text-muted-foreground">{payment.vendor?.name || '-'}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Bank Account')}</span>
                                <p className="mt-1 text-muted-foreground">
                                    {payment.bank_account?.account_name || '-'}
                                    {payment.bank_account?.account_number &&
                                        ` (${payment.bank_account.account_number})`}
                                </p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Payment Amount')}</span>
                                <p className="mt-1 text-lg font-bold text-foreground">
                                    {formatCurrency(payment.payment_amount)}
                                </p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Status')}</span>
                                <div className="mt-1">
                                    <span
                                        className={`rounded-full px-2 py-1 text-sm ${
                                            payment.status === 'cleared'
                                                ? 'bg-muted text-foreground'
                                                : payment.status === 'pending'
                                                  ? 'bg-muted text-foreground'
                                                  : 'bg-muted text-destructive'
                                        }`}
                                    >
                                        {t(payment.status)}
                                    </span>
                                </div>
                            </div>
                            {payment.reference_number && (
                                <div>
                                    <span className="font-semibold">{t('Reference Number')}</span>
                                    <p className="mt-1 text-muted-foreground">{payment.reference_number}</p>
                                </div>
                            )}
                            <div>
                                <span className="font-semibold">{t('Created Date')}</span>
                                <p className="mt-1 text-muted-foreground">{formatDate(payment.created_at)}</p>
                            </div>
                        </div>
                        {payment.notes && (
                            <div className="mt-4">
                                <span className="font-semibold">{t('Notes')}</span>
                                <p className="mt-1 rounded bg-muted/50 p-3 text-sm">{payment.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Invoice Allocations */}
                {payment.allocations && payment.allocations.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{t('Invoice Allocations')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 text-left">{t('Invoice Number')}</th>
                                            <th className="py-2 text-left">{t('Invoice Date')}</th>
                                            <th className="py-2 text-right">{t('Invoice Total')}</th>
                                            <th className="py-2 text-right">{t('Allocated Amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payment.allocations?.map((allocation) => (
                                            <tr key={allocation.id} className="border-b">
                                                <td className="py-2 font-medium">
                                                    {allocation.invoice?.invoice_number}
                                                </td>
                                                <td className="py-2">{formatDate(allocation.invoice?.invoice_date)}</td>
                                                <td className="py-2 text-right">
                                                    {formatCurrency(allocation.invoice?.total_amount)}
                                                </td>
                                                <td className="py-2 text-right font-semibold">
                                                    {formatCurrency(allocation.allocated_amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 font-semibold">
                                            <td colSpan={3} className="py-2 text-right">
                                                {t('Total Payment:')}
                                            </td>
                                            <td className="py-2 text-right text-lg">
                                                {formatCurrency(payment.payment_amount)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Debit Note History */}
                {payment.debit_note_applications && payment.debit_note_applications.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{t('Debit Note History')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 text-left">{t('Debit Note Number')}</th>
                                            <th className="py-2 text-left">{t('Application Date')}</th>
                                            <th className="py-2 text-right">{t('Applied Amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payment.debit_note_applications?.map((application) => (
                                            <tr key={application.id} className="border-b">
                                                <td className="py-2 font-medium">
                                                    {application.debit_note?.debit_note_number}
                                                </td>
                                                <td className="py-2">{formatDate(application.application_date)}</td>
                                                <td className="py-2 text-right font-semibold">
                                                    {formatCurrency(application.applied_amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 font-semibold">
                                            <td colSpan={2} className="py-2 text-right">
                                                {t('Total Applied Debit Note:')}
                                            </td>
                                            <td className="py-2 text-right text-lg">
                                                {formatCurrency(
                                                    payment.debit_note_applications.reduce(
                                                        (sum, app) => sum + parseFloat(app.applied_amount),
                                                        0
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DialogContent>
    );
}
