import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';

interface LedgerEntry {
    id: number;
    journal_date: string;
    reference_type: string;
    journal_description: string;
    description: string;
    debit_amount: number;
    credit_amount: number;
    account_code: string;
    account_name: string;
}

interface LedgerSummaryProps {
    [key: string]: any;
    entries: LedgerEntry[];
    selectedAccount: {
        account_code: string;
        account_name: string;
    } | null;
    filters: {
        from_date: string;
        to_date: string;
    };
}

export default function Print() {
    const { t } = useTranslation();
    const { entries, selectedAccount, filters } = usePage<LedgerSummaryProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'pdf') {
            downloadPDF();
        }
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);

        const printContent = document.querySelector('.ledger-summary-container');
        if (printContent) {
            const opt = {
                margin: 0.25,
                filename: `ledger-summary-${formatDate(filters.from_date || new Date().toISOString())}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const },
            };

            try {
                await html2pdf()
                    .set(opt)
                    .from(printContent as HTMLElement)
                    .save();
                setTimeout(() => window.close(), 1000);
            } catch (error) {
                console.error('PDF generation failed:', error);
            }
        }

        setIsDownloading(false);
    };

    return (
        <div className="min-h-screen bg-card">
            <Head title={t('Ledger Summary')} />

            {isDownloading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50">
                    <div className="rounded-lg bg-card p-6 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"></div>
                            <p className="text-lg font-semibold text-foreground">{t('Generating PDF...')}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="ledger-summary-container mx-auto max-w-4xl bg-card p-12">
                {/* Header */}
                <div className="mb-12 flex items-start justify-between">
                    <div>
                        <h1 className="mb-4 text-2xl font-bold">
                            {getCompanySetting('company_name') || 'YOUR COMPANY'}
                        </h1>
                        <div className="space-y-1 text-sm">
                            {getCompanySetting('company_address') && <p>{getCompanySetting('company_address')}</p>}
                            {(getCompanySetting('company_city') ||
                                getCompanySetting('company_state') ||
                                getCompanySetting('company_zipcode')) && (
                                <p>
                                    {getCompanySetting('company_city')}
                                    {getCompanySetting('company_state') &&
                                        `, ${getCompanySetting('company_state')}`}{' '}
                                    {getCompanySetting('company_zipcode')}
                                </p>
                            )}
                            {getCompanySetting('company_country') && <p>{getCompanySetting('company_country')}</p>}
                            {getCompanySetting('company_telephone') && (
                                <p>
                                    {t('Phone')}: {getCompanySetting('company_telephone')}
                                </p>
                            )}
                            {getCompanySetting('company_email') && (
                                <p>
                                    {t('Email')}: {getCompanySetting('company_email')}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-end">
                        <h2 className="mb-2 text-2xl font-bold">{t('LEDGER SUMMARY')}</h2>
                        <div className="space-y-1 text-sm">
                            {filters.from_date && filters.to_date && (
                                <p>
                                    {t('Period')}: {formatDate(filters.from_date)} - {formatDate(filters.to_date)}
                                </p>
                            )}
                            {selectedAccount && (
                                <p>
                                    {t('Account')}: {selectedAccount.account_code} - {selectedAccount.account_name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="mb-6">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-border">
                                <th className="py-2 text-start text-sm font-bold">{t('Date')}</th>
                                <th className="py-2 text-start text-sm font-bold">{t('Account')}</th>
                                <th className="py-2 text-start text-sm font-bold">{t('Description')}</th>
                                <th className="py-2 text-end text-sm font-bold">{t('Debit')}</th>
                                <th className="py-2 text-end text-sm font-bold">{t('Credit')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries?.map((entry) => (
                                <tr key={entry.id} className="border-b border-border">
                                    <td className="py-1.5 text-sm">{formatDate(entry.journal_date)}</td>
                                    <td className="py-1.5 text-sm">{entry.account_code}</td>
                                    <td className="py-1.5 text-sm">{entry.description || entry.journal_description}</td>
                                    <td className="py-1.5 text-end text-sm tabular-nums">
                                        {entry.debit_amount > 0 ? formatCurrency(entry.debit_amount) : '-'}
                                    </td>
                                    <td className="py-1.5 text-end text-sm tabular-nums">
                                        {entry.credit_amount > 0 ? formatCurrency(entry.credit_amount) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
                    <p>{getCompanySetting('company_name')}</p>
                    <p>
                        {t('Generated on')} {formatDate(new Date().toISOString())}
                    </p>
                </div>
            </div>

            <style>{`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.25in;
                    size: A4;
                }

                .ledger-summary-container {
                    max-width: 100%;
                    margin: 0;
                    box-shadow: none;
                }

                @media print {
                    body {
                        background: hsl(var(--card));
                    }

                    .ledger-summary-container {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}
