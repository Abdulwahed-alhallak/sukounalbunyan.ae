import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Printer, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import NoRecordsFound from '@/components/no-records-found';
import axios from 'axios';

interface CashFlowData {
    beginning_cash: number;
    operating: number;
    investing: number;
    financing: number;
    net_cash_flow: number;
    ending_cash: number;
    from_date: string;
    to_date: string;
}

interface CashFlowProps {
    [key: string]: any;
    financialYear?: {
        year_start_date: string;
        year_end_date: string;
    };
}

export default function CashFlow({ financialYear }: CashFlowProps) {
    const { t } = useTranslation();
    const { auth } = usePage<any>().props;
    const [fromDate, setFromDate] = useState(financialYear?.year_start_date || '');
    const [toDate, setToDate] = useState(financialYear?.year_end_date || '');
    const [data, setData] = useState<CashFlowData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('double-entry.reports.cash-flow'), {
                params: { from_date: fromDate, to_date: toDate },
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching cash flow:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDownloadPDF = () => {
        const printUrl =
            route('double-entry.reports.cash-flow.print') + `?from_date=${fromDate}&to_date=${toDate}&download=pdf`;
        window.open(printUrl, '_blank');
    };

    const clearFilters = () => {
        setFromDate(financialYear?.year_start_date || '');
        setToDate(financialYear?.year_end_date || '');
    };

    return (
        <Card className="shadow-sm">
            <CardContent className="bg-muted/50/50 border-b p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">{t('From Date')}</label>
                        <DatePicker value={fromDate} onChange={setFromDate} placeholder={t('Select from date')} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">{t('To Date')}</label>
                        <DatePicker value={toDate} onChange={setToDate} placeholder={t('Select to date')} />
                    </div>
                    <div className="flex items-end gap-2">
                        <Button onClick={fetchData} disabled={loading} size="sm">
                            {loading ? t('Loading...') : t('Generate')}
                        </Button>
                        <Button variant="outline" onClick={clearFilters} size="sm">
                            {t('Clear')}
                        </Button>
                        {data && auth.user?.permissions?.includes('print-cash-flow') && (
                            <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="gap-2">
                                <Printer className="h-4 w-4" />
                                {t('Download PDF')}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardContent className="p-0">
                {data ? (
                    <>
                        <div className="border-b bg-muted/50 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-lg border bg-card p-4 text-center">
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                        {t('Beginning Cash')}
                                    </p>
                                    <p className="text-lg font-bold">{formatCurrency(data.beginning_cash)}</p>
                                </div>
                                <div className="rounded-lg border bg-card p-4 text-center">
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                        {t('Net Cash Flow')}
                                    </p>
                                    <p className="text-lg font-bold">{formatCurrency(data.net_cash_flow)}</p>
                                </div>
                                <div className="rounded-lg border bg-card p-4 text-center">
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">{t('Ending Cash')}</p>
                                    <p className="text-lg font-bold">{formatCurrency(data.ending_cash)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                <div className="rounded-lg bg-muted/50 p-4">
                                    <h4 className="mb-3 text-base font-bold">
                                        {t('Cash Flow from Operating Activities')}
                                    </h4>
                                    <div className="flex justify-between py-2">
                                        <p className="text-sm">{t('Net cash from operations')}</p>
                                        <p className="text-sm font-semibold">{formatCurrency(data.operating)}</p>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-muted/50 p-4">
                                    <h4 className="mb-3 text-base font-bold">
                                        {t('Cash Flow from Investing Activities')}
                                    </h4>
                                    <div className="flex justify-between py-2">
                                        <p className="text-sm">{t('Net cash from investing')}</p>
                                        <p className="text-sm font-semibold">{formatCurrency(data.investing)}</p>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-muted/50 p-4">
                                    <h4 className="mb-3 text-base font-bold">
                                        {t('Cash Flow from Financing Activities')}
                                    </h4>
                                    <div className="flex justify-between py-2">
                                        <p className="text-sm">{t('Net cash from financing')}</p>
                                        <p className="text-sm font-semibold">{formatCurrency(data.financing)}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between border-t-2 border-border py-4 text-lg font-bold">
                                    <p>{t('Net Increase/Decrease in Cash')}</p>
                                    <p>{formatCurrency(data.net_cash_flow)}</p>
                                </div>

                                <div className="flex justify-between border-t-4 border-border py-4 text-xl font-bold">
                                    <p>{t('Ending Cash Balance')}</p>
                                    <p>{formatCurrency(data.ending_cash)}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <NoRecordsFound
                        icon={FileText}
                        title={t('Cash Flow Statement')}
                        description={t('Select date range to generate the report')}
                        className="h-auto py-12"
                    />
                )}
            </CardContent>
        </Card>
    );
}
