import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { printReceipt } from './PrintReceipt';
import { downloadReceiptPDF } from './DownloadReceipt';

interface ReceiptModalProps {
    [key: string]: any;
    isOpen: boolean;
    onClose: () => void;
    completedSale: any;
    globalSettings: any;
}

export default function ReceiptModal({ isOpen, onClose, completedSale, globalSettings }: ReceiptModalProps) {
    const { t } = useTranslation();
    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        printReceipt(completedSale, globalSettings);
    };

    const handleDownload = () => {
        downloadReceiptPDF(completedSale, globalSettings);
    };

    if (!completedSale) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto backdrop-blur-none">
                <DialogHeader className="no-print">
                    <DialogTitle className="flex items-center justify-center text-foreground">
                        <CheckCircle className="me-2 h-6 w-6" />
                        {t('Sale Completed Successfully!')}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Success Message */}
                    <div className="no-print rounded-lg bg-muted/50 p-4 text-center">
                        <p className="font-medium text-foreground">
                            {t('Your transaction has been processed successfully.')}
                        </p>
                        <p className="mt-1 text-sm text-foreground">
                            {t('Receipt Number')}: {completedSale.pos_number}
                        </p>
                    </div>

                    {/* Thermal Receipt Preview */}
                    <div
                        ref={receiptRef}
                        className="print-area print-receipt mx-auto w-72 border border-border bg-card font-mono text-xs leading-tight shadow-lg"
                    >
                        <div className="p-3">
                            {/* Header */}
                            <div className="mb-3 text-center">
                                <div className="mb-1 text-base font-bold tracking-wider">
                                    {globalSettings?.company_name || 'COMPANY NAME'}
                                </div>
                                <div className="text-xs leading-relaxed">
                                    <div>{globalSettings?.company_address || 'Company Address'}</div>
                                    <div>
                                        {globalSettings?.company_city || 'City'},{' '}
                                        {globalSettings?.company_state || 'State'}
                                    </div>
                                    <div>
                                        {globalSettings?.company_country || 'Country'} -{' '}
                                        {globalSettings?.company_zipcode || 'Zipcode'}
                                    </div>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="my-2 text-center">
                                <div className="border-t-2 border-dashed border-border"></div>
                            </div>

                            {/* Receipt Info */}
                            <div className="mb-3">
                                <div className="flex justify-between py-0.5">
                                    <span className="font-medium">{t('Receipt')}:</span>
                                    <span className="font-bold">{completedSale.pos_number}</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span className="font-medium">{t('Date')}:</span>
                                    <span>{formatDate(new Date())}</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span className="font-medium">{t('Customer')}:</span>
                                    <span className="ms-2 truncate font-medium">
                                        {completedSale.customer?.name || t('Walk-in')}
                                    </span>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="my-2 text-center">
                                <div className="border-t-2 border-dashed border-border"></div>
                            </div>

                            {/* Items */}
                            <div className="mb-3">
                                {completedSale.items?.map((item: any) => {
                                    const itemSubtotal = item.price * item.quantity;
                                    let itemTaxAmount = 0;
                                    let taxDisplay = '';
                                    if (item.taxes && item.taxes.length > 0) {
                                        const taxNames = item.taxes?.map((tax: any) => {
                                            itemTaxAmount += (itemSubtotal * tax.rate) / 100;
                                            return `${tax.name} (${tax.rate}%)`;
                                        });
                                        taxDisplay = taxNames.join(', ');
                                    } else {
                                        taxDisplay = '-';
                                    }
                                    return (
                                        <div key={item.id} className="mb-3 border-b border-dotted border-border pb-2">
                                            <div className="mb-1 truncate text-sm font-bold">{item.name}</div>
                                            <div className="space-y-0.5 text-xs">
                                                <div className="flex justify-between">
                                                    <span>{t('Qty')}:</span>
                                                    <span className="font-medium">{item.quantity}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>{t('Price')}:</span>
                                                    <span className="font-medium">{formatCurrency(item.price)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>{t('Tax')}:</span>
                                                    <span className="font-medium">{taxDisplay}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>{t('Tax Amount')}:</span>
                                                    <span className="font-medium">{formatCurrency(itemTaxAmount)}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-dotted pt-1 font-bold">
                                                    <span>{t('Sub Total')}:</span>
                                                    <span>{formatCurrency(itemSubtotal)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Separator */}
                            <div className="my-2 text-center">
                                <div className="border-t-2 border-dashed border-border"></div>
                            </div>

                            {/* Totals */}
                            <div className="mb-3">
                                <div className="flex justify-between py-1 text-sm">
                                    <span className="font-medium">{t('Discount')}:</span>
                                    <span className="font-bold">-{formatCurrency(completedSale.discount)}</span>
                                </div>
                                <div className="flex justify-between border-t-2 border-double border-border py-2 text-base font-bold">
                                    <span>{t('Total')}:</span>
                                    <span className="text-lg">{formatCurrency(completedSale.total)}</span>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="my-2 text-center">
                                <div className="border-t-2 border-dashed border-border"></div>
                            </div>

                            {/* Footer */}
                            <div className="text-center">
                                <div className="text-xs font-medium">{t('★ Thank you for your business! ★')}</div>
                                <div className="mt-1 text-xs opacity-75">{new Date().toLocaleTimeString()}</div>
                            </div>

                            {/* ZATCA QR CODE Phase 1 */}
                            {completedSale.zatca_qr && (
                                <div className="no-print-page-break mt-4 flex justify-center">
                                    <img
                                        src={completedSale.zatca_qr}
                                        alt="ZATCA e-Invoice QR"
                                        className="h-32 w-32 object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="no-print flex justify-end gap-2">
                        <Button onClick={handleDownload} className="bg-muted/500 hover:bg-foreground/80">
                            <Download className="me-2 h-4 w-4" />
                            {t('Download PDF')}
                        </Button>
                        <Button onClick={handlePrint} className="bg-muted/500 hover:bg-foreground/80">
                            <Printer className="me-2 h-4 w-4" />
                            {t('Print')}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('Close')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
