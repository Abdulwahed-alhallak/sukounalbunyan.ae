import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ArrowLeft, Download, Printer, Calendar, RefreshCw, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';

interface Column {
    key: string;
    label: string;
    type: 'text' | 'currency' | 'number' | 'percentage' | 'date' | 'badge';
}

interface SummaryItem {
    label: string;
    value: string | number;
    type: string;
    highlight?: boolean;
}

interface ReportData {
    title: string;
    subtitle?: string;
    columns: Column[];
    rows: Record<string, any>[];
    summary: SummaryItem[];
    chartData?: Record<string, any>[];
    chartType?: 'area' | 'bar' | 'pie';
}

interface Props {
    report: ReportData;
    reportType: string;
    dateFrom: string;
    dateTo: string;
    filters: Record<string, any>;
}

export default function ReportView({ report, reportType, dateFrom, dateTo, filters }: Props) {
    const { t } = useTranslation();
    const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
    const [localDateTo, setLocalDateTo] = useState(dateTo);

    const handleRefresh = () => {
        router.get(
            route('reports.generate', reportType),
            {
                date_from: localDateFrom,
                date_to: localDateTo,
                ...filters,
            },
            { preserveState: true }
        );
    };

    const formatValue = (value: any, type: string) => {
        if (value === null || value === undefined) return '—';
        switch (type) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'SAR',
                    minimumFractionDigits: 0,
                }).format(Number(value));
            case 'percentage':
                return `${value}%`;
            case 'number':
                return new Intl.NumberFormat('en-US').format(Number(value));
            default:
                return String(value);
        }
    };

    const badgeColor = (value: string) => {
        const colors: Record<string, string> = {
            paid: 'bg-muted text-foreground',
            completed: 'bg-muted text-foreground',
            active: 'bg-muted text-muted-foreground',
            pending: 'bg-muted text-muted-foreground',
            overdue: 'bg-muted text-muted-foreground',
            high: 'bg-muted text-muted-foreground',
            medium: 'bg-muted text-muted-foreground',
            low: 'bg-muted text-foreground',
        };
        return colors[value?.toLowerCase()] || 'bg-muted text-muted-foreground';
    };

    // Chart rendering
    const renderChart = () => {
        if (!report.chartData || report.chartData.length === 0) return null;

        const dataKeys = Object.keys(report.chartData[0]).filter((k) => k !== 'name' && k !== 'month' && k !== 'date');
        const xKey = report.chartData[0].month ? 'month' : report.chartData[0].date ? 'date' : 'name';
        const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

        if (report.chartType === 'pie') {
            return (
                <PieChart
                    data={report.chartData.map((d, i) => ({ ...d, color: colors[i % colors.length] }))}
                    dataKey="value"
                    nameKey="name"
                    height={280}
                    showTooltip={true}
                    showLegend={true}
                />
            );
        }

        if (report.chartType === 'bar') {
            return (
                <BarChart
                    data={report.chartData}
                    dataKey={dataKeys[0] || 'value'}
                    height={280}
                    showTooltip={true}
                    showGrid={true}
                    xAxisKey={xKey}
                />
            );
        }

        // Default: area
        return (
            <AreaChart
                data={report.chartData}
                dataKey={dataKeys[0] || 'value'}
                height={280}
                showTooltip={true}
                showGrid={true}
                showLegend={dataKeys.length > 1}
                xAxisKey={xKey}
                areas={dataKeys.map((k, i) => ({ dataKey: k, color: colors[i % colors.length], name: k }))}
            />
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Report Center'), url: route('reports.index') }, { label: t(report.title) }]}
        >
            <Head title={t(report.title)} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('reports.index')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-accent"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{t(report.title)}</h1>
                            {report.subtitle && <p className="text-sm text-muted-foreground">{report.subtitle}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={route('reports.export-csv', { reportType, date_from: dateFrom, date_to: dateTo })}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent"
                        >
                            <Download className="h-3.5 w-3.5" /> {t('Export CSV')}
                        </a>
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent"
                        >
                            <Printer className="h-3.5 w-3.5" /> {t('Print')}
                        </button>
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="date"
                        value={localDateFrom}
                        onChange={(e) => setLocalDateFrom(e.target.value)}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                    <span className="text-sm text-muted-foreground">{t('to')}</span>
                    <input
                        type="date"
                        value={localDateTo}
                        onChange={(e) => setLocalDateTo(e.target.value)}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:bg-foreground/90"
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> {t('Refresh')}
                    </button>
                </div>

                {/* Summary Cards */}
                {report.summary.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {report.summary.map((item, i) => (
                            <Card key={i} className={item.highlight ? 'border-foreground/30 bg-foreground/5' : ''}>
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground">{t(item.label)}</p>
                                    <p
                                        className={`mt-1 text-xl font-bold ${item.highlight ? 'text-foreground' : 'text-foreground'}`}
                                    >
                                        {formatValue(item.value, item.type)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Chart */}
                {report.chartData && report.chartData.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">{t('Visualization')}</CardTitle>
                        </CardHeader>
                        <CardContent>{renderChart()}</CardContent>
                    </Card>
                )}

                {/* Data Table */}
                {report.columns.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-border bg-card">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        {report.columns.map((col) => (
                                            <th
                                                key={col.key}
                                                className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                            >
                                                {t(col.label)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {report.rows.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={report.columns.length}
                                                className="px-4 py-12 text-center text-muted-foreground"
                                            >
                                                <BarChart3 className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                                {t('No data available for this period')}
                                            </td>
                                        </tr>
                                    ) : (
                                        report.rows.map((row, ri) => (
                                            <tr key={ri} className="transition hover:bg-muted/20">
                                                {report.columns.map((col) => (
                                                    <td key={col.key} className="px-4 py-3 text-sm">
                                                        {col.type === 'badge' ? (
                                                            <span
                                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeColor(row[col.key])}`}
                                                            >
                                                                {row[col.key]}
                                                            </span>
                                                        ) : col.type === 'currency' ? (
                                                            <span className="font-mono text-foreground">
                                                                {formatValue(row[col.key], 'currency')}
                                                            </span>
                                                        ) : col.type === 'percentage' ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-1.5 w-16 rounded-full bg-muted">
                                                                    <div
                                                                        className="h-full rounded-full bg-foreground"
                                                                        style={{
                                                                            width: `${Math.min(100, Number(row[col.key]) || 0)}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {row[col.key]}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-foreground">
                                                                {formatValue(row[col.key], col.type)}
                                                            </span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
                            {report.rows.length} {t('records')} • {t('Generated at')} {new Date().toLocaleString()}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
