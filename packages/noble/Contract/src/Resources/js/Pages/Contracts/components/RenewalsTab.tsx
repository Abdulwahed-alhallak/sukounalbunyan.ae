import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencyInput } from '@/components/ui/currency-input';
import InputError from '@/components/ui/input-error';
import {
    RefreshCw,
    Plus,
    Grid,
    List,
    ChevronLeft,
    ChevronRight,
    Calendar,
    DollarSign,
    User,
    Eye,
    Edit,
    Trash2,
} from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/helpers';

const getRenewalStatusColor = (status: any) => {
    const statusValue = status?.toString().toLowerCase();
    switch (statusValue) {
        case 'draft':
            return 'bg-muted text-foreground';
        case 'pending':
            return 'bg-muted text-foreground';
        case 'approved':
            return 'bg-muted text-foreground';
        case 'active':
            return 'bg-muted text-foreground';
        case 'expired':
            return 'bg-muted text-foreground';
        case 'cancelled':
            return 'bg-muted text-destructive';
        default:
            return 'bg-muted text-foreground';
    }
};

const getRenewalStatusText = (status: any, t: (key: string) => string) => {
    const statusValue = status?.toString().toLowerCase();
    switch (statusValue) {
        case 'draft':
            return t('Draft');
        case 'pending':
            return t('Pending');
        case 'approved':
            return t('Approved');
        case 'active':
            return t('Active');
        case 'expired':
            return t('Expired');
        case 'cancelled':
            return t('Cancelled');
        default:
            return t('Draft');
    }
};

interface RenewalsTabProps {
    contract: any;
    setDeleteConfig?: (config: any) => void;
}

export default function RenewalsTab({ contract, setDeleteConfig }: RenewalsTabProps) {
    const { t } = useTranslation();
    const { auth } = usePage<any>().props;

    const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
    const [renewalData, setRenewalData] = useState({
        start_date: '',
        end_date: '',
        value: '',
        status: 'pending',
        notes: '',
    });
    const [renewalErrors, setRenewalErrors] = useState<any>({});
    const [renewalView, setRenewalView] = useState<'list' | 'grid'>('list');
    const [renewalPage, setRenewalPage] = useState(
        parseInt(new URLSearchParams(window.location.search).get('renewal_page') || '1')
    );
    const [renewalPerPage, setRenewalPerPage] = useState(
        parseInt(new URLSearchParams(window.location.search).get('renewal_per_page') || '10')
    );
    const [renewalSearch, setRenewalSearch] = useState(
        new URLSearchParams(window.location.search).get('renewal_search') || ''
    );
    const [renewalSearchInput, setRenewalSearchInput] = useState(
        new URLSearchParams(window.location.search).get('renewal_search') || ''
    );
    const [showRenewalId, setShowRenewalId] = useState<number | null>(null);
    const [editRenewalId, setEditRenewalId] = useState<number | null>(null);
    const [showRenewalDialogOpen, setShowRenewalDialogOpen] = useState(false);

    const handleRenewalSubmit = () => {
        setRenewalErrors({});
        const url = editRenewalId
            ? route('contract-renewals.update', editRenewalId)
            : route('contract-renewals.store', contract.id);
        const method = editRenewalId ? 'put' : 'post';

        router[method](url, renewalData, {
            onSuccess: () => {
                setRenewalDialogOpen(false);
                setRenewalData({ start_date: '', end_date: '', value: '', status: 'pending', notes: '' });
                setEditRenewalId(null);
                setRenewalErrors({});
                router.reload();
            },
            onError: (errors) => {
                setRenewalErrors(errors);
            },
        });
    };

    const getSelectedRenewal = () => {
        return contract.renewals?.find((renewal: any) => renewal.id === showRenewalId);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('Contract Renewals')}</CardTitle>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <SearchInput
                                value={renewalSearchInput}
                                onChange={(value) => setRenewalSearchInput(value)}
                                onSearch={() => {
                                    setRenewalSearch(renewalSearchInput);
                                    setRenewalPage(1);
                                    router.reload({
                                        data: {
                                            renewal_search: renewalSearchInput,
                                            renewal_page: 1,
                                            renewal_per_page: renewalPerPage,
                                        },
                                    });
                                }}
                                onClear={() => {
                                    setRenewalSearch('');
                                    setRenewalSearchInput('');
                                    setRenewalPage(1);
                                    router.reload({
                                        data: {
                                            renewal_search: '',
                                            renewal_page: 1,
                                            renewal_per_page: renewalPerPage,
                                        },
                                    });
                                }}
                                placeholder={t('Search renewals...')}
                                className="w-64"
                            />
                        </div>
                        <div className="flex rounded-md border">
                            <Button
                                size="sm"
                                variant={renewalView === 'list' ? 'default' : 'ghost'}
                                onClick={() => setRenewalView('list')}
                                className="h-9 rounded-r-none px-2"
                            >
                                <List className="h-3 w-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant={renewalView === 'grid' ? 'default' : 'ghost'}
                                onClick={() => setRenewalView('grid')}
                                className="h-9 rounded-l-none px-2"
                            >
                                <Grid className="h-3 w-3" />
                            </Button>
                        </div>
                        <Select
                            value={renewalPerPage.toString()}
                            onValueChange={(value) => {
                                setRenewalPerPage(Number(value));
                                setRenewalPage(1);
                                router.reload({
                                    data: {
                                        renewal_search: renewalSearch,
                                        renewal_page: 1,
                                        renewal_per_page: Number(value),
                                    },
                                });
                            }}
                        >
                            <SelectTrigger className="h-9 w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 {t('per page')}</SelectItem>
                                <SelectItem value="10">10 {t('per page')}</SelectItem>
                                <SelectItem value="20">20 {t('per page')}</SelectItem>
                                <SelectItem value="50">50 {t('per page')}</SelectItem>
                            </SelectContent>
                        </Select>
                        {auth.user?.permissions?.includes('create-contract-renewals') && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setEditRenewalId(null);
                                                setRenewalData({
                                                    start_date: '',
                                                    end_date: '',
                                                    value: '',
                                                    status: 'pending',
                                                    notes: '',
                                                });
                                                setRenewalErrors({});
                                                setRenewalDialogOpen(true);
                                            }}
                                            className="h-9 w-9 p-0"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Add Renewal')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {(() => {
                        const renewals = contract.renewals || [];
                        const totalRenewals = renewals.length;
                        const lastPage = Math.ceil(totalRenewals / renewalPerPage);

                        return renewals.length > 0 ? (
                            <>
                                {renewalView === 'list' ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('Start Date')}</TableHead>
                                                <TableHead>{t('End Date')}</TableHead>
                                                <TableHead>{t('Value')}</TableHead>
                                                <TableHead>{t('Status')}</TableHead>
                                                <TableHead>{t('Created By')}</TableHead>
                                                <TableHead className="w-24">{t('Actions')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {renewals?.map((renewal: any) => (
                                                <TableRow key={renewal.id}>
                                                    <TableCell>{formatDate(renewal.start_date)}</TableCell>
                                                    <TableCell>{formatDate(renewal.end_date)}</TableCell>
                                                    <TableCell>
                                                        {renewal.value ? formatCurrency(renewal.value) : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-sm ${getRenewalStatusColor(renewal.status)}`}
                                                        >
                                                            {getRenewalStatusText(renewal.status, t)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{renewal.creator?.name || '-'}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            onClick={() => {
                                                                                setShowRenewalId(renewal.id);
                                                                                setShowRenewalDialogOpen(true);
                                                                            }}
                                                                            className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('View Details')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                            {auth.user?.permissions?.includes(
                                                                'edit-contract-renewals'
                                                            ) &&
                                                                (renewal.creator_id === auth.user?.id ||
                                                                    renewal.created_by === auth.user?.id) && (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    onClick={() => {
                                                                                        setEditRenewalId(renewal.id);
                                                                                        setRenewalData({
                                                                                            start_date:
                                                                                                renewal.start_date,
                                                                                            end_date: renewal.end_date,
                                                                                            value: renewal.value,
                                                                                            status: renewal.status,
                                                                                            notes: renewal.notes || '',
                                                                                        });
                                                                                        setRenewalDialogOpen(true);
                                                                                    }}
                                                                                    className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                                >
                                                                                    <Edit className="h-4 w-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>{t('Edit')}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                )}
                                                            {auth.user?.permissions?.includes(
                                                                'delete-contract-renewals'
                                                            ) &&
                                                                (renewal.creator_id === auth.user?.id ||
                                                                    renewal.created_by === auth.user?.id) && (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    onClick={() => {
                                                                                        if (setDeleteConfig) {
                                                                                            setDeleteConfig({
                                                                                                type: 'renewal',
                                                                                                id: renewal.id,
                                                                                                route: 'contract-renewals.destroy',
                                                                                                message: t(
                                                                                                    'Are you sure you want to delete this renewal?'
                                                                                                ),
                                                                                            });
                                                                                        } else {
                                                                                            if (
                                                                                                confirm(
                                                                                                    t(
                                                                                                        'Are you sure you want to delete this renewal?'
                                                                                                    )
                                                                                                )
                                                                                            ) {
                                                                                                router.delete(
                                                                                                    route(
                                                                                                        'contract-renewals.destroy',
                                                                                                        renewal.id
                                                                                                    )
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>{t('Delete')}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                        {renewals?.map((renewal: any) => (
                                            <div
                                                key={renewal.id}
                                                className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg"
                                            >
                                                {/* Value - Main Focus */}
                                                <div className="mb-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 p-3 text-center">
                                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                        {t('Renewal Value')}
                                                    </p>
                                                    <p className="text-xl font-bold text-foreground">
                                                        {renewal.value ? formatCurrency(renewal.value) : '-'}
                                                    </p>
                                                </div>

                                                {/* Date Range */}
                                                <div className="mb-4 rounded-lg bg-muted/50 p-3">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="text-center">
                                                            <p className="mb-1 text-muted-foreground">{t('Start')}</p>
                                                            <p className="font-semibold text-foreground">
                                                                {formatDate(renewal.start_date)}
                                                            </p>
                                                        </div>
                                                        <div className="h-8 w-px bg-muted"></div>
                                                        <div className="text-center">
                                                            <p className="mb-1 text-muted-foreground">{t('End')}</p>
                                                            <p className="font-semibold text-foreground">
                                                                {formatDate(renewal.end_date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Creator */}
                                                <div className="mb-4 flex items-center gap-2 px-2">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted/50">
                                                        <User className="h-3 w-3 text-foreground" />
                                                    </div>
                                                    <span className="truncate text-xs font-medium text-muted-foreground">
                                                        {renewal.creator?.name || '-'}
                                                    </span>
                                                </div>

                                                {/* Notes Preview */}
                                                {renewal.notes && (
                                                    <div className="mb-4 rounded-lg border border-border bg-muted/50 p-2">
                                                        <p className="line-clamp-2 text-xs leading-relaxed text-foreground">
                                                            {renewal.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Status and Actions */}
                                                <div className="flex items-center justify-between border-t border-border pt-4">
                                                    <div className="flex items-center gap-2 text-sm font-medium">
                                                        <div
                                                            className={`h-2.5 w-2.5 rounded-full ${
                                                                renewal.status === 'pending'
                                                                    ? 'bg-muted/500'
                                                                    : renewal.status === 'approved'
                                                                      ? 'bg-muted/500'
                                                                      : renewal.status === 'active'
                                                                        ? 'bg-muted/500'
                                                                        : renewal.status === 'expired'
                                                                          ? 'bg-muted-foreground'
                                                                          : renewal.status === 'rejected'
                                                                            ? 'bg-muted/500'
                                                                            : 'bg-muted-foreground'
                                                            }`}
                                                        />
                                                        <span className="text-xs">{t(renewal.status)}</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setShowRenewalId(renewal.id);
                                                                            setShowRenewalDialogOpen(true);
                                                                        }}
                                                                        className="h-6 w-6 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <Eye className="h-3 w-3" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('View Details')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        {auth.user?.permissions?.includes('edit-contract-renewals') &&
                                                            (renewal.creator_id === auth.user?.id ||
                                                                renewal.created_by === auth.user?.id) && (
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setEditRenewalId(renewal.id);
                                                                                    setRenewalData({
                                                                                        start_date: renewal.start_date,
                                                                                        end_date: renewal.end_date,
                                                                                        value: renewal.value,
                                                                                        status: renewal.status,
                                                                                        notes: renewal.notes || '',
                                                                                    });
                                                                                    setRenewalDialogOpen(true);
                                                                                }}
                                                                                className="h-6 w-6 p-0 text-foreground hover:text-foreground"
                                                                            >
                                                                                <Edit className="h-3 w-3" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{t('Edit Renewal')}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            )}
                                                        {auth.user?.permissions?.includes('delete-contract-renewals') &&
                                                            (renewal.creator_id === auth.user?.id ||
                                                                renewal.created_by === auth.user?.id) && (
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    if (setDeleteConfig) {
                                                                                        setDeleteConfig({
                                                                                            type: 'renewal',
                                                                                            id: renewal.id,
                                                                                            route: 'contract-renewals.destroy',
                                                                                            message: t(
                                                                                                'Are you sure you want to delete this renewal?'
                                                                                            ),
                                                                                        });
                                                                                    } else {
                                                                                        if (
                                                                                            confirm(
                                                                                                t(
                                                                                                    'Are you sure you want to delete this renewal?'
                                                                                                )
                                                                                            )
                                                                                        ) {
                                                                                            router.delete(
                                                                                                route(
                                                                                                    'contract-renewals.destroy',
                                                                                                    renewal.id
                                                                                                )
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                                            >
                                                                                <Trash2 className="h-3 w-3" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{t('Delete Renewal')}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="bg-muted/50/30 border-t px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            {t('Showing')}{' '}
                                            <span className="font-medium text-foreground">
                                                {(renewalPage - 1) * renewalPerPage + 1}
                                            </span>{' '}
                                            {t('to')}{' '}
                                            <span className="font-medium text-foreground">
                                                {Math.min(renewalPage * renewalPerPage, totalRenewals)}
                                            </span>{' '}
                                            {t('of')}{' '}
                                            <span className="font-medium text-foreground">{totalRenewals}</span>{' '}
                                            {t('results')}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const newPage = Math.max(1, renewalPage - 1);
                                                    setRenewalPage(newPage);
                                                    router.reload({
                                                        data: {
                                                            renewal_search: renewalSearch,
                                                            renewal_page: newPage,
                                                            renewal_per_page: renewalPerPage,
                                                        },
                                                    });
                                                }}
                                                disabled={renewalPage === 1}
                                                className="h-8 px-3"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                {t('Previous')}
                                            </Button>
                                            <div className="flex items-center space-x-1">
                                                {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                                                    let pageNum;
                                                    if (lastPage <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (renewalPage <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (renewalPage >= lastPage - 2) {
                                                        pageNum = lastPage - 4 + i;
                                                    } else {
                                                        pageNum = renewalPage - 2 + i;
                                                    }

                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={renewalPage === pageNum ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => {
                                                                setRenewalPage(pageNum);
                                                                router.reload({
                                                                    data: {
                                                                        renewal_search: renewalSearch,
                                                                        renewal_page: pageNum,
                                                                        renewal_per_page: renewalPerPage,
                                                                    },
                                                                });
                                                            }}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const newPage = Math.min(lastPage, renewalPage + 1);
                                                    setRenewalPage(newPage);
                                                    router.reload({
                                                        data: {
                                                            renewal_search: renewalSearch,
                                                            renewal_page: newPage,
                                                            renewal_per_page: renewalPerPage,
                                                        },
                                                    });
                                                }}
                                                disabled={renewalPage === lastPage}
                                                className="h-8 px-3"
                                            >
                                                {t('Next')}
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-12 text-center">
                                <RefreshCw className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
                                <p className="text-sm text-muted-foreground">
                                    {renewalSearch ? t('No renewals found') : t('No renewals yet')}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {renewalSearch ? t('Try adjusting your search') : t('Create your first renewal')}
                                </p>
                            </div>
                        );
                    })()}
                </CardContent>
            </Card>

            <Dialog open={renewalDialogOpen} onOpenChange={setRenewalDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editRenewalId ? t('Edit Contract Renewal') : t('Add Contract Renewal')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="my-3 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label required>{t('Start Date')}</Label>
                                <DatePicker
                                    value={renewalData.start_date}
                                    onChange={(value) => setRenewalData({ ...renewalData, start_date: value })}
                                    placeholder={t('Select Start Date')}
                                    required
                                />
                                <InputError message={renewalErrors.start_date} />
                            </div>
                            <div>
                                <Label required>{t('End Date')}</Label>
                                <DatePicker
                                    value={renewalData.end_date}
                                    onChange={(value) => setRenewalData({ ...renewalData, end_date: value })}
                                    placeholder={t('Select End Date')}
                                    required
                                />
                                <InputError message={renewalErrors.end_date} />
                            </div>
                        </div>
                        <div>
                            <CurrencyInput
                                label={t('Value')}
                                value={renewalData.value}
                                onChange={(value) => setRenewalData({ ...renewalData, value: value })}
                                error={renewalErrors.value}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="status" required>
                                {t('Status')}
                            </Label>
                            <Select
                                value={renewalData.status}
                                onValueChange={(value) => setRenewalData({ ...renewalData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-muted" />
                                            {t('Draft')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-foreground" />
                                            {t('Pending')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-foreground" />
                                            {t('Approved')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="active">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-foreground" />
                                            {t('Active')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="expired">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-foreground" />
                                            {t('Expired')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-destructive" />
                                            {t('Cancelled')}
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={renewalErrors.status} />
                        </div>
                        <div>
                            <Label htmlFor="notes">{t('Notes')}</Label>
                            <Textarea
                                id="notes"
                                value={renewalData.notes}
                                onChange={(e) => setRenewalData({ ...renewalData, notes: e.target.value })}
                                placeholder={t('Enter Notes')}
                                rows={3}
                            />
                            <InputError message={renewalErrors.notes} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRenewalDialogOpen(false);
                                setEditRenewalId(null);
                                setRenewalData({ start_date: '', end_date: '', value: '', status: 'draft', notes: '' });
                                setRenewalErrors({});
                            }}
                        >
                            {t('Cancel')}
                        </Button>
                        <Button onClick={handleRenewalSubmit}>{editRenewalId ? t('Update') : t('Create')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRenewalDialogOpen} onOpenChange={setShowRenewalDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4" />
                            {t('Renewal Details')}
                        </DialogTitle>
                    </DialogHeader>
                    {getSelectedRenewal() && (
                        <div className="my-3 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-foreground">{t('Start Date')}</Label>
                                    <p className="mt-1 text-sm">{formatDate(getSelectedRenewal().start_date)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-foreground">{t('End Date')}</Label>
                                    <p className="mt-1 text-sm">{formatDate(getSelectedRenewal().end_date)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-foreground">{t('Value')}</Label>
                                    <p className="mt-1 text-sm">
                                        {getSelectedRenewal().value ? formatCurrency(getSelectedRenewal().value) : '-'}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-foreground">{t('Status')}</Label>
                                    <div className="mt-1">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <div
                                                className={`h-2.5 w-2.5 rounded-full ${
                                                    getSelectedRenewal().status === 'pending'
                                                        ? 'bg-muted/500'
                                                        : getSelectedRenewal().status === 'approved'
                                                          ? 'bg-muted/500'
                                                          : getSelectedRenewal().status === 'active'
                                                            ? 'bg-muted/500'
                                                            : getSelectedRenewal().status === 'expired'
                                                              ? 'bg-muted-foreground'
                                                              : getSelectedRenewal().status === 'rejected'
                                                                ? 'bg-muted/500'
                                                                : 'bg-muted-foreground'
                                                }`}
                                            />
                                            {t(getSelectedRenewal().status)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-foreground">{t('Created By')}</Label>
                                <p className="mt-1 text-sm">{getSelectedRenewal().creator?.name || '-'}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-foreground">{t('Created At')}</Label>
                                <p className="mt-1 text-sm">{formatDateTime(getSelectedRenewal().created_at)}</p>
                            </div>
                            {getSelectedRenewal().notes && (
                                <div>
                                    <Label className="text-sm font-medium text-foreground">{t('Notes')}</Label>
                                    <div className="mt-1 rounded-lg bg-muted/50 p-3">
                                        <p className="text-sm text-foreground">{getSelectedRenewal().notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRenewalDialogOpen(false);
                                setShowRenewalId(null);
                            }}
                        >
                            {t('Close')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
