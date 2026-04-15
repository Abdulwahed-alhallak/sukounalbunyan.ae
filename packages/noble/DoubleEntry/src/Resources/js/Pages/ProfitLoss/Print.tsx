import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';

interface Account {
    id: number;
    account_code: string;
    account_name: string;
    balance: number;
}

interface ProfitLossData {
    revenue: Account[];
    expenses: Account[];
    total_revenue: number;
    total_expenses: number;
    net_profit: number;
    from_date: string;
    to_date: string;
}

interface ProfitLossProps {
    [key: string]: any;
    profitLoss: ProfitLossData;
}

export default function Print() {
    const { t } = useTranslation();
    const { profitLoss } = usePage<ProfitLossProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'pdf') {
            downloadPDF();
        }
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);

        const printContent = document.querySelector('.profit-loss-container');
        if (printContent) {
            const opt = {
                margin: 0.25,
                filename: `profit-loss-${formatDate(profitLoss.from_date)}-to-${formatDate(profitLoss.to_date)}.pdf`,
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
            <Head title={t('Profit & Loss Statement')} />

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

            <div className="profit-loss-container mx-auto max-w-4xl bg-card p-12">
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
                        <h2 className="mb-2 text-2xl font-bold">{t('PROFIT & LOSS STATEMENT')}</h2>
                        <div className="space-y-1 text-sm">
                            <p>
                                {t('Period')}: {formatDate(profitLoss.from_date)} - {formatDate(profitLoss.to_date)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="mb-6 grid grid-cols-2 gap-8">
                    {/* Left Column - Revenue */}
                    <div>
                        <h3 className="mb-3 border-b-2 border-border pb-2 text-base font-bold">{t('Revenue')}</h3>
                        {profitLoss.revenue.length > 0 ? (
                            profitLoss.revenue?.map((account) => (
                                <div key={account.id} className="flex justify-between py-1.5 text-sm">
                                    <span>
                                        {account.account_code} - {account.account_name}
                                    </span>
                                    <span className="tabular-nums">{formatCurrency(account.balance)}</span>
                                </div>
                            ))
                        ) : (
                            <p className="py-2 text-sm">{t('No revenue accounts')}</p>
                        )}
                        <div className="mt-2 flex justify-between border-t py-2 text-sm font-semibold">
                            <span>{t('Total Revenue')}</span>
                            <span className="tabular-nums">{formatCurrency(profitLoss.total_revenue)}</span>
                        </div>
                    </div>

                    {/* Right Column - Expenses */}
                    <div>
                        <h3 className="mb-3 border-b-2 border-border pb-2 text-base font-bold">{t('Expenses')}</h3>
                        {profitLoss.expenses.length > 0 ? (
                            profitLoss.expenses?.map((account) => (
                                <div key={account.id} className="flex justify-between py-1.5 text-sm">
                                    <span>
                                        {account.account_code} - {account.account_name}
                                    </span>
                                    <span className="tabular-nums">{formatCurrency(account.balance)}</span>
                                </div>
                            ))
                        ) : (
                            <p className="py-2 text-sm">{t('No expense accounts')}</p>
                        )}
                        <div className="mt-2 flex justify-between border-t py-2 text-sm font-semibold">
                            <span>{t('Total Expenses')}</span>
                            <span className="tabular-nums">{formatCurrency(profitLoss.total_expenses)}</span>
                        </div>
                    </div>
                </div>

                {/* Net Profit/Loss */}
                <div className="mt-8 border-t-2 border-border pt-4">
                    <div className="flex justify-between py-2 text-base font-bold">
                        <span>{profitLoss.net_profit >= 0 ? t('Net Profit') : t('Net Loss')}</span>
                        <span className="tabular-nums">{formatCurrency(Math.abs(profitLoss.net_profit))}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
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

                .profit-loss-container {
                    max-width: 100%;
                    margin: 0;
                    box-shadow: none;
                }

                @media print {
                    body {
                        background: hsl(var(--card));
                    }

                    .profit-loss-container {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}
