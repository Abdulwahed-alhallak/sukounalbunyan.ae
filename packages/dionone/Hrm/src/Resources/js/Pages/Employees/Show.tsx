import { Head, usePage } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye } from 'lucide-react';
import { formatDate, getImagePath, getCurrencySymbol } from '@/utils/helpers';
import ModuleAttachments from "@/components/ModuleAttachments";
import { router } from "@inertiajs/react";

function Field({ label, value, dir }: { label: string; value: any; dir?: string }) {
    return (
        <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="font-medium" dir={dir}>{value || '-'}</p>
        </div>
    );
}

export default function Show() {
    const { employee, attendances = [], leaveApplications = [], assets = [], violations = [], onboardings = [], contracts = [] } = usePage<any>().props;
    const { t } = useTranslation();

    const statusColors: any = {
        'Active': 'bg-muted text-foreground',
        'Resigned': 'bg-muted text-destructive',
        'Terminated': 'bg-muted text-destructive',
        'Transferred': 'bg-muted text-foreground',
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Employees'), url: route('hrm.employees.index') },
                { label: t('View Employee') }
            ]}
            pageTitle={t('Employee Details')}
        >
            <Head title={t('Employee Details')} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar - Profile */}
                <div className="lg:col-span-1">
                    <Card className="shadow-sm">
                        <CardContent className="p-6 text-center">
                            <div className="mb-4">
                                <img 
                                    src={employee.user?.avatar ? getImagePath(employee.user.avatar) : getImagePath('avatar.png')} 
                                    alt={employee.user?.name || 'Employee'}
                                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-border"
                                    onError={(e) => { e.currentTarget.src = getImagePath('avatar.png'); }}
                                />
                            </div>
                            <h3 className="text-xl font-semibold mb-1">{employee.user?.name}</h3>
                            {employee.name_ar && <p className="text-lg text-muted-foreground mb-1" dir="rtl">{employee.name_ar}</p>}
                            <p className="text-muted-foreground text-sm mb-2">{employee.user?.email}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[employee.employee_status as keyof typeof statusColors] || 'bg-muted text-foreground'}`}>
                                {employee.employee_status || 'Active'}
                            </span>
                            
                            <div className="space-y-3 text-left mt-6">
                                <Field label={t('Employee ID')} value={employee.employee_id} />
                                {employee.application_id && <Field label={t('Application ID')} value={employee.application_id} />}
                                <Field label={t('Job Title')} value={employee.job_title} />
                                {employee.job_title_ar && <Field label={t('Job Title (AR)')} value={employee.job_title_ar} dir="rtl" />}
                                <Field label={t('Nationality')} value={employee.nationality} />
                                <Field label={t('Work Area')} value={employee.allocated_area} />
                                <Field label={t('Basic Salary')} value={employee.basic_salary ? `${Number(employee.basic_salary).toLocaleString()} SAR` : null} />
                                <Field label={t('Payment Method')} value={employee.payment_method} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Content - Tabs */}
                <div className="lg:col-span-3">
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <Tabs defaultValue="personal" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 h-auto py-2 gap-2 bg-transparent justify-items-stretch">
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="personal">{t('Personal')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="contact">{t('Contact')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="employment">{t('Employment')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="identity">{t('Identity')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="banking">{t('Banking')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="insurance">{t('Insurance')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="documents">{t('Documents')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="contracts">{t('Contracts')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="attendance">{t('Attendance')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="leave">{t('Leave')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="assets">{t('Assets')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="violations">{t('Violations')}</TabsTrigger>
                                    <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 shadow-sm border border-transparent data-[state=active]:border-border" value="onboarding">{t('Onboarding')}</TabsTrigger>
                                </TabsList>

                                {/* Personal Information */}
                                <TabsContent value="personal" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Personal Information')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Field label={t('Full Name')} value={employee.user?.name} />
                                        <Field label={t('Arabic Name')} value={employee.name_ar} dir="rtl" />
                                        <Field label={t('Date of Birth')} value={formatDate(employee.date_of_birth)} />
                                        <Field label={t('Gender')} value={employee.gender} />
                                        <Field label={t('Nationality')} value={employee.nationality} />
                                        <Field label={t('Marital Status')} value={employee.marital_status} />
                                        {employee.marital_status2 && <Field label={t('Marital Status 2')} value={employee.marital_status2} />}
                                        <Field label={t('Place of Birth')} value={employee.place_of_birth} />
                                        <Field label={t('Religion')} value={employee.religion} />
                                        <Field label={t('No. of Dependents')} value={employee.no_of_dependents} />
                                        <Field label={t('Blood Type')} value={employee.blood_type} />
                                    </div>
                                    <h4 className="font-semibold text-lg border-b pb-2 mt-8">{t('Education & Skills')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Field label={t('Education Level')} value={employee.education_level} />
                                        <Field label={t('University')} value={employee.university} />
                                        <Field label={t('Major / Field')} value={employee.major_field} />
                                        <Field label={t('Graduation Year')} value={employee.graduation_year} />
                                        <Field label={t('Total Experience (Years)')} value={employee.total_experience_years} />
                                        <Field label={t('Computer Skills')} value={employee.computer_skills} />
                                        <Field label={t('English Level')} value={employee.english_level} />
                                        <Field label={t('Arabic Level')} value={employee.arabic_level} />
                                        <Field label={t('Other Languages')} value={employee.other_languages} />
                                    </div>
                                </TabsContent>

                                {/* Contact Information */}
                                <TabsContent value="contact" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Contact Information')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Field label={t('Mobile No.')} value={employee.mobile_no} />
                                        <Field label={t('Alternate Mobile')} value={employee.alternate_mobile_no} />
                                        <Field label={t('Email Address')} value={employee.email_address} />
                                        <Field label={t('Work Email')} value={employee.work_email} />
                                        <Field label={t('Place of Residence')} value={employee.place_of_residence} />
                                        <Field label={t('Address')} value={employee.address_line_1} />
                                        <Field label={t('Resident Type')} value={employee.resident_type} />
                                    </div>
                                    <h4 className="font-semibold text-lg border-b pb-2 mt-8">{t('Emergency Contact')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Field label={t('Contact Name')} value={employee.emergency_contact_name} />
                                        <Field label={t('Relationship')} value={employee.emergency_contact_relationship} />
                                        <Field label={t('Contact Number')} value={employee.emergency_contact_number} />
                                    </div>
                                </TabsContent>

                                {/* Employment Details */}
                                <TabsContent value="employment" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Employment Details')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Field label={t('Employee ID')} value={employee.employee_id} />
                                        <Field label={t('Job Title')} value={employee.job_title} />
                                        <Field label={t('Job Title (AR)')} value={employee.job_title_ar} dir="rtl" />
                                        <Field label={t('Occupation')} value={employee.occupation} />
                                        <Field label={t('Employer Number')} value={employee.employer_number} />
                                        <Field label={t('Work Area')} value={employee.allocated_area} />
                                        <Field label={t('Joining Date')} value={formatDate(employee.date_of_joining)} />
                                        <Field label={t('GOSI Joining Date')} value={formatDate(employee.gosi_joining_date)} />
                                        <Field label={t('Line Manager')} value={employee.line_manager} />
                                        <Field label={t('Status')} value={
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[employee.employee_status as keyof typeof statusColors] || 'bg-muted text-foreground'}`}>
                                                {employee.employee_status}
                                            </span>
                                        } />
                                        <Field label={t('OCT Active')} value={employee.oct_active ? 'Yes' : 'No'} />
                                        <Field label={t('JISR Active')} value={employee.jisr_active ? 'Yes' : 'No'} />
                                        <Field label={t('List Type')} value={employee.list_type} />
                                    </div>
                                    {employee.notes && (
                                        <>
                                            <h4 className="font-semibold text-lg border-b pb-2 mt-8">{t('Notes')}</h4>
                                            <p className="text-sm bg-muted/50 p-4 rounded-lg">{employee.notes}</p>
                                        </>
                                    )}
                                </TabsContent>

                                {/* Identity Documents */}
                                <TabsContent value="identity" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Identity Documents')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Field label={t('ID/Iqama No.')} value={employee.iqama_no} />
                                        <Field label={t('Passport No.')} value={employee.passport_no} />
                                        <Field label={t('Iqama Issue Date')} value={formatDate(employee.iqama_issue_date)} />
                                        <Field label={t('Iqama Expiry Date')} value={formatDate(employee.iqama_expiry_date)} />
                                        <Field label={t('Passport Expiry Date')} value={formatDate(employee.passport_expiry_date)} />
                                    </div>
                                </TabsContent>

                                {/* Banking */}
                                <TabsContent value="banking" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Salary & Payment')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Field label={t('Basic Salary')} value={employee.basic_salary ? `${Number(employee.basic_salary).toLocaleString()} SAR` : null} />
                                        <Field label={t('Payment Method')} value={employee.payment_method} />
                                    </div>
                                    <h4 className="font-semibold text-lg border-b pb-2 mt-8">{t('Bank Details')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Field label={t('Bank Name')} value={employee.bank_name} />
                                        <Field label={t('Account Holder')} value={employee.account_holder_name} />
                                        <Field label={t('Bank IBAN')} value={employee.bank_iban} />
                                        <Field label={t('SWIFT Code')} value={employee.swift_code} />
                                    </div>
                                </TabsContent>

                                {/* Insurance */}
                                <TabsContent value="insurance" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Insurance Information')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Field label={t('Insurance Status')} value={employee.insurance_status} />
                                        <Field label={t('Insurance Class')} value={employee.insurance_class} />
                                        <Field label={t('Sponsor ID')} value={employee.sponsor_id} />
                                    </div>
                                </TabsContent>

                                {/* Documents */}
                                <TabsContent value="documents" className="space-y-6 mt-6">
                                    <ModuleAttachments 
                                        moduleId={employee.id}
                                        attachments={employee.attachments || []}
                                        deleteRoute="hrm.employees.attachments.destroy"
                                        onRefresh={() => router.reload()}
                                    />
                                </TabsContent>
                                {/* Contracts */}
                                <TabsContent value="contracts" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Employee Contracts')}</h4>
                                    {contracts && contracts.length > 0 ? (
                                        <div className="rounded-lg border overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/50 border-b">
                                                    <tr>
                                                        <th className="p-3 text-left">{t('Type')}</th>
                                                        <th className="p-3 text-left">{t('Start Date')}</th>
                                                        <th className="p-3 text-left">{t('End Date')}</th>
                                                        <th className="p-3 text-left">{t('Salary')}</th>
                                                        <th className="p-3 text-left">{t('Status')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {contracts.map((c: any) => (
                                                        <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                                                            <td className="p-3 font-medium">{t(c.contract_type)}</td>
                                                            <td className="p-3">{formatDate(c.start_date)}</td>
                                                            <td className="p-3">{c.end_date ? formatDate(c.end_date) : '-'}</td>
                                                            <td className="p-3">{c.basic_salary ? `${Number(c.basic_salary).toLocaleString()} ${getCurrencySymbol()}` : '-'}</td>
                                                            <td className="p-3"><Badge>{t(c.status)}</Badge></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p className="text-muted-foreground">{t('No contracts found.')}</p>}
                                </TabsContent>

                                {/* Attendance */}
                                <TabsContent value="attendance" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Attendance History')}</h4>
                                    {attendances.length > 0 ? (
                                        <div className="rounded-lg border overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/50 border-b">
                                                    <tr><th className="p-3 text-left">{t('Date')}</th><th className="p-3 text-left">{t('Clock In')}</th><th className="p-3 text-left">{t('Clock Out')}</th><th className="p-3 text-left">{t('Status')}</th></tr>
                                                </thead>
                                                <tbody>
                                                    {attendances.map((a: any) => (
                                                        <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                                                            <td className="p-3">{formatDate(a.date)}</td>
                                                            <td className="p-3">{a.clock_in || '-'}</td>
                                                            <td className="p-3">{a.clock_out || '-'}</td>
                                                            <td className="p-3"><Badge>{t(a.status || 'Present')}</Badge></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p className="text-muted-foreground">{t('No attendance records found.')}</p>}
                                </TabsContent>

                                {/* Leave */}
                                <TabsContent value="leave" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Leave Applications')}</h4>
                                    {leaveApplications.length > 0 ? (
                                        <div className="rounded-lg border overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/50 border-b">
                                                    <tr><th className="p-3 text-left">{t('Type')}</th><th className="p-3 text-left">{t('Duration')}</th><th className="p-3 text-left">{t('Days')}</th><th className="p-3 text-left">{t('Status')}</th></tr>
                                                </thead>
                                                <tbody>
                                                    {leaveApplications.map((l: any) => (
                                                        <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30">
                                                            <td className="p-3">{l.leave_type?.title || '-'}</td>
                                                            <td className="p-3">{formatDate(l.start_date)} - {formatDate(l.end_date)}</td>
                                                            <td className="p-3">{l.total_leave_days}</td>
                                                            <td className="p-3"><Badge>{t(l.status)}</Badge></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p className="text-muted-foreground">{t('No leave applications found.')}</p>}
                                </TabsContent>

                                {/* Assets */}
                                <TabsContent value="assets" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Company Assets')}</h4>
                                    {assets.length > 0 ? (
                                        <div className="rounded-lg border overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/50 border-b">
                                                    <tr><th className="p-3 text-left">{t('Asset Name')}</th><th className="p-3 text-left">{t('Type')}</th><th className="p-3 text-left">{t('Serial No')}</th><th className="p-3 text-left">{t('Status')}</th></tr>
                                                </thead>
                                                <tbody>
                                                    {assets.map((a: any) => (
                                                        <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                                                            <td className="p-3 font-medium">{a.asset_name}</td>
                                                            <td className="p-3">{a.asset_type}</td>
                                                            <td className="p-3">{a.serial_number || '-'}</td>
                                                            <td className="p-3"><Badge>{t(a.status)}</Badge></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p className="text-muted-foreground">{t('No assets assigned.')}</p>}
                                </TabsContent>

                                {/* Violations */}
                                <TabsContent value="violations" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Violations & Disciplinary')}</h4>
                                    {violations.length > 0 ? (
                                        <div className="rounded-lg border overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/50 border-b">
                                                    <tr><th className="p-3 text-left">{t('Violation Type')}</th><th className="p-3 text-left">{t('Date')}</th><th className="p-3 text-left">{t('Severity')}</th><th className="p-3 text-left">{t('Deduction')}</th></tr>
                                                </thead>
                                                <tbody>
                                                    {violations.map((v: any) => (
                                                        <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30">
                                                            <td className="p-3 font-medium">{v.violation_type?.name || '-'}</td>
                                                            <td className="p-3">{formatDate(v.violation_date)}</td>
                                                            <td className="p-3"><Badge variant="outline">{t(v.violation_type?.severity || '-')}</Badge></td>
                                                            <td className="p-3 text-destructive font-semibold">-{Number(v.deduction_amount).toLocaleString()} SAR</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p className="text-muted-foreground text-emerald-600">{t('No violations found. Excellent record!')}</p>}
                                </TabsContent>

                                {/* Onboarding */}
                                <TabsContent value="onboarding" className="space-y-6 mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2">{t('Onboarding Progress')}</h4>
                                    {onboardings.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {onboardings.map((o: any) => (
                                                <Card key={o.id} className="p-4 shadow-none bg-muted/30">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div><p className="font-medium">{t('Onboarding Plan')}</p><p className="text-xs text-muted-foreground">{t('Due:')} {formatDate(o.due_date)}</p></div>
                                                        <Badge>{t(o.status)}</Badge>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {(typeof o.checklist_items === 'string' ? JSON.parse(o.checklist_items || '[]') : (o.checklist_items || [])).map((item: any, i: number) => (
                                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                                <input type="checkbox" checked={item.completed} readOnly className="w-4 h-4 rounded text-primary" />
                                                                <span className={item.completed ? 'line-through text-muted-foreground' : ''}>{item.task}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : <p className="text-muted-foreground">{t('No onboarding plan found.')}</p>}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}