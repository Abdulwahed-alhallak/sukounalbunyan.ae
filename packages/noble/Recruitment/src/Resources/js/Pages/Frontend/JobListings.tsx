import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, DollarSign, Briefcase, Star } from 'lucide-react';
import FrontendLayout from '../../Components/Frontend/FrontendLayout';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { useFormFields } from '@/hooks/useFormFields';

interface Job {
    id: number;
    encrypted_id: string;
    title: string;
    location?: string;
    jobType?: string;
    salaryFrom?: number;
    salaryTo?: number;
    postedDate: string;
    deadlineDate?: string;
    skills: string[];
    featured: boolean;
    description?: string;
    job_application?: string;
    application_url?: string;
}

interface JobListingsProps {
    [key: string]: any;
    userSlug?: string;
    jobs: Job[];
    jobCategories: string[];
    jobLocations: { id: number; name: string }[];
    jobTypes: { id: number; name: string }[];
    siteSettings: {
        logo?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
    };
}

export default function JobListings({
    userSlug,
    jobs,
    jobCategories,
    jobLocations,
    jobTypes,
    siteSettings,
}: JobListingsProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const integrationFields = useFormFields('getIntegrationFields', {}, () => {}, {}, 'create', t, 'Recruitment');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedJobType, setSelectedJobType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [activeSearchTerm, setActiveSearchTerm] = useState('');
    const [savedJobs, setSavedJobs] = useState<number[]>([]);

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

    const getJobTypeColor = (jobType: string) => {
        return jobType === 'Full Time' ? 'bg-muted text-foreground' : 'bg-muted text-foreground';
    };

    const handleSearch = () => {
        setActiveSearchTerm(searchTerm);
    };

    const handleSaveJob = (jobId: number) => {
        const storageKey = `savedJobs_${userSlug}`;
        let updatedSavedJobs;

        if (savedJobs.includes(jobId)) {
            updatedSavedJobs = savedJobs.filter((id) => id !== jobId);
        } else {
            updatedSavedJobs = [...savedJobs, jobId];
        }

        setSavedJobs(updatedSavedJobs);
        localStorage.setItem(storageKey, JSON.stringify(updatedSavedJobs));
    };

    const filteredAndSortedJobs = (() => {
        // Filter jobs
        const filtered = jobs.filter((job) => {
            const searchLower = activeSearchTerm.toLowerCase();
            const matchesSearch =
                activeSearchTerm === '' ||
                job.title.toLowerCase().includes(searchLower) ||
                job.location?.toLowerCase().includes(searchLower) ||
                job.description?.toLowerCase().includes(searchLower) ||
                job.skills.some((skill) => skill.toLowerCase().includes(searchLower));

            // Find matching location by ID
            const matchesLocation =
                selectedLocation === 'all' ||
                jobLocations?.find((loc) => loc.id.toString() === selectedLocation)?.name.toLowerCase() ===
                    job.location?.toLowerCase();

            // Find matching job type by ID
            const matchesJobType =
                selectedJobType === 'all' ||
                jobTypes?.find((type) => type.id.toString() === selectedJobType)?.name.toLowerCase() ===
                    job.jobType?.toLowerCase();

            const matchesCategory =
                selectedCategory === 'All' ||
                (selectedCategory === 'Featured Job' && job.featured) ||
                (selectedCategory === 'Saved Job' && savedJobs.includes(job.id));

            return matchesSearch && matchesLocation && matchesJobType && matchesCategory;
        });

        // Sort jobs
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'salary-high':
                    return (b.salaryTo || 0) - (a.salaryTo || 0);
                case 'salary-low':
                    return (a.salaryFrom || 0) - (b.salaryFrom || 0);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'newest':
                default:
                    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
            }
        });
    })();

    return (
        <FrontendLayout title="Jobs" userSlug={userSlug} brandSettings={siteSettings}>
            {/* Hero Section */}
            <div className="bg-card text-background">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="mb-4 text-4xl font-bold"> {t('Join Our Amazing Team')} </h2>
                        <p className="mb-8 text-xl text-muted-foreground">
                            {' '}
                            {t('Discover exciting career opportunities and grow with us')}{' '}
                        </p>

                        {/* Search Bar */}
                        <div className="mx-auto max-w-2xl rounded-lg bg-card p-2 shadow-lg">
                            <div className="flex items-center space-x-2">
                                <div className="relative flex-1">
                                    <Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        placeholder={t('Search jobs, skills, or keywords...')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border-0 ps-10 text-foreground focus:ring-0"
                                    />
                                </div>
                                <Button className="bg-muted hover:bg-card" onClick={handleSearch} type="button">
                                    {t('Search Jobs')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <Card className="sticky top-4">
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-semibold">{t('Filter Jobs')}</h3>

                                {/* Job Categories */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        {t('Job Category')}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant={selectedCategory === 'All' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setSelectedCategory('All')}
                                            className="text-xs"
                                        >
                                            {t('All')}
                                        </Button>
                                        <Button
                                            variant={selectedCategory === 'Featured Job' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setSelectedCategory('Featured Job')}
                                            className="text-xs"
                                        >
                                            {t('Featured Job')}
                                        </Button>
                                        <Button
                                            variant={selectedCategory === 'Saved Job' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setSelectedCategory('Saved Job')}
                                            className="text-xs"
                                        >
                                            {t('Saved Job')}
                                        </Button>
                                    </div>
                                </div>

                                {/* Location Filter */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        {t('Location')}
                                    </label>
                                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Locations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('All Locations')}</SelectItem>
                                            {jobLocations?.map((location) => (
                                                <SelectItem key={location.id} value={location.id.toString()}>
                                                    {location.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Job Type Filter */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        {t('Job Type')}
                                    </label>
                                    <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('All Types')}</SelectItem>
                                            {jobTypes?.map((type) => (
                                                <SelectItem key={type.id} value={type.id.toString()}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        {t('Sort By')}
                                    </label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">{t('Newest First')}</SelectItem>
                                            <SelectItem value="salary-high">{t('Salary: High to Low')}</SelectItem>
                                            <SelectItem value="salary-low">{t('Salary: Low to High')}</SelectItem>
                                            <SelectItem value="title">{t('Job Title A-Z')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Job Listings */}
                    <div className="lg:w-3/4">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-foreground">{t('All Positions')}</h3>
                            <span className="text-sm text-muted-foreground">
                                {filteredAndSortedJobs.length} {t('jobs found')}
                            </span>
                        </div>

                        <div className="space-y-6">
                            {filteredAndSortedJobs?.map((job) => (
                                <Card key={job.id} className="border shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="mb-4 flex items-start justify-between">
                                                    <div>
                                                        <h4 className="mb-2 text-xl font-bold text-foreground">
                                                            {job.title}
                                                        </h4>
                                                        <div className="mb-3 flex items-center text-muted-foreground">
                                                            <MapPin className="me-2 h-5 w-5 text-foreground" />
                                                            <span className="font-medium">{job.location}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {job.featured && (
                                                            <Badge className="border-border bg-muted text-foreground hover:bg-muted">
                                                                <Star className="me-1 h-3 w-3" />
                                                                {t('Featured')}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                                                    <div className="flex items-center rounded-lg bg-muted/50 p-3">
                                                        <DollarSign className="me-2 h-5 w-5 text-foreground" />
                                                        <div>
                                                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Salary')}
                                                            </p>
                                                            <p className="font-semibold text-foreground">
                                                                {formatSalary(job.salaryFrom, job.salaryTo)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center rounded-lg bg-muted/50 p-3">
                                                        <Briefcase className="me-2 h-5 w-5 text-foreground" />
                                                        <div>
                                                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Type')}
                                                            </p>
                                                            <p className="font-semibold text-foreground">
                                                                {job.jobType}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center rounded-lg bg-muted/50 p-3">
                                                        <Clock className="me-2 h-5 w-5 text-foreground" />
                                                        <div>
                                                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                {t('Posted')}
                                                            </p>
                                                            <p className="font-semibold text-foreground">
                                                                {formatDate(job.postedDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {job.deadlineDate && (
                                                        <div className="flex items-center rounded-lg bg-muted/50 p-3">
                                                            <Clock className="me-2 h-5 w-5 text-destructive" />
                                                            <div>
                                                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                    {t('Deadline')}
                                                                </p>
                                                                <p className="font-semibold text-destructive">
                                                                    {formatDate(job.deadlineDate)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {job.skills && job.skills.length > 0 && (
                                                    <div className="mb-4">
                                                        <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Required Skills')}
                                                        </p>
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

                                        <div className="flex items-center justify-between border-t border-border pt-4">
                                            <div className="flex items-center space-x-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSaveJob(job.id)}
                                                    className={
                                                        savedJobs.includes(job.id)
                                                            ? 'border-border bg-muted/50 text-foreground'
                                                            : 'text-muted-foreground'
                                                    }
                                                >
                                                    <Briefcase className="me-2 h-4 w-4" />
                                                    {savedJobs.includes(job.id) ? 'Saved' : 'Save Job'}
                                                </Button>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="border-border text-foreground hover:bg-muted/50"
                                                    onClick={() =>
                                                        userSlug &&
                                                        (window.location.href = route(
                                                            'recruitment.frontend.careers.jobs.show',
                                                            { userSlug, id: job.encrypted_id }
                                                        ))
                                                    }
                                                >
                                                    {t('View Details')}
                                                </Button>
                                                <Button
                                                    className="bg-muted px-6 text-background hover:bg-card"
                                                    onClick={() => {
                                                        if (job.job_application === 'custom' && job.application_url) {
                                                            window.open(job.application_url, '_blank');
                                                        } else if (userSlug) {
                                                            window.location.href = route(
                                                                'recruitment.frontend.careers.jobs.apply',
                                                                { userSlug, id: job.encrypted_id }
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {t('Apply Now')}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredAndSortedJobs.length === 0 && (
                            <div className="py-12 text-center">
                                <Briefcase className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold text-foreground">{t('No jobs found')}</h3>
                                <p className="text-muted-foreground">
                                    {t('Try adjusting your search criteria or filters')}
                                </p>
                            </div>
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
