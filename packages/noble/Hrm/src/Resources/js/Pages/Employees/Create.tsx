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
import { Trash2 } from 'lucide-react';
import MediaPicker from '@/components/MediaPicker';
import { CreateEmployeeFormData } from './types';
import { useEffect, useState } from 'react';
import { useFormFields } from '@/hooks/useFormFields';
import { User, Briefcase, Phone, Fingerprint, CreditCard, ShieldCheck, GraduationCap, FileUp } from 'lucide-react';

export default function Create() {
    const { users,
        branches = [],
        departments = [],
        designations = [],
        shifts,
        documentTypes,
        generatedEmployeeId,
    } = usePage<any>().props;
    const [activeTab, setActiveTab] = useState('personal');
    const [filteredBranches, setFilteredBranches] = useState(branches || []);
    const [filteredDepartments, setFilteredDepartments] = useState(departments || []);
    const [filteredDesignations, setFilteredDesignations] = useState(designations || []);
    const { t } = useTranslation();

    const tabs = [
        { id: 'personal', label: t('Personal'), icon: User },
        { id: 'employment', label: t('Employment'), icon: Briefcase },
        { id: 'contact', label: t('Contact'), icon: Phone },
        { id: 'identity', label: t('Identity'), icon: Fingerprint },
        { id: 'banking', label: t('Banking'), icon: CreditCard },
        { id: 'insurance', label: t('Insurance'), icon: ShieldCheck },
        { id: 'education', label: t('Education'), icon: GraduationCap },
        { id: 'documents', label: t('Attachments'), icon: FileUp },
    ];

    const { data, setData, post, processing, errors } = useForm<CreateEmployeeFormData>({
        employee_id: generatedEmployeeId,
        application_id: '',
        name_ar: '',
        date_of_birth: '',
        gender: 'Male',
        shift_id: '',
        date_of_joining: '',
        employment_type: 'Full Time',
        // Personal
        nationality: '',
        marital_status: '',
        marital_status2: '',
        place_of_birth: '',
        religion: '',
        no_of_dependents: '',
        blood_type: '',
        // Contact
        mobile_no: '',
        alternate_mobile_no: '',
        email_address: '',
        work_email: '',
        place_of_residence: '',
        resident_type: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        // Identity
        iqama_no: '',
        passport_no: '',
        iqama_issue_date: '',
        iqama_expiry_date: '',
        passport_expiry_date: '',
        // Emergency
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_number: '',
        // Employment
        employer_number: '',
        occupation: '',
        job_title: '',
        job_title_ar: '',
        allocated_area: '',
        line_manager: '',
        gosi_joining_date: '',
        employee_status: 'Active',
        list_type: '',
        notes: '',
        // Insurance
        insurance_status: '',
        insurance_class: '',
        sponsor_id: '',
        // Banking
        bank_name: '',
        account_holder_name: '',
        account_number: '',
        bank_identifier_code: '',
        bank_branch: '',
        bank_iban: '',
        swift_code: '',
        tax_payer_id: '',
        basic_salary: '',
        payment_method: '',
        hours_per_day: '',
        days_per_week: '',
        rate_per_hour: '',
        // Education
        education_level: '',
        university: '',
        major_field: '',
        graduation_year: '',
        total_experience_years: '',
        computer_skills: '',
        english_level: '',
        arabic_level: '',
        other_languages: '',
        // Relations
        user_id: '',
        branch_id: '',
        department_id: '',
        designation_id: '',
        attachment_ids: [],
    });

    useEffect(() => {
        setFilteredBranches(branches || []);
        if (!data.user_id) {
            setData('branch_id', '');
        }
    }, [data.user_id]);

    useEffect(() => {
        if (data.branch_id) {
            const branchDepartments = departments.filter((dept) => dept.branch_id.toString() === data.branch_id);
            setFilteredDepartments(branchDepartments);
            if (data.department_id && !branchDepartments.find((dept) => dept.id.toString() === data.department_id)) {
                setData('department_id', '');
                setData('designation_id', '');
            }
        } else {
            setFilteredDepartments([]);
            setData('department_id', '');
            setData('designation_id', '');
        }
    }, [data.branch_id]);

    useEffect(() => {
        if (data.department_id) {
            const departmentDesignations = designations.filter(
                (desig) => desig.department_id.toString() === data.department_id
            );
            setFilteredDesignations(departmentDesignations);
            if (
                data.designation_id &&
                !departmentDesignations.find((desig) => desig.id.toString() === data.designation_id)
            ) {
                setData('designation_id', '');
            }
        } else {
            setFilteredDesignations([]);
            setData('designation_id', '');
        }
    }, [data.department_id]);

    const validatePersonalTab = () => {
        return data.employee_id.trim() !== '' && data.date_of_birth !== '' && data.gender !== '';
    };

    const validateEmploymentTab = () => {
        return (
            data.user_id !== '' &&
            data.employment_type !== '' &&
            data.shift_id !== '' &&
            data.branch_id !== '' &&
            data.department_id !== '' &&
            data.designation_id !== ''
        );
    };

    const validateContactTab = () => {
        return (
            data.address_line_1.trim() !== '' &&
            data.city.trim() !== '' &&
            data.state.trim() !== '' &&
            data.country.trim() !== '' &&
            data.postal_code.trim() !== '' &&
            data.emergency_contact_name.trim() !== '' &&
            data.emergency_contact_relationship.trim() !== '' &&
            data.emergency_contact_number.trim() !== ''
        );
    };

    const validateBankingTab = () => {
        return (
            data.bank_name.trim() !== '' &&
            data.account_holder_name.trim() !== '' &&
            data.account_number.trim() !== '' &&
            data.bank_identifier_code.trim() !== '' &&
            data.bank_branch.trim() !== ''
        );
    };

    const validateHoursTab = () => {
        return (
            data.basic_salary?.trim() !== '' &&
            data.hours_per_day?.trim() !== '' &&
            data.days_per_week?.trim() !== '' &&
            data.rate_per_hour?.trim() !== ''
        );
    };

    const biometricFields = useFormFields('biometricEmployeeIdFields', data, setData, errors, 'create');
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hrm.employees.store'));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Hrm'), url: route('hrm.index') },
                { label: t('Employees'), url: route('hrm.employees.index') },
                { label: t('Create') },
            ]}
            pageTitle={t('Create Employee')}
        >
            <Head title={t('Create Employee')} />

            <Card className="shadow-sm">
                <CardContent>
                    <form onSubmit={submit} className="pt-5">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                                <TabsTrigger value="personal">{t('Personal')}</TabsTrigger>
                                <TabsTrigger value="employment">{t('Employment')}</TabsTrigger>
                                <TabsTrigger value="contact">{t('Contact')}</TabsTrigger>
                                <TabsTrigger value="identity">{t('Identity')}</TabsTrigger>
                                <TabsTrigger value="banking">{t('Banking')}</TabsTrigger>
                                <TabsTrigger value="insurance">{t('Insurance')}</TabsTrigger>
                                <TabsTrigger value="education">{t('Education')}</TabsTrigger>
                                <TabsTrigger value="documents">{t('Attachments')}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="employee_id">{t('Employee Id')}</Label>
                                        <Input
                                            id="employee_id"
                                            type="text"
                                            value={data.employee_id}
                                            placeholder={t('Auto Generated')}
                                            readOnly
                                            className="bg-muted/50"
                                        />
                                        <InputError message={errors.employee_id} />
                                    </div>
                                    <div>
                                        <Label htmlFor="application_id">{t('Application ID')}</Label>
                                        <Input
                                            id="application_id"
                                            type="text"
                                            value={data.application_id}
                                            onChange={(e) => setData('application_id', e.target.value)}
                                            placeholder={t('e.g., S-01-2017')}
                                        />
                                        <InputError message={errors.application_id} />
                                    </div>

                                    <div>
                                        <Label required>{t('Date Of Birth')}</Label>
                                        <DatePicker
                                            value={data.date_of_birth}
                                            onChange={(date) => setData('date_of_birth', date)}
                                            placeholder={t('Select Date Of Birth')}
                                            required
                                        />
                                        <InputError message={errors.date_of_birth} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label>{t('Gender')}</Label>
                                        <RadioGroup
                                            value={data.gender || 'Male'}
                                            onValueChange={(value) => setData('gender', value)}
                                            className="mt-2 flex gap-6"
                                        >
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="Male" id="gender_male" />
                                                <Label htmlFor="gender_male" className="cursor-pointer">
                                                    {t('Male')}
                                                </Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="Female" id="gender_female" />
                                                <Label htmlFor="gender_female" className="cursor-pointer">
                                                    {t('Female')}
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                        <InputError message={errors.gender} />
                                    </div>
                                    <div>
                                        <Label htmlFor="name_ar">{t('Arabic Name')}</Label>
                                        <Input
                                            id="name_ar"
                                            value={data.name_ar}
                                            onChange={(e) => setData('name_ar', e.target.value)}
                                            placeholder={t('الاسم بالعربي')}
                                            dir="rtl"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nationality">{t('Nationality')}</Label>
                                        <Input
                                            id="nationality"
                                            value={data.nationality}
                                            onChange={(e) => setData('nationality', e.target.value)}
                                            placeholder={t('e.g., Saudi')}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="marital_status">{t('Marital Status')}</Label>
                                        <Select
                                            value={data.marital_status}
                                            onValueChange={(v) => setData('marital_status', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Single">{t('Single')}</SelectItem>
                                                <SelectItem value="Married">{t('Married')}</SelectItem>
                                                <SelectItem value="Divorced">{t('Divorced')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="marital_status2">{t('Marital Status 2')}</Label>
                                        <Input
                                            id="marital_status2"
                                            value={data.marital_status2}
                                            onChange={(e) => setData('marital_status2', e.target.value)}
                                            placeholder={t('Enter Marital Status 2')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="place_of_birth">{t('Place of Birth')}</Label>
                                        <Input
                                            id="place_of_birth"
                                            value={data.place_of_birth}
                                            onChange={(e) => setData('place_of_birth', e.target.value)}
                                            placeholder={t('Enter Place of Birth')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="religion">{t('Religion')}</Label>
                                        <Input
                                            id="religion"
                                            value={data.religion}
                                            onChange={(e) => setData('religion', e.target.value)}
                                            placeholder={t('Enter Religion')}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="no_of_dependents">{t('No. of Dependents')}</Label>
                                        <Input
                                            id="no_of_dependents"
                                            type="number"
                                            min="0"
                                            value={data.no_of_dependents}
                                            onChange={(e) => setData('no_of_dependents', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="blood_type">{t('Blood Type')}</Label>
                                        <Select value={data.blood_type} onValueChange={(v) => setData('blood_type', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']?.map((b) => (
                                                    <SelectItem key={b} value={b}>
                                                        {b}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {biometricFields?.map((field) => (
                                        <div key={field.id}>{field.component}</div>
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => setActiveTab('employment')}
                                        disabled={!validatePersonalTab()}
                                    >
                                        {t('Next')}
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="employment" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="user_id" required>
                                            {t('User')}
                                        </Label>
                                        <Select
                                            value={data.user_id?.toString() || ''}
                                            onValueChange={(value) => setData('user_id', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select User')} />
                                            </SelectTrigger>
                                            <SelectContent searchable={true}>
                                                {users?.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.id.toString()}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {t('Note: Company users will be applicable for create employee.')}
                                        </p>
                                        <InputError message={errors.user_id} />
                                    </div>

                                    <div>
                                        <Label htmlFor="shift_id" required>
                                            {t('Shift')}
                                        </Label>
                                        <Select
                                            value={data.shift_id?.toString() || ''}
                                            onValueChange={(value) => setData('shift_id', value)}
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
                                        <InputError message={errors.shift_id} />
                                    </div>

                                    <div>
                                        <Label>{t('Date Of Joining')}</Label>
                                        <DatePicker
                                            value={data.date_of_joining}
                                            onChange={(date) => setData('date_of_joining', date)}
                                            placeholder={t('Select Date Of Joining')}
                                            required
                                        />
                                        <InputError message={errors.date_of_joining} />
                                    </div>

                                    <div>
                                        <Label htmlFor="employment_type" required>
                                            {t('Employment Type')}
                                        </Label>
                                        <Select
                                            value={data.employment_type || 'Full Time'}
                                            onValueChange={(value) => setData('employment_type', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select Employment Type')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Full Time">{t('Full Time')}</SelectItem>
                                                <SelectItem value="Part Time">{t('Part Time')}</SelectItem>
                                                <SelectItem value="Temporary">{t('Temporary')}</SelectItem>
                                                <SelectItem value="Contract">{t('Contract')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.employment_type} />
                                    </div>

                                    <div>
                                        <Label htmlFor="branch_id" required>
                                            {t('Branch')}
                                        </Label>
                                        <Select
                                            value={data.branch_id?.toString() || ''}
                                            onValueChange={(value) => setData('branch_id', value)}
                                            disabled={!data.user_id}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        data.user_id ? t('Select Branch') : t('Select User first')
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent searchable={true}>
                                                {filteredBranches?.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.id.toString()}>
                                                        {item.branch_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.branch_id} />
                                    </div>

                                    <div>
                                        <Label htmlFor="department_id" required>
                                            {t('Department')}
                                        </Label>
                                        <Select
                                            value={data.department_id?.toString() || ''}
                                            onValueChange={(value) => setData('department_id', value)}
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
                                        <InputError message={errors.department_id} />
                                    </div>

                                    <div>
                                        <Label htmlFor="designation_id" required>
                                            {t('Designation')}
                                        </Label>
                                        <Select
                                            value={data.designation_id?.toString() || ''}
                                            onValueChange={(value) => setData('designation_id', value)}
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
                                        <InputError message={errors.designation_id} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold">{t('Job Details')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="job_title">{t('Job Title')}</Label>
                                        <Input
                                            id="job_title"
                                            value={data.job_title}
                                            onChange={(e) => setData('job_title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="job_title_ar">{t('المسمى الوظيفي بالعربي')}</Label>
                                        <Input
                                            id="job_title_ar"
                                            value={data.job_title_ar}
                                            onChange={(e) => setData('job_title_ar', e.target.value)}
                                            dir="rtl"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="occupation">{t('Occupation')}</Label>
                                        <Input
                                            id="occupation"
                                            value={data.occupation}
                                            onChange={(e) => setData('occupation', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="allocated_area">{t('Allocated Area')}</Label>
                                        <Input
                                            id="allocated_area"
                                            value={data.allocated_area}
                                            onChange={(e) => setData('allocated_area', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="line_manager">{t('Line Manager')}</Label>
                                        <Input
                                            id="line_manager"
                                            value={data.line_manager}
                                            onChange={(e) => setData('line_manager', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="employer_number">{t('Employer Number')}</Label>
                                        <Input
                                            id="employer_number"
                                            value={data.employer_number}
                                            onChange={(e) => setData('employer_number', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('GOSI Joining Date')}</Label>
                                        <DatePicker
                                            value={data.gosi_joining_date}
                                            onChange={(date) => setData('gosi_joining_date', date)}
                                            placeholder={t('Select Date')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="employee_status">{t('Employee Status')}</Label>
                                        <Select
                                            value={data.employee_status}
                                            onValueChange={(v) => setData('employee_status', v)}
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
                                            onChange={(e) => setData('list_type', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="notes">{t('Notes')}</Label>
                                    <Input
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder={t('Additional notes...')}
                                    />
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('personal')}>
                                        {t('Previous')}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setActiveTab('contact')}
                                        disabled={!validateEmploymentTab()}
                                    >
                                        {t('Next')}
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="contact" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="mobile_no">{t('Mobile Number')}</Label>
                                        <Input
                                            id="mobile_no"
                                            value={data.mobile_no}
                                            onChange={(e) => setData('mobile_no', e.target.value)}
                                            placeholder={t('+966...')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="alternate_mobile_no">{t('Alternate Mobile')}</Label>
                                        <Input
                                            id="alternate_mobile_no"
                                            value={data.alternate_mobile_no}
                                            onChange={(e) => setData('alternate_mobile_no', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email_address">{t('Email Address')}</Label>
                                        <Input
                                            id="email_address"
                                            type="email"
                                            value={data.email_address}
                                            onChange={(e) => setData('email_address', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="work_email">{t('Work Email')}</Label>
                                        <Input
                                            id="work_email"
                                            type="email"
                                            value={data.work_email}
                                            onChange={(e) => setData('work_email', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="place_of_residence">{t('Place of Residence')}</Label>
                                        <Input
                                            id="place_of_residence"
                                            value={data.place_of_residence}
                                            onChange={(e) => setData('place_of_residence', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="resident_type">{t('Resident Type')}</Label>
                                        <Input
                                            id="resident_type"
                                            value={data.resident_type}
                                            onChange={(e) => setData('resident_type', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold">{t('Address')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="address_line_1">{t('Address Line 1')}</Label>
                                        <Input
                                            id="address_line_1"
                                            type="text"
                                            value={data.address_line_1}
                                            onChange={(e) => setData('address_line_1', e.target.value)}
                                            placeholder={t('Enter Address Line 1')}
                                            required
                                        />
                                        <InputError message={errors.address_line_1} />
                                    </div>

                                    <div>
                                        <Label htmlFor="address_line_2">{t('Address Line 2')}</Label>
                                        <Input
                                            id="address_line_2"
                                            type="text"
                                            value={data.address_line_2}
                                            onChange={(e) => setData('address_line_2', e.target.value)}
                                            placeholder={t('Enter Address Line 2')}
                                        />
                                        <InputError message={errors.address_line_2} />
                                    </div>

                                    <div>
                                        <Label htmlFor="city">{t('City')}</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder={t('Enter City')}
                                            required
                                        />
                                        <InputError message={errors.city} />
                                    </div>

                                    <div>
                                        <Label htmlFor="state">{t('State')}</Label>
                                        <Input
                                            id="state"
                                            type="text"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            placeholder={t('Enter State')}
                                            required
                                        />
                                        <InputError message={errors.state} />
                                    </div>

                                    <div>
                                        <Label htmlFor="country">{t('Country')}</Label>
                                        <Input
                                            id="country"
                                            type="text"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            placeholder={t('Enter Country')}
                                            required
                                        />
                                        <InputError message={errors.country} />
                                    </div>

                                    <div>
                                        <Label htmlFor="postal_code">{t('Postal Code')}</Label>
                                        <Input
                                            id="postal_code"
                                            type="text"
                                            value={data.postal_code}
                                            onChange={(e) => setData('postal_code', e.target.value)}
                                            placeholder={t('Enter Postal Code')}
                                            required
                                        />
                                        <InputError message={errors.postal_code} />
                                    </div>

                                    <div>
                                        <Label htmlFor="emergency_contact_name">{t('Emergency Contact Name')}</Label>
                                        <Input
                                            id="emergency_contact_name"
                                            type="text"
                                            value={data.emergency_contact_name}
                                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                            placeholder={t('Enter Emergency Contact Name')}
                                            required
                                        />
                                        <InputError message={errors.emergency_contact_name} />
                                    </div>

                                    <div>
                                        <Label htmlFor="emergency_contact_relationship">
                                            {t('Emergency Contact Relationship')}
                                        </Label>
                                        <Input
                                            id="emergency_contact_relationship"
                                            type="text"
                                            value={data.emergency_contact_relationship}
                                            onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                                            placeholder={t('Enter Emergency Contact Relationship')}
                                            required
                                        />
                                        <InputError message={errors.emergency_contact_relationship} />
                                    </div>
                                </div>

                                <div>
                                    <PhoneInputComponent
                                        label={t('Emergency Contact Number')}
                                        value={data.emergency_contact_number}
                                        onChange={(value) => setData('emergency_contact_number', value || '')}
                                        error={errors.emergency_contact_number}
                                        required
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
                                            onChange={(e) => setData('iqama_no', e.target.value)}
                                            placeholder={t('Enter Iqama Number')}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('Iqama Issue Date')}</Label>
                                        <DatePicker
                                            value={data.iqama_issue_date}
                                            onChange={(date) => setData('iqama_issue_date', date)}
                                            placeholder={t('Select Date')}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('Iqama Expiry Date')}</Label>
                                        <DatePicker
                                            value={data.iqama_expiry_date}
                                            onChange={(date) => setData('iqama_expiry_date', date)}
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
                                            onChange={(e) => setData('passport_no', e.target.value)}
                                            placeholder={t('Enter Passport Number')}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('Passport Expiry Date')}</Label>
                                        <DatePicker
                                            value={data.passport_expiry_date}
                                            onChange={(date) => setData('passport_expiry_date', date)}
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

                            {/* Banking Tab (merged with salary/hours) */}
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
                                            onChange={(e) => setData('basic_salary', e.target.value)}
                                            placeholder={t('SAR')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="payment_method">{t('Payment Method')}</Label>
                                        <Select
                                            value={data.payment_method}
                                            onValueChange={(v) => setData('payment_method', v)}
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
                                            onChange={(e) => setData('hours_per_day', e.target.value)}
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
                                            onChange={(e) => setData('days_per_week', e.target.value)}
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
                                            onChange={(e) => setData('bank_name', e.target.value)}
                                            placeholder={t('Enter Bank Name')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="bank_iban">{t('Bank IBAN')}</Label>
                                        <Input
                                            id="bank_iban"
                                            value={data.bank_iban}
                                            onChange={(e) => setData('bank_iban', e.target.value)}
                                            placeholder={t('SA...')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="account_holder_name">{t('Account Holder Name')}</Label>
                                        <Input
                                            id="account_holder_name"
                                            value={data.account_holder_name}
                                            onChange={(e) => setData('account_holder_name', e.target.value)}
                                            placeholder={t('Enter Name')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="swift_code">{t('SWIFT Code')}</Label>
                                        <Input
                                            id="swift_code"
                                            value={data.swift_code}
                                            onChange={(e) => setData('swift_code', e.target.value)}
                                            placeholder={t('Enter SWIFT Code')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="account_number">{t('Account Number')}</Label>
                                        <Input
                                            id="account_number"
                                            value={data.account_number}
                                            onChange={(e) => setData('account_number', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tax_payer_id">{t('Tax Payer Id')}</Label>
                                        <Input
                                            id="tax_payer_id"
                                            value={data.tax_payer_id}
                                            onChange={(e) => setData('tax_payer_id', e.target.value)}
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
                                            onValueChange={(v) => setData('insurance_status', v)}
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
                                            onValueChange={(v) => setData('insurance_class', v)}
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
                                            onChange={(e) => setData('sponsor_id', e.target.value)}
                                            placeholder={t('Enter Sponsor ID')}
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
                                            onValueChange={(v) => setData('education_level', v)}
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
                                            onChange={(e) => setData('university', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="major_field">{t('Major / Field')}</Label>
                                        <Input
                                            id="major_field"
                                            value={data.major_field}
                                            onChange={(e) => setData('major_field', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="graduation_year">{t('Graduation Year')}</Label>
                                        <Input
                                            id="graduation_year"
                                            value={data.graduation_year}
                                            onChange={(e) => setData('graduation_year', e.target.value)}
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
                                            onChange={(e) => setData('total_experience_years', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="computer_skills">{t('Computer Skills')}</Label>
                                        <Input
                                            id="computer_skills"
                                            value={data.computer_skills}
                                            onChange={(e) => setData('computer_skills', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold">{t('Languages')}</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="english_level">{t('English Level')}</Label>
                                        <Select
                                            value={data.english_level}
                                            onValueChange={(v) => setData('english_level', v)}
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
                                            onValueChange={(v) => setData('arabic_level', v)}
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
                                            onChange={(e) => setData('other_languages', e.target.value)}
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
                                <div className="space-y-4">
                                    <Label>{t('Employee Mission Payload (Attachments)')}</Label>
                                    <MediaPicker
                                        multiple={true}
                                        value={data.attachment_ids}
                                        onChange={(ids) => setData('attachment_ids', ids)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t('Upload mission-critical documents, identity proofs, and certifications.')}
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
                                            {processing ? t('Creating...') : t('Create')}
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
