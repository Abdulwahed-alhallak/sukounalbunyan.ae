import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';
import { BalanceSheetViewProps } from './types';

export default function Print() {
    const { t } = useTranslation();
    const { balanceSheet, groupedItems } = usePage<BalanceSheetViewProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

    // Calculate totals from actual items
    const totalEquity = groupedItems.equity
        ? Object.values(groupedItems.equity)
              .flat()
              .reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0)
        : 0;
    const totalLiabilities = groupedItems.liabilities
        ? Object.values(groupedItems.liabilities)
              .flat()
              .reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0)
        : 0;
    const totalAssets = groupedItems.assets
        ? Object.values(groupedItems.assets)
              .flat()
              .reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0)
        : 0;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'pdf') {
            downloadPDF();
        }
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);

        const printContent = document.querySelector('.balance-sheet-container');
        if (printContent) {
            const opt = {
                margin: 0.25,
                filename: `balance-sheet-${formatDate(balanceSheet.balance_sheet_date)}.pdf`,
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
            <Head title={t('Balance Sheet')} />

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

            <div className="balance-sheet-container mx-auto max-w-4xl bg-card p-12">
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
                        <h2 className="mb-2 text-2xl font-bold">{t('BALANCE SHEET')}</h2>
                        <div className="space-y-1 text-sm">
                            <p>
                                {t('As of')}: {formatDate(balanceSheet.balance_sheet_date)}
                            </p>
                            <p>
                                {t('Financial Year')}: {balanceSheet.financial_year}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="mb-6 grid grid-cols-2 gap-8">
                    {/* Left Column - Liabilities & Equity */}
                    <div>
                        <h3 className="mb-3 border-b-2 border-border pb-2 text-base font-bold">
                            {t('Liabilities & Equity')}
                        </h3>

                        {/* Equity */}
                        {groupedItems.equity && (
                            <div className="mb-4">
                                <h4 className="mb-2 text-sm font-semibold">{t('Equity')}</h4>
                                {Object.entries(groupedItems.equity)?.map(([subSection, items]) => (
                                    <div key={subSection}>
                                        {items?.map((item) => (
                                            <div key={item.id} className="flex justify-between py-1.5 text-sm">
                                                <span>{item.account?.account_name}</span>
                                                <span className="tabular-nums">{formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <div className="mt-2 flex justify-between border-t py-2 text-sm font-semibold">
                                    <span>{t('Total Equity')}</span>
                                    <span className="tabular-nums">{formatCurrency(totalEquity)}</span>
                                </div>
                            </div>
                        )}

                        {/* Liabilities */}
                        {groupedItems.liabilities && (
                            <div className="mb-4">
                                <h4 className="mb-2 text-sm font-semibold">{t('Liabilities')}</h4>
                                {Object.entries(groupedItems.liabilities)?.map(([subSection, items]) => (
                                    <div key={subSection} className="mb-3">
                                        <h5 className="mb-1 text-xs font-medium capitalize">
                                            {subSection.replace('_', ' ')}
                                        </h5>
                                        {items?.map((item) => (
                                            <div key={item.id} className="ms-3 flex justify-between py-1.5 text-sm">
                                                <span>{item.account?.account_name}</span>
                                                <span className="tabular-nums">{formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <div className="mt-2 flex justify-between border-t py-2 text-sm font-semibold">
                                    <span>{t('Total Liabilities')}</span>
                                    <span className="tabular-nums">{formatCurrency(totalLiabilities)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Assets */}
                    <div>
                        <h3 className="mb-3 border-b-2 border-border pb-2 text-base font-bold">{t('Assets')}</h3>

                        {groupedItems.assets && (
                            <div>
                                {Object.entries(groupedItems.assets)?.map(([subSection, items]) => (
                                    <div key={subSection} className="mb-3">
                                        <h4 className="mb-1 text-xs font-medium capitalize">
                                            {subSection.replace('_', ' ')}
                                        </h4>
                                        {items?.map((item) => (
                                            <div key={item.id} className="ms-3 flex justify-between py-1.5 text-sm">
                                                <span>{item.account?.account_name}</span>
                                                <span className="tabular-nums">{formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Totals Row */}
                <div className="grid grid-cols-2 gap-8 border-t-2 border-border pt-4">
                    <div className="flex justify-between text-base font-bold">
                        <span>{t('Total Liabilities & Equity')}</span>
                        <span className="tabular-nums">{formatCurrency(totalLiabilities + totalEquity)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold">
                        <span>{t('Total Assets')}</span>
                        <span className="tabular-nums">{formatCurrency(totalAssets)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
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

                .balance-sheet-container {
                    max-width: 100%;
                    margin: 0;
                    box-shadow: none;
                }

                @media print {
                    body {
                        background: hsl(var(--card));
                    }

                    .balance-sheet-container {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}
