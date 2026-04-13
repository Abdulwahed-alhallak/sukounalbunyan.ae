import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { getImagePath } from '@/utils/helpers';
import { Plus, Edit, Trash2, Key, Users as UsersIcon, User as UserIcon, UserCheck, History, Lock } from "lucide-react";

interface LeaveBalanceData {
    employee_id: number;
    employee_name: string;
    leave_types: {
        leave_type_name: string;
        leave_type_color: string;
        total_days: number;
        used_days: number;
        available_days: number;
    }[];
}

interface LeaveBalanceIndexProps {
    leaveBalances: LeaveBalanceData[];
}

export default function Index() {
    const { t } = useTranslation();
    const { leaveBalances } = usePage<LeaveBalanceIndexProps>().props;


    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Hrm'), url: route('hrm.index') },
                { label: t('Leave Balance') }
            ]}
            pageTitle={t('Leave Balance')}
        >
            <Head title={t('Leave Balance')} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {leaveBalances?.map((employee) => (
                    <Card key={employee.employee_id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                                    {employee.avatar ? (
                                        <img
                                            src={getImagePath(employee.avatar)}
                                            alt={employee.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{employee.employee_name}</h3>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {/* Table Header */}
                            <div className="flex items-center justify-between p-2 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-muted-foreground">{t('Leave Type')}</span>
                                </div>
                                <div className="flex items-center gap-8 text-xs font-medium text-muted-foreground">
                                    <span className="w-12 text-center">{t('Total')}</span>
                                    <span className="w-12 text-center">{t('Used')}</span>
                                    <span className="w-16 text-center">{t('Available')}</span>
                                </div>
                            </div>

                            {/* Leave Type Rows */}
                            {employee.leave_types?.map((leaveType, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2">

                                        <span className="font-medium text-sm">{leaveType.leave_type_name}</span>
                                    </div>
                                    <div className="flex items-center gap-8 text-xs">
                                        <span className="w-12 text-center font-medium text-foreground">{leaveType.total_days}</span>
                                        <span className="w-12 text-center font-medium text-destructive">{leaveType.used_days}</span>
                                        <span className="w-16 text-center font-medium text-foreground">{leaveType.available_days}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}