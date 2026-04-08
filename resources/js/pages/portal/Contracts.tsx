import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FileSignature, ArrowLeft, Calendar, DollarSign } from 'lucide-react';

interface Contract {
    id: number;
    subject: string;
    status: string;
    value: number;
    type: string;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
}

interface Props {
    contracts: { data: Contract[]; total: number };
}

const statusBadge: Record<string, string> = {
    active: 'text-foreground bg-muted',
    expired: 'text-muted-foreground bg-muted',
    pending: 'text-muted-foreground bg-muted',
};

export default function PortalContracts({ contracts }: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Portal'), url: route('portal.dashboard') }, { label: t('Contracts') }]}>
            <Head title={t('My Contracts')} />

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={route('portal.dashboard')} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{t('My Contracts')}</h1>
                        <p className="text-sm text-muted-foreground">{contracts?.total || 0} {t('contracts')}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {(contracts?.data || []).length === 0 ? (
                        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
                            <FileSignature className="mb-4 h-12 w-12 text-muted-foreground/30" />
                            <h3 className="text-lg font-semibold text-foreground">{t('No contracts found')}</h3>
                        </div>
                    ) : (contracts.data).map(contract => (
                        <div key={contract.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30 hover:shadow-md">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-foreground">{contract.subject}</h3>
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge[contract.status] || 'bg-muted text-muted-foreground'}`}>
                                        {contract.status}
                                    </span>
                                </div>
                                {contract.type && <p className="mt-0.5 text-xs text-muted-foreground">{contract.type}</p>}
                                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                    {contract.start_date && (
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {contract.start_date} — {contract.end_date || '∞'}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                                    <DollarSign className="h-4 w-4 text-foreground" />
                                    {Number(contract.value || 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
