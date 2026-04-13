import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Play, Cpu, AlertTriangle, CheckCircle } from "lucide-react";
import NoRecordsFound from '@/components/no-records-found';
import { formatDate, formatDateTime } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { logs, auth } = usePage<any>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState({
        search: urlParams.get('search') || '',
        status: urlParams.get('status') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || 'punch_time');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'desc');
    const [processing, setProcessing] = useState(false);

    const handleFilter = () => {
        router.get(route('hrm.biometric-logs.index'), { ...filters, per_page: perPage, sort: sortField, direction: sortDirection }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('hrm.biometric-logs.index'), { ...filters, per_page: perPage, sort: field, direction }, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setFilters({ search: '', status: '' });
        router.get(route('hrm.biometric-logs.index'), { per_page: perPage });
    };

    const runProcessor = () => {
        setProcessing(true);
        router.post(route('hrm.biometric-logs.process'), {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false)
        });
    };

    const tableColumns = [
        {
            key: 'emp_id',
            header: t('Employee Machine ID'),
            sortable: true,
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold">{value}</span>
                </div>
            )
        },
        {
            key: 'punch_time',
            header: t('Punch Timestamp'),
            sortable: true,
            render: (value: string) => value ? formatDateTime(value) : '-'
        },
        {
            key: 'type',
            header: t('Action Type'),
            sortable: true,
            render: (value: string) => (
                <span className="capitalize">{t(value || 'Auto-Detected')}</span>
            )
        },
        {
            key: 'is_processed',
            header: t('Status'),
            sortable: true,
            render: (value: boolean, log: any) => (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className={`text-[10px] w-fit font-black uppercase ${value ? 'bg-foreground/10 text-foreground border-foreground/20' : 'bg-muted-foreground/10 text-muted-foreground border-border/20'}`}>
                        {value ? t('Processed') : t('Pending Engine')}
                    </Badge>
                    {log.error_message && (
                        <div className="flex items-center gap-1 text-destructive text-[10px] font-bold">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{log.error_message}</span>
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Hrm'), url: route('hrm.index') },
                { label: t('Biometric Logs') }
            ]}
            pageTitle={t('ADMS Biometric Logs')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('manage-attendances') && (
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button size="sm" onClick={runProcessor} disabled={processing} className="flex items-center gap-2">
                                    <Cpu className={`h-4 w-4 ${processing ? 'animate-pulse text-primary' : ''}`} />
                                    <span className="hidden sm:inline">{processing ? t('Crunching Data...') : t('Force Processor Engine')}</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('Run mapping CRON job manually to generate attendances')}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
            }
        >
            <Head title={t('Biometric Logs')} />

            <div className="space-y-6 animate-in fade-in duration-1000">
                
                {/* Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="premium-card p-6 bg-gradient-to-br from-foreground/5 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center text-foreground">
                                <Fingerprint className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Total Pushes')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">{logs?.total || 0}</h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('All-Time Recorded Vectors')}</p>
                        </div>
                    </div>
                    
                    <div className="premium-card p-6 bg-gradient-to-br from-destructive/5 via-transparent to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Unbound IDs')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">{logs?.data?.filter((l: any) => l.error_message).length || 0}</h3>
                            <p className="text-xs font-medium text-muted-foreground">{t('Requires Manual Mapping in Employees')}</p>
                        </div>
                    </div>
                </div>

                <Card className="premium-card border-none bg-foreground/40 backdrop-blur-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-card/5">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="w-full lg:flex-1 max-w-xl">
                                <SearchInput
                                    value={filters.search}
                                    onChange={(value) => setFilters({ ...filters, search: value })}
                                    onSearch={handleFilter}
                                    placeholder={t('Search Machine ID...')}
                                    className="bg-background/20 border-white/10"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`cursor-pointer transition-colors ${filters.status === '' ? 'bg-foreground text-background' : 'bg-transparent text-muted-foreground'}`} onClick={() => { setFilters({ ...filters, status: '' }); setTimeout(handleFilter, 100); }}>
                                    {t('All Streams')}
                                </Badge>
                                <Badge variant="outline" className={`cursor-pointer transition-colors ${filters.status === 'processed' ? 'bg-foreground text-background' : 'bg-transparent text-muted-foreground'}`} onClick={() => { setFilters({ ...filters, status: 'processed' }); setTimeout(handleFilter, 100); }}>
                                    {t('Processed')}
                                </Badge>
                                <Badge variant="outline" className={`cursor-pointer transition-colors ${filters.status === 'pending' ? 'bg-foreground text-background' : 'bg-transparent text-muted-foreground'}`} onClick={() => { setFilters({ ...filters, status: 'pending' }); setTimeout(handleFilter, 100); }}>
                                    {t('Raw Data')}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="p-0">
                        <DataTable
                            data={logs?.data || []}
                            columns={tableColumns}
                            onSort={handleSort}
                            sortKey={sortField}
                            sortDirection={sortDirection as 'asc' | 'desc'}
                            className="border-none"
                            emptyState={
                                <NoRecordsFound
                                    icon={Fingerprint}
                                    title={t('No ADMS Vectors Found')}
                                    description={t('System clear. Waiting for biometric device push payload.')}
                                    hasFilters={!!(filters.search || filters.status)}
                                    onClearFilters={clearFilters}
                                />
                            }
                        />
                    </div>

                    <div className="px-6 py-4 border-t border-white/5 bg-card/5">
                        <Pagination
                            data={logs || { data: [], links: [], total: 0, current_page: 1, last_page: 1, per_page: 10, from: 0, to: 0 }}
                            routeName="hrm.biometric-logs.index"
                            filters={{ ...filters, per_page: perPage }}
                        />
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
