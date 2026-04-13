import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Mail,
    Phone,
    Building,
    Briefcase,
    Calendar,
    DollarSign,
    Clock,
    FileText,
    MapPin,
    Download,
    Hash,
} from 'lucide-react';
import { Candidate, CandidateShowProps } from './types';
import { formatDate, formatCurrency, getImagePath } from '@/utils/helpers';

export default function Show() {
    const { t } = useTranslation();
    const { candidate, customQuestions } = usePage<CandidateShowProps>().props;
    const pageProps = usePage().props as any;
    const { imageUrlPrefix } = pageProps;

    const downloadFile = (filePath: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = `${imageUrlPrefix}/${filePath}`;
        link.download = filePath.split('/').pop() || fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const statusOptions: any = {
        '0': 'New',
        '1': 'Screening',
        '2': 'Interview',
        '3': 'Offer',
        '4': 'Hired',
        '5': 'Rejected',
    };
    const statusColors: any = {
        '0': 'bg-muted text-foreground',
        '1': 'bg-muted text-foreground',
        '2': 'bg-muted text-foreground',
        '3': 'bg-muted text-foreground',
        '4': 'bg-muted text-foreground',
        '5': 'bg-muted text-destructive',
    };

    const candidateAnswers = (() => {
        try {
            return candidate.custom_question ? JSON.parse(candidate.custom_question) : {};
        } catch (error) {
            return {};
        }
    })();

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Recruitment'), url: route('recruitment.index') },
                { label: t('Candidates'), url: route('recruitment.candidates.index') },
                { label: t('Candidate Details') },
            ]}
            pageTitle={t('Candidate Details')}
        >
            <Head title={`${t('Candidate Details')} - ${candidate.first_name} ${candidate.last_name}`} />

            <div className="space-y-6">
                {/* Header Card with Basic Info */}
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-foreground/10">
                                    {candidate.profile_path ? (
                                        <img
                                            src={getImagePath(candidate.profile_path)}
                                            alt={`${candidate.first_name} ${candidate.last_name}`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Users className="h-8 w-8 text-foreground" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">
                                        {`${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'N/A'}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {(candidate as any).job_posting?.title || 'No Job Applied'}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {candidate.tracking_id || 'No Tracking ID'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`rounded-full px-2 py-1 text-sm ${statusColors[candidate.status as keyof typeof statusColors] || 'bg-muted text-foreground'}`}
                            >
                                {t(statusOptions[candidate.status] || candidate.status || 'Unknown')}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('Email')}</p>
                                    <p className="font-medium">{candidate.email || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('Phone')}</p>
                                    <p className="font-medium">{candidate.phone || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('Date of Birth')}</p>
                                    <p className="font-medium">{candidate.dob ? formatDate(candidate.dob) : '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('Gender')}</p>
                                    <p className="font-medium">
                                        {candidate.gender
                                            ? t(candidate.gender.charAt(0).toUpperCase() + candidate.gender.slice(1))
                                            : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('Location')}</p>
                                    <p className="font-medium">
                                        {[candidate.city, candidate.state, candidate.country]
                                            .filter(Boolean)
                                            .join(', ') || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Professional Information */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                {t('Professional Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('Current Company')}
                                    </label>
                                    <p className="font-medium">{candidate.current_company || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('Current Position')}
                                    </label>
                                    <p className="font-medium">{candidate.current_position || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('Experience')}
                                    </label>
                                    <p className="font-medium">
                                        {candidate.experience_years || '0'} {t('years')}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('Notice Period')}
                                    </label>
                                    <p className="font-medium">{candidate.notice_period || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Job & Salary Information */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                {t('Job & Salary Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t('Source')}</label>
                                    <p className="font-medium">{(candidate as any).candidate_source?.name || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('Application Date')}
                                    </label>
                                    <p className="font-medium">
                                        {candidate.application_date ? formatDate(candidate.application_date) : '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('Current Salary')}
                                    </label>
                                    <p className="font-medium">
                                        {candidate.current_salary ? formatCurrency(candidate.current_salary) : '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('Expected Salary')}
                                    </label>
                                    <p className="font-medium">
                                        {candidate.expected_salary ? formatCurrency(candidate.expected_salary) : '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Documents */}
                {(candidate.resume_path || candidate.cover_letter_path) && (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {t('Documents')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {candidate.resume_path && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            {t('Resume/CV')}
                                        </label>
                                        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-3">
                                            <FileText className="h-5 w-5 text-foreground" />
                                            <span className="flex-1 text-sm font-medium">{t('Resume')}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => downloadFile(candidate.resume_path, 'resume')}
                                                className="h-8 px-3"
                                            >
                                                <Download className="me-1 h-4 w-4" />
                                                {t('Download')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {candidate.cover_letter_path && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            {t('Cover Letter')}
                                        </label>
                                        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-3">
                                            <FileText className="h-5 w-5 text-foreground" />
                                            <span className="flex-1 text-sm font-medium">{t('Cover Letter')}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    downloadFile(candidate.cover_letter_path, 'cover_letter')
                                                }
                                                className="h-8 px-3"
                                            >
                                                <Download className="me-1 h-4 w-4" />
                                                {t('Download')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Application Questions */}
                {Object.keys(candidateAnswers).length > 0 && (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {t('Application Questions')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {Object.entries(candidateAnswers)?.map(([questionId, answer]) => {
                                    const questionIdNum = questionId.replace('custom_question_', '');
                                    const questionText =
                                        (customQuestions as any)?.[questionIdNum]?.question ||
                                        `${t('Question')} #${questionIdNum}`;
                                    return (
                                        <div key={questionId} className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                {questionText}
                                            </label>
                                            <p className="rounded-md bg-muted/50 p-3 font-medium">
                                                {(answer as string) || '-'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Notes Section */}
                {candidate.notes && (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {t('Notes')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md bg-muted/50 p-4">
                                <p className="whitespace-pre-wrap">{candidate.notes}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
