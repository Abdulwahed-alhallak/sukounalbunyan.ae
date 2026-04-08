import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    FileText, DollarSign, TrendingUp, AlertTriangle, Briefcase,
    FileSignature, ArrowRight, Receipt, CreditCard, Clock,
} from 'lucide-react';

interface InvoiceItem {
    id: number;
    number: string;
    amount: number;
    status: string;
    date: string | null;
    due_date?: string | null;
}

interface Props {
    user: { name: string; email: string; type: string; company: string };
    stats: Record<string, number>;
    recentInvoices: InvoiceItem[];
}

const statusColor: Record<string, string> = {
    Paid: 'text-foreground bg-muted',
    Sent: 'text-foreground bg-foreground/5',
    Draft: 'text-muted-foreground bg-muted/50',
    'Partially Paid': 'text-muted-foreground bg-muted',
    Unpaid: 'text-muted-foreground bg-foreground/5',
    Overdue: 'text-muted-foreground bg-foreground/5',
};

export default function PortalDashboard({ user, stats, recentInvoices }: Props) {
    const { t } = useTranslation();
    const isClient = user.type === 'client';

    const kpis = isClient ? [
        { label: t('Total Invoices'), value: stats.total_invoices || 0, icon: FileText },
        { label: t('Total Amount'), value: `$${(stats.total_amount || 0).toLocaleString()}`, icon: DollarSign },
        { label: t('Paid'), value: `$${(stats.paid_amount || 0).toLocaleString()}`, icon: CreditCard },
        { label: t('Outstanding'), value: `$${(stats.outstanding || 0).toLocaleString()}`, icon: Clock },
    ] : [
        { label: t('Total Bills'), value: stats.total_bills || 0, icon: Receipt },
        { label: t('Total Amount'), value: `$${(stats.total_amount || 0).toLocaleString()}`, icon: DollarSign },
        { label: t('Paid'), value: `$${(stats.paid_amount || 0).toLocaleString()}`, icon: CreditCard },
        { label: t('Outstanding'), value: `$${(stats.outstanding || 0).toLocaleString()}`, icon: Clock },
    ];

    const quickLinks = [
        { label: isClient ? t('My Invoices') : t('My Bills'), href: route('portal.invoices'), icon: FileText },
        ...(isClient ? [
            { label: t('My Projects'), href: route('portal.projects'), icon: Briefcase },
            { label: t('Contracts'), href: route('portal.contracts'), icon: FileSignature },
        ] : []),
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
                    {kpis.map(kpi => {
                        const Icon = kpi.icon;
                        return (
                            <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 transition hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 border border-border">
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
                        <p className="text-sm text-muted-foreground">{stats.overdue_count} {t('invoices are overdue. Please settle them to avoid service disruption.')}</p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Invoices */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-semibold text-foreground">{isClient ? t('Recent Invoices') : t('Recent Bills')}</h2>
                            <Link href={route('portal.invoices')} className="flex items-center gap-1 text-xs text-foreground hover:underline">{t('View All')} <ArrowRight className="h-3 w-3" /></Link>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-border bg-card">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Date')}</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Amount')}</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Status')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentInvoices.length === 0 ? (
                                        <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">{t('No records found')}</td></tr>
                                    ) : recentInvoices.map(item => (
                                        <tr key={item.id} className="transition hover:bg-muted/20">
                                            <td className="px-4 py-3 text-sm font-medium text-foreground">{item.number}</td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">{item.date || '—'}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-foreground">${item.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusColor[item.status] || 'bg-muted text-muted-foreground'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="mb-3 text-base font-semibold text-foreground">{t('Quick Access')}</h2>
                        <div className="space-y-2">
                            {quickLinks.map(link => {
                                const Icon = link.icon;
                                return (
                                    <Link key={link.href} href={link.href} className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-foreground/30 hover:shadow-md">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 border border-border">
                                            <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{link.label}</span>
                                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
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
