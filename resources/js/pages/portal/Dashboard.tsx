import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    FileText,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Briefcase,
    FileSignature,
    ArrowRight,
    Receipt,
    CreditCard,
    Clock,
    Shield,
    HardHat,
    Package,
    Printer,
    Download,
} from 'lucide-react';

interface InvoiceItem {
    id: number;
    number: string;
    amount: number;
    status: string;
    date: string | null;
    due_date?: string | null;
}

interface RentalActivity {
    id: number;
    number: string;
    project: string;
    start_date: string;
    status: string;
}

interface Props {
    user: { name: string; email: string; type: string; company: string };
    stats: Record<string, number>;
    recentInvoices: InvoiceItem[];
    recentRentalActivity?: RentalActivity[];
}

const statusColor: Record<string, string> = {
    Paid: 'text-foreground bg-muted',
    Sent: 'text-foreground bg-foreground/5',
    Draft: 'text-muted-foreground bg-muted/50',
    'Partially Paid': 'text-muted-foreground bg-muted',
    Unpaid: 'text-muted-foreground bg-foreground/5',
    Overdue: 'text-muted-foreground bg-foreground/5',
};

export default function PortalDashboard({ user, stats, recentInvoices, recentRentalActivity }: Props) {
    const { t } = useTranslation();
    const isClient = user.type === 'client';

    const formatAED = (amount: number) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const kpis = isClient
        ? [
              { label: t('Total Amount'), value: formatAED(stats.total_amount || 0), icon: DollarSign },
              { label: t('Outstanding Balance'), value: formatAED(stats.outstanding || 0), icon: Clock },
              { label: t('Scaffolding on Site'), value: stats.scaffolding_units_on_site || 0, icon: HardHat },
              { label: t('Security Deposits'), value: formatAED(stats.security_deposits_total || 0), icon: Shield },
          ]
        : [
              { label: t('Total Bills'), value: stats.total_bills || 0, icon: Receipt },
              { label: t('Total Amount'), value: formatAED(stats.total_amount || 0), icon: DollarSign },
              { label: t('Paid'), value: formatAED(stats.paid_amount || 0), icon: CreditCard },
              { label: t('Outstanding'), value: formatAED(stats.outstanding || 0), icon: Clock },
          ];

    const quickLinks = [
        { label: isClient ? t('My Invoices') : t('My Bills'), href: route('portal.invoices'), icon: FileText },
        ...(isClient
            ? [
                  { label: t('My Projects'), href: route('portal.projects'), icon: Briefcase },
                  { label: t('Contracts'), href: route('portal.contracts'), icon: FileSignature },
              ]
            : []),
    ];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Portal') }]} pageTitle={t('Portal')}>
            <Head title={isClient ? t('Client Portal') : t('Vendor Portal')} />

            <div className="space-y-6">
                {/* Welcome */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h1 className="text-xl font-bold text-foreground">
                        {t('Welcome')}, {user.name} 👋
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {user.company} • {isClient ? t('Client Portal') : t('Vendor Portal')}
                    </p>
                </div>

                {/* KPI Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <div
                                key={kpi.label}
                                className="rounded-xl border border-border bg-card p-4 transition hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-foreground/5">
                                        <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                                        <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Alerts */}
                {stats.overdue_count > 0 && (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
                        <AlertTriangle className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                        <p className="text-sm text-muted-foreground">
                            {stats.overdue_count}{' '}
                            {t('invoices are overdue. Please settle them to avoid service disruption.')}
                        </p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content Areas */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Invoices */}
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-foreground">
                                    {isClient ? t('Recent Invoices') : t('Recent Bills')}
                                </h2>
                                <Link
                                    href={route('portal.invoices')}
                                    className="flex items-center gap-1 text-xs text-foreground hover:underline"
                                >
                                    {t('View All')} <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-card">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">#</th>
                                            <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">{t('Date')}</th>
                                            <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">{t('Amount')}</th>
                                            <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">{t('Status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {recentInvoices.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                                    {t('No records found')}
                                                </td>
                                            </tr>
                                        ) : (
                                            recentInvoices.map((item) => (
                                                <tr key={item.id} className="transition hover:bg-muted/20">
                                                    <td className="px-4 py-3 text-sm font-medium text-foreground">{item.number}</td>
                                                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.date || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-foreground">{formatAED(item.amount)}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusColor[item.status] || 'bg-muted text-muted-foreground'}`}>
                                                            {t(item.status)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Rental Activity */}
                        {isClient && recentRentalActivity && recentRentalActivity.length > 0 && (
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-foreground">
                                        {t('On-Site Rental Activity')}
                                    </h2>
                                    <Link
                                        href={route('portal.contracts')}
                                        className="flex items-center gap-1 text-xs text-foreground hover:underline"
                                    >
                                        {t('View All Contracts')} <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                                <div className="overflow-hidden rounded-xl border border-border bg-card">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/50">
                                                <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">{t('Contract #')}</th>
                                                <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">{t('Project')}</th>
                                                <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">{t('Start Date')}</th>
                                                <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">{t('Status')}</th>
                                                <th className="px-4 py-3 text-end text-xs font-semibold text-muted-foreground">{t('Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {recentRentalActivity.map((rc) => (
                                                <tr key={rc.id} className="transition hover:bg-muted/20">
                                                    <td className="px-4 py-3 text-sm font-medium text-foreground">{rc.number}</td>
                                                    <td className="px-4 py-3 text-xs text-muted-foreground">{rc.project}</td>
                                                    <td className="px-4 py-3 text-xs text-muted-foreground">{rc.start_date}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20">
                                                            {t(rc.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-end">
                                                        <a
                                                            href={route('rental.download', rc.id)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground hover:shadow-sm"
                                                            title={t('Download PDF')}
                                                        >
                                                            <Printer className="h-4 w-4" />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="mb-3 text-base font-semibold text-foreground">{t('Quick Access')}</h2>
                        <div className="space-y-2">
                            {quickLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-foreground/30 hover:shadow-md"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-foreground/5">
                                            <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{link.label}</span>
                                        <ArrowRight className="ms-auto h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
