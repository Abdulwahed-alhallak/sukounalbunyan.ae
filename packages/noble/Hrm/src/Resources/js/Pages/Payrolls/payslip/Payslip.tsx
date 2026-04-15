import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting, getImagePath } from '@/utils/helpers';

interface PayrollEntry {
    id: number;
    employee: {
        id: number;
        name: string;
        email: string;
        user: {
            name: string;
            email: string;
        };
    };
    payroll: {
        id: number;
        title: string;
        pay_period_start: string;
        pay_period_end: string;
        pay_date: string;
    };
    basic_salary: number;
    total_allowances: number;
    total_manual_overtimes: number;
    total_deductions: number;
    total_loans: number;
    gross_pay: number;
    net_pay: number;
    attendance_overtime_amount: number;
    attendance_overtime_rate: number;
    working_days: number;
    present_days: number;
    half_days: number;
    absent_days: number;
    paid_leave_days: number;
    unpaid_leave_days: number;
    manual_overtime_hours: number;
    attendance_overtime_hours: number;
    overtime_hours: number;
    per_day_salary: number;
    unpaid_leave_deduction: number;
    half_day_deduction: number;
    absent_day_deduction: number;
    allowances_breakdown: Record<string, number>;
    deductions_breakdown: Record<string, number>;
    manual_overtimes_breakdown: Record<string, number>;
    loans_breakdown: Record<string, number>;
}

interface PayslipProps {
    [key: string]: any;
    payrollEntry: PayrollEntry;
}

export default function Payslip() {
    const { t } = useTranslation();
    const { payrollEntry } = usePage<PayslipProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'pdf') {
            downloadPDF();
        }
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);

        const printContent = document.querySelector('.payslip-container');
        if (printContent) {
            const opt = {
                margin: 0.25,
                filename: `payslip-${payrollEntry.employee?.user?.name || payrollEntry.employee?.name}-${formatDate(payrollEntry.payroll.pay_period_start)}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const },
            };

            try {
                await html2pdf()
                    .set(opt)
                    .from(printContent as HTMLElement)
                    .save();
                setTimeout(() => window.close(), 1000);
            } catch (error) {
                console.error('PDF generation failed:', error);
            }
        }

        setIsDownloading(false);
    };

    const employeeName = payrollEntry.employee?.user?.name || payrollEntry.employee?.name;
    const employeeEmail = payrollEntry.employee?.user?.email || payrollEntry.employee?.email;

    return (
        <div className="min-h-screen bg-card">
            <Head title={t('Payslip')} />

            {isDownloading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50">
                    <div className="rounded-lg bg-card p-6 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"></div>
                            <p className="text-lg font-semibold text-foreground">{t('Generating PDF...')}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="payslip-container mx-auto max-w-4xl bg-card p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{payrollEntry.payroll.title}</h1>
                    </div>
                    <div className="text-end">
                        <h1 className="text-xl font-bold">{getCompanySetting('company_name') || 'YOUR COMPANY'}</h1>
                        <p className="text-sm text-muted-foreground">{getCompanySetting('company_address')}</p>
                    </div>
                </div>

                {/* Main Payslip Container */}
                <div className="border-2 border-black">
                    {/* Employee Details Grid */}
                    <div className="p-1 ps-1">
                        <div className="mb-4 grid grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">{t('Name')} :</span>
                                <span>{employeeName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">{t('Designation')} :</span>
                                <span>{payrollEntry.employee?.designation?.designation_name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">{t('Working Days')} :</span>
                                <span>{payrollEntry.working_days}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">{t('Employee ID')} :</span>
                                <span>{payrollEntry.employee.employee_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">{t('Days Worked')} :</span>
                                <span>{payrollEntry.present_days}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">{t('Bank Name')} :</span>
                                <span>{payrollEntry.employee?.bank_name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">{t('Paid Leave')} :</span>
                                <span>{payrollEntry.paid_leave_days}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">{t('Bank A/C No')} :</span>
                                <span>{payrollEntry.employee?.account_number || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">{t('Unpaid Leave')} :</span>
                                <span>{payrollEntry.unpaid_leave_days}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">{t('IFSC No')} :</span>
                                <span>{payrollEntry.employee?.ifsc_code || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Earnings and Deductions Table */}
                        <div className="mt-1 grid grid-cols-2 gap-0 border border-black">
                            {/* Earnings Column */}
                            <div className="border-e border-black">
                                <div className="border-b border-black bg-muted px-3 py-2">
                                    <h3 className="font-bold">{t('Earnings')}</h3>
                                </div>
                                <div className="space-y-1 p-3">
                                    <div className="flex justify-between">
                                        <span>{t('Basic Salary')}</span>
                                        <span>{formatCurrency(payrollEntry.basic_salary)}</span>
                                    </div>

                                    {/* Allowances Section */}
                                    {Object.keys(payrollEntry.allowances_breakdown || {}).length > 0 && (
                                        <>
                                            <div className="pt-1 text-xs font-semibold text-muted-foreground">
                                                {t('Allowances')}:
                                            </div>
                                            {Object.entries(payrollEntry.allowances_breakdown || {})?.map(
                                                ([name, amount]) => (
                                                    <div key={name} className="flex justify-between ps-2">
                                                        <span className="text-sm">{name}</span>
                                                        <span className="text-sm">
                                                            {formatCurrency(Number(amount))}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </>
                                    )}

                                    {/* Manual Overtime Section */}
                                    {Object.keys(payrollEntry.manual_overtimes_breakdown || {}).length > 0 && (
                                        <>
                                            <div className="pt-1 text-xs font-semibold text-muted-foreground">
                                                {t('Manual Overtime')}:
                                            </div>
                                            {Object.entries(payrollEntry.manual_overtimes_breakdown || {})?.map(
                                                ([name, amount]) => (
                                                    <div key={name} className="flex justify-between ps-2">
                                                        <span className="text-sm">{name}</span>
                                                        <span className="text-sm">
                                                            {formatCurrency(Number(amount))}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </>
                                    )}

                                    {/* Attendance Overtime Section */}
                                    {payrollEntry.attendance_overtime_amount > 0 && (
                                        <>
                                            <div className="pt-1 text-xs font-semibold text-muted-foreground">
                                                {t('Attendance Overtime')}:
                                            </div>
                                            <div className="flex justify-between ps-2">
                                                <span className="text-sm">
                                                    {t('OT Hours')} ({payrollEntry.attendance_overtime_hours}h)
                                                </span>
                                                <span className="text-sm">
                                                    {formatCurrency(payrollEntry.attendance_overtime_amount)}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Deductions Column */}
                            <div>
                                <div className="border-b border-black bg-muted px-3 py-2">
                                    <h3 className="font-bold">{t('Deduction')}</h3>
                                </div>
                                <div className="space-y-1 p-3">
                                    {/* Leave Deductions Section */}
                                    {(payrollEntry.unpaid_leave_deduction > 0 ||
                                        payrollEntry.half_day_deduction > 0 ||
                                        payrollEntry.absent_day_deduction > 0) && (
                                        <>
                                            <div className="text-xs font-semibold text-muted-foreground">
                                                {t('Leave Deductions')}:
                                            </div>
                                            {payrollEntry.unpaid_leave_deduction > 0 && (
                                                <div className="flex justify-between ps-2">
                                                    <span className="text-sm">
                                                        {t('Unpaid Leave')} ({payrollEntry.unpaid_leave_days}d)
                                                    </span>
                                                    <span className="text-sm">
                                                        {formatCurrency(payrollEntry.unpaid_leave_deduction)}
                                                    </span>
                                                </div>
                                            )}
                                            {payrollEntry.half_day_deduction > 0 && (
                                                <div className="flex justify-between ps-2">
                                                    <span className="text-sm">
                                                        {t('Half Days')} ({payrollEntry.half_days}d)
                                                    </span>
                                                    <span className="text-sm">
                                                        {formatCurrency(payrollEntry.half_day_deduction)}
                                                    </span>
                                                </div>
                                            )}
                                            {payrollEntry.absent_day_deduction > 0 && (
                                                <div className="flex justify-between ps-2">
                                                    <span className="text-sm">
                                                        {t('Absent Days')} ({payrollEntry.absent_days}d)
                                                    </span>
                                                    <span className="text-sm">
                                                        {formatCurrency(payrollEntry.absent_day_deduction)}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Other Deductions Section */}
                                    {Object.keys(payrollEntry.deductions_breakdown || {}).length > 0 && (
                                        <>
                                            <div className="pt-1 text-xs font-semibold text-muted-foreground">
                                                {t('Other Deductions')}:
                                            </div>
                                            {Object.entries(payrollEntry.deductions_breakdown || {})?.map(
                                                ([name, amount]) => (
                                                    <div key={name} className="flex justify-between ps-2">
                                                        <span className="text-sm">{name}</span>
                                                        <span className="text-sm">
                                                            {formatCurrency(Number(amount))}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </>
                                    )}

                                    {/* Loans Section */}
                                    {Object.keys(payrollEntry.loans_breakdown || {}).length > 0 && (
                                        <>
                                            <div className="pt-1 text-xs font-semibold text-muted-foreground">
                                                {t('Loans')}:
                                            </div>
                                            {Object.entries(payrollEntry.loans_breakdown || {})?.map(
                                                ([name, amount]) => (
                                                    <div key={name} className="flex justify-between ps-2">
                                                        <span className="text-sm">{name}</span>
                                                        <span className="text-sm">
                                                            {formatCurrency(Number(amount))}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Gross Pay and Net Pay Summary */}
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between px-3 py-3">
                                <span>
                                    <span className="font-bold">{t('Gross Pay')}</span> (Basic + Allowances + Overtimes
                                    - Leave Deductions)
                                </span>
                                <span className="font-bold">{formatCurrency(payrollEntry.gross_pay)}</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-3">
                                <span>
                                    <span className="font-bold">{t('Net Pay')}</span> (Gross - Deductions)
                                </span>
                                <span className="font-bold">{formatCurrency(payrollEntry.net_pay)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Net Salary Box */}
                <div className="mt-4 w-48">
                    <div className="flex min-h-[4rem] items-center justify-center rounded-lg border border-black bg-card p-3 text-center">
                        <div>
                            <div className="text-sm text-black">{t('Net Salary')}</div>
                            <div className="text-xl font-bold text-black">{formatCurrency(payrollEntry.net_pay)}</div>
                        </div>
                    </div>
                </div>

                {/* Footer with Company Details */}
                <div className="mt-6 flex items-end justify-between">
                    <div className="flex-1 text-center">
                        <p className="text-xs text-muted-foreground">
                            {t('This is a computer generated payslip and does not require signature.')}
                        </p>
                    </div>
                    <div className="max-w-xs text-end text-sm text-muted-foreground">
                        <div className="font-semibold">{getCompanySetting('company_name') || 'YOUR COMPANY'}</div>
                        {getCompanySetting('company_address') && <div>{getCompanySetting('company_address')}</div>}
                        {(getCompanySetting('company_city') ||
                            getCompanySetting('company_state') ||
                            getCompanySetting('company_zipcode')) && (
                            <div>
                                {getCompanySetting('company_city')}
                                {getCompanySetting('company_state') && `, ${getCompanySetting('company_state')}`}{' '}
                                {getCompanySetting('company_zipcode')}
                            </div>
                        )}
                        {getCompanySetting('company_country') && <div>{getCompanySetting('company_country')}</div>}
                        {getCompanySetting('company_telephone') && (
                            <div>
                                {t('Ph')}: {getCompanySetting('company_telephone')}
                            </div>
                        )}
                        {getCompanySetting('company_email') && <div>{getCompanySetting('company_email')}</div>}
                    </div>
                </div>
            </div>

            <style>{`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.25in;
                    size: A4;
                }

                .payslip-container {
                    max-width: 100%;
                    margin: 0;
                    box-shadow: none;
                }

                @media print {
                    body {
                        background: hsl(var(--card));
                    }

                    .payslip-container {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}
