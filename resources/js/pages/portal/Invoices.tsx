import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FileText, ArrowLeft, Download, Eye } from 'lucide-react';
import { useState } from 'react';

interface InvoiceItem {
    id: number;
    invoice_id?: string;
    bill_id?: string;
    total: number;
    status: string;
    invoice_date?: string;
    bill_date?: string;
    due_date?: string;
}

interface Props {
    invoices: { data: InvoiceItem[]; current_page: number; last_page: number; total: number; links: any[] };
    type: string;
}

const statusColor: Record<string, string> = {
    Paid: 'text-foreground bg-muted',
    Sent: 'text-muted-foreground bg-muted',
    Draft: 'text-muted-foreground bg-muted/50',
    'Partially Paid': 'text-muted-foreground bg-muted',
    Unpaid: 'text-muted-foreground bg-muted',
};

export default function PortalInvoices({ invoices, type }: Props) {
    const { t } = useTranslation();
    const isClient = type === 'client';
    const [statusFilter, setStatusFilter] = useState('');

    const items = invoices?.data || [];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Portal'), url: route('portal.dashboard') }, { label: isClient ? t('Invoices') : t('Bills') }]}>
            <Head title={isClient ? t('My Invoices') : t('My Bills')} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('portal.dashboard')} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{isClient ? t('My Invoices') : t('My Bills')}</h1>
                            <p className="text-sm text-muted-foreground">{invoices?.total || 0} {t('records')}</p>
                        </div>
                    </div>
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); router.get(route('portal.invoices'), e.target.value ? { status: e.target.value } : {}, { preserveState: true }); }}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                        <option value="">{t('All Status')}</option>
                        <option value="Paid">{t('Paid')}</option>
                        <option value="Sent">{t('Sent')}</option>
                        <option value="Draft">{t('Draft')}</option>
                        <option value="Unpaid">{t('Unpaid')}</option>
                    </select>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Date')}</th>
                                {isClient && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Due Date')}</th>}
                                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">{t('Amount')}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {items.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-12 text-center">
                                    <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">{t('No records found')}</p>
                                </td></tr>
                            ) : items.map(item => (
                                <tr key={item.id} className="transition hover:bg-muted/20">
                                    <td className="px-4 py-3 text-sm font-medium text-foreground">{item.invoice_id || item.bill_id || `#${item.id}`}</td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.invoice_date || item.bill_date || '—'}</td>
                                    {isClient && <td className="px-4 py-3 text-xs text-muted-foreground">{item.due_date || '—'}</td>}
                                    <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">${Number(item.total).toLocaleString()}</td>
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

                {/* Pagination */}
                {invoices?.last_page > 1 && (
                    <div className="flex justify-center gap-1">{invoices.links.map((link: any, i: number) => (
                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                            className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-sm transition ${link.active ? 'bg-foreground text-background' : link.url ? 'text-muted-foreground hover:bg-accent' : 'cursor-not-allowed text-muted-foreground/50'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}</div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
