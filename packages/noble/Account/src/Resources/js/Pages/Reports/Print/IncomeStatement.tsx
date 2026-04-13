import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function PrintIncomeStatement() {
    const { t } = useTranslation();
    const { data, filters } = usePage<any>().props;

    return (
        <>
            <Head title={t('Income Statement')} />
            <div className="mx-auto max-w-5xl p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">{t('Income Statement')}</h1>
                    <p className="text-muted-foreground">
                        {formatDate(data.from_date)} {t('to')} {formatDate(data.to_date)}
                    </p>
                </div>

                <table className="w-full border-collapse">
                    <tbody>
                        <tr className="bg-muted">
                            <td className="border px-4 py-2 font-semibold">{t('Revenue')}</td>
                            <td className="border px-4 py-2"></td>
                        </tr>
                        {data.revenue?.map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td className="border px-8 py-1">{item.category}</td>
                                <td className="border px-4 py-1 text-end">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                        <tr className="bg-muted/50 font-semibold">
                            <td className="border px-4 py-2">{t('Total Revenue')}</td>
                            <td className="border px-4 py-2 text-end">{formatCurrency(data.total_revenue)}</td>
                        </tr>

                        <tr className="bg-muted">
                            <td className="border px-4 py-2 font-semibold">{t('Expenses')}</td>
                            <td className="border px-4 py-2"></td>
                        </tr>
                        {data.expenses?.map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td className="border px-8 py-1">{item.category}</td>
                                <td className="border px-4 py-1 text-end">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                        <tr className="bg-muted/50 font-semibold">
                            <td className="border px-4 py-2">{t('Total Expenses')}</td>
                            <td className="border px-4 py-2 text-end">{formatCurrency(data.total_expenses)}</td>
                        </tr>

                        <tr className="bg-muted font-bold">
                            <td className="border px-4 py-3 text-lg">{t('Net Income')}</td>
                            <td className="border px-4 py-3 text-end text-lg">{formatCurrency(data.net_income)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
