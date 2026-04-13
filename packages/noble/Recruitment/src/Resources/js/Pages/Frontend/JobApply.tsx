import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Star, Upload, FileText, File, Image, X } from 'lucide-react';
import FrontendLayout from '../../Components/Frontend/FrontendLayout';
import { PhoneInputComponent } from '@/components/ui/phone-input';
import { DatePicker } from '@/components/ui/date-picker';
import { useFormFields } from '@/hooks/useFormFields';
import { formatCurrency } from '@/utils/helpers';

interface Job {
    id: number;
    encrypted_id: string;
    title: string;
    location: string;
    jobType: string;
    salaryFrom: number;
    salaryTo: number;
    skills: string[];
    featured: boolean;
    terms_condition?: string;
    show_terms_condition?: boolean;
}

interface CustomQuestion {
    id: number;
    question: string;
    type: string;
    options: string[];
    is_required: boolean;
}

interface JobApplyProps {
    job: Job;
    userSlug: string;
    brandSettings: {
        logo?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
    };
    applicationTips: { title: string }[];
    storageSettings: {
        allowedFileTypes: string;
        maxUploadSize: number;
    };
    customQuestions: CustomQuestion[];
    jobPostingSettings: {
        applicant: string[];
        visibility: string[];
    };
}

export default function JobApply({
    job,
    userSlug,
    brandSettings,
    applicationTips,
    storageSettings,
    customQuestions,
    jobPostingSettings,
}: JobApplyProps) {
    const { t } = useTranslation();

    const integrationFields = useFormFields('getIntegrationFields', {}, () => {}, {}, 'create', t, 'Recruitment');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        country: '',
        state: '',
        city: '',
        currentCompany: '',
        currentPosition: '',
        experienceYears: '',
        currentSalary: '',
        expectedSalary: '',
        noticePeriod: '',
        skills: '',
        education: '',
        portfolioUrl: '',
        linkedinUrl: '',
    });
    const [customAnswers, setCustomAnswers] = useState<Record<string, string | string[]>>({});
    const [uploadedFiles, setUploadedFiles] = useState<{ resume?: File; coverLetter?: File; profilePhoto?: File }>({});
    const [filePreviews, setFilePreviews] = useState<{ resume?: string; coverLetter?: string; profilePhoto?: string }>(
        {}
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const formatSalary = (from: number, to: number) => {
        return `${formatCurrency(from)} - ${formatCurrency(to)}`;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formDataToSubmit = new FormData();

        // Add form fields
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSubmit.append(key, value);
        });

        // Add custom question answers
        Object.entries(customAnswers).forEach(([key, value]) => {
            if (value) {
                if (Array.isArray(value)) {
                    // For checkbox arrays, join with commas
                    formDataToSubmit.append(key, value.join(','));
                } else {
                    formDataToSubmit.append(key, value as string);
                }
            }
        });

        // Add files
        if (uploadedFiles.resume) formDataToSubmit.append('resume', uploadedFiles.resume);
        if (uploadedFiles.coverLetter) formDataToSubmit.append('coverLetter', uploadedFiles.coverLetter);
        if (uploadedFiles.profilePhoto) formDataToSubmit.append('profilePhoto', uploadedFiles.profilePhoto);

        try {
            const response = await fetch(
                route('recruitment.frontend.careers.jobs.apply.submit', { userSlug, id: job.encrypted_id }),
                {
                    method: 'POST',
                    body: formDataToSubmit,
                    headers: {
                        'X-CSRF-TOKEN':
                            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                }
            );

            const result = await response.json();

            if (response.ok && result.success) {
                window.location.href = route('recruitment.frontend.careers.application.success', {
                    userSlug,
                    trackingId: result.tracking_id,
                });
            } else {
                setIsSubmitting(false);
            }
        } catch (error) {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () => {
        const basicFieldsValid = formData.name && formData.email && formData.experienceYears;

        // Check required custom questions
        const requiredCustomQuestionsValid = customQuestions.every((question) => {
            if (question.is_required) {
                const fieldName = `custom_question_${question.id}`;
                const value = customAnswers[fieldName];
                if (Array.isArray(value)) {
                    return value.length > 0;
                } else {
                    return value && value.toString().trim() !== '';
                }
            }
            return true;
        });

        // Check terms acceptance if terms are shown
        const termsValid = !job.show_terms_condition || termsAccepted;

        return basicFieldsValid && requiredCustomQuestionsValid && termsValid;
    };

    return (
        <FrontendLayout userSlug={userSlug} brandSettings={brandSettings}>
            <Head title={`Apply for ${job.title}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Main Application Form */}
                    <div className="lg:w-2/3">
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mb-6 text-muted-foreground hover:bg-muted hover:text-foreground"
                                onClick={() =>
                                    (window.location.href = route('recruitment.frontend.careers.jobs.show', {
                                        userSlug,
                                        id: job.encrypted_id,
                                    }))
                                }
                            >
                                <ArrowLeft className="me-2 h-4 w-4" />
                                {t('Back to Job Details')}
                            </Button>
                            <h1 className="mb-2 text-3xl font-bold text-foreground">{t('Apply for Position')}</h1>
                            <p className="text-muted-foreground">
                                {t('Please fill out the form below to submit your application')}
                            </p>
                        </div>

                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Personal Information Section */}
                                    <div>
                                        <h2 className="mb-6 border-b border-border pb-2 text-lg font-semibold text-foreground">
                                            {t('Personal Information')}
                                        </h2>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {/* Full Name */}
                                            <div className="md:col-span-2">
                                                <Label
                                                    htmlFor="name"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Full Name')}
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    placeholder={t('Enter your full name')}
                                                    className="h-11"
                                                    required
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <Label
                                                    htmlFor="email"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Email Address')}
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    placeholder={t('Enter your email address')}
                                                    className="h-11"
                                                    required
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <PhoneInputComponent
                                                    label={t('Phone Number')}
                                                    value={formData.phone}
                                                    onChange={(value) => handleInputChange('phone', value)}
                                                    placeholder={t('Enter your phone number')}
                                                    id="phone"
                                                    name="phone"
                                                />
                                            </div>

                                            {/* Gender */}
                                            {jobPostingSettings.applicant.includes('gender') && (
                                                <div>
                                                    <Label
                                                        htmlFor="gender"
                                                        className="mb-2 block text-sm font-medium text-foreground"
                                                    >
                                                        {t('Gender')}
                                                    </Label>
                                                    <Select
                                                        value={formData.gender}
                                                        onValueChange={(value) => handleInputChange('gender', value)}
                                                    >
                                                        <SelectTrigger className="h-11">
                                                            <SelectValue placeholder={t('Select Gender')} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="male">{t('Male')}</SelectItem>
                                                            <SelectItem value="female">{t('Female')}</SelectItem>
                                                            <SelectItem value="other">{t('Other')}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            {/* Date of Birth */}
                                            {jobPostingSettings.applicant.includes('date_of_birth') && (
                                                <div>
                                                    <Label className="mb-2 block text-sm font-medium text-foreground">
                                                        {t('Date of Birth')}
                                                    </Label>
                                                    <DatePicker
                                                        value={formData.dateOfBirth}
                                                        onChange={(date) => handleInputChange('dateOfBirth', date)}
                                                        placeholder={t('Select Date of Birth')}
                                                        maxDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
                                                    />
                                                </div>
                                            )}

                                            {/* Country */}
                                            {jobPostingSettings.applicant.includes('country') && (
                                                <div>
                                                    <Label
                                                        htmlFor="country"
                                                        className="mb-2 block text-sm font-medium text-foreground"
                                                    >
                                                        {t('Country')}
                                                    </Label>
                                                    <Input
                                                        id="country"
                                                        type="text"
                                                        value={formData.country}
                                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                                        placeholder={t('Enter your country')}
                                                        className="h-11"
                                                        required
                                                    />
                                                </div>
                                            )}

                                            {/* State */}
                                            {jobPostingSettings.applicant.includes('country') && (
                                                <div>
                                                    <Label
                                                        htmlFor="state"
                                                        className="mb-2 block text-sm font-medium text-foreground"
                                                    >
                                                        {t('State')}
                                                    </Label>
                                                    <Input
                                                        id="state"
                                                        type="text"
                                                        value={formData.state}
                                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                                        placeholder={t('Enter your state')}
                                                        className="h-11"
                                                    />
                                                </div>
                                            )}

                                            {/* City */}
                                            {jobPostingSettings.applicant.includes('country') && (
                                                <div>
                                                    <Label
                                                        htmlFor="city"
                                                        className="mb-2 block text-sm font-medium text-foreground"
                                                    >
                                                        {t('City')}
                                                    </Label>
                                                    <Input
                                                        id="city"
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                                        placeholder={t('Enter your city')}
                                                        className="h-11"
                                                    />
                                                </div>
                                            )}

                                            {/* Profile Photo */}
                                            {jobPostingSettings.visibility.includes('profile_image') && (
                                                <div>
                                                    <Label
                                                        htmlFor="profilePhoto"
                                                        className="mb-2 block text-sm font-medium text-foreground"
                                                    >
                                                        {t('Profile Photo')}
                                                    </Label>
                                                    {!uploadedFiles.profilePhoto ? (
                                                        <div className="mt-1">
                                                            <Input
                                                                id="profilePhoto"
                                                                name="profilePhoto"
                                                                type="file"
                                                                accept={storageSettings.allowedFileTypes
                                                                    .split(',')
                                                                    ?.map((type) => `.${type.trim()}`)
                                                                    .join(',')}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        setUploadedFiles((prev) => ({
                                                                            ...prev,
                                                                            profilePhoto: file,
                                                                        }));
                                                                        if (file.type.startsWith('image/')) {
                                                                            const reader = new FileReader();
                                                                            reader.onload = (e) => {
                                                                                setFilePreviews((prev) => ({
                                                                                    ...prev,
                                                                                    profilePhoto: e.target
                                                                                        ?.result as string,
                                                                                }));
                                                                            };
                                                                            reader.readAsDataURL(file);
                                                                        }
                                                                    }
                                                                }}
                                                                className="h-11"
                                                            />
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {t('JPG, PNG, GIF up to')}{' '}
                                                                {storageSettings.maxUploadSize} {t('MB')}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="relative mt-1">
                                                            {filePreviews.profilePhoto ? (
                                                                <div className="relative inline-block">
                                                                    <img
                                                                        src={filePreviews.profilePhoto}
                                                                        alt="Profile photo preview"
                                                                        className="h-32 w-32 rounded-lg border object-cover"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setUploadedFiles((prev) => ({
                                                                                ...prev,
                                                                                profilePhoto: undefined,
                                                                            }));
                                                                            setFilePreviews((prev) => ({
                                                                                ...prev,
                                                                                profilePhoto: undefined,
                                                                            }));
                                                                        }}
                                                                        className="bg-muted/500 absolute -end-2 -top-2 rounded-full p-1 text-background hover:bg-destructive"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                    <p className="mt-2 text-sm text-foreground">
                                                                        {uploadedFiles.profilePhoto.name}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center space-x-3 rounded-lg border bg-muted/50 p-3">
                                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                                                        <Image className="h-6 w-6 text-foreground" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-foreground">
                                                                            {uploadedFiles.profilePhoto.name}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {(
                                                                                uploadedFiles.profilePhoto.size /
                                                                                1024 /
                                                                                1024
                                                                            ).toFixed(2)}{' '}
                                                                            MB
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setUploadedFiles((prev) => ({
                                                                                ...prev,
                                                                                profilePhoto: undefined,
                                                                            }));
                                                                            setFilePreviews((prev) => ({
                                                                                ...prev,
                                                                                profilePhoto: undefined,
                                                                            }));
                                                                        }}
                                                                        className="text-destructive hover:text-destructive"
                                                                    >
                                                                        <X className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Professional Information Section */}
                                    <div>
                                        <h2 className="mb-6 border-b border-border pb-2 text-lg font-semibold text-foreground">
                                            {' '}
                                            {t('Professional Information')}{' '}
                                        </h2>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {/* Current Company */}
                                            <div>
                                                <Label
                                                    htmlFor="currentCompany"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Current Company')}
                                                </Label>
                                                <Input
                                                    id="currentCompany"
                                                    type="text"
                                                    value={formData.currentCompany}
                                                    onChange={(e) =>
                                                        handleInputChange('currentCompany', e.target.value)
                                                    }
                                                    placeholder={t('Enter your current company')}
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Current Position */}
                                            <div>
                                                <Label
                                                    htmlFor="currentPosition"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Current Position')}
                                                </Label>
                                                <Input
                                                    id="currentPosition"
                                                    type="text"
                                                    value={formData.currentPosition}
                                                    onChange={(e) =>
                                                        handleInputChange('currentPosition', e.target.value)
                                                    }
                                                    placeholder={t('Enter your current position')}
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Experience Years */}
                                            <div>
                                                <Label
                                                    htmlFor="experienceYears"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Experience (Years)')}
                                                </Label>
                                                <Input
                                                    id="experienceYears"
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={formData.experienceYears}
                                                    onChange={(e) =>
                                                        handleInputChange('experienceYears', e.target.value)
                                                    }
                                                    placeholder={t('Enter experience years')}
                                                    className="h-11"
                                                    required
                                                />
                                            </div>

                                            {/* Current Salary */}
                                            <div>
                                                <Label
                                                    htmlFor="currentSalary"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Current Salary')}
                                                </Label>
                                                <Input
                                                    id="currentSalary"
                                                    type="number"
                                                    min="0"
                                                    value={formData.currentSalary}
                                                    onChange={(e) => handleInputChange('currentSalary', e.target.value)}
                                                    placeholder={t('Enter current salary')}
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Expected Salary */}
                                            <div>
                                                <Label
                                                    htmlFor="expectedSalary"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Expected Salary')}
                                                </Label>
                                                <Input
                                                    id="expectedSalary"
                                                    type="number"
                                                    min="0"
                                                    value={formData.expectedSalary}
                                                    onChange={(e) =>
                                                        handleInputChange('expectedSalary', e.target.value)
                                                    }
                                                    placeholder={t('Enter expected salary')}
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Notice Period */}
                                            <div>
                                                <Label
                                                    htmlFor="noticePeriod"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Notice Period')}
                                                </Label>
                                                <Input
                                                    id="noticePeriod"
                                                    type="text"
                                                    value={formData.noticePeriod}
                                                    onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                                                    placeholder={t('Enter notice period')}
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* Skills */}
                                            <div className="md:col-span-2">
                                                <Label
                                                    htmlFor="skills"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Skills')}
                                                </Label>
                                                <Textarea
                                                    id="skills"
                                                    value={formData.skills}
                                                    onChange={(e) => handleInputChange('skills', e.target.value)}
                                                    placeholder={t('Enter skills')}
                                                    rows={3}
                                                />
                                            </div>

                                            {/* Education */}
                                            <div className="md:col-span-2">
                                                <Label
                                                    htmlFor="education"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Education')}
                                                </Label>
                                                <Textarea
                                                    id="education"
                                                    value={formData.education}
                                                    onChange={(e) => handleInputChange('education', e.target.value)}
                                                    placeholder={t('Enter education')}
                                                    rows={3}
                                                />
                                            </div>

                                            {/* Portfolio URL */}
                                            <div>
                                                <Label
                                                    htmlFor="portfolioUrl"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('Portfolio URL')}
                                                </Label>
                                                <Input
                                                    id="portfolioUrl"
                                                    type="url"
                                                    value={formData.portfolioUrl}
                                                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                                                    placeholder={t('Enter portfolio URL')}
                                                    className="h-11"
                                                />
                                            </div>

                                            {/* LinkedIn URL */}
                                            <div>
                                                <Label
                                                    htmlFor="linkedinUrl"
                                                    className="mb-2 block text-sm font-medium text-foreground"
                                                >
                                                    {t('LinkedIn URL')}
                                                </Label>
                                                <Input
                                                    id="linkedinUrl"
                                                    type="url"
                                                    value={formData.linkedinUrl}
                                                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                                                    placeholder={t('Enter LinkedIn URL')}
                                                    className="h-11"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents Section */}
                                    {(jobPostingSettings.visibility.includes('resume') ||
                                        jobPostingSettings.visibility.includes('cover_letter')) && (
                                        <div>
                                            <h2 className="mb-6 border-b border-border pb-2 text-lg font-semibold text-foreground">
                                                {' '}
                                                {t('Documents')}{' '}
                                            </h2>
                                            <div className="space-y-4">
                                                {/* Resume Upload */}
                                                {jobPostingSettings.visibility.includes('resume') && (
                                                    <div>
                                                        <Label
                                                            htmlFor="resume"
                                                            className="mb-2 block text-sm font-medium text-foreground"
                                                        >
                                                            {t('Resume/CV')}
                                                        </Label>
                                                        {!uploadedFiles.resume ? (
                                                            <div className="mt-1">
                                                                <Input
                                                                    id="resume"
                                                                    name="resume"
                                                                    type="file"
                                                                    accept={storageSettings.allowedFileTypes
                                                                        .split(',')
                                                                        ?.map((type) => `.${type.trim()}`)
                                                                        .join(',')}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            setUploadedFiles((prev) => ({
                                                                                ...prev,
                                                                                resume: file,
                                                                            }));
                                                                            if (file.type.startsWith('image/')) {
                                                                                const reader = new FileReader();
                                                                                reader.onload = (e) => {
                                                                                    setFilePreviews((prev) => ({
                                                                                        ...prev,
                                                                                        resume: e.target
                                                                                            ?.result as string,
                                                                                    }));
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="h-11"
                                                                />
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    {storageSettings.allowedFileTypes} {t('up to')}{' '}
                                                                    {storageSettings.maxUploadSize} {t('MB')}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="relative mt-1">
                                                                {filePreviews.resume ? (
                                                                    <div className="relative inline-block">
                                                                        <img
                                                                            src={filePreviews.resume}
                                                                            alt="Resume preview"
                                                                            className="h-32 w-32 rounded-lg border object-cover"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setUploadedFiles((prev) => ({
                                                                                    ...prev,
                                                                                    resume: undefined,
                                                                                }));
                                                                                setFilePreviews((prev) => ({
                                                                                    ...prev,
                                                                                    resume: undefined,
                                                                                }));
                                                                            }}
                                                                            className="bg-muted/500 absolute -end-2 -top-2 rounded-full p-1 text-background hover:bg-destructive"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                        <p className="mt-2 text-sm text-foreground">
                                                                            {uploadedFiles.resume.name}
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center space-x-3 rounded-lg border bg-muted/50 p-3">
                                                                        {uploadedFiles.resume.type.includes('pdf') ? (
                                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                                                                <FileText className="h-6 w-6 text-destructive" />
                                                                            </div>
                                                                        ) : uploadedFiles.resume.type.includes(
                                                                              'doc'
                                                                          ) ? (
                                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                                                                <File className="h-6 w-6 text-foreground" />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                                                                <File className="h-6 w-6 text-muted-foreground" />
                                                                            </div>
                                                                        )}
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-medium text-foreground">
                                                                                {uploadedFiles.resume.name}
                                                                            </p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {(
                                                                                    uploadedFiles.resume.size /
                                                                                    1024 /
                                                                                    1024
                                                                                ).toFixed(2)}{' '}
                                                                                {t('MB')}{' '}
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setUploadedFiles((prev) => ({
                                                                                    ...prev,
                                                                                    resume: undefined,
                                                                                }));
                                                                                setFilePreviews((prev) => ({
                                                                                    ...prev,
                                                                                    resume: undefined,
                                                                                }));
                                                                            }}
                                                                            className="text-destructive hover:text-destructive"
                                                                        >
                                                                            <X className="h-5 w-5" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Cover Letter Upload */}
                                                {jobPostingSettings.visibility.includes('cover_letter') && (
                                                    <div>
                                                        <Label
                                                            htmlFor="coverLetter"
                                                            className="mb-2 block text-sm font-medium text-foreground"
                                                        >
                                                            {t('Cover Letter')}
                                                        </Label>
                                                        {!uploadedFiles.coverLetter ? (
                                                            <div className="mt-1">
                                                                <Input
                                                                    id="coverLetter"
                                                                    name="coverLetter"
                                                                    type="file"
                                                                    accept={storageSettings.allowedFileTypes
                                                                        .split(',')
                                                                        ?.map((type) => `.${type.trim()}`)
                                                                        .join(',')}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            setUploadedFiles((prev) => ({
                                                                                ...prev,
                                                                                coverLetter: file,
                                                                            }));
                                                                            if (file.type.startsWith('image/')) {
                                                                                const reader = new FileReader();
                                                                                reader.onload = (e) => {
                                                                                    setFilePreviews((prev) => ({
                                                                                        ...prev,
                                                                                        coverLetter: e.target
                                                                                            ?.result as string,
                                                                                    }));
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="h-11"
                                                                />
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    {storageSettings.allowedFileTypes} {t('up to')}{' '}
                                                                    {storageSettings.maxUploadSize} {t('MB')}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="relative mt-1">
                                                                {filePreviews.coverLetter ? (
                                                                    <div className="relative inline-block">
                                                                        <img
                                                                            src={filePreviews.coverLetter}
                                                                            alt="Cover letter preview"
                                                                            className="h-32 w-32 rounded-lg border object-cover"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setUploadedFiles((prev) => ({
                                                                                    ...prev,
                                                                                    coverLetter: undefined,
                                                                                }));
                                                                                setFilePreviews((prev) => ({
                                                                                    ...prev,
                                                                                    coverLetter: undefined,
                                                                                }));
                                                                            }}
                                                                            className="bg-muted/500 absolute -end-2 -top-2 rounded-full p-1 text-background hover:bg-destructive"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                        <p className="mt-2 text-sm text-foreground">
                                                                            {uploadedFiles.coverLetter.name}
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center space-x-3 rounded-lg border bg-muted/50 p-3">
                                                                        {uploadedFiles.coverLetter.type.includes(
                                                                            'pdf'
                                                                        ) ? (
                                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                                                                <FileText className="h-6 w-6 text-destructive" />
                                                                            </div>
                                                                        ) : uploadedFiles.coverLetter.type.includes(
                                                                              'doc'
                                                                          ) ? (
                                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                                                                <File className="h-6 w-6 text-foreground" />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                                                                <File className="h-6 w-6 text-muted-foreground" />
                                                                            </div>
                                                                        )}
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-medium text-foreground">
                                                                                {uploadedFiles.coverLetter.name}
                                                                            </p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {(
                                                                                    uploadedFiles.coverLetter.size /
                                                                                    1024 /
                                                                                    1024
                                                                                ).toFixed(2)}{' '}
                                                                                MB
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setUploadedFiles((prev) => ({
                                                                                    ...prev,
                                                                                    coverLetter: undefined,
                                                                                }));
                                                                                setFilePreviews((prev) => ({
                                                                                    ...prev,
                                                                                    coverLetter: undefined,
                                                                                }));
                                                                            }}
                                                                            className="text-destructive hover:text-destructive"
                                                                        >
                                                                            <X className="h-5 w-5" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Custom Questions Section */}
                                    {customQuestions.length > 0 && (
                                        <div>
                                            <h2 className="mb-6 border-b border-border pb-2 text-lg font-semibold text-foreground">
                                                {' '}
                                                {t('Application Questions')}{' '}
                                            </h2>
                                            <div className="space-y-6">
                                                {customQuestions?.map((question) => {
                                                    const fieldName = `custom_question_${question.id}`;
                                                    return (
                                                        <div key={question.id}>
                                                            <Label className="mb-2 block text-sm font-medium text-foreground">
                                                                {question.question}
                                                                {question.is_required && (
                                                                    <span className="ms-1 text-destructive">*</span>
                                                                )}
                                                            </Label>
                                                            {question.type === 'text' && (
                                                                <Input
                                                                    type="text"
                                                                    value={customAnswers[fieldName] || ''}
                                                                    onChange={(e) =>
                                                                        setCustomAnswers((prev) => ({
                                                                            ...prev,
                                                                            [fieldName]: e.target.value,
                                                                        }))
                                                                    }
                                                                    className="h-11"
                                                                    required={question.is_required}
                                                                />
                                                            )}
                                                            {question.type === 'number' && (
                                                                <Input
                                                                    type="number"
                                                                    value={customAnswers[fieldName] || ''}
                                                                    onChange={(e) =>
                                                                        setCustomAnswers((prev) => ({
                                                                            ...prev,
                                                                            [fieldName]: e.target.value,
                                                                        }))
                                                                    }
                                                                    className="h-11"
                                                                    required={question.is_required}
                                                                />
                                                            )}
                                                            {question.type === 'textarea' && (
                                                                <Textarea
                                                                    value={customAnswers[fieldName] || ''}
                                                                    onChange={(e) =>
                                                                        setCustomAnswers((prev) => ({
                                                                            ...prev,
                                                                            [fieldName]: e.target.value,
                                                                        }))
                                                                    }
                                                                    rows={3}
                                                                    required={question.is_required}
                                                                />
                                                            )}
                                                            {question.type === 'select' && (
                                                                <Select
                                                                    value={(customAnswers[fieldName] as string) || ''}
                                                                    onValueChange={(value) =>
                                                                        setCustomAnswers((prev) => ({
                                                                            ...prev,
                                                                            [fieldName]: value,
                                                                        }))
                                                                    }
                                                                >
                                                                    <SelectTrigger className="h-11">
                                                                        <SelectValue placeholder="Select an option" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {question.options?.map((option, index) => (
                                                                            <SelectItem key={index} value={option}>
                                                                                {option}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                            {question.type === 'radio' && (
                                                                <RadioGroup
                                                                    value={(customAnswers[fieldName] as string) || ''}
                                                                    onValueChange={(value) =>
                                                                        setCustomAnswers((prev) => ({
                                                                            ...prev,
                                                                            [fieldName]: value,
                                                                        }))
                                                                    }
                                                                    className="flex flex-wrap gap-6"
                                                                >
                                                                    {question.options?.map((option, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="flex items-center space-x-2"
                                                                        >
                                                                            <RadioGroupItem
                                                                                value={option}
                                                                                id={`${fieldName}_${index}`}
                                                                                className="h-4 w-4"
                                                                            />
                                                                            <Label
                                                                                htmlFor={`${fieldName}_${index}`}
                                                                                className="cursor-pointer text-sm text-foreground"
                                                                            >
                                                                                {option}
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </RadioGroup>
                                                            )}
                                                            {question.type === 'checkbox' && (
                                                                <div className="space-y-2">
                                                                    {question.options?.map((option, index) => {
                                                                        const currentValues =
                                                                            (customAnswers[fieldName] as string[]) ||
                                                                            [];
                                                                        const isChecked =
                                                                            currentValues.includes(option);

                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                className="flex items-center space-x-2"
                                                                            >
                                                                                <Checkbox
                                                                                    id={`${fieldName}_${index}`}
                                                                                    checked={isChecked}
                                                                                    onCheckedChange={(checked) => {
                                                                                        setCustomAnswers((prev) => {
                                                                                            const currentValues =
                                                                                                (prev[
                                                                                                    fieldName
                                                                                                ] as string[]) || [];
                                                                                            if (checked) {
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    [fieldName]: [
                                                                                                        ...currentValues,
                                                                                                        option,
                                                                                                    ],
                                                                                                };
                                                                                            } else {
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    [fieldName]:
                                                                                                        currentValues.filter(
                                                                                                            (v) =>
                                                                                                                v !==
                                                                                                                option
                                                                                                        ),
                                                                                                };
                                                                                            }
                                                                                        });
                                                                                    }}
                                                                                />
                                                                                <Label
                                                                                    htmlFor={`${fieldName}_${index}`}
                                                                                    className="cursor-pointer text-sm font-normal"
                                                                                >
                                                                                    {option}
                                                                                </Label>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Terms & Conditions Section */}
                                    {job.show_terms_condition && job.terms_condition && (
                                        <div>
                                            <h2 className="mb-6 border-b border-border pb-2 text-lg font-semibold text-foreground">
                                                {' '}
                                                {t('Terms & Conditions')}{' '}
                                            </h2>
                                            <div className="flex items-start space-x-2">
                                                <Checkbox
                                                    id="terms_accepted"
                                                    checked={termsAccepted}
                                                    onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor="terms_accepted"
                                                    className="cursor-pointer text-sm leading-relaxed text-foreground"
                                                >
                                                    {t('I have read and agree to the')}{' '}
                                                    <a
                                                        href={route('recruitment.frontend.careers.jobs.terms', {
                                                            userSlug,
                                                            id: job.encrypted_id,
                                                        })}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-foreground underline hover:text-foreground"
                                                    >
                                                        {t('terms and conditions')}
                                                    </a>{' '}
                                                    {t('for this position')}.
                                                </Label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="border-t border-border pt-6">
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                className="h-11 bg-muted px-8 text-background hover:bg-card"
                                                disabled={!isFormValid() || isSubmitting}
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Job Summary Sidebar */}
                    <div className="lg:w-1/3">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-foreground"> {t('Job Summary')} </h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="mb-2 font-medium text-foreground">{job.title}</h4>
                                        <div className="mb-2 flex items-center text-sm text-muted-foreground">
                                            <MapPin className="me-1 h-4 w-4" />
                                            {job.location}
                                        </div>
                                        <div className="mb-3 flex gap-2">
                                            {job.featured && (
                                                <Badge className="border-border bg-muted text-foreground hover:bg-muted">
                                                    <Star className="me-1 h-3 w-3" />
                                                    {t('Featured')}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="rounded-lg bg-muted/50 p-3">
                                            <div className="flex items-center">
                                                <DollarSign className="me-2 h-4 w-4 text-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground"> {t('Salary')} </p>
                                                    <p className="font-medium text-foreground">
                                                        {formatSalary(job.salaryFrom, job.salaryTo)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-lg bg-muted/50 p-3">
                                            <div className="flex items-center">
                                                <Briefcase className="me-2 h-4 w-4 text-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground"> {t('Type')} </p>
                                                    <p className="font-medium text-foreground">{job.jobType}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {job.skills && job.skills.length > 0 && (
                                        <div>
                                            <p className="mb-2 text-xs text-muted-foreground">
                                                {' '}
                                                {t('Required Skills')}{' '}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {job.skills?.map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="outline"
                                                        className="border-border bg-muted/50 text-xs text-foreground"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {applicationTips.length > 0 && (
                                    <div className="mt-6 rounded-lg bg-muted/50 p-4">
                                        <h4 className="mb-2 font-medium text-foreground"> {t('Application Tips')} </h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            {applicationTips?.map((tip, index) => (
                                                <li key={index}>• {tip.title}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Integration Widgets (Tawk.to, etc.) */}
            {integrationFields?.map((field) => (
                <div key={field.id}>{field.component}</div>
            ))}
        </FrontendLayout>
    );
}
