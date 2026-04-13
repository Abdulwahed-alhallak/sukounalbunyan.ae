import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/ui/input-error';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PhoneInputComponent } from '@/components/ui/phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaPicker from '@/components/MediaPicker';
import ModuleAttachments from '@/components/ModuleAttachments';
import { EditEmployeeFormData } from './types';
import { useEffect, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { getImagePath } from '@/utils/helpers';
import { useFormFields } from '@/hooks/useFormFields';

export default function Edit() {
    const {
        employee,
        users = [],
        branches = [],
        departments = [],
        designations = [],
        shifts,
        existingDocuments,
        documentTypes,
    } = usePage<any>().props;
    const [activeTab, setActiveTab] = useState('personal');
    const [filteredBranches, setFilteredBranches] = useState(branches || []);
    const [filteredDepartments, setFilteredDepartments] = useState(departments || []);
    const [filteredDesignations, setFilteredDesignations] = useState(designations || []);
    const { t } = useTranslation();

    const { data, setData, put, processing, errors } = useForm<EditEmployeeFormData>({
        employee_id: employee.employee_id ?? '',
        application_id: employee.application_id ?? '',
        name_ar: employee.name_ar ?? '',
        date_of_birth: employee.date_of_birth || '',
        gender: employee.gender || 'Male',
        nationality: employee.nationality ?? '',
        marital_status: employee.marital_status ?? '',
        marital_status2: employee.marital_status2 ?? '',
        place_of_birth: employee.place_of_birth ?? '',
        religion: employee.religion ?? '',
        no_of_dependents: employee.no_of_dependents?.toString() || '',
        blood_type: employee.blood_type ?? '',
        shift_id: employee.shift?.toString() || '',
        date_of_joining: employee.date_of_joining || '',
        employment_type: employee.employment_type || 'Full Time',
        employer_number: employee.employer_number ?? '',
        occupation: employee.occupation ?? '',
        job_title: employee.job_title ?? '',
        job_title_ar: employee.job_title_ar ?? '',
        allocated_area: employee.allocated_area ?? '',
        line_manager: employee.line_manager ?? '',
        gosi_joining_date: employee.gosi_joining_date || '',
        employee_status: employee.employee_status ?? '',
        list_type: employee.list_type ?? '',
        notes: employee.notes ?? '',
        mobile_no: employee.mobile_no ?? '',
        alternate_mobile_no: employee.alternate_mobile_no ?? '',
        email_address: employee.email_address ?? '',
        work_email: employee.work_email ?? '',
        place_of_residence: employee.place_of_residence ?? '',
        resident_type: employee.resident_type ?? '',
        address_line_1: employee.address_line_1 ?? '',
        address_line_2: employee.address_line_2 ?? '',
        city: employee.city ?? '',
        state: employee.state ?? '',
        country: employee.country ?? '',
        postal_code: employee.postal_code ?? '',
        emergency_contact_name: employee.emergency_contact_name ?? '',
        emergency_contact_relationship: employee.emergency_contact_relationship ?? '',
        emergency_contact_number: employee.emergency_contact_number ?? '',
        iqama_no: employee.iqama_no ?? '',
        iqama_issue_date: employee.iqama_issue_date || '',
        iqama_expiry_date: employee.iqama_expiry_date || '',
        passport_no: employee.passport_no ?? '',
        passport_expiry_date: employee.passport_expiry_date || '',
        bank_name: employee.bank_name ?? '',
        account_holder_name: employee.account_holder_name ?? '',
        account_number: employee.account_number ?? '',
        bank_identifier_code: employee.bank_identifier_code ?? '',
        bank_branch: employee.bank_branch ?? '',
        bank_iban: employee.bank_iban ?? '',
        swift_code: employee.swift_code ?? '',
        tax_payer_id: employee.tax_payer_id ?? '',
        basic_salary: employee.basic_salary?.toString() || '',
        payment_method: employee.payment_method ?? '',
        hours_per_day: employee.hours_per_day?.toString() || '',
        days_per_week: employee.days_per_week?.toString() || '',
        rate_per_hour: employee.rate_per_hour?.toString() || '',
        insurance_status: employee.insurance_status ?? '',
        insurance_class: employee.insurance_class ?? '',
        sponsor_id: employee.sponsor_id ?? '',
        education_level: employee.education_level ?? '',
        university: employee.university ?? '',
        major_field: employee.major_field ?? '',
        graduation_year: employee.graduation_year ?? '',
        total_experience_years: employee.total_experience_years?.toString() || '',
        computer_skills: employee.computer_skills ?? '',
        english_level: employee.english_level ?? '',
        arabic_level: employee.arabic_level ?? '',
        other_languages: employee.other_languages ?? '',
        user_id: employee.user_id?.toString() || '',
        branch_id: employee.branch_id?.toString() || '',
        department_id: employee.department_id?.toString() || '',
        designation_id: employee.designation_id?.toString() || '',
        attachment_ids: [],
    });

    useEffect(() => {
        setFilteredBranches(branches || []);
    }, [data.user_id]);

    useEffect(() => {
        if (data.branch_id) {
            const branchDepartments = departments.filter((dept: any) => dept.branch_id.toString() === data.branch_id);
            setFilteredDepartments(branchDepartments);
        } else {
            setFilteredDepartments([]);
        }
    }, [data.branch_id]);

    useEffect(() => {
        if (data.department_id) {
            const departmentDesignations = designations.filter(
                (desig: any) => desig.department_id.toString() === data.department_id
            );
            setFilteredDesignations(departmentDesignations);
        } else {
            setFilteredDesignations([]);
        }
    }, [data.department_id]);

    const addDocument = () => {
        setData('documents', [...data.documents, { document_type_id: '', file: '' }]);
    };

    const removeDocument = (index: number) => {
        const newDocuments = data.documents.filter((_: any, i: number) => i !== index);
        setData('documents', newDocuments);
    };

    const updateDocument = (index: number, field: string, value: any) => {
        const newDocuments = [...data.documents];
        newDocuments[index] = { ...newDocuments[index], [field]: value };
        setData('documents', newDocuments);
    };

    const biometricFields = useFormFields('biometricEmployeeIdFields', data, setData, errors, 'edit');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('hrm.employees.update', employee.id));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Hrm'), url: route('hrm.index') },
                { label: t('Employees'), url: route('hrm.employees.index') },
                { label: t('Edit') },
            ]}
            pageTitle={t('Edit Employee')}
        >
            <Head title={t('Edit Employee')} />

            <Card className="shadow-sm">
                <CardContent>
                    <form onSubmit={submit} className="pt-5">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-8">
                                <TabsTrigger value="personal">{t('Personal')}</TabsTrigger>
                                <TabsTrigger value="employment">{t('Employment')}</TabsTrigger>
                                <TabsTrigger value="contact">{t('Contact')}</TabsTrigger>
                                <TabsTrigger value="identity">{t('Identity')}</TabsTrigger>
                                <TabsTrigger value="banking">{t('Banking')}</TabsTrigger>
                                <TabsTrigger value="insurance">{t('Insurance')}</TabsTrigger>
                                <TabsTrigger value="education">{t('Education')}</TabsTrigger>
                                <TabsTrigger value="documents">{t('Documents')}</TabsTrigger>
                            </TabsList>

                            {/* Personal Tab */}
                            <TabsContent value="personal" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                    <div>
                                        <Label htmlFor="employee_id">{t('Employee Id')}</Label>
                                        <Input
                                            id="employee_id"
                                            value={data.employee_id}
                                            disabled
                                            placeholder={t('Employee Id')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="application_id">{t('Application ID')}</Label>
                                        <Input
                                            id="application_id"
                                            value={data.application_id}
                                            onChange={(e: any) => setData('application_id', e.target.value)}
                                            placeholder={t('e.g., S-01-2017')}
                                        />
                                        <InputError message={errors.application_id} />
                                    </div>
                                    <div>
                                        <Label htmlFor="name_ar">{t('الاسم بالعربي')}</Label>
                                        <Input
                                            id="name_ar"
                                            value={data.name_ar}
                                            onChange={(e: any) => setData('name_ar', e.target.value)}
                                            placeholder={t('أدخل الاسم بالعربي')}
                                            dir="rtl"
                                        />
                                    </div>
                                    <div>
                                        <Label required>{t('Date Of Birth')}</Label>
                                        <DatePicker
                                            value={data.date_of_birth}
                                            onChange={(date: any) => setData('date_of_birth', date)}
                                            placeholder={t('Select Date')}
                                            required
                                        />
                                        <InputError message={errors.date_of_birth} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                    <div>
                                        <Label>{t('Gender')}</Label>
                                        <RadioGroup
                                            value={data.gender || 'Male'}
                                            onValueChange={(value: any) => setData('gender', value)}
                                            className="mt-2 flex gap-6"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Male" id="gender_male" />
                                                <Label htmlFor="gender_male" className="cursor-pointer">
                                                    {t('Male')}
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Female" id="gender_female" />
                                                <Label htmlFor="gender_female" className="cursor-pointer">
                                                    {t('Female')}
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <Label htmlFor="nationality">{t('Nationality')}</Label>
                                        <Input
                                            id="nationality"
                                            value={data.nationality}
                                            onChange={(e: any) => setData('nationality', e.target.value)}
                                            placeholder={t('e.g., Saudi, Egyptian')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="marital_status">{t('Marital Status')}</Label>
                                        <Select
                                            value={data.marital_status}
                                            onValueChange={(v: any) => setData('marital_status', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Single">{t('Single')}</SelectItem>
                                                <SelectItem value="Married">{t('Married')}</SelectItem>
                                                <SelectItem value="Divorced">{t('Divorced')}</SelectItem>
                                                <SelectItem value="Widowed">{t('Widowed')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="marital_status2">{t('Marital Status 2')}</Label>
                                        <Input
                                            id="marital_status2"
                                            value={data.marital_status2}
                                            onChange={(e: any) => setData('marital_status2', e.target.value)}
                                            placeholder={t('Enter Marital Status 2')}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                    <div>
                                        <Label htmlFor="place_of_birth">{t('Place of Birth')}</Label>
                                        <Input
                                            id="place_of_birth"
                                            value={data.place_of_birth}
                                            onChange={(e: any) => setData('place_of_birth', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="religion">{t('Religion')}</Label>
                                        <Input
                                            id="religion"
                                            value={data.religion}
                                            onChange={(e: any) => setData('religion', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="no_of_dependents">{t('No. of Dependents')}</Label>
                                        <Input
                                            id="no_of_dependents"
                                            type="number"
                                            min="0"
                                            value={data.no_of_dependents}
                                            onChange={(e: any) => setData('no_of_dependents', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="blood_type">{t('Blood Type')}</Label>
                                        <Select
                                            value={data.blood_type}
                                            onValueChange={(v: any) => setData('blood_type', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']?.map((bt) => (
                                                    <SelectItem key={bt} value={bt}>
                                                        {bt}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {biometricFields?.map((field: any) => (
                                    <div key={field.id}>{field.component}</div>
                                ))}

                                <div className="flex justify-end">
                                    <Button type="button" onClick={() => setActiveTab('employment')}>
                                        {t('Next')}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Employment Tab */}
                            <TabsContent value="employment" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="shift_id" required>
                                            {t('Shift')}
                                        </Label>
                                        <Select
                                            value={data.shift_id?.toString() || ''}
                                            onValueChange={(value: any) => setData('shift_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select Shift')} />
                                            </SelectTrigger>
                                            <SelectContent searchable={true}>
                                                {shifts?.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.id.toString()}>
                                                        {item.shift_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>{t('Date Of Joining')}</Label>
                                        <DatePicker
                                            value={data.date_of_joining}
                                            onChange={(date: any) => setData('date_of_joining', date)}
                                            placeholder={t('Select Date')}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label required>{t('Employment Type')}</Label>
                                        <Select
                                            value={data.employment_type}
                                            onValueChange={(value: any) => setData('employment_type', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Full Time">{t('Full Time')}</SelectItem>
                                                <SelectItem value="Part Time">{t('Part Time')}</SelectItem>
                                                <SelectItem value="Temporary">{t('Temporary')}</SelectItem>
                                                <SelectItem value="Contract">{t('Contract')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label required>{t('Branch')}</Label>
                                        <Select
                                            value={data.branch_id?.toString() || ''}
                                            onValueChange={(value: any) => setData('branch_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select Branch')} />
                                            </SelectTrigger>
                                            <SelectContent searchable={true}>
                                                {filteredBranches?.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.id.toString()}>
                                                        {item.branch_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label required>{t('Department')}</Label>
                                        <Select
                                            value={data.department_id?.toString() || ''}
                                            onValueChange={(value: any) => setData('department_id', value)}
                                            disabled={!data.branch_id}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        data.branch_id
                                                            ? t('Select Department')
                                                            : t('Select Branch first')
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent searchable={true}>
                                                {filteredDepartments?.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.id.toString()}>
                                                        {item.department_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label required>{t('Designation')}</Label>
                                        <Select
                                            value={data.designation_id?.toString() || ''}
                                            onValueChange={(value: any) => setData('designation_id', value)}
                                            disabled={!data.department_id}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        data.department_id
                                                            ? t('Select Designation')
                                                            : t('Select Department first')
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent searchable={true}>
                                                {filteredDesignations?.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.id.toString()}>
                                                        {item.designation_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold">{t('Job Details')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="job_title">{t('Job Title')}</Label>
                                        <Input
                                            id="job_title"
                                            value={data.job_title}
                                            onChange={(e: any) => setData('job_title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="job_title_ar">{t('المسمى الوظيفي بالعربي')}</Label>
                                        <Input
                                            id="job_title_ar"
                                            value={data.job_title_ar}
                                            onChange={(e: any) => setData('job_title_ar', e.target.value)}
                                            dir="rtl"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="occupation">{t('Occupation')}</Label>
                                        <Input
                                            id="occupation"
                                            value={data.occupation}
                                            onChange={(e: any) => setData('occupation', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="allocated_area">{t('Allocated Area')}</Label>
                                        <Input
                                            id="allocated_area"
                                            value={data.allocated_area}
                                            onChange={(e: any) => setData('allocated_area', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="line_manager">{t('Line Manager')}</Label>
                                        <Input
                                            id="line_manager"
                                            value={data.line_manager}
                                            onChange={(e: any) => setData('line_manager', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="employer_number">{t('Employer Number')}</Label>
                                        <Input
                                            id="employer_number"
                                            value={data.employer_number}
                                            onChange={(e: any) => setData('employer_number', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('GOSI Joining Date')}</Label>
                                        <DatePicker
                                            value={data.gosi_joining_date}
                                            onChange={(date: any) => setData('gosi_joining_date', date)}
                                            placeholder={t('Select Date')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="employee_status">{t('Employee Status')}</Label>
                                        <Select
                                            value={data.employee_status}
                                            onValueChange={(v: any) => setData('employee_status', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">{t('Active')}</SelectItem>
                                                <SelectItem value="Inactive">{t('Inactive')}</SelectItem>
                                                <SelectItem value="Terminated">{t('Terminated')}</SelectItem>
                                                <SelectItem value="Resigned">{t('Resigned')}</SelectItem>
                                                <SelectItem value="On Leave">{t('On Leave')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="list_type">{t('List Type')}</Label>
                                        <Input
                                            id="list_type"
                                            value={data.list_type}
                                            onChange={(e: any) => setData('list_type', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="notes">{t('Notes')}</Label>
                                    <Input
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e: any) => setData('notes', e.target.value)}
                                        placeholder={t('Additional notes...')}
                                    />
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('personal')}>
                                        {t('Previous')}
                                    </Button>
                                    <Button type="button" onClick={() => setActiveTab('contact')}>
                                        {t('Next')}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Contact Tab */}
                            <TabsContent value="contact" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="mobile_no">{t('Mobile Number')}</Label>
                                        <Input
                                            id="mobile_no"
                                            value={data.mobile_no}
                                            onChange={(e: any) => setData('mobile_no', e.target.value)}
                                            placeholder={t('+966...')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="alternate_mobile_no">{t('Alternate Mobile')}</Label>
                                        <Input
                                            id="alternate_mobile_no"
                                            value={data.alternate_mobile_no}
                                            onChange={(e: any) => setData('alternate_mobile_no', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email_address">{t('Email Address')}</Label>
                                        <Input
                                            id="email_address"
                                            type="email"
                                            value={data.email_address}
                                            onChange={(e: any) => setData('email_address', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="work_email">{t('Work Email')}</Label>
                                        <Input
                                            id="work_email"
                                            type="email"
                                            value={data.work_email}
                                            onChange={(e: any) => setData('work_email', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="place_of_residence">{t('Place of Residence')}</Label>
                                        <Input
                                            id="place_of_residence"
                                            value={data.place_of_residence}
                                            onChange={(e: any) => setData('place_of_residence', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="resident_type">{t('Resident Type')}</Label>
                                        <Input
                                            id="resident_type"
                                            value={data.resident_type}
                                            onChange={(e: any) => setData('resident_type', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold">{t('Address')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="address_line_1">{t('Address Line 1')}</Label>
                                        <Input
                                            id="address_line_1"
                                            value={data.address_line_1}
                                            onChange={(e: any) => setData('address_line_1', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="address_line_2">{t('Address Line 2')}</Label>
                                        <Input
                                            id="address_line_2"
                                            value={data.address_line_2}
                                            onChange={(e: any) => setData('address_line_2', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="city">{t('City')}</Label>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e: any) => setData('city', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">{t('State')}</Label>
                                        <Input
                                            id="state"
                                            value={data.state}
                                            onChange={(e: any) => setData('state', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">{t('Country')}</Label>
                                        <Input
                                            id="country"
                                            value={data.country}
                                            onChange={(e: any) => setData('country', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="postal_code">{t('Postal Code')}</Label>
                                        <Input
                                            id="postal_code"
                                            value={data.postal_code}
                                            onChange={(e: any) => setData('postal_code', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold">{t('Emergency Contact')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="emergency_contact_name">{t('Emergency Contact Name')}</Label>
                                        <Input
                                            id="emergency_contact_name"
                                            value={data.emergency_contact_name}
                                            onChange={(e: any) => setData('emergency_contact_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="emergency_contact_relationship">{t('Relationship')}</Label>
                                        <Input
                                            id="emergency_contact_relationship"
                                            value={data.emergency_contact_relationship}
                                            onChange={(e: any) =>
                                                setData('emergency_contact_relationship', e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <PhoneInputComponent
                                        label={t('Emergency Contact Number')}
                                        value={data.emergency_contact_number}
                                        onChange={(value: any) => setData('emergency_contact_number', value || '')}
                                        error={errors.emergency_contact_number}
                                    />
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('employment')}>
                                        {t('Previous')}
                                    </Button>
                                    <Button type="button" onClick={() => setActiveTab('identity')}>
                                        {t('Next')}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Identity Tab */}
                            <TabsContent value="identity" className="mt-6 space-y-6">
                                <h3 className="text-lg font-semibold">{t('Residency / Iqama')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="iqama_no">{t('Iqama Number')}</Label>
                                        <Input
                                            id="iqama_no"
                                            value={data.iqama_no}
                                            onChange={(e: any) => setData('iqama_no', e.target.value)}
                                            placeholder={t('Enter Iqama Number')}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('Iqama Issue Date')}</Label>
                                        <DatePicker
                                            value={data.iqama_issue_date}
                                            onChange={(date: any) => setData('iqama_issue_date', date)}
                                            placeholder={t('Select Date')}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('Iqama Expiry Date')}</Label>
                                        <DatePicker
                                            value={data.iqama_expiry_date}
                                            onChange={(date: any) => setData('iqama_expiry_date', date)}
                                            placeholder={t('Select Date')}
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold">{t('Passport')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="passport_no">{t('Passport Number')}</Label>
                                        <Input
                                            id="passport_no"
                                            value={data.passport_no}
                                            onChange={(e: any) => setData('passport_no', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('Passport Expiry Date')}</Label>
                                        <DatePicker
                                            value={data.passport_expiry_date}
                                            onChange={(date: any) => setData('passport_expiry_date', date)}
                                            placeholder={t('Select Date')}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('contact')}>
                                        {t('Previous')}
                                    </Button>
                                    <Button type="button" onClick={() => setActiveTab('banking')}>
                                        {t('Next')}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Banking Tab */}
                            <TabsContent value="banking" className="mt-6 space-y-6">
                                <h3 className="text-lg font-semibold">{t('Salary & Payment')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <Label htmlFor="basic_salary">{t('Basic Salary')}</Label>
                                        <Input
                                            id="basic_salary"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.basic_salary}
                                            onChange={(e: any) => setData('basic_salary', e.target.value)}
                                            placeholder={t('SAR')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="payment_method">{t('Payment Method')}</Label>
                                        <Select
                                            value={data.payment_method}
                                            onValueChange={(v: any) => setData('payment_method', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BANK TRANSFER">{t('Bank Transfer')}</SelectItem>
                                                <SelectItem value="CASH">{t('Cash')}</SelectItem>
                                                <SelectItem value="CHEQUE">{t('Cheque')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="hours_per_day">{t('Hours Per Day')}</Label>
                                        <Input
                                            id="hours_per_day"
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="24"
                                            value={data.hours_per_day}
                                            onChange={(e: any) => setData('hours_per_day', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="days_per_week">{t('Days Per Week')}</Label>
                                        <Input
                                            id="days_per_week"
                                            type="number"
                                            min="0"
                                            max="7"
                                            value={data.days_per_week}
                                            onChange={(e: any) => setData('days_per_week', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold">{t('Bank Details')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="bank_name">{t('Bank Name')}</Label>
                                        <Input
                                            id="bank_name"
                                            value={data.bank_name}
                                            onChange={(e: any) => setData('bank_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="bank_iban">{t('Bank IBAN')}</Label>
                                        <Input
                                            id="bank_iban"
                                            value={data.bank_iban}
                                            onChange={(e: any) => setData('bank_iban', e.target.value)}
                                            placeholder={t('SA...')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="account_holder_name">{t('Account Holder Name')}</Label>
                                        <Input
                                            id="account_holder_name"
                                            value={data.account_holder_name}
                                            onChange={(e: any) => setData('account_holder_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="swift_code">{t('SWIFT Code')}</Label>
                                        <Input
                                            id="swift_code"
                                            value={data.swift_code}
                                            onChange={(e: any) => setData('swift_code', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="account_number">{t('Account Number')}</Label>
                                        <Input
                                            id="account_number"
                                            value={data.account_number}
                                            onChange={(e: any) => setData('account_number', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tax_payer_id">{t('Tax Payer Id')}</Label>
                                        <Input
                                            id="tax_payer_id"
                                            value={data.tax_payer_id}
                                            onChange={(e: any) => setData('tax_payer_id', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('identity')}>
                                        {t('Previous')}
                                    </Button>
                                    <Button type="button" onClick={() => setActiveTab('insurance')}>
                                        {t('Next')}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Insurance Tab */}
                            <TabsContent value="insurance" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="insurance_status">{t('Insurance Status')}</Label>
                                        <Select
                                            value={data.insurance_status}
                                            onValueChange={(v: any) => setData('insurance_status', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">{t('Active')}</SelectItem>
                                                <SelectItem value="Inactive">{t('Inactive')}</SelectItem>
                                                <SelectItem value="Pending">{t('Pending')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="insurance_class">{t('Insurance Class')}</Label>
                                        <Select
                                            value={data.insurance_class}
                                            onValueChange={(v: any) => setData('insurance_class', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="A">A</SelectItem>
                                                <SelectItem value="B">B</SelectItem>
                                                <SelectItem value="C">C</SelectItem>
                                                <SelectItem value="D">D</SelectItem>
                                                <SelectItem value="VIP">VIP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="sponsor_id">{t('Sponsor ID')}</Label>
                                        <Input
                                            id="sponsor_id"
                                            value={data.sponsor_id}
                                            onChange={(e: any) => setData('sponsor_id', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('banking')}>
                                        {t('Previous')}
                                    </Button>
                                    <Button type="button" onClick={() => setActiveTab('education')}>
                                        {t('Next')}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Education Tab */}
                            <TabsContent value="education" className="mt-6 space-y-6">
                                <h3 className="text-lg font-semibold">{t('Education')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="education_level">{t('Education Level')}</Label>
                                        <Select
                                            value={data.education_level}
                                            onValueChange={(v: any) => setData('education_level', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High School">{t('High School')}</SelectItem>
                                                <SelectItem value="Diploma">{t('Diploma')}</SelectItem>
                                                <SelectItem value="Bachelors">{t('Bachelors')}</SelectItem>
                                                <SelectItem value="Masters">{t('Masters')}</SelectItem>
                                                <SelectItem value="PhD">{t('PhD')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="university">{t('University')}</Label>
                                        <Input
                                            id="university"
                                            value={data.university}
                                            onChange={(e: any) => setData('university', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="major_field">{t('Major / Field')}</Label>
                                        <Input
                                            id="major_field"
                                            value={data.major_field}
                                            onChange={(e: any) => setData('major_field', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="graduation_year">{t('Graduation Year')}</Label>
                                        <Input
                                            id="graduation_year"
                                            value={data.graduation_year}
                                            onChange={(e: any) => setData('graduation_year', e.target.value)}
                                            placeholder="2020"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="total_experience_years">{t('Total Experience (Years)')}</Label>
                                        <Input
                                            id="total_experience_years"
                                            type="number"
                                            min="0"
                                            value={data.total_experience_years}
                                            onChange={(e: any) => setData('total_experience_years', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="computer_skills">{t('Computer Skills')}</Label>
                                        <Input
                                            id="computer_skills"
                                            value={data.computer_skills}
                                            onChange={(e: any) => setData('computer_skills', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold">{t('Languages')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="english_level">{t('English Level')}</Label>
                                        <Select
                                            value={data.english_level}
                                            onValueChange={(v: any) => setData('english_level', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="None">{t('None')}</SelectItem>
                                                <SelectItem value="Basic">{t('Basic')}</SelectItem>
                                                <SelectItem value="Intermediate">{t('Intermediate')}</SelectItem>
                                                <SelectItem value="Fluent">{t('Fluent')}</SelectItem>
                                                <SelectItem value="Native">{t('Native')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="arabic_level">{t('Arabic Level')}</Label>
                                        <Select
                                            value={data.arabic_level}
                                            onValueChange={(v: any) => setData('arabic_level', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="None">{t('None')}</SelectItem>
                                                <SelectItem value="Basic">{t('Basic')}</SelectItem>
                                                <SelectItem value="Intermediate">{t('Intermediate')}</SelectItem>
                                                <SelectItem value="Fluent">{t('Fluent')}</SelectItem>
                                                <SelectItem value="Native">{t('Native')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="other_languages">{t('Other Languages')}</Label>
                                        <Input
                                            id="other_languages"
                                            value={data.other_languages}
                                            onChange={(e: any) => setData('other_languages', e.target.value)}
                                            placeholder={t('e.g., Urdu, Hindi')}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('insurance')}>
                                        {t('Previous')}
                                    </Button>
                                    <Button type="button" onClick={() => setActiveTab('documents')}>
                                        {t('Next')}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Documents Tab */}
                            <TabsContent value="documents" className="mt-6 space-y-6">
                                <ModuleAttachments
                                    attachments={employee.attachments}
                                    onDelete={(id: number) => {
                                        if (confirm(t('Are you sure you want to delete this attachment?'))) {
                                            router.delete(route('hrm.employees.attachments.destroy', id), {
                                                preserveScroll: true,
                                            });
                                        }
                                    }}
                                />

                                <div className="space-y-4 border-t pt-6">
                                    <Label>{t('Add New Attachments')}</Label>
                                    <MediaPicker
                                        multiple={true}
                                        value={data.attachment_ids}
                                        onChange={(ids: any) => setData('attachment_ids', ids)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t('Upload additional mission-critical documents or update existing ones.')}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('education')}>
                                        {t('Previous')}
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                            {t('Cancel')}
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? t('Updating...') : t('Update')}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </form>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
