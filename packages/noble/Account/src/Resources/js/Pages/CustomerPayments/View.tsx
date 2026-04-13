import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomerPaymentViewProps } from './types';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function View({ payment }: CustomerPaymentViewProps) {
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{t('Payment Details')} - {payment.payment_number || `#${payment.id}`}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-3">
                {/* Payment Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t('Payment Information')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">{t('Payment Number')}</span>
                                <p className="mt-1 text-muted-foreground">{payment.payment_number || `#${payment.id}`}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Payment Date')}</span>
                                <p className="mt-1 text-muted-foreground">{formatDate(payment.payment_date)}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Customer')}</span>
                                <p className="mt-1 text-muted-foreground">{payment.customer?.name || '-'}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Bank Account')}</span>
                                <p className="mt-1 text-muted-foreground">
                                    {payment.bank_account?.account_name || '-'}
                                    {payment.bank_account?.account_number && ` (${payment.bank_account.account_number})`}
                                </p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Payment Amount')}</span>
                                <p className="mt-1 text-lg font-bold text-foreground">{formatCurrency(payment.payment_amount)}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Status')}</span>
                                <div className="mt-1">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        payment.status === 'cleared' ? 'bg-muted text-foreground' :
                                        payment.status === 'pending' ? 'bg-muted text-foreground' :
                                        'bg-muted text-destructive'
                                    }`}>
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
                                <span className="text-muted-foreground">{t('Notes')}</span>
                                <p className="mt-1 p-3 bg-muted/50 rounded text-sm">{payment.notes}</p>
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
                                            <th className="text-left py-2">{t('Invoice Number')}</th>
                                            <th className="text-left py-2">{t('Invoice Date')}</th>
                                            <th className="text-right py-2">{t('Invoice Total')}</th>
                                            <th className="text-right py-2">{t('Allocated Amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payment.allocations?.map((allocation) => (
                                            <tr key={allocation.id} className="border-b">
                                                <td className="py-2 font-medium">{allocation.invoice?.invoice_number}</td>
                                                <td className="py-2">{formatDate(allocation.invoice?.invoice_date)}</td>
                                                <td className="py-2 text-right">{formatCurrency(allocation.invoice?.total_amount)}</td>
                                                <td className="py-2 text-right font-semibold">{formatCurrency(allocation.allocated_amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 font-semibold">
                                            <td colSpan={3} className="py-2 text-right">{t('Total Payment:')}</td>
                                            <td className="py-2 text-right text-lg">{formatCurrency(payment.payment_amount)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Credit Note History */}
                {payment.credit_note_applications && payment.credit_note_applications.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{t('Credit Note History')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2">{t('Credit Note Number')}</th>
                                            <th className="text-left py-2">{t('Application Date')}</th>
                                            <th className="text-right py-2">{t('Applied Amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payment.credit_note_applications?.map((application) => (
                                            <tr key={application.id} className="border-b">
                                                <td className="py-2 font-medium">{application.credit_note?.credit_note_number}</td>
                                                <td className="py-2">{formatDate(application.application_date)}</td>
                                                <td className="py-2 text-right font-semibold">{formatCurrency(application.applied_amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 font-semibold">
                                            <td colSpan={2} className="py-2 text-right">{t('Total Applied Credit Note:')}</td>
                                            <td className="py-2 text-right text-lg">{formatCurrency(payment.credit_note_applications.reduce((sum, app) => sum + parseFloat(app.applied_amount), 0))}</td>
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
