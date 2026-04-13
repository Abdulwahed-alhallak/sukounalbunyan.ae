import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FrontendLayout from '../../Components/Frontend/FrontendLayout';
import { MapPin, Clock, DollarSign, Briefcase, Star, ArrowLeft, Bookmark, Users, Calendar } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { useFormFields } from '@/hooks/useFormFields';

interface Job {
    id: number;
    encrypted_id: string;
    title: string;
    location: string;
    jobType: string;
    salaryFrom: number;
    salaryTo: number;
    positions: number;
    startDate: string;
    endDate: string;
    postedDate: string;
    skills: string[];
    featured: boolean;
    description: string;
    requirements: string;
    benefits: string;
    job_application?: string;
    application_url?: string;
}

interface JobDetailsProps {
    job: Job;
    userSlug: string;
    brandSettings: {
        logo?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
    };
    companyInfo: {
        ourMission: string;
        companySize: string;
        industry: string;
    };
}

export default function JobDetails({ job, userSlug, brandSettings, companyInfo }: JobDetailsProps) {
    const { t } = useTranslation();
    const [savedJobs, setSavedJobs] = useState<number[]>([]);

    const integrationFields = useFormFields('getIntegrationFields', {}, () => {}, {}, 'create', t, 'Recruitment');

    useEffect(() => {
        const storageKey = `savedJobs_${userSlug}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                setSavedJobs(JSON.parse(saved));
            } catch (e) {
                setSavedJobs([]);
            }
        }
    }, [userSlug]);

    const formatSalary = (from: number, to: number) => {
        return `${formatCurrency(from)} - ${formatCurrency(to)}`;
    };

    const handleSaveJob = () => {
        const storageKey = `savedJobs_${userSlug}`;
        let updatedSavedJobs;

        if (savedJobs.includes(job.id)) {
            updatedSavedJobs = savedJobs.filter((id) => id !== job.id);
        } else {
            updatedSavedJobs = [...savedJobs, job.id];
        }

        setSavedJobs(updatedSavedJobs);
        localStorage.setItem(storageKey, JSON.stringify(updatedSavedJobs));
    };

    return (
        <FrontendLayout userSlug={userSlug} brandSettings={brandSettings}>
            <Head title={`${job.title} - Job Details`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {/* Job Header */}
                        <Card className="mb-8">
                            <CardContent className="p-8">
                                {/* Action Buttons */}
                                <div className="mb-2 flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:bg-muted hover:text-foreground"
                                        onClick={() =>
                                            (window.location.href = route('recruitment.frontend.careers.jobs.index', {
                                                userSlug,
                                            }))
                                        }
                                    >
                                        <ArrowLeft className="me-2 h-4 w-4" />
                                        {t('Back to Jobs')}
                                    </Button>
                                </div>

                                <div className="mb-6 flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-4 flex items-center gap-3">
                                            <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                                            <div className="flex gap-2">
                                                {job.featured && (
                                                    <Badge className="border-border bg-muted text-foreground hover:bg-muted">
                                                        <Star className="me-1 h-3 w-3" />
                                                        {t('Featured')}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-6 flex items-center text-muted-foreground">
                                            <MapPin className="me-2 h-5 w-5 text-foreground" />
                                            <span className="text-lg font-medium">{job.location}</span>
                                        </div>

                                        {/* Job Info Grid */}
                                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                                            <div className="rounded-lg bg-muted/50 p-4">
                                                <DollarSign className="mb-2 h-6 w-6 text-foreground" />
                                                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                    {' '}
                                                    {t('Salary Range')}{' '}
                                                </p>
                                                <p className="font-bold text-foreground">
                                                    {formatSalary(job.salaryFrom, job.salaryTo)}
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-muted/50 p-4">
                                                <Briefcase className="mb-2 h-6 w-6 text-foreground" />
                                                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                    {' '}
                                                    {t('Job Type')}{' '}
                                                </p>
                                                <p className="font-bold text-foreground">{job.jobType}</p>
                                            </div>
                                            <div className="rounded-lg bg-muted/50 p-4">
                                                <Users className="mb-2 h-6 w-6 text-foreground" />
                                                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                    {' '}
                                                    {t('Positions')}{' '}
                                                </p>
                                                <p className="font-bold text-foreground">
                                                    {job.positions} {t('Available')}{' '}
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-muted/50 p-4">
                                                <Clock className="mb-2 h-6 w-6 text-destructive" />
                                                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                    {' '}
                                                    {t('Deadline')}{' '}
                                                </p>
                                                <p className="font-bold text-destructive">{formatDate(job.endDate)}</p>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        {job.skills && job.skills.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="mb-3 text-sm font-medium text-foreground">
                                                    {' '}
                                                    {t('Required Skills')}{' '}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.skills?.map((skill) => (
                                                        <Badge
                                                            key={skill}
                                                            variant="outline"
                                                            className="border-border bg-muted/50 text-foreground"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Job Description */}
                        {job.description && (
                            <Card className="mb-8">
                                <CardContent className="p-8">
                                    <h2 className="mb-6 text-2xl font-bold text-foreground">
                                        {' '}
                                        {t('Job Description')}{' '}
                                    </h2>
                                    <div
                                        className="prose prose-gray prose-headings:text-foreground prose-h3:text-xl prose-h4:text-lg prose-ul:list-disc prose-li:mb-2 max-w-none"
                                        dangerouslySetInnerHTML={{ __html: job.description }}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Job Requirements */}
                        {job.requirements && (
                            <Card className="mb-8">
                                <CardContent className="p-8">
                                    <h2 className="mb-6 text-2xl font-bold text-foreground">
                                        {' '}
                                        {t('Job Requirements')}{' '}
                                    </h2>
                                    <div
                                        className="prose prose-gray prose-headings:text-foreground prose-h3:text-xl prose-h4:text-lg prose-ul:list-disc prose-li:mb-2 max-w-none"
                                        dangerouslySetInnerHTML={{ __html: job.requirements }}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Benefits */}
                        {job.benefits && (
                            <Card className="mb-8">
                                <CardContent className="p-8">
                                    <h2 className="mb-6 text-2xl font-bold text-foreground"> {t('Benefits')} </h2>
                                    <div
                                        className="prose prose-gray prose-headings:text-foreground prose-h3:text-xl prose-h4:text-lg prose-ul:list-disc prose-li:mb-2 max-w-none"
                                        dangerouslySetInnerHTML={{ __html: job.benefits }}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        {/* Apply Card */}
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="mb-6 text-center">
                                    <h3 className="mb-2 text-xl font-bold text-foreground"> {t('Ready to Apply?')} </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {' '}
                                        {t('Join our team and make a difference')}{' '}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        className="w-full bg-muted py-3 text-lg text-background hover:bg-card"
                                        onClick={() => {
                                            if (job.job_application === 'custom' && job.application_url) {
                                                window.open(job.application_url, '_blank');
                                            } else {
                                                window.location.href = route(
                                                    'recruitment.frontend.careers.jobs.apply',
                                                    { userSlug, id: job.encrypted_id }
                                                );
                                            }
                                        }}
                                    >
                                        {t('Apply for This Position')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={`w-full border-border hover:bg-muted/50 ${
                                            savedJobs.includes(job.id)
                                                ? 'border-border bg-muted/50 text-foreground'
                                                : 'text-foreground'
                                        }`}
                                        onClick={handleSaveJob}
                                    >
                                        {savedJobs.includes(job.id) ? 'Saved' : 'Save for Later'}
                                    </Button>
                                </div>

                                <div className="my-6 border-t border-border"></div>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground"> {t('Posted')} :</span>
                                        <span className="font-medium">{formatDate(job.postedDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground"> {t('Application Deadline')} :</span>
                                        <span className="font-medium">{formatDate(job.endDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground"> {t('Start Date')} :</span>
                                        <span className="font-medium">{formatDate(job.startDate)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Info Card */}
                        {(companyInfo.ourMission || companyInfo.companySize || companyInfo.industry) && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="mb-4 text-lg font-bold text-foreground">
                                        {' '}
                                        {t('About the Company')}{' '}
                                    </h3>
                                    <div className="space-y-4">
                                        {companyInfo.ourMission && (
                                            <div>
                                                <h4 className="mb-2 font-medium text-foreground">
                                                    {' '}
                                                    {t('Our Mission')}{' '}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {companyInfo.ourMission}
                                                </p>
                                            </div>
                                        )}
                                        {companyInfo.companySize && (
                                            <div>
                                                <h4 className="mb-2 font-medium text-foreground">
                                                    {' '}
                                                    {t('Company Size')}{' '}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {companyInfo.companySize}
                                                </p>
                                            </div>
                                        )}
                                        {companyInfo.industry && (
                                            <div>
                                                <h4 className="mb-2 font-medium text-foreground"> {t('Industry')} </h4>
                                                <p className="text-sm text-muted-foreground">{companyInfo.industry}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
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
