import { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Save } from 'lucide-react';
import SystemSetupSidebar from '../SystemSetupSidebar';
import { WorkingDaysIndexProps } from './types';

export default function Index() {
    const { t } = useTranslation();
    const { workingDays, auth } = usePage<WorkingDaysIndexProps>().props;

    const daysOfWeek = [
        { key: 'monday', label: t('Monday') },
        { key: 'tuesday', label: t('Tuesday') },
        { key: 'wednesday', label: t('Wednesday') },
        { key: 'thursday', label: t('Thursday') },
        { key: 'friday', label: t('Friday') },
        { key: 'saturday', label: t('Saturday') },
        { key: 'sunday', label: t('Sunday') },
    ];

    const { data, setData, put, processing } = useForm({
        working_days: workingDays || [],
    });

    const handleDayChange = (day: string, checked: boolean) => {
        if (checked) {
            setData('working_days', [...data.working_days, day]);
        } else {
            setData(
                'working_days',
                data.working_days.filter((d) => d !== day)
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('hrm.working-days.update'));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Hrm'), url: route('hrm.index') },
                { label: t('System Setup') },
                { label: t('Working Days') },
            ]}
            pageTitle={t('System Setup')}
        >
            <Head title={t('Working Days')} />

            <div className="flex flex-col gap-8 md:flex-row">
                <div className="flex-shrink-0 md:w-64">
                    <SystemSetupSidebar activeItem="working-days" />
                </div>

                <div className="flex-1">
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-medium">
                                    <Clock className="h-5 w-5" />
                                    {t('Working Days')}
                                </h3>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        {t(
                                            'Select the days of the week that are considered working days for your organization.'
                                        )}
                                    </p>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {daysOfWeek?.map((day) => (
                                            <div
                                                key={day.key}
                                                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
                                            >
                                                <Checkbox
                                                    id={day.key}
                                                    checked={data.working_days.includes(day.key)}
                                                    onCheckedChange={(checked) =>
                                                        handleDayChange(day.key, checked as boolean)
                                                    }
                                                />
                                                <label
                                                    htmlFor={day.key}
                                                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {day.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {auth.user?.permissions?.includes('edit-working-days') && (
                                        <div className="flex justify-end pt-4">
                                            <Button
                                                type="submit"
                                                disabled={processing || data.working_days.length === 0}
                                                className="flex items-center gap-2"
                                            >
                                                {processing ? t('Saving...') : t('Save')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
