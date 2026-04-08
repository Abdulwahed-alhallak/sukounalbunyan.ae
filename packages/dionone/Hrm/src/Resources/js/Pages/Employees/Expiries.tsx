import { Head, usePage, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Briefcase, FileText, ChevronRight } from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";

interface EmployeeMin {
    id: number;
    iqama_expiry_date: string | null;
    passport_expiry_date: string | null;
    user: { id: number; name: string } | null;
}

interface PageProps {
    expiringIqamas: EmployeeMin[];
    expiringPassports: EmployeeMin[];
    auth: any;
    [key: string]: any;
}

export default function Expiries() {
    const { t } = useTranslation();
    const { expiringIqamas, expiringPassports } = usePage<PageProps>().props;

    const renderExpiryList = (list: EmployeeMin[], type: 'iqama' | 'passport') => {
        if (!list || list.length === 0) {
            return (
                <div className="p-8 text-center bg-muted/20 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">{t('No expiring documents found in the next 60 days.')}</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {list.map(emp => {
                    const dateStr = type === 'iqama' ? emp.iqama_expiry_date : emp.passport_expiry_date;
                    if (!dateStr) return null;
                    
                    const dateObj = new Date(dateStr);
                    const daysLeft = differenceInDays(dateObj, new Date());
                    
                    let badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
                    if (daysLeft < 0) badgeColor = 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
                    else if (daysLeft <= 14) badgeColor = 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400';

                    return (
                        <div key={emp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 flex items-center justify-center rounded-full ${daysLeft < 0 ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{emp.user?.name || t('Unknown Employee')}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {t('Expires')}: <strong className="text-foreground">{new Date(dateStr).toLocaleDateString()}</strong> 
                                        <span className="mx-2">•</span> 
                                        {daysLeft < 0 ? t('Expired') : t('in')} {Math.abs(daysLeft)} {t('days')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={`${badgeColor} shadow-none`}>
                                    {daysLeft < 0 ? t('Expired') : daysLeft <= 14 ? t('Expiring Soon') : t('Needs Renewal')}
                                </Badge>
                                <Link href={route('hrm.employees.show', emp.id)} className="text-muted-foreground hover:text-primary transition-colors">
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Employees'), url: route('hrm.employees.index') }, { label: t('Document Expiries') }]} pageTitle={t('Document Expiry Dashboard')}>
            <Head title={t('Document Expiry Dashboard')} />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t('Document Expiry Alerts')}</h2>
                    <p className="text-muted-foreground text-sm">{t('Monitor upcoming expirations for critical employee documents within the next 60 days.')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-orange-200 shadow-sm overflow-hidden">
                        <div className="h-1 w-full bg-orange-400"></div>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <MapPin className="h-5 w-5 mr-2 text-orange-500" /> 
                                {t('Iqama / National ID Expiries')}
                                <Badge variant="secondary" className="ml-auto">{expiringIqamas.length}</Badge>
                            </CardTitle>
                            <CardDescription>{t('Residency documents requiring renewal')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderExpiryList(expiringIqamas, 'iqama')}
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200 shadow-sm overflow-hidden">
                        <div className="h-1 w-full bg-blue-400"></div>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Briefcase className="h-5 w-5 mr-2 text-blue-500" /> 
                                {t('Passport Expiries')}
                                <Badge variant="secondary" className="ml-auto">{expiringPassports.length}</Badge>
                            </CardTitle>
                            <CardDescription>{t('Passports requiring renewal')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderExpiryList(expiringPassports, 'passport')}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
